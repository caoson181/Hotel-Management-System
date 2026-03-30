/**
 * SOLAR SYSTEM JS - TRÁNH XUNG ĐỘT VỚI HOMEPAGE.JS
 * Tất cả biến và function đều có prefix "solar"
 */

// CREATE STARS BACKGROUND
function solarCreateStars() {
  const container = document.getElementById("solarStarsContainer");
  if (!container) return;

  const starCount = Math.min(300, Math.floor(window.innerWidth / 3));
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("solar-star");
    const size = Math.random() * 2.5 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = Math.random() * 3 + 1 + "s";
    container.appendChild(star);
  }
}

// PLANET DATA
let solarPlanets = [];
let solarAnimationId = null;
let solarIsPlaying = true;
let solarAngles = [];
let solarCurrentOrbitRadii = [];

const solarBaseOrbitRadii = [180, 265, 350, 435, 520];
const solarBaseSpeed = 0.00055;

function solarUpdateOrbitRadii() {
  const container = document.getElementById("solarOrbitSystem");
  if (!container) return;

  const containerSize = container.offsetWidth;
  const scale = containerSize / 900;

  solarCurrentOrbitRadii = solarBaseOrbitRadii.map((r) => r * scale);
}

function solarCreatePlanets() {
  const container = document.getElementById("solarOrbitSystem");
  if (!container) return;

  solarUpdateOrbitRadii();

  const existingCenter = container.querySelector(".solar-gravity-center");
  container.innerHTML = "";
  if (existingCenter) container.appendChild(existingCenter);

  if (solarAngles.length === 0) {
    solarAngles = solarBaseOrbitRadii.map(() => Math.random() * Math.PI * 2);
  }

  solarPlanets = [];

  const planetNames = ["Awards", "Rating", "Green", "Media", "Guests"];
  const planetValues = ["18", "4.9", "5★", "120+", "50K+"];
  const planetIcons = [
    "fa-trophy",
    "fa-star",
    "fa-leaf",
    "fa-newspaper",
    "fa-users",
  ];
  const planetColors = ["#fbbf24", "#60a5fa", "#34d399", "#f97316", "#ec489a"];

  for (let i = 0; i < solarCurrentOrbitRadii.length; i++) {
    const orbit = document.createElement("div");
    orbit.className = "solar-orbit";
    const diameter = solarCurrentOrbitRadii[i] * 2;
    orbit.style.width = diameter + "px";
    orbit.style.height = diameter + "px";
    container.appendChild(orbit);

    const planetDiv = document.createElement("div");
    planetDiv.className = "solar-planet";
    planetDiv.setAttribute("data-solar-planet-idx", i);
    planetDiv.style.background = `radial-gradient(circle at 30% 30%, ${planetColors[i]}40, rgba(20,30,55,0.95))`;
    planetDiv.style.border = `1.5px solid ${planetColors[i]}80`;
    planetDiv.innerHTML = `
            <i class="fas ${planetIcons[i]}" style="color: ${planetColors[i]};"></i>
            <div class="solar-planet-value" style="color: ${planetColors[i]};">${planetValues[i]}</div>
            <div class="solar-planet-label">${planetNames[i]}</div>
        `;
    container.appendChild(planetDiv);

    const speed = solarBaseSpeed / (1 + i * 0.08);

    solarPlanets.push({
      element: planetDiv,
      radius: solarCurrentOrbitRadii[i],
      angle: solarAngles[i],
      speed: speed,
      index: i,
    });
  }

  solarRepositionPlanets();

  if (solarAnimationId) cancelAnimationFrame(solarAnimationId);
  solarStartAnimation();
}

