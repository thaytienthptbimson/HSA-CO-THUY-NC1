/* =====================================================================
   app.js — Ôn thi Tiếng Anh ĐGNL HSA ĐHQGHN 2026
   Phần 1: DỮ LIỆU (thêm bài/câu hỏi tại đây)
   Phần 2: XỬ LÝ GIAO DIỆN (không cần sửa khi chỉ thêm nội dung)
   ===================================================================== */

/* ---------- PHẦN 1. DỮ LIỆU ---------- */

// Q(nội dung câu, [A, B, C, D], vị trí đáp án đúng (0=A, 1=B, 2=C, 3=D), giải thích)
const Q = (q, o, a, e) => ({ q, o, a, e });
// P(đoạn văn): chèn đoạn đọc hiểu, các câu Q ngay sau nó thuộc đoạn này
const P = (text) => ({ passage: text });

const DATA = {
  /* ===== NGỮ PHÁP: mỗi chuyên đề = lý thuyết + bài tập ===== */
  grammar: [
    {
      title: "Các thì của động từ",
      theory: "<p><b>Hiện tại hoàn thành</b> (have/has + V3): since, for, already, yet, so far.</p><p><b>Quá khứ đơn</b> (V2): yesterday, ago, last..., in 2020.</p><p><b>Quá khứ hoàn thành</b> (had + V3): xảy ra trước một mốc/hành động khác trong quá khứ.</p><p><b>Quá khứ tiếp diễn + quá khứ đơn</b>: hành động đang diễn ra thì bị cắt ngang.</p><p><b>Tương lai hoàn thành</b> (will have + V3): by + mốc thời gian trong tương lai.</p>",
      qs: [
        Q("She ____ in Hanoi since 2018.", ["lives", "has lived", "lived", "is living"], 1, "'since + mốc thời gian' dùng hiện tại hoàn thành: has lived."),
        Q("When I arrived, the meeting ____.", ["already started", "has already started", "had already started", "is starting"], 2, "Cuộc họp bắt đầu trước lúc tôi đến (mốc quá khứ) → quá khứ hoàn thành."),
        Q("Look! The children ____ in the garden.", ["play", "are playing", "played", "have played"], 1, "'Look!' báo hiệu hành động đang diễn ra → hiện tại tiếp diễn."),
        Q("By this time next year, he ____ his degree.", ["will finish", "finishes", "will have finished", "is finishing"], 2, "'By this time next year' → tương lai hoàn thành."),
        Q("I ____ TV when the phone rang.", ["watched", "was watching", "have watched", "am watching"], 1, "Hành động đang diễn ra (was watching) bị cắt ngang bởi hành động ngắn (rang).")
      ]
    },
    {
      title: "Câu điều kiện",
      theory: "<p><b>Loại 1</b> (có thể xảy ra): If + S + V(s/es), S + will + V.</p><p><b>Loại 2</b> (không có thật ở hiện tại): If + S + V2/were, S + would + V.</p><p><b>Loại 3</b> (không có thật ở quá khứ): If + S + had + V3, S + would have + V3.</p><p><b>Đảo ngữ</b>: Should + S + V (loại 1), Were + S + ... (loại 2), Had + S + V3 (loại 3).</p>",
      qs: [
        Q("If it rains tomorrow, we ____ the picnic.", ["cancel", "will cancel", "would cancel", "would have cancelled"], 1, "Điều kiện loại 1: If + hiện tại đơn, S + will + V."),
        Q("If I ____ you, I would accept the offer.", ["am", "will be", "were", "had been"], 2, "Điều kiện loại 2 (giả sử trái hiện tại): If I were you."),
        Q("If she had studied harder, she ____ the exam.", ["would pass", "will pass", "would have passed", "passed"], 2, "Điều kiện loại 3: had + V3 → would have + V3."),
        Q("____ you need any help, please call me.", ["If", "Should", "Were", "Had"], 1, "Đảo ngữ điều kiện loại 1: Should you need = If you need."),
        Q("Had I known about the traffic, I ____ earlier.", ["would leave", "will leave", "would have left", "left"], 2, "Had I known = If I had known (loại 3) → would have left.")
      ]
    },
    {
      title: "Câu bị động",
      theory: "<p>Cấu trúc chung: <b>be + V3</b> (by + tác nhân nếu cần).</p><p>Hiện tại đơn: am/is/are + V3. Quá khứ đơn: was/were + V3.</p><p>Hiện tại hoàn thành: have/has been + V3. Động từ khuyết thiếu: modal + be + V3.</p><p>Động từ tường thuật (say, believe, think...): S + is said/believed + <b>to V</b>.</p>",
      qs: [
        Q("This bridge ____ in 1995.", ["built", "was built", "is built", "has built"], 1, "Có mốc 'in 1995' → quá khứ đơn bị động: was built."),
        Q("The report must ____ before Friday.", ["finish", "be finished", "been finished", "finishing"], 1, "Modal + be + V3: must be finished."),
        Q("English ____ all over the world.", ["speaks", "is spoken", "spoke", "is speaking"], 1, "Tiếng Anh 'được nói' → hiện tại đơn bị động: is spoken."),
        Q("Many trees ____ in the city since 2020.", ["have planted", "have been planted", "were planted", "are planting"], 1, "'since 2020' → hiện tại hoàn thành bị động: have been planted."),
        Q("She is said ____ ten languages.", ["speaking", "to speak", "speak", "speaks"], 1, "Bị động với động từ tường thuật: S + is said + to V.")
      ]
    },
    {
      title: "Mệnh đề quan hệ",
      theory: "<p><b>who</b>: người (chủ ngữ). <b>whom</b>: người (tân ngữ, sau giới từ). <b>which</b>: vật.</p><p><b>whose</b> + danh từ: chỉ sở hữu. <b>where</b>: nơi chốn. <b>when</b>: thời gian.</p><p>Mệnh đề không xác định (có dấu phẩy) <b>không dùng that</b>.</p>",
      qs: [
        Q("The man ____ lives next door is a doctor.", ["whose", "whom", "who", "which"], 2, "Thay cho người, làm chủ ngữ → who."),
        Q("This is the house ____ I was born.", ["which", "where", "who", "whose"], 1, "Chỉ nơi chốn → where (= in which)."),
        Q("The girl ____ bag was stolen is crying.", ["who", "whom", "which", "whose"], 3, "Chỉ sở hữu (bag của cô gái) → whose."),
        Q("Hanoi, ____ is the capital of Vietnam, has over 8 million people.", ["that", "which", "who", "where"], 1, "Mệnh đề không xác định (có dấu phẩy) → dùng which, không dùng that."),
        Q("She is the person to ____ I gave the keys.", ["who", "whom", "which", "whose"], 1, "Sau giới từ (to) chỉ người → whom.")
      ]
    },
    {
      title: "So sánh",
      theory: "<p><b>So sánh hơn</b>: adj-er / more + adj + than.</p><p><b>So sánh nhất</b>: the + adj-est / the most + adj.</p><p><b>So sánh kép</b>: The + so sánh hơn..., the + so sánh hơn...</p><p><b>Bằng nhau</b>: as + adj + as. Bất quy tắc: good → better → best; bad → worse → worst.</p>",
      qs: [
        Q("This exam is ____ than the last one.", ["more difficult", "most difficult", "difficultest", "the more difficult"], 0, "Tính từ dài + than → more + adj."),
        Q("She is the ____ student in our class.", ["more intelligent", "most intelligent", "intelligenter", "as intelligent"], 1, "Có 'the' + phạm vi 'in our class' → so sánh nhất."),
        Q("The harder you work, the ____ you will be.", ["successful", "more successful", "most successful", "as successful"], 1, "So sánh kép: The + so sánh hơn, the + so sánh hơn."),
        Q("His English is getting ____ every day.", ["good", "well", "better and better", "the best"], 2, "Tăng dần theo thời gian → better and better."),
        Q("My house is not as ____ as yours.", ["big", "bigger", "biggest", "more big"], 0, "as + adj nguyên mẫu + as.")
      ]
    },
    {
      title: "Cấu tạo từ",
      theory: "<p><b>Danh từ</b>: -tion, -ment, -ness, -ity, -ance. <b>Tính từ</b>: -ful, -less, -ous, -ive, -able.</p><p><b>Trạng từ</b>: adj + -ly. <b>Động từ</b>: -ize, -en, en-.</p><p>Vị trí: tính từ đứng trước danh từ hoặc sau be; trạng từ bổ nghĩa cho động từ/tính từ; sau mạo từ the cần danh từ.</p>",
      qs: [
        Q("She spoke ____ about her plans.", ["enthusiasm", "enthusiastic", "enthusiastically", "enthusiast"], 2, "Bổ nghĩa cho động từ 'spoke' → trạng từ."),
        Q("The ____ of the project surprised everyone.", ["succeed", "successful", "successfully", "success"], 3, "Sau 'The' và làm chủ ngữ → danh từ: success."),
        Q("He gave a very ____ answer, so nobody understood.", ["confused", "confusing", "confusion", "confusingly"], 1, "Câu trả lời gây khó hiểu (chủ động) → confusing; confused chỉ cảm giác của người."),
        Q("Regular exercise can ____ your immune system.", ["strength", "strong", "strengthen", "strongly"], 2, "Sau can cần động từ nguyên mẫu: strengthen."),
        Q("The company is looking for ____ employees.", ["responsibly", "responsibility", "responsible", "responsibilities"], 2, "Đứng trước danh từ 'employees' → tính từ.")
      ]
    }
  ],

  /* ===== LUYỆN ĐỀ: mỗi đề có thời gian (phút) ===== */
  mocktest: [
    {
      title: "Đề thi thử số 1",
      minutes: 20,
      qs: [
        Q("She has been working here ____ five years.", ["since", "for", "during", "from"], 1, "'five years' là khoảng thời gian → for."),
        Q("The teacher asked us ____ so much noise.", ["not make", "don't make", "not to make", "to not making"], 2, "ask + O + (not) to V."),
        Q("I'm not used to ____ up so early.", ["get", "getting", "got", "be getting"], 1, "be used to + V-ing."),
        Q("Choose the word closest in meaning to 'reluctant': He was reluctant to share his opinion.", ["eager", "unwilling", "ready", "glad"], 1, "reluctant = unwilling (miễn cưỡng)."),
        Q("Choose the word OPPOSITE in meaning to 'abundant': Fresh water is no longer abundant in many regions.", ["plentiful", "scarce", "cheap", "pure"], 1, "abundant (dồi dào) >< scarce (khan hiếm)."),
        Q("Not only ____ the exam, but she also won a scholarship.", ["she passed", "did she pass", "she did pass", "passed she"], 1, "Đảo ngữ với 'Not only' đứng đầu câu: did + S + V."),
        Q("'Would you mind opening the window?' — '____'", ["Yes, I'd love to.", "Not at all, I'll do it now.", "That's very kind of you.", "You're welcome."], 1, "'Would you mind...?' đồng ý bằng 'Not at all'."),
        Q("He suggested ____ a taxi to the airport.", ["to take", "taking", "us to take", "took"], 1, "suggest + V-ing."),
        Q("Chọn phần SAI: Each of the students have finished their homework.", ["Each of", "have", "finished", "their"], 1, "Each of + danh từ số nhiều nhưng động từ chia số ít: has finished."),
        Q("Neither the manager nor the employees ____ aware of the change.", ["is", "was", "are", "has been"], 2, "Neither...nor: động từ chia theo danh từ gần nhất (employees) → are."),
        Q("Tom: 'I passed my driving test!' — Mary: '____'", ["Good luck!", "Congratulations!", "Never mind.", "Take care."], 1, "Đáp lại tin vui → Congratulations!"),
        P("Many cities around the world are introducing green roofs, which are roofs covered with plants. These roofs absorb rainwater, reducing the risk of floods, and they keep buildings cooler in summer, so less electricity is needed for air conditioning. Moreover, they provide a habitat for birds and insects in crowded urban areas. However, green roofs are expensive to install and require regular maintenance, which discourages some building owners. Despite this, experts believe the long-term benefits outweigh the costs."),
        Q("What is the passage mainly about?", ["The history of urban gardening", "The advantages and drawbacks of green roofs", "How to reduce electricity bills", "Ways to protect birds and insects"], 1, "Đoạn văn nêu lợi ích (hút nước mưa, mát hơn, môi trường sống) và hạn chế (chi phí, bảo trì) của mái xanh."),
        Q("According to the passage, green roofs help buildings by ____.", ["making them taller", "keeping them cooler in summer", "increasing rainwater", "attracting tourists"], 1, "Đoạn văn: 'keep buildings cooler in summer'."),
        Q("The word 'discourages' in the passage is closest in meaning to ____.", ["attracts", "deters", "helps", "teaches"], 1, "discourage = deter (làm nản lòng, ngăn cản)."),
        Q("What do experts think about green roofs?", ["They are too costly to be useful.", "Their benefits are greater than their costs in the long run.", "They should only be built on houses.", "They need more electricity."], 1, "Câu cuối: 'long-term benefits outweigh the costs'.")
      ]
    }
  ]
};

