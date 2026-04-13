/**
 * Solar news page script.
 * Keeps the animated orbit intro while turning cards into real article links.
 */

function solarCreateStars() {
  const container = document.getElementById("solarStarsContainer");
  if (!container) return;

  const starCount = Math.min(300, Math.floor(window.innerWidth / 3));
  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("div");
    star.classList.add("solar-star");
    const size = Math.random() * 2.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${Math.random() * 3 + 1}s`;
    container.appendChild(star);
  }
}

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
  solarCurrentOrbitRadii = solarBaseOrbitRadii.map((radius) => radius * scale);
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
  const planetIcons = ["fa-trophy", "fa-star", "fa-leaf", "fa-newspaper", "fa-users"];
  const planetColors = ["#fbbf24", "#60a5fa", "#34d399", "#f97316", "#ec489a"];

  solarCurrentOrbitRadii.forEach((radius, index) => {
    const orbit = document.createElement("div");
    orbit.className = "solar-orbit";
    orbit.style.width = `${radius * 2}px`;
    orbit.style.height = `${radius * 2}px`;
    container.appendChild(orbit);

    const planetDiv = document.createElement("div");
    planetDiv.className = "solar-planet";
    planetDiv.dataset.solarPlanetIdx = index;
    planetDiv.style.background = `radial-gradient(circle at 30% 30%, ${planetColors[index]}40, rgba(20,30,55,0.95))`;
    planetDiv.style.border = `1.5px solid ${planetColors[index]}80`;
    planetDiv.innerHTML = `
      <i class="fas ${planetIcons[index]}" style="color: ${planetColors[index]};"></i>
      <div class="solar-planet-value" style="color: ${planetColors[index]};">${planetValues[index]}</div>
      <div class="solar-planet-label">${planetNames[index]}</div>
    `;
    container.appendChild(planetDiv);

    solarPlanets.push({
      element: planetDiv,
      radius,
      angle: solarAngles[index],
      speed: solarBaseSpeed / (1 + index * 0.08),
      index,
    });
  });

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
    planet.element.style.left = `${x - planet.element.offsetWidth / 2}px`;
    planet.element.style.top = `${y - planet.element.offsetHeight / 2}px`;
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
  const orbitRings = container.querySelectorAll(".solar-orbit");

  solarPlanets.forEach((planet, index) => {
    planet.radius = solarCurrentOrbitRadii[index];
    if (orbitRings[index]) {
      orbitRings[index].style.width = `${planet.radius * 2}px`;
      orbitRings[index].style.height = `${planet.radius * 2}px`;
    }
  });

  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  solarPlanets.forEach((planet) => {
    const x = centerX + Math.cos(planet.angle) * planet.radius;
    const y = centerY + Math.sin(planet.angle) * planet.radius;
    planet.element.style.left = `${x - planet.element.offsetWidth / 2}px`;
    planet.element.style.top = `${y - planet.element.offsetHeight / 2}px`;
  });
}

function solarCategoryMeta(category) {
  if (category === "achievement") {
    return { icon: "fa-trophy", label: i18n.achievement, prefix: "🏆" };
  }
  if (category === "event") {
    return { icon: "fa-calendar-alt", label: i18n.event, prefix: "✨" };
  }
  return { icon: "fa-newspaper", label: i18n.news, prefix: "🛰" };
}

let solarCurrentFilter = "all";

function solarRenderNews() {
  const grid = document.getElementById("solarNewsGrid");
  if (!grid) return;

  const filtered =
    solarCurrentFilter === "all"
      ? solarArticles
      : solarArticles.filter((article) => article.category === solarCurrentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="solar-empty-state">${i18n.explore}</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((article) => {
      const meta = solarCategoryMeta(article.category);
      return `
        <a class="solar-news-card" href="/gravity-news/${article.slug}">
          <div class="solar-card-img" style="background-image: url('${article.coverImage}');">
            <span class="solar-card-badge"><i class="fas ${meta.icon}"></i> ${meta.label.toUpperCase()}</span>
          </div>
          <div class="solar-card-content">
            <span class="solar-card-category">${meta.prefix} ${meta.label}</span>
            <h3 class="solar-card-title">${article.title}</h3>
            <p class="solar-card-excerpt">${article.excerpt}</p>
            <div class="solar-card-meta">
              <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
              <span class="solar-read-more">${i18n.readMore} <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

function solarInitFilters() {
  document.querySelectorAll(".solar-filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".solar-filter-btn").forEach((item) => {
        item.classList.remove("active");
      });
      button.classList.add("active");
      solarCurrentFilter = button.dataset.filter;
      solarRenderNews();
    });
  });
}

function solarUpdateScrollProgress() {
  const progressBar = document.getElementById("solarScrollProgress");
  if (!progressBar) return;

  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${percent}%`;
}

function solarToggleNavbarOnScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 50);
}

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
      window.location.href = "/gravity-news";
    });
  }

  solarRenderNews();
  solarInitFilters();
}

let solarResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(solarResizeTimeout);
  solarResizeTimeout = setTimeout(() => {
    solarRepositionPlanets();
  }, 150);
});

window.addEventListener("scroll", () => {
  solarUpdateScrollProgress();
  solarToggleNavbarOnScroll();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    solarInit();
    solarToggleNavbarOnScroll();
  });
} else {
  solarInit();
  solarToggleNavbarOnScroll();
}
