/* =====================================================================
   app.js — Ôn thi Tiếng Anh ĐGNL HSA ĐHQGHN 2026
   Dữ liệu: exams_grammar.json và exams_mocktest.json (để cùng thư mục index.html)
   Luồng: Trang chủ → danh sách nội dung của mục → chỉ hiện bài đã chọn
   ===================================================================== */

const DATA_FILES = { grammar: "exams_grammar.json", mocktest: "exams_mocktest.json" };
const SECTION_TEXT = {
  grammar: { title: "Ôn tập ngữ pháp", sub: "Chọn một chuyên đề hoặc đề tổng hợp để vào làm bài ngay." },
  mocktest: { title: "Luyện đề thi thử", sub: "Chọn một đề để thi thử với đồng hồ đếm ngược." }
};
const SCALE_MAX = { english: 50 }; // thang điểm quy đổi theo trường "scale" của đề
const LETTERS = ["A", "B", "C", "D"];

const cache = {};
const state = { section: null, exam: null, qs: [], submitted: false, running: false, timerId: null, results: {} };
const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove("hidden-element");
const hide = (id) => $(id).classList.add("hidden-element");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (runs) => runs.map((r) => r.t).join("");

/* ---------- ĐIỀU HƯỚNG ---------- */

function go(screen) {
  ["home", "list", "workspace"].forEach((s) => hide(s + "-screen"));
  show(screen + "-screen");
  $("header-tabs").style.display = screen === "list" ? "flex" : "none";
  if (screen === "workspace") show("back-btn"); else { hide("back-btn"); hide("timer-display"); }
  window.scrollTo({ top: 0 });
}

function confirmLeave() {
  return !(state.running && !state.submitted) ||
    confirm("Bạn đang làm dở bài. Thoát ra sẽ mất bài làm hiện tại. Tiếp tục?");
}

function goHome() {
  if (!confirmLeave()) return;
  stopTimer();
  go("home");
}

function startMode(mode) { selectSection(mode); }

/* Chọn mục (Ngữ pháp / Luyện đề) → hiện ngay danh sách nội dung */
function selectSection(section) {
  if (!DATA_FILES[section] || !confirmLeave()) return;
  stopTimer();
  state.section = section;
  state.exam = null;
  const base = "px-5 py-2 rounded-md text-sm transition-colors ";
  const on = "bg-gray-50 text-blue-800 font-bold shadow-sm";
  const off = "bg-white/20 hover:bg-white/90 hover:text-blue-800 font-semibold";
  ["grammar", "mocktest"].forEach((s) => ($("tab-" + s).className = base + (s === section ? on : off)));
  go("list");
  renderList();
}

function backToList() {
  if (!confirmLeave()) return;
  stopTimer();
  state.exam = null;
  go("list");
  renderList();
}

/* ---------- ĐỌC DỮ LIỆU & DANH SÁCH ---------- */

