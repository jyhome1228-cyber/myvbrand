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


// MYV brand entry + quiet scroll typography: shared by Korean and English pages.
// Intro is opt-in from homepage <head> and appears only once per browsing session.
(() => {
  const root = document.documentElement;
  const overlay = document.getElementById("myvIntro");
  if (overlay && root.classList.contains("myv-intro-ready")) {
    try { sessionStorage.setItem("myv-intro-viewed-v1", "yes"); } catch (_) {}
    let closing = false;
    let autoClose;
    const removeIntro = () => {
      if (closing) return;
      closing = true;
      window.clearTimeout(autoClose);
      overlay.classList.add("is-leaving");
      root.classList.remove("myv-intro-ready");
      window.setTimeout(() => overlay.remove(), 510);
      document.removeEventListener("keydown", onEscape);
    };
    function onEscape(event) {
      if (event.key === "Escape") removeIntro();
    }
    overlay.querySelector(".myv-intro-skip")?.addEventListener("click", removeIntro);
    document.addEventListener("keydown", onEscape);
    autoClose = window.setTimeout(removeIntro, 1450);
  } else if (overlay) {
    overlay.remove();
  }

  // Progressive enhancement: never hide content if observer is unsupported
  // or the visitor prefers reduced motion.
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selector = [
    "main .home-section-head h2", "main .page-section-heading h2",
    "main .prosumer-heading h2", "main .definition-top h2",
    "main .section-head h2", "main .section-top h2",
    "main .home-section-copy h2", "main .page-copy h2",
    "main .hero-copy h1", "main .centered-hero-copy h1",
    "main .page-hero-inner h1", "main .hero .container > h1",
    "main .split h2", "main .panel h3",
    "main .home-business-link-card h3", "main .en-home-entry-card h3",
    "main .banner-cta h2", "main .home-final-cta h2"
  ].join(", ");
  const textTargets = [...document.querySelectorAll(selector)];
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        textObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -22px 0px" });
  textTargets.forEach((el, i) => {
    el.classList.add("myv-scroll-motion");
    el.style.setProperty("--myv-motion-delay", String((i % 3) * 55) + "ms");
    textObserver.observe(el);
  });
})();
