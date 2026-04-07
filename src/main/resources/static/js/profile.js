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
document.addEventListener("click", () => {
  avatarModal.classList.remove("active");
});
const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const closeHistory = document.getElementById("closeHistory");
const upgradePlanBtn = document.getElementById("upgradePlanBtn");
const upgradePlanModal = document.getElementById("upgradePlanModal");
const closeUpgradePlan = document.getElementById("closeUpgradePlan");

if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    historyModal.style.display = "flex";
  });
}

if (closeHistory) {
  closeHistory.addEventListener("click", () => {
    historyModal.style.display = "none";
  });
}

// click ngoài để đóng
window.addEventListener("click", (e) => {
  if (e.target === historyModal) {
    historyModal.style.display = "none";
  }
  if (e.target === upgradePlanModal) {
    upgradePlanModal.style.display = "none";
  }
});

if (upgradePlanBtn) {
  upgradePlanBtn.addEventListener("click", () => {
    upgradePlanModal.style.display = "flex";
    renderUpgradeProgress();
  });
}

if (closeUpgradePlan) {
  closeUpgradePlan.addEventListener("click", () => {
    upgradePlanModal.style.display = "none";
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function renderUpgradeProgress() {
  const summary = document.querySelector(".upgrade-plan-summary");
  const fill = document.getElementById("upgradeProgressFill");
  const currentEl = document.getElementById("upgradeProgressCurrent");
  const targetEl = document.getElementById("upgradeProgressTarget");
  const textEl = document.getElementById("upgradePlanText");

  if (!summary || !fill || !currentEl || !targetEl || !textEl) {
    return;
  }

  const totalSpent = Number(summary.dataset.totalSpent || 0);
  const memberLevel = String(summary.dataset.memberLevel || "Bronze").toLowerCase();

  let baseline = 0;
  let nextTarget = 50000000;
  let nextLabel = "Silver / VIP";

  if (memberLevel === "silver") {
    baseline = 50000000;
    nextTarget = 100000000;
    nextLabel = "Gold / VIP";
  } else if (memberLevel === "gold") {
    baseline = 100000000;
    nextTarget = 200000000;
    nextLabel = "Platinum / VVIP";
  } else if (memberLevel === "platinum") {
    fill.style.width = "100%";
    currentEl.textContent = formatMoney(totalSpent);
    targetEl.textContent = "Top tier reached";
    textEl.textContent = "You are already at the highest membership tier. Enjoy all premium privileges.";
    return;
  }

  const progress = Math.max(0, Math.min(100, ((totalSpent - baseline) / (nextTarget - baseline)) * 100));
  fill.style.width = `${progress}%`;
  currentEl.textContent = formatMoney(totalSpent);
  targetEl.textContent = formatMoney(nextTarget);
  textEl.textContent = `Spend ${formatMoney(Math.max(0, nextTarget - totalSpent))} more to upgrade to ${nextLabel}.`;
}