/* ---------- PHẦN 2. XỬ LÝ GIAO DIỆN ---------- */

const state = { section: null, index: -1, qs: [], submitted: false, running: false, timerId: null, done: {} };
const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove("hidden-element");
const hide = (id) => $(id).classList.add("hidden-element");
const LETTERS = ["A", "B", "C", "D"];

/* Chọn mục (Ngữ pháp / Luyện đề) → vào thẳng bài đầu tiên */
function selectSection(section) {
  if (!DATA[section]) return;
  stopTimer();
  state.section = section;
  state.index = -1;

  const base = "px-5 py-2 rounded-md text-sm transition-colors ";
  const on = "bg-gray-50 text-blue-800 font-bold shadow-sm";
  const off = "bg-white/20 hover:bg-white/90 hover:text-blue-800 font-semibold";
  ["grammar", "mocktest"].forEach((s) => ($("tab-" + s).className = base + (s === section ? on : off)));
  $("sidebar-title-text").textContent = section === "grammar" ? "Chuyên đề ngữ pháp" : "Đề thi thử";

  renderSidebar();
  openItem(0, false);
}

/* Mở một bài học / đề thi */
function openItem(i, scrollToContent) {
  if (state.running && !state.submitted &&
      !confirm("Bạn đang làm dở đề. Chuyển sang bài khác sẽ mất bài làm hiện tại. Tiếp tục?")) return;
  stopTimer();

  const item = DATA[state.section][i];
  state.index = i;
  state.submitted = false;
  state.qs = item.qs.filter((x) => !x.passage);

  hide("welcome-screen");
  hide("result-screen");
  show("test-screen");
  show("submit-btn");
  $("current-test-title").textContent = item.title;
  $("current-test-subtitle").textContent = state.section === "grammar"
    ? "Chuyên đề ngữ pháp • Kiến thức cần nhớ + bài tập vận dụng"
    : "Đề thi thử • Định dạng ĐGNL ĐHQGHN • " + item.minutes + " phút";
  $("submit-btn").textContent = state.section === "grammar" ? "NỘP BÀI & XEM ĐÁP ÁN" : "NỘP BÀI & XEM ĐIỂM";

  renderQuestions(item);
  updateSidebar();
  if (item.minutes) startTimer(item.minutes * 60);

  if (scrollToContent && window.innerWidth < 1024) {
    $("test-screen").scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0 });
  }
}

