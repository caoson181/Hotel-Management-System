const sections = document.querySelectorAll(".service-card");
const navLinks = document.querySelectorAll(".nav-link");
const thumbButtons = document.querySelectorAll(".service-thumb");
const mainImage = document.getElementById("service-main-image");
const header = document.querySelector(".header");

function syncServiceHeaderState() {
  if (!header || !document.body.classList.contains("service-navbar-transparent")) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 50);
}

syncServiceHeaderState();
window.addEventListener("scroll", syncServiceHeaderState);

if (sections.length && navLinks.length) {
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.clientHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      navLinks.forEach((link) => link.classList.remove("active"));

      const lastLink = navLinks[navLinks.length - 1];
      if (lastLink) {
        lastLink.classList.add("active");
      }
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.25,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

if (mainImage && thumbButtons.length) {
  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextImage = button.dataset.image;
      if (!nextImage) {
        return;
      }

      mainImage.src = nextImage;
      thumbButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}
