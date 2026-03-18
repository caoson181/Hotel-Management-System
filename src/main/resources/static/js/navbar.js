function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");

  // nếu navbar đã được Thymeleaf render thì không cần fetch
  if (!navbarContainer) return;

  // áp dụng quyền theo role
  if (typeof applyRolePermissions === "function") {
    applyRolePermissions();
  }

  // setup account events
  if (typeof setupAccountFeatures === "function") {
    setupAccountFeatures();
  }

  // hiển thị role
  const navbarRole = document.getElementById("navbarRole");
  if (navbarRole && typeof currentRole !== "undefined") {
    navbarRole.innerText = currentRole;
  }

  // hiển thị user + avatar
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    const nameEl = document.querySelector(".account-name");
    const avatarEl = document.querySelector(".avatar");

    if (nameEl) {
      nameEl.innerText = user.name;
    }

    if (avatarEl) {
      avatarEl.innerText = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
    }
  }
}

// chạy khi trang load
document.addEventListener("DOMContentLoaded", loadNavbar);
