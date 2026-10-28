/* MYV prosumer quest calculator — shared KR / EN calculation and guided UI. */
(() => {
  "use strict";

  const form = document.getElementById("prosumerCalculator");
  if (!form) return;

  const english = document.documentElement.lang.toLowerCase().startsWith("en");
  const el = id => document.getElementById(id);
  const fields = [el("monthlySales"), el("followers"), el("avgPurchase")];
  const rate = el("commissionRate");
  const bonus = el("ambassadorBonus");
  const rateOutput = el("commissionOutput");
  const outputs = {
    total: el("totalIncome"),
    direct: el("salesIncome"),
    follower: el("assetIncome"),
    bonus: el("bonusIncome")
  };
  const questTitle = el("questHeadline");
  const questSubtitle = el("questSubline");
  const questProgress = el("questProgress");
  const questBubble = el("questBubbleText");
  const questChips = [...document.querySelectorAll("[data-quest-target]")];
  const numberFormatter = new Intl.NumberFormat("ko-KR");
  const visited = new Set();
  let activeStep = null;

  const messages = english ? {
    progress: n => n === 4 ? "QUEST COMPLETE" : "STEP " + n + " / 3",
    titles: [
      "First, try changing your monthly direct sales.",
      "Great! Next, enter the number of connected purchasers.",
      "Almost there! Set the average purchase per person.",
      "Quest complete! Here's your estimated monthly income."
    ],
    subtitles: [
      "Start with your own sales to see how direct rewards are calculated.",
      "Changing the number of followers shows its effect on eligible purchase rewards.",
      "Once you've set the average purchase amount, your scenario is complete.",
      "Change any input to explore how your results move."
    ],
    result: n => "With your current inputs, the illustrative monthly total is " + n + ".",
    resultBonus: (n, b) => "Your illustrative monthly total is " + n + ", including " + b + " in an activity bonus.",
    zero: "Enter values above zero to explore this part of the model.",
    labels: ["Direct sales", "Follower purchases", "Average purchase"]
  } : {
    progress: n => n === 4 ? "QUEST COMPLETE" : "STEP " + n + " / 3",
    titles: [
      "먼저 월 직접 판매액을 바꿔보세요!",
      "좋아요! 다음은 연결 팔로워 구매자 수를 입력해보세요.",
      "거의 다 왔어요! 1인당 평균 구매액을 입력해보세요.",
      "퀘스트 완료! 현재 조건의 월 예상 수익을 확인해보세요."
    ],
    subtitles: [
      "내가 판매한 금액을 조정하면 직접 판매 수익이 바로 계산됩니다.",
      "팔로워 구매자 수에 따라 예상 구매 수익이 어떻게 변하는지 살펴보세요.",
      "평균 구매액까지 입력하면 나만의 수익 시뮬레이션이 완성됩니다.",
      "숫자를 다시 바꿔보면 예상 수익이 실시간으로 달라집니다."
    ],
    result: n => "지금 입력한 조건이라면 월 예상 수익은 " + n + "입니다!",
    resultBonus: (n, b) => "현재 조건의 월 예상 수익은 " + n + "이며, 활동비 " + b + "이 포함된 예시입니다!",
    zero: "0보다 큰 값을 입력하면 예상 수익을 확인할 수 있어요.",
    labels: ["판매액", "팔로워", "평균 구매액"]
  };

  const money = n => english
    ? "KRW " + numberFormatter.format(n)
    : numberFormatter.format(n) + "원";

  const safeNumber = field => {
    if (!field) return 0;
    const raw = String(field.value || "").normalize("NFKC").replace(/,/g, "");
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    const max = Number(field.dataset.max) || 100000000000;
    return Math.min(n, max);
  };

  function formatField(field) {
    const old = field.value || "";
    const selection = field.selectionStart == null ? old.length : field.selectionStart;
    const countBefore = old.slice(0, selection).normalize("NFKC").replace(/\D/g, "").length;
    const digits = old.normalize("NFKC").replace(/\D/g, "");
    const limit = Number(field.dataset.max) || 100000000000;
    const num = digits ? Math.min(Number(digits), limit) : 0;
    const next = digits ? numberFormatter.format(num) : "";
    field.value = next;
    if (document.activeElement === field) {
      let pos = 0, seen = 0;
      while (pos < next.length && seen < countBefore) {
        if (/\d/.test(next[pos])) seen++;
        pos++;
      }
      try { field.setSelectionRange(pos, pos); } catch (_) {}
    }
  }

  function updateGuide(values, result, activity) {
    if (!questTitle || !questSubtitle || !questBubble) return;
    const missing = fields.findIndex((field, index) => !visited.has(index) || values[index] <= 0);
    const step = missing === -1 ? 3 : (activeStep == null ? missing : activeStep);
    const currentStep = step === 3 ? 4 : step + 1;
    questTitle.textContent = messages.titles[step];
    questSubtitle.textContent = messages.subtitles[step];
    if (questProgress) questProgress.textContent = messages.progress(currentStep);
    questChips.forEach((chip, index) => {
      const complete = visited.has(index) && values[index] > 0;
      const current = index === step;
      chip.classList.toggle("is-done", complete);
      chip.classList.toggle("is-current", current);
      chip.setAttribute("aria-pressed", String(current));
      chip.setAttribute("aria-label", messages.labels[index] +
        (complete ? (english ? ": complete" : ": 완료") : ""));
    });
    const hasZero = values.some(x => x <= 0);
    questBubble.textContent = hasZero && step !== 3
      ? messages.zero + " " + messages.result(money(result))
      : activity
        ? messages.resultBonus(money(result), money(activity))
        : messages.result(money(result));
  }

  function update() {
    const values = fields.map(safeNumber);
    const rateValue = Math.max(5, Math.min(40, Number(rate?.value) || 15));
    const direct = Math.round(values[0] * rateValue / 100);
    const follower = Math.round(values[1] * values[2] * rateValue / 100);
    const activity = bonus?.checked ? 1000000 : 0;
    const total = direct + follower + activity;

    if (rateOutput) rateOutput.textContent = rateValue + "%";
    outputs.direct.textContent = money(direct);
    outputs.follower.textContent = money(follower);
    outputs.bonus.textContent = money(activity);
    outputs.total.textContent = money(total);
    if (rate) {
      rate.style.setProperty("--slider-percent", (rateValue - 5) * 100 / 35 + "%");
    }
    updateGuide(values, total, activity);
  }

  fields.forEach((field, index) => {
    if (!field) return;
    formatField(field);
    field.addEventListener("input", event => {
      if (event.isComposing) return;
      formatField(field);
      visited.add(index);
      activeStep = null;
      update();
    });
    field.addEventListener("compositionend", () => {
      formatField(field);
      visited.add(index);
      activeStep = null;
      update();
    });
    field.addEventListener("blur", () => {
      if (field.value === "") field.value = "0";
      formatField(field);
      activeStep = null;
      update();
    });
  });

  questChips.forEach((chip, index) => {
    chip.addEventListener("click", () => {
      activeStep = index;
      update();
      fields[index]?.focus();
      fields[index]?.select();
    });
  });

  rate?.addEventListener("input", update);
  bonus?.addEventListener("change", update);
  form.addEventListener("submit", event => event.preventDefault());
  update();
})();