function solarAnimatePlanets() {
  if (!solarIsPlaying) {
    solarAnimationId = requestAnimationFrame(solarAnimatePlanets);
    return;
  }

  const container = document.getElementById("solarOrbitSystem");
  if (!container) {
    solarAnimationId = requestAnimationFrame(solarAnimatePlanets);
    return;
  }

  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  solarPlanets.forEach((planet) => {
    planet.angle += planet.speed;
    const x = centerX + Math.cos(planet.angle) * planet.radius;
    const y = centerY + Math.sin(planet.angle) * planet.radius;
    planet.element.style.left = x - planet.element.offsetWidth / 2 + "px";
    planet.element.style.top = y - planet.element.offsetHeight / 2 + "px";
    solarAngles[planet.index] = planet.angle;
  });

  solarAnimationId = requestAnimationFrame(solarAnimatePlanets);
}

function solarStartAnimation() {
  if (solarAnimationId) cancelAnimationFrame(solarAnimationId);
  solarAnimationId = requestAnimationFrame(solarAnimatePlanets);
}

function solarRepositionPlanets() {
  const container = document.getElementById("solarOrbitSystem");
  if (!container) return;

  solarUpdateOrbitRadii();

  solarPlanets.forEach((planet, idx) => {
    planet.radius = solarCurrentOrbitRadii[idx];

    const orbitRing = container.querySelectorAll(".solar-orbit")[idx];
    if (orbitRing) {
      const diameter = planet.radius * 2;
      orbitRing.style.width = diameter + "px";
      orbitRing.style.height = diameter + "px";
    }
  });

  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  solarPlanets.forEach((planet) => {
    const x = centerX + Math.cos(planet.angle) * planet.radius;
    const y = centerY + Math.sin(planet.angle) * planet.radius;
    planet.element.style.left = x - planet.element.offsetWidth / 2 + "px";
    planet.element.style.top = y - planet.element.offsetHeight / 2 + "px";
  });
}

// ARTICLES DATA
const solarArticles = [
  {
    id: 1,
    titleKey: "article.1.title",
    excerptKey: "article.1.excerpt",
    contentKey: "article.1.content",
    category: "achievement",
    date: "2025-06-12",
    image: "https://picsum.photos/id/1018/600/400",
  },
  {
    id: 2,
    titleKey: "article.2.title",
    excerptKey: "article.2.excerpt",
    contentKey: "article.2.content",
    category: "news",
    date: "2025-07-03",
    image: "https://picsum.photos/id/1015/600/400",
  },
  {
    id: 3,
    titleKey: "article.3.title",
    excerptKey: "article.3.excerpt",
    contentKey: "article.3.content",
    category: "achievement",
    date: "2025-05-20",
    image: "https://picsum.photos/id/1025/600/400",
  },
  {
    id: 4,
    titleKey: "article.4.title",
    excerptKey: "article.4.excerpt",
    contentKey: "article.4.content",
    category: "event",
    date: "2025-06-01",
    image: "https://picsum.photos/id/1035/600/400",
  },
  {
    id: 5,
    titleKey: "article.5.title",
    excerptKey: "article.5.excerpt",
    contentKey: "article.5.content",
    category: "news",
    date: "2025-06-25",
    image: "https://picsum.photos/id/1043/600/400",
  },
  {
    id: 6,
    titleKey: "article.6.title",
    excerptKey: "article.6.excerpt",
    contentKey: "article.6.content",
    category: "achievement",
    date: "2025-07-10",
    image: "https://picsum.photos/id/1050/600/400",
  },
];

function t(key) {
    return i18nArticles[key] || key;
}

let solarCurrentFilter = "all";

