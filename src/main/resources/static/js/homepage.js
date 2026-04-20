// Initialize Swiper for Hero Slider
const swiper = new Swiper(".swiper-container", {
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
});
// Smooth Scrolling for Navigation Links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // chỉ scroll nếu là anchor (#rooms, #contact...)
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetSection = document.querySelector(href);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

// Typing Effect Enhancement
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = "";
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Apply typing effect to hero titles
document.addEventListener("DOMContentLoaded", () => {
  const heroTitles = document.querySelectorAll(".hero-text h2");
  heroTitles.forEach((title, index) => {
    if (title.classList.contains("typing-effect")) {
      const text = title.textContent;
      setTimeout(() => {
        typeWriter(title, text);
      }, index * 2000); // Stagger the typing effects
    }
  });
  // ================== CODE BOOK SHELF ==================
  const shelf = document.getElementById("bookShelf");
  if (shelf) {
    const services = window.homepageMessages?.bookShelfServices || [
      {
        title: "Luxury Spa & Wellness",
        desc: "Relax with professional spa treatments and wellness services.",
        image: "/images/slide1.jpg",
        link: "/services#spa",
      },
      {
        title: "Swimming Pool",
        desc: "Enjoy a relaxing swim in our clean and modern pool.",
        image: "/images/slide2.jpg",
        link: "/services#pool",
      },
      {
        title: "Fitness Center",
        desc: "Stay active with our fully equipped gym facilities.",
        image: "/images/slide6.jpg",
        link: "/services#gym",
      },
      {
        title: "Fine Dining Restaurant",
        desc: "Enjoy delicious local and international dishes prepared by expert chefs.",
        image: "/images/slide4.jpg",
        link: "/services#restaurant",
      },
    ];

    shelf.innerHTML = "";

    services.forEach((service) => {
      const panel = document.createElement("div");
      panel.className = "panel";
      panel.style.backgroundImage = `url('${service.image}')`;

      panel.innerHTML = `
                <div class="content">
                    <div class="title">${service.title}</div>
                    ${service.desc ? `<div class="desc">${service.desc}</div>` : ""}
                </div>
            `;

      panel.onclick = () => {
        window.location.href = service.link;
      };

      shelf.appendChild(panel);
    });
  }
});

// Parallax Effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".parallax");

  parallaxElements.forEach((element) => {
    const rate = scrolled * -0.5;
    element.style.transform = `translateY(${rate}px)`;
  });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Floating Elements Animation Enhancement
function animateFloatingElements() {
  const floatingElements = document.querySelectorAll(".floating-circle");

  floatingElements.forEach((element, index) => {
    const delay = index * 0.5;
    element.style.animationDelay = `${delay}s`;

    // Add random movement
    element.addEventListener("animationiteration", () => {
      const randomX = Math.random() * 100 - 50;
      const randomY = Math.random() * 100 - 50;
      element.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
  });
}

animateFloatingElements();

// Dynamic Background Gradient
function updateBackgroundGradient() {
  if (document.body.classList.contains("customer-theme-dark")) {
    document.body.style.background = "";
    return;
  }

  const hour = new Date().getHours();
  let gradient;

  if (hour < 6) {
    gradient = "linear-gradient(135deg, #f0f4f8 0%, #e0e9f0 100%)"; // Đêm nhạt (xám xanh rất nhẹ)
  } else if (hour < 12) {
    gradient = "linear-gradient(135deg, #f8f1e9 0%, #f0e6d9 100%)"; // Sáng (be kem ấm nhẹ)
  } else if (hour < 18) {
    gradient = "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)"; // Chiều (xanh dương siêu nhạt)
  } else {
    gradient = "linear-gradient(135deg, #f5f0ff 0%, #ede6f5 100%)"; // Tối (tím lavender rất nhạt)
  }

  document.body.style.background = gradient;
}

updateBackgroundGradient();
setInterval(updateBackgroundGradient, 60000); // Update every minute
window.addEventListener("customer-theme-change", updateBackgroundGradient);

// Particle Effect (Simple)
function createParticles() {
  const particleContainer = document.createElement("div");
  particleContainer.className = "particles";
  document.body.appendChild(particleContainer);

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particleContainer.appendChild(particle);
  }
}

createParticles();

// Add CSS for particles
const particleStyles = `
.particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
}

.particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: particleFloat linear infinite;
}

@keyframes particleFloat {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Scroll-based Header Background Change
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
