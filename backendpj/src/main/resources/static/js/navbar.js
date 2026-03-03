function loadNavbar() {
  let path = window.location.pathname;
  let prefix = "";

  // xác định đường dẫn tới components
  if (
    path.includes("/rooms/") ||
    path.includes("/staff/") ||
    path.includes("/users/") ||
    path.includes("/revenue/") ||
    path.includes("/reports/")
  ) {
    prefix = "../../";
  }

  fetch(prefix + "components/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

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

      // hiển thị tên user + avatar
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        const nameEl = document.querySelector(".account-name");
        const avatarEl = document.querySelector(".avatar");

        if (nameEl) nameEl.innerText = user.name;

        if (avatarEl) {
          avatarEl.innerText = user.name
            .split(" ")
            .map((n) => n[0])
            .join("");
        }
      }
    });
}