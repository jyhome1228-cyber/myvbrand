(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll(".nav-dropdown > button").forEach(button => {
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      const dropdown = button.closest(".nav-dropdown");
      dropdown?.classList.toggle("open", open);
    });
  });

  const page = document.body.dataset.page;
  const korLink = document.querySelector('a[data-locale="ko"]');
  if (korLink && page === "news") {
    const params = new URLSearchParams(location.search);
    if (params.has("article")) korLink.href = "../news.html?article=" + encodeURIComponent(params.get("article"));
    else if (params.has("category")) korLink.href = "../news.html?category=" + encodeURIComponent(params.get("category"));
  }

  const calculator = document.getElementById("enCalculator");
  if (calculator) {
    const output = id => document.getElementById(id);
    const money = amount => "KRW " + Math.round(amount).toLocaleString("en-US");
    const compute = () => {
      const val = name => Math.max(0, Number(calculator.elements[name]?.value) || 0);
      const sales = Math.min(val("sales"), 100000000000);
      const followers = Math.min(val("followers"), 1000000);
      const spend = Math.min(val("spend"), 100000000000);
      const rate = Math.min(100, val("rate")) / 100;
      const direct = sales * rate;
      const network = followers * spend * rate;
      const bonus = calculator.elements["bonus"]?.checked ? 1000000 : 0;
      output("enCalcDirect").textContent = money(direct);
      output("enCalcFollower").textContent = money(network);
      output("enCalcBonus").textContent = money(bonus);
      output("enCalcTotal").textContent = money(direct + network + bonus);
    };
    calculator.addEventListener("input", compute);
    calculator.addEventListener("change", compute);
    calculator.addEventListener("submit", e => e.preventDefault());
    compute();
  }

  if (page !== "news") return;

  // Titles are editorial English working translations. Body translations
  // intentionally remain flagged as unfinished until approved.
  const titleMap = {
    "legacy-171831533": "Vietnamese KOL Xenia Joins Getz-Beauty, Signaling Entry into Korea",
    "legacy-170448224": "V Labs CEO Jangwook Lee on E-Commerce Where Businesses and Consumers Grow Together",
    "legacy-170004786": "Influencer E-Commerce Association and V Labs Join Forces for a Global MYV Prosumer Ecosystem",
    "legacy-169080625": "V Labs CEO Receives Award for Consumer Curation at the 2025 Influencer Awards",
    "legacy-168408090": "Meet Drunken Rose, a Signature Fragrance from Scentwiki",
    "legacy-168310159": "CoffeeTools: Bringing the Aroma of Coffee Into Everyday Life",
    "legacy-168029754": "MYV: Building an E-Commerce Model Where Consumption Creates Value",
    "legacy-167950862": "Gentle Dermocosmetics Brand Dr. Gentle Joins MYV",
    "legacy-167829500": "Pet Brand OnesPapa Expands on MYV with Freeze-Dried Dog Treats",
    "legacy-167537778": "MYV Welcomes Traditional Korean Black Goat Extract and Premium Red Ginseng Gift Sets",
    "legacy-167321731": "Premium Soy Milk Brand Duyubonsaek Joins MYV",
    "legacy-167275727": "MYV: A Platform Where Consumption Becomes Shared Value",
    "weeklypeople-interview": "V Labs CEO Jangwook Lee Featured in Weekly People Interview",
    "myv-patent-registration": "V Labs Announces Three Patents Related to MYV",
    "value-consumption-platform": "V Labs Develops MYV, a Value-Driven Commerce Platform for Shared Growth",
    "dentipromised-blind-test": "Dentipromised Toothpaste: Blind Product Test",
    "myv-renewal-2024": "MYV Marks Its 2024 Online Mall Renewal with a Launch Event",
    "silkyhair-blind-test": "Silkyhair Hair Essence: Blind Product Test",
    "vpoint-friend-event": "MYV Announces 2024 Invite-a-Friend V.Point Campaign",
    "assistfit-collaboration": "V Labs Broadens Consumer Engagement with AssistFit Media",
    "luluan-brand-launch": "Eco-Friendly Portable Bidet Brand Luluan Joins MYV",
    "anti-hairloss-blind-test": "Anti-Hairloss Shampoo: Blind Product Test",
    "pearlcare-launch": "Beauty and Healthcare Brand Pearlcare Joins MYV",
    "black-friday-2024": "MYV Holds a Black Friday Promotion in 2024",
    "jungleon-office": "V Labs Selected to Join Seongnam Startup Center Jungle ON",
    "onk-healthcare-launch": "Three Taijeon Group ONK Health Products Join the MYV Mall",
    "jalpul-house-launch": "Household Essentials Brand Jalpul House Joins MYV",
    "ozon-toothbrush-launch": "Korean Toothbrush Brand Ozon Joins MYV",
    "verymom-launch": "Premium Skincare Brand Verymom Joins MYV",
    "farmerssignature-lovew-launch": "Farmers Signature and Lovew Skincare Join MYV",
    "onespapa-foot-cleanser-launch": "OnesPapa Natural Dog Paw Cleanser Joins MYV",
    "ai-demand-patent": "V Labs Registers Patent for AI-Based Demand Forecasting",
    "taejeon-vitality-launch": "MYV Adds Three Taijeon Group Wellness Products",
    "manticket-launch": "Men's Care Brand Manticket Expands MYV's Portfolio",
    "vastly-launch": "Eco-Friendly Lifestyle Brand Vastly Joins MYV",
    "cuni-launch": "Natural Lifestyle Brand CUNI Joins the MYV Mall",
    "cleanbeauty-startup-seminar": "V Labs Participates in Clean Beauty Startup Seminar",
    "gibunjoeum-launch": "Upcycled Hand Wash Brand Gibunjoeum Joins MYV"
  };

  const grid = document.getElementById("enNewsGrid");
  const count = document.getElementById("enNewsCount");
  const filters = document.getElementById("enNewsFilters");
  const pages = document.getElementById("enNewsPages");
  const list = document.getElementById("enNewsList");
  const detail = document.getElementById("enNewsDetail");
  if (!grid || !filters || !pages || !list || !detail) return;

  const params = new URLSearchParams(location.search);
  const validCats = ["ALL", "MYV", "PARTNER", "GLOBAL"];
  let category = validCats.includes(params.get("category")) ? params.get("category") : "ALL";
  let currentPage = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  let posts = [];

  function node(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function titleFor(post) { return titleMap[post.id] || post.title; }

  function renderDetails(post) {
    list.hidden = true;
    detail.hidden = false;
    document.getElementById("enArticleCategory").textContent = post.category;
    document.getElementById("enArticleTitle").textContent = titleFor(post);
    document.getElementById("enArticleDate").textContent = "Published " + post.date +
      (post.reportedDate ? " · Source publication date " + post.reportedDate : "");
    document.title = titleFor(post) + " | MYV News";
    const body = document.getElementById("enArticleBody");
    body.replaceChildren();
    if (!post.body) {
      body.appendChild(node("p", "", "The source article content has not yet been migrated to the MYV website. An English article draft will be added once the source material is available."));
    } else {
      // Original Korean is shown transparently until an approved English translation exists.
      const paragraphs = String(post.body).split(/\n\s*\n/).filter(Boolean);
      paragraphs.forEach(text => {
        const copy = text.trim().replace(/^["'](?=https?:\/\/)/, "").replace(/["']$/, "");
        if (/^https:\/\/\S+\.(webp|png|jpg|jpeg)(?:\?\S*)?$/i.test(copy)) {
          const figure = node("figure");
          const img = node("img");
          img.src = copy;
          img.loading = "lazy";
          img.alt = "Source article visual";
          figure.appendChild(img);
          body.appendChild(figure);
        } else {
          // Remove Markdown bold markers without inventing translated text.
          body.appendChild(node("p", "", text.replace(/\*\*/g, "")));
        }
      });
    }
    document.getElementById("enArticleNotice").hidden = false;
  }

  function renderCard(post) {
    const card = node("a", "news-card");
    card.href = "./news.html?article=" + encodeURIComponent(post.id);
    const imgBox = node("div", "news-thumb" + (post.thumbnail ? " real" : ""));
    if (post.thumbnail) {
      const img = node("img");
      img.src = post.thumbnail;
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = "";
      imgBox.appendChild(img);
    } else {
      imgBox.appendChild(node("small", "", post.category));
      const logo = node("img");
      logo.src = "../assets/myv-logo.svg";
      logo.alt = "";
      imgBox.appendChild(logo);
      imgBox.appendChild(node("strong", "", "MYV NEWS"));
    }
    card.appendChild(imgBox);
    card.appendChild(node("p", "category", post.category));
    card.appendChild(node("h3", "", titleFor(post)));
    const time = node("time", "", post.date);
    time.dateTime = post.date;
    card.appendChild(time);
    return card;
  }

  function renderList() {
    list.hidden = false;
    detail.hidden = true;
    document.title = "MYV News";
    filters.replaceChildren();
    validCats.forEach(cat => {
      const button = node("button", cat === category ? "active" : "", cat);
      button.type = "button";
      button.setAttribute("aria-pressed", String(cat === category));
      button.addEventListener("click", () => {
        category = cat;
        currentPage = 1;
        renderList();
      });
      filters.appendChild(button);
    });
    const filtered = posts.filter(p => category === "ALL" || p.category === category);
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12));
    currentPage = Math.min(currentPage, totalPages);
    count.textContent = filtered.length + " articles · " + currentPage + " / " + totalPages + " pages";
    grid.replaceChildren(...filtered.slice((currentPage - 1) * 12, currentPage * 12).map(renderCard));
    pages.replaceChildren();
    if (totalPages > 1) {
      const addPage = (label, target, disabled) => {
        const button = node("button", target === currentPage && label === String(target) ? "active" : "", label);
        button.type = "button";
        button.disabled = disabled;
        button.addEventListener("click", () => {
          currentPage = target;
          renderList();
          document.getElementById("enNewsArea")?.scrollIntoView();
        });
        pages.appendChild(button);
      };
      addPage("Prev", currentPage - 1, currentPage <= 1);
      for (let i = 1; i <= totalPages; i++) addPage(String(i), i, false);
      addPage("Next", currentPage + 1, currentPage === totalPages);
    }
    const url = new URL(location.href);
    url.searchParams.delete("article");
    if (category === "ALL") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    if (currentPage === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(currentPage));
    history.replaceState(null, "", url);
  }

  fetch("../news-posts.json?v=20261018-en01", {cache: "no-store"}).then(response => {
    if (!response.ok) throw new Error("News source not available");
    return response.json();
  }).then(data => {
    if (!Array.isArray(data)) throw new Error("Invalid news source");
    posts = data.sort((a,b) => (b.date||"").localeCompare(a.date||""));
    const articleId = new URLSearchParams(location.search).get("article");
    const article = articleId ? posts.find(post => post.id === articleId) : null;
    if (article) renderDetails(article);
    else renderList();
  }).catch(() => {
    grid.replaceChildren(node("p", "", "News is temporarily unavailable. Please try again later."));
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
      window.setTimeout(() => {
        root.classList.remove("myv-intro-ready");
        overlay.remove();
      }, 510);
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
