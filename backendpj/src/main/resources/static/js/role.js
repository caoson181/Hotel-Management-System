let currentRole = "Manager";

function applyRolePermissions() {
  const allFeatures = document.querySelectorAll(".menu-dropdown a");
  const allMenus = document.querySelectorAll(".menu-item");

  allFeatures.forEach((item) => {
    item.style.display = "none";
  });

  const rolePermissions = {
    Manager: [
      "viewRoomStatus",
      "checkEquipment",
      "checkInOut",
      "viewStaff",
      "manageStaff",
      "manageUsers",
      "viewRevenue",
      "viewReports",
    ],

    Receptionist: ["viewRoomStatus", "checkInOut"],

    Admin: [
      "viewRoomStatus",
      "viewStaff",
      "manageStaff",
      "manageUsers",
      "viewReports",
    ],

    Housekeeping: ["viewRoomStatus", "checkEquipment"],
  };

  rolePermissions[currentRole].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  });

  allMenus.forEach((menu) => {
    const visible = menu.querySelectorAll(
      ".menu-dropdown a[style='display: block;']"
    );

    menu.style.display = visible.length > 0 ? "inline-block" : "none";
  });

  const roleElements = document.querySelectorAll("#navbarRole, #profileRole");
  roleElements.forEach((el) => {
    el.textContent = currentRole;
  });
}