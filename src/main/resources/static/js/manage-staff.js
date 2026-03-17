function openCreateModal() {
  document.getElementById("createModal").style.display = "block";
}

function closeCreateModal() {
  document.getElementById("createModal").style.display = "none";
}
function openEditModal(button) {
  document.getElementById("editId").value = button.dataset.id;
  document.getElementById("editName").value = button.dataset.name;
  document.getElementById("editUsername").value = button.dataset.username;
  document.getElementById("editEmail").value = button.dataset.email;
  document.getElementById("editPhone").value = button.dataset.phone;
  document.getElementById("editGender").value = button.dataset.gender;
  document.getElementById("editRole").value = button.dataset.role;

  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
