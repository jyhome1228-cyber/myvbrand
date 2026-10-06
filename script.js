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
