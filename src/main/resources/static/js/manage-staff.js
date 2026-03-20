// ===================== manage-staff.js =====================
function openCreateModal() {
  document.getElementById("createModal").style.display = "block";
}

function closeCreateModal() {
  document.getElementById("createModal").style.display = "none";
}

function openEditModal(btn) {
  document.getElementById("editId").value = btn.dataset.id;
  document.getElementById("editName").value = btn.dataset.name;
  document.getElementById("editUsername").value = btn.dataset.username;
  document.getElementById("editEmail").value = btn.dataset.email;
  document.getElementById("editPhone").value = btn.dataset.phone;
  document.getElementById("editGender").value = btn.dataset.gender;
  document.getElementById("editRole").value = btn.dataset.role;
  document.getElementById("editHireDate").value = btn.dataset.hire;
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
