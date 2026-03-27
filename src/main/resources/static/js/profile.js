const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");

editBtn.addEventListener("click", function () {
  document.querySelectorAll(".view-mode").forEach((el) => {
    el.style.display = "none";
  });

  document.querySelectorAll(".edit-mode").forEach((el) => {
    el.style.display = "inline-block";
  });

  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
});
const modal = document.getElementById("changePasswordModal");
const openBtn = document.getElementById("ChangePasswordBtn");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
function submitChangePassword() {
  const current = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (newPass !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  fetch("/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      currentPassword: current,
      newPassword: newPass,
    }),
  })
    .then((res) => {
      if (!res.ok)
        return res.text().then((text) => {
          throw new Error(text);
        });
      return res.text();
    })
    .then((msg) => {
      alert(msg);
      document.getElementById("changePasswordModal").style.display = "none";
    })
    .catch((err) => {
      alert(err.message);
    });
}

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const passwordHint = document.getElementById("passwordHint");
const confirmHint = document.getElementById("confirmHint");

function validatePassword(pw) {
  const hasLength = pw.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);

  return hasLength && hasLetter && hasNumber;
}

// validate password
newPassword.addEventListener("input", () => {
  const pw = newPassword.value;

  if (!pw) {
    passwordHint.innerText = "";
    return;
  }

  if (!validatePassword(pw)) {
    passwordHint.innerText =
      "Password must be at least 8 characters and include letters + numbers";
    passwordHint.className = "hint error";
  } else {
    passwordHint.innerText = "Strong password ✅";
    passwordHint.className = "hint success";
  }
});

// validate confirm
confirmPassword.addEventListener("input", () => {
  if (!confirmPassword.value) {
    confirmHint.innerText = "";
    return;
  }

  if (confirmPassword.value !== newPassword.value) {
    confirmHint.innerText = "Passwords do not match";
    confirmHint.className = "hint error";
  } else {
    confirmHint.innerText = "Passwords match ✅";
    confirmHint.className = "hint success";
  }
});

document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const inputId = icon.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

const avatarBtn = document.getElementById("openAvatarModal");
const avatarModal = document.getElementById("avatarModal");

avatarBtn.onclick = (e) => {
  e.stopPropagation();
  avatarModal.classList.toggle("active");
};

document.addEventListener("click", () => {
  avatarModal.classList.remove("active");
});