/* Danh mục bên trái */
function renderSidebar() {
  $("sidebar-container").innerHTML = DATA[state.section].map((it, i) =>
    `<button onclick="openItem(${i}, true)" id="side-${i}" class="w-full text-left px-4 py-3 border-b border-gray-100 border-l-4 flex items-center justify-between gap-2 hover:bg-blue-50 transition-colors">
      <span class="text-sm font-semibold text-gray-700">${i + 1}. ${it.title}</span>
      <span id="badge-${i}" class="text-xs font-bold text-green-700 bg-green-100 rounded-full px-2 py-0.5 flex-shrink-0 hidden-element"></span>
    </button>`).join("");
}

function updateSidebar() {
  DATA[state.section].forEach((it, i) => {
    const active = i === state.index;
    const btn = $("side-" + i);
    btn.classList.toggle("bg-blue-100", active);
    btn.classList.toggle("border-l-blue-600", active);
    btn.classList.toggle("border-l-transparent", !active);
    const badge = $("badge-" + i);
    const result = state.done[state.section + i];
    badge.textContent = result || "";
    badge.classList.toggle("hidden-element", !result);
  });
}

/* Hiển thị lý thuyết + câu hỏi */
function renderQuestions(item) {
  let html = "";
  let n = 0;
  if (item.theory) {
    html += `<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
      <h3 class="font-bold text-amber-800 mb-2">Kiến thức cần nhớ</h3>
      <div class="text-gray-700 leading-relaxed space-y-2">${item.theory}</div>
    </div>
    <h3 class="font-bold text-blue-800 text-lg pt-2">Bài tập vận dụng</h3>`;
  }
  item.qs.forEach((it) => {
    if (it.passage) {
      html += `<div class="reading-passage bg-gray-50 border-l-4 border-blue-400 rounded p-4 text-[17px] leading-relaxed">
        <p class="font-sans text-sm font-bold text-blue-800 mb-2">Đọc đoạn văn và trả lời các câu hỏi bên dưới</p>${it.passage}</div>`;
      return;
    }
    const k = n++;
    html += `<div class="question-box bg-white border border-gray-200 rounded-xl p-4" id="qbox-${k}">
      <p class="font-semibold text-gray-800 mb-3"><span class="text-blue-700">Câu ${k + 1}.</span> ${it.q}</p>
      <div class="grid gap-2 sm:grid-cols-2">
        ${it.o.map((opt, j) => `<label class="option-label flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-white">
          <input type="radio" name="q${k}" value="${j}" class="w-4 h-4 accent-blue-600 flex-shrink-0">
          <span>${LETTERS[j]}. ${opt}</span></label>`).join("")}
      </div>
      <div id="exp-${k}" class="hidden-element mt-3 text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 text-gray-700"></div>
    </div>`;
  });
  $("questions-container").innerHTML = html;
}