async function loadExams(section) {
  if (cache[section]) return cache[section];
  const res = await fetch(DATA_FILES[section], { cache: "no-cache" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return (cache[section] = await res.json());
}

async function renderList() {
  const section = state.section;
  const box = $("list-container");
  $("list-title").textContent = SECTION_TEXT[section].title;
  $("list-sub").textContent = SECTION_TEXT[section].sub;
  box.innerHTML = `<p class="text-gray-500">Đang tải danh sách...</p>`;
  try {
    const exams = await loadExams(section);
    if (state.section !== section || state.exam) return;
    const now = Date.now();
    box.innerHTML = exams.map((e, i) => {
      const [label, title] = e.name.includes(":") ? e.name.split(/:\s*(.+)/).slice(0, 2) : ["", e.name];
      const count = e.items.filter((x) => x.k === "q").length;
      const closed = (e.openAt && now < e.openAt) ? "Chưa mở" : (e.closeAt && now > e.closeAt) ? "Đã đóng" : "";
      const result = state.results[e.id];
      const badge = closed
        ? `<span class="text-xs font-bold text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">${closed}</span>`
        : result ? `<span class="text-xs font-bold text-green-700 bg-green-100 rounded-full px-2 py-0.5">Đã làm: ${result}</span>` : "";
      return `<button onclick="openExam(${i})" class="dashboard-card text-left bg-white rounded-xl border-2 border-blue-100 p-5 flex flex-col">
        <div class="flex items-start justify-between gap-2 min-h-[1.5rem]">
          <span class="text-sm font-bold text-blue-600">${esc(label)}</span>${badge}
        </div>
        <h3 class="text-base font-bold text-gray-800 mt-1 flex-grow">${esc(title)}</h3>
        <p class="text-sm text-gray-500 mt-3">${count} câu • ${e.time || "không giới hạn"}${e.time ? " phút" : ""}</p>
      </button>`;
    }).join("");
  } catch (err) {
    box.innerHTML = `<div class="col-span-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
      <p class="font-bold mb-1">Không tải được dữ liệu "${DATA_FILES[section]}".</p>
      <p class="text-sm">Hãy để file này cùng thư mục với index.html và mở trang qua máy chủ web (hosting hoặc Live Server). Trình duyệt không cho đọc file JSON khi mở trực tiếp bằng file://.</p>
    </div>`;
  }
}

/* ---------- CHUẨN BỊ ĐỀ (xáo trộn theo cờ của đề) ---------- */

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Giữ nguyên thứ tự đáp án với câu tìm lỗi sai (có (A)(B)(C)(D) trong câu) hoặc đáp án kiểu "cả A và B"
const fixedOrder = (q) =>
  /\(A\)[\s\S]*\(B\)/.test(plain(q.stem)) ||
  q.opts.some((o) => /all of the above|none of the above|\bboth [A-D]\b|\b[A-D] and [A-D]\b/i.test(plain(o.runs)));

function prepare(exam) {
  // Tách đề thành các khối: tiêu đề (h) + lý thuyết/đoạn văn (p) + câu hỏi (q)
  const blocks = [];
  let cur = null;
  exam.items.forEach((it) => {
    if (it.k === "h" || !cur) { cur = { head: null, texts: [], qs: [] }; blocks.push(cur); }
    if (it.k === "h") cur.head = it;
    else if (it.k === "p") cur.texts.push(it);
    else cur.qs.push({ ...it });
  });

  if (exam.shufGrp) shuffle(blocks);
  let n = 0;
  blocks.forEach((b) => {
    if (exam.shufQ) { // chỉ xáo câu độc lập (g=0); câu thuộc đoạn văn/hội thoại giữ nguyên thứ tự
      const free = shuffle(b.qs.filter((q) => !q.g));
      b.qs = b.qs.map((q) => (q.g ? q : free.pop()));
    }
    b.map = {};
    b.grouped = b.qs.some((q) => q.g);
    b.qs.forEach((q) => {
      q.n = ++n;          // đánh số lại liên tục sau khi xáo
      b.map[q.no] = n;    // để cập nhật số câu trong tiêu đề/đoạn văn (vd: chỗ trống (631))
      if (exam.shufOpt && !fixedOrder(q)) q.opts = shuffle(q.opts.slice());
      q.ok = q.opts.findIndex((o) => o.ok);
    });
  });
  return blocks;
}

/* ---------- HIỂN THỊ BÀI LÀM (chỉ nội dung đã chọn) ---------- */

function rich(runs, map) {
  return runs.map((r) => {
    let t = esc(r.t);
    if (map) t = t.replace(/\d+/g, (d) => map[d] || d);
    if (r.f & 4) t = `<u style="text-decoration-thickness:2px;text-underline-offset:3px">${t}</u>`; // gạch chân
    return r.f & 2 ? `<b>${t}</b>` : t;
  }).join("");
}

function questionHtml(q) {
  const stem = q.stem.length ? rich(q.stem) : `Chọn đáp án đúng cho chỗ trống (${q.n}).`;
  return `<div class="question-box bg-white border border-gray-200 rounded-xl p-4" id="qbox-${q.n}">
    <p class="font-semibold text-gray-800 mb-3 whitespace-pre-line"><span class="text-blue-700">Câu ${q.n}.</span> ${stem}</p>
    <div class="grid gap-2 sm:grid-cols-2">
      ${q.opts.map((o, j) => `<label class="option-label flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-white">
        <input type="radio" name="q${q.n}" value="${j}" class="w-4 h-4 accent-blue-600 flex-shrink-0">
        <span>${LETTERS[j]}. ${rich(o.runs)}</span></label>`).join("")}
    </div>
    <div id="note-${q.n}" class="hidden-element mt-3 text-sm rounded-lg p-3"></div>
  </div>`;
}

function blockHtml(b) {
  const map = b.grouped ? b.map : null;
  const head = b.head ? `<h3 class="font-bold text-blue-800 text-lg pt-2">${rich(b.head.runs, map)}</h3>` : "";
  const isTheory = b.texts.length > 0 && plain(b.texts[0].runs).startsWith("LÝ THUYẾT");
  const paras = b.texts.map((t) => `<p>${rich(t.runs, map)}</p>`).join("");
  let box = "";
  if (b.texts.length) {
    box = isTheory
      ? `<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 space-y-2 text-gray-700 leading-relaxed">${paras}</div>`
      : `<div class="reading-passage bg-gray-50 border-l-4 border-blue-400 rounded p-4 text-[17px] leading-relaxed space-y-3">${paras}</div>`;
  }
  // Có lý thuyết: đọc lý thuyết trước, rồi mới tới yêu cầu đề và câu hỏi
  return `<section class="space-y-4">${isTheory ? box + head : head + box}${b.qs.map(questionHtml).join("")}</section>`;
}

function openExam(i) {
  const exam = cache[state.section][i];
  const now = Date.now();
  if (exam.openAt && now < exam.openAt) return alert("Nội dung này chưa đến giờ mở.");
  if (exam.closeAt && now > exam.closeAt) return alert("Nội dung này đã đóng.");

  const blocks = prepare(exam);
  state.exam = exam;
  state.qs = blocks.flatMap((b) => b.qs);
  state.submitted = false;

  $("current-test-title").textContent = exam.name;
  $("current-test-subtitle").textContent = `${state.qs.length} câu` + (exam.time ? ` • ${exam.time} phút` : "");
  $("questions-container").innerHTML = blocks.map(blockHtml).join("");
  hide("result-screen");
  show("submit-btn");
  go("workspace");
  if (exam.time) startTimer(exam.time * 60);
}

function retryExam() {
  openExam(cache[state.section].indexOf(state.exam));
}

/* ---------- NỘP BÀI & CHẤM ĐIỂM ---------- */

function submitTest(auto) {
  if (!state.exam || state.submitted) return;
  const qs = state.qs;
  const total = qs.length;
  const picked = (q) => document.querySelector(`input[name="q${q.n}"]:checked`);
  const answered = qs.filter((q) => picked(q)).length;
  if (!auto && answered < total && !confirm(`Bạn mới trả lời ${answered}/${total} câu. Vẫn nộp bài?`)) return;

  stopTimer();
  state.submitted = true;
  let correct = 0;

  qs.forEach((q) => {
    const p = picked(q);
    const val = p ? Number(p.value) : -1;
    document.querySelectorAll(`#qbox-${q.n} .option-label`).forEach((lb, j) => {
      lb.querySelector("input").disabled = true;
      lb.style.pointerEvents = "none";
      const span = lb.querySelector("span");
      if (j === q.ok) { lb.classList.add("correct-ans-box"); span.classList.add("correct-ans-text"); }
      else if (j === val) { lb.classList.add("wrong-ans-box"); span.classList.add("wrong-ans-text"); }
    });
    if (val === q.ok) { correct++; return; }
    const note = $("note-" + q.n);
    note.className = "mt-3 text-sm rounded-lg p-3 bg-red-50 border border-red-100 text-red-800";
    note.innerHTML = `${val === -1 ? "<i>Bạn chưa trả lời.</i> " : ""}<b>Đáp án đúng: ${LETTERS[q.ok]}.</b> ${rich(q.opts[q.ok].runs)}`;
  });

  const max = SCALE_MAX[state.exam.scale] || total;
  const score = Math.round((correct / total) * max * 10) / 10;
  const percent = Math.round((correct / total) * 100);
  $("score-display").textContent = `${score}/${max}`;
  $("correct-display").textContent = correct;
  $("wrong-display").textContent = total - correct;
  $("percent-display").textContent = percent + "%";
  $("motivation-message").textContent =
    percent >= 90 ? "Xuất sắc! Bạn nắm rất chắc phần này." :
    percent >= 70 ? "Khá tốt! Xem lại các câu sai để lên điểm tối đa." :
    percent >= 50 ? "Đạt mức trung bình. Đọc lại phần lý thuyết rồi làm lại nhé." :
                    "Đừng nản! Ôn lại lý thuyết và luyện thêm, bạn sẽ tiến bộ nhanh.";

  state.results[state.exam.id] = `${score}/${max}`;
  hide("submit-btn");
  show("result-screen");
  $("result-screen").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- ĐỒNG HỒ ĐẾM NGƯỢC ---------- */

function startTimer(seconds) {
  let left = seconds;
  const el = $("timer-display");
  const tick = () => {
    el.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
    el.classList.toggle("text-red-300", left <= 300);
  };
  state.running = true;
  show("timer-display");
  tick();
  state.timerId = setInterval(() => {
    left--;
    tick();
    if (left <= 0) {
      alert("Hết giờ! Hệ thống tự động nộp bài.");
      submitTest(true);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
  state.running = false;
  hide("timer-display");
}
