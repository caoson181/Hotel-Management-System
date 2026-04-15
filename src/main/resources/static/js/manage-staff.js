// ===================== manage-staff.js =====================
function openCreateModal() {
  document.getElementById("createModal").style.display = "block";
}

function closeCreateModal() {
  document.getElementById("createModal").style.display = "none";
}

function normalizeRoleValue(role) {
  const normalized = String(role || "").trim().toLowerCase().replace(/^role_/, "");
  const roleMap = {
    admin: "Admin",
    manager: "Manager",
    receptionist: "Receptionist",
    housekeeper: "Housekeeper",
  };
  return roleMap[normalized] || "";
}

function openEditModal(btn) {
  document.getElementById("editId").value = btn.dataset.id;
  document.getElementById("editName").value = btn.dataset.name;
  document.getElementById("editUsername").value = btn.dataset.username;
  document.getElementById("editEmail").value = btn.dataset.email;
  document.getElementById("editPhone").value = btn.dataset.phone;
  document.getElementById("editGender").value = btn.dataset.gender;
  document.getElementById("editDob").value = btn.dataset.dob || "";

  const roleSelect = document.getElementById("editRole");
  const normalizedRole = normalizeRoleValue(btn.dataset.role);
  roleSelect.value = normalizedRole;

  // 👉 THÊM 2 DÒNG NÀY
  document.getElementById("editHireDate").value = btn.dataset.hiredate;
  document.getElementById("editSalary").value = btn.dataset.salary;

  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

window.onclick = function (e) {
  const createModal = document.getElementById("createModal");
  const editModal = document.getElementById("editModal");

  if (e.target === createModal) createModal.style.display = "none";
  if (e.target === editModal) editModal.style.display = "none";
};