/* Nộp bài, chấm điểm, hiện đáp án */
function submitTest(auto) {
  if (state.submitted) return;
  const total = state.qs.length;
  const answered = state.qs.filter((_, k) => document.querySelector(`input[name="q${k}"]:checked`)).length;
  if (!auto && answered < total && !confirm(`Bạn mới trả lời ${answered}/${total} câu. Vẫn nộp bài?`)) return;

  stopTimer();
  state.submitted = true;
  let correct = 0;

  state.qs.forEach((q, k) => {
    const picked = document.querySelector(`input[name="q${k}"]:checked`);
    const val = picked ? Number(picked.value) : -1;
    document.querySelectorAll(`#qbox-${k} .option-label`).forEach((lb, j) => {
      lb.querySelector("input").disabled = true;
      lb.style.pointerEvents = "none";
      const span = lb.querySelector("span");
      if (j === q.a) { lb.classList.add("correct-ans-box"); span.classList.add("correct-ans-text"); }
      else if (j === val) { lb.classList.add("wrong-ans-box"); span.classList.add("wrong-ans-text"); }
    });
    if (val === q.a) correct++;
    const ex = $("exp-" + k);
    ex.innerHTML = `<b>Đáp án: ${LETTERS[q.a]}.</b> ${val === -1 ? "<i>(Bạn chưa trả lời)</i> " : ""}${q.e || ""}`;
    ex.classList.remove("hidden-element");
  });

  const percent = Math.round((correct / total) * 100);
  $("score-display").textContent = `${correct}/${total}`;
  $("correct-display").textContent = correct;
  $("wrong-display").textContent = total - correct;
  $("percent-display").textContent = percent + "%";
  $("motivation-message").textContent =
    percent >= 90 ? "Xuất sắc! Bạn nắm rất chắc phần này." :
    percent >= 70 ? "Khá tốt! Xem lại các câu sai để lên điểm tối đa." :
    percent >= 50 ? "Đạt mức trung bình. Đọc lại phần kiến thức cần nhớ rồi làm lại nhé." :
                    "Đừng nản! Ôn lại lý thuyết và luyện thêm, bạn sẽ tiến bộ nhanh.";

  state.done[state.section + state.index] = `${correct}/${total}`;
  updateSidebar();
  hide("submit-btn");
  show("result-screen");
  $("result-screen").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Nút "Trở về Danh mục" sau khi xem kết quả */
function continueAfterResult() {
  stopTimer();
  state.index = -1;
  hide("result-screen");
  hide("test-screen");
  show("welcome-screen");
  updateSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Đồng hồ đếm ngược (chỉ dùng cho đề thi thử) */
function startTimer(seconds) {
  let left = seconds;
  const el = $("timer-display");
  const tick = () => {
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    el.textContent = `${m}:${s}`;
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
