function setupAccountFeatures() {
  document.addEventListener("click", function (e) {

    if (e.target.id === "profileBtn") {
      e.preventDefault();
      openProfileModal();
    }

    if (e.target.id === "changePasswordBtn") {
      e.preventDefault();
      openPasswordModal();
    }

    if (e.target.id === "closeModal") {
      closePasswordModal();
    }

    if (e.target.id === "closeProfileModal") {
      closeProfileModal();
    }

  });
}

function openPasswordModal(){
  const modal = document.getElementById("passwordModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closePasswordModal(){
  const modal = document.getElementById("passwordModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function openProfileModal(){
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closeProfileModal(){
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.classList.remove("show");
  }
}