function solarRenderNews() {
  const filtered =
    solarCurrentFilter === "all"
      ? solarArticles
      : solarArticles.filter((a) => a.category === solarCurrentFilter);
  const grid = document.getElementById("solarNewsGrid");
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem;">🌌 ${i18n.explore} 🌌</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (article) => `
        <div class="solar-news-card" data-solar-id="${article.id}">
            <div class="solar-card-img" style="background-image: url('${article.image}');">
                <span class="solar-card-badge"><i class="fas ${article.category === "achievement" ? "fa-trophy" : article.category === "news" ? "fa-bullhorn" : "fa-glass-cheers"}"></i> ${article.category.toUpperCase()}</span>
            </div>
            <div class="solar-card-content">
                <span class="solar-card-category">${
                  article.category === "achievement"
                    ? "🏆 " + i18n.achievement
                    : article.category === "news"
                      ? "📡 " + i18n.news
                      : "✨ " + i18n.event
                }</span>
                <h3 class="solar-card-title">${t(article.titleKey)}</h3>
                <p class="solar-card-excerpt">${t(article.excerptKey)}</p>
                <div class="solar-card-meta">
                    <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                    <span class="solar-read-more">${i18n.readMore} <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  document.querySelectorAll(".solar-news-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.solarId);
      const article = solarArticles.find((a) => a.id === id);
      if (article) solarOpenDetail(article);
    });
  });
}

function solarOpenDetail(article) {
  const modal = document.getElementById("solarDetailModal");
  const detailDiv = document.getElementById("solarDetailDynamicContent");
  if (!modal || !detailDiv) return;

  detailDiv.innerHTML = `
        <div class="solar-detail-header" style="background-image: url('${article.image}');"></div>
        <div class="solar-detail-content">
            <div style="color:#a78bfa; margin-bottom:0.5rem;">${article.category.toUpperCase()}</div>
            <h2 style="font-size:1.4rem; margin-bottom:0.5rem; font-weight:800;">${t(article.titleKey)}</h2>
            <div style="color:#94a3b8; margin-bottom:1rem;">${article.date}</div>
            <div>${t(article.contentKey)}</div>
            <div style="margin-top:2rem; padding:1rem; background:rgba(139,92,246,0.1); border-radius:1rem; text-align:center;">✨ Gravity Hotel — ${i18n.explore}</div>
        </div>
    `;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function solarCloseDetail() {
  const modal = document.getElementById("solarDetailModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function solarInitFilters() {
  document.querySelectorAll(".solar-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".solar-filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      solarCurrentFilter = btn.dataset.filter;
      solarRenderNews();
    });
  });
}

// Solar System Scroll Progress
function solarUpdateScrollProgress() {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("solarScrollProgress");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Khởi tạo toàn bộ Solar System
function solarInit() {
  solarCreateStars();

  setTimeout(() => {
    solarCreatePlanets();
  }, 100);

  const toggleBtn = document.getElementById("solarToggleOrbitBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      solarIsPlaying = !solarIsPlaying;
      toggleBtn.innerHTML = solarIsPlaying
        ? `<i class="fas fa-pause"></i> ${i18n.pause}`
        : `<i class="fas fa-play"></i> ${i18n.play}`;
    });
  }

  const centerElement = document.querySelector(".solar-gravity-center");
  if (centerElement) {
    centerElement.addEventListener("click", () => {
      alert("✨ Gravity Hotel — The gravitational center of excellence! ✨");
    });
  }

  document
    .getElementById("solarCloseModalBtn")
    ?.addEventListener("click", solarCloseDetail);
  document
    .getElementById("solarDetailModal")
    ?.addEventListener("click", (e) => {
      if (e.target === document.getElementById("solarDetailModal"))
        solarCloseDetail();
    });

  solarRenderNews();
  solarInitFilters();
}

// Resize handler cho solar system
let solarResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(solarResizeTimeout);
  solarResizeTimeout = setTimeout(() => {
    if (typeof solarRepositionPlanets === "function") {
      solarRepositionPlanets();
    }
  }, 150);
});

function solarToggleNavbarOnScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 50);
}

// Scroll handler
window.addEventListener("scroll", () => {
  solarUpdateScrollProgress();
  solarToggleNavbarOnScroll();
});

// Khởi chạy khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    solarInit();
    solarToggleNavbarOnScroll();
  });
} else {
  solarInit();
  solarToggleNavbarOnScroll();
}
