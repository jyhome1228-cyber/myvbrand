(() => {
  "use strict";
  const current = location.pathname.split("/").pop() || "index.html";
  const ko = "../" + (current === "thank-you.html" ? "contact-thanks.html" : current);
  const query = location.search;
  document.querySelectorAll(".language-switch .lang-button, .mobile-language .lang-button").forEach(button => {
    const locale = button.textContent.trim().toUpperCase();
    button.classList.toggle("is-active", locale === "EN");
    button.title = locale === "KR" ? "한국어 홈페이지" : "English website";
    if (locale === "KR") {
      button.addEventListener("click", () => {
        location.href = ko + query;
      });
    }
  });
  document.querySelectorAll(".footer-language").forEach(group => {
    const fields = Array.from(group.querySelectorAll("span"));
    for (const f of fields) {
      const locale = f.textContent.trim().toUpperCase();
      f.classList.toggle("is-active", locale === "EN");
      if (locale === "KR") {
        f.style.cursor = "pointer";
        f.tabIndex = 0;
        f.setAttribute("role", "link");
        f.setAttribute("aria-label", "한국어 페이지로 이동");
        f.addEventListener("click", () => location.href = ko + query);
        f.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            location.href = ko + query;
          }
        });
      }
    }
  });
})();