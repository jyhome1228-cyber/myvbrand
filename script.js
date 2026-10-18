const header = document.getElementById("siteHeader");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const revealItems = document.querySelectorAll(".reveal");

function onScroll(){
  header.classList.toggle("scrolled", window.scrollY > 24);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive:true });

menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});

mobileMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{ threshold:0.12 });

revealItems.forEach(item => observer.observe(item));


// NEWS FILTER
const newsFilterButtons = document.querySelectorAll(".news-filter [data-filter]");
const newsCards = document.querySelectorAll(".news-data-card[data-category]");
if (!document.querySelector('[data-news-archive]')) newsFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    newsFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    newsCards.forEach((card) => {
      const visible = filter === "ALL" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});


// Staggered reveal polish
document.querySelectorAll(".reveal").forEach((group) => {
  const children = group.querySelectorAll(
    ".page-card, .home-business-grid article, .home-together-card, .news-data-card, .vpoint-rate-card, .vpoint-total-card, .vpoint-result-card, .vpoint-example article, .vpoint-monthly"
  );
  children.forEach((child, index) => {
    child.style.setProperty("--stagger", index);
  });
});


// MYV bilingual draft: route KR / EN controls to matching English pages.
// The Korean site remains the default and the English pages live under /en/.
(() => {
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const supported = new Set([
    "index.html", "about.html", "business.html", "prosumer.html",
    "partner.html", "news.html", "vpoint.html", "contact.html", "privacy.html"
  ]);
  const requested = supported.has(pageName) ? pageName : "news.html";
  const script = document.querySelector('script[src*="script.js"]');
  const root = script ? new URL(".", script.src) : new URL("./", location.href);
  const enHref = new URL("en/" + requested, root);
  if (requested === "news.html" && pageName === "news.html") {
    const original = new URLSearchParams(location.search);
    if (original.has("article")) enHref.searchParams.set("article", original.get("article"));
    else if (original.has("category")) enHref.searchParams.set("category", original.get("category"));
  }
  document.querySelectorAll(".language-switch .lang-button, .mobile-language .lang-button").forEach(button => {
    const text = button.textContent.trim().toUpperCase();
    if (text === "EN") {
      button.title = "View English draft";
      button.setAttribute("aria-label", "View English website draft");
      button.addEventListener("click", () => { location.href = enHref.href; });
    }
  });
  document.querySelectorAll(".footer-language").forEach(group => {
    const en = Array.from(group.querySelectorAll("span")).find(el => el.textContent.trim() === "EN");
    if (!en) return;
    en.style.cursor = "pointer";
    en.setAttribute("role", "link");
    en.setAttribute("tabindex", "0");
    en.setAttribute("aria-label", "View English website draft");
    en.addEventListener("click", () => { location.href = enHref.href; });
    en.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        location.href = enHref.href;
      }
    });
  });
})();
