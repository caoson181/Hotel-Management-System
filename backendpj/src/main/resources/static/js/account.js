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
  document.getElementById("passwordModal").classList.add("show");
}

function closePasswordModal(){
  document.getElementById("passwordModal").classList.remove("show");
}

function openProfileModal(){
  document.getElementById("profileModal").classList.add("show");
}

function closeProfileModal(){
  document.getElementById("profileModal").classList.remove("show");
}