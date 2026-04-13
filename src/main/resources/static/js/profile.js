const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const profileEditForm = document.getElementById("profileEditForm");
const breadcrumb = document.getElementById("profileBreadcrumb");
const panels = Array.from(document.querySelectorAll(".profile-panel"));
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const themeButtons = Array.from(document.querySelectorAll("[data-theme-value]"));

const panelTitles = {
  overview: "Account",
  profile: "Account > Profile",
  wallet: "Account > Wallet & Transactions",
  bookings: "Account > Booking & Refunds",
  settings: "Account > General Settings",
  security: "Account > Security",
};

const HISTORY_ROOM_IMAGE_CATALOG = {
  standard: {
    single: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
    double: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    twin: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  superior: {
    single: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    double: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    twin: "https://www.royalgardenhotel.co.uk/_img/videos/deluxe-twin.png",
    triple: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  deluxe: {
    double: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    twin: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    family: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  executive: {
    double: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    twin: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  suite: {
    double: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    family: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
};

function applyHistoryRoomImages() {
  document.querySelectorAll(".history-detail-image img[data-rank][data-type]").forEach((img) => {
    const rank = String(img.dataset.rank || "").toLowerCase();
    const type = String(img.dataset.type || "").toLowerCase();
    const imageUrl = HISTORY_ROOM_IMAGE_CATALOG?.[rank]?.[type];

    if (imageUrl) {
      img.src = imageUrl;
      img.alt = `${rank} ${type}`;
    }
  });
}

function activatePanel(panelName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === panelName);
  });

  if (breadcrumb) {
    breadcrumb.textContent = panelTitles[panelName] || panelTitles.overview;
    breadcrumb.classList.toggle("is-link", panelName !== "overview");
  }

  if (panelName === "bookings") {
    applyHistoryRoomImages();
  }

  const url = new URL(window.location.href);
  url.searchParams.set("panel", panelName);
  window.history.replaceState({}, "", url.toString());
}

if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activatePanel(button.dataset.tabTarget || "overview");
    });
  });
}

if (breadcrumb) {
  breadcrumb.addEventListener("click", () => {
    if (breadcrumb.classList.contains("is-link")) {
      activatePanel("overview");
    }
  });
}

function resetEditMode() {
  document.querySelectorAll(".view-mode").forEach((el) => {
    el.style.display = "";
  });

  document.querySelectorAll(".edit-mode").forEach((el) => {
    el.hidden = true;
    el.style.display = "none";
  });

  if (profileEditForm) {
    profileEditForm.reset();
  }

  if (editBtn) {
    editBtn.style.display = "inline-flex";
  }

  if (saveBtn) {
    saveBtn.hidden = true;
    saveBtn.style.display = "none";
  }

  if (cancelEditBtn) {
    cancelEditBtn.hidden = true;
    cancelEditBtn.style.display = "none";
  }
}

if (editBtn && saveBtn && cancelEditBtn) {
  editBtn.addEventListener("click", () => {
    document.querySelectorAll(".view-mode").forEach((el) => {
      el.style.display = "none";
    });

    document.querySelectorAll(".edit-mode").forEach((el) => {
      el.hidden = false;
      el.style.display = "inline-block";
    });

    editBtn.style.display = "none";
    saveBtn.hidden = false;
    saveBtn.style.display = "inline-flex";
    cancelEditBtn.hidden = false;
    cancelEditBtn.style.display = "inline-flex";
  });

  cancelEditBtn.addEventListener("click", resetEditMode);
}

const modal = document.getElementById("changePasswordModal");
const openBtn = document.getElementById("ChangePasswordBtn");
const securityPasswordBtn = document.getElementById("securityPasswordBtn");
const closeBtn = document.getElementById("closeModal");

function openPasswordModal() {
  if (modal) {
    modal.style.display = "block";
  }
}

if (openBtn) {
  openBtn.addEventListener("click", openPasswordModal);
}

if (securityPasswordBtn) {
  securityPasswordBtn.addEventListener("click", openPasswordModal);
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

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
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
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

window.submitChangePassword = submitChangePassword;

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

if (newPassword && passwordHint) {
  newPassword.addEventListener("input", () => {
    const pw = newPassword.value;

    if (!pw) {
      passwordHint.innerText = "";
      return;
    }

    if (!validatePassword(pw)) {
      passwordHint.innerText = "Password must be at least 8 characters and include letters + numbers";
      passwordHint.className = "hint error";
    } else {
      passwordHint.innerText = "Strong password";
      passwordHint.className = "hint success";
    }
  });
}

if (confirmPassword && confirmHint) {
  confirmPassword.addEventListener("input", () => {
    if (!confirmPassword.value) {
      confirmHint.innerText = "";
      return;
    }

    if (confirmPassword.value !== newPassword.value) {
      confirmHint.innerText = "Passwords do not match";
      confirmHint.className = "hint error";
    } else {
      confirmHint.innerText = "Passwords match";
      confirmHint.className = "hint success";
    }
  });
}

document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const inputId = icon.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (!input) {
      return;
    }

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

if (avatarBtn && avatarModal) {
  avatarBtn.onclick = (e) => {
    e.stopPropagation();
    avatarModal.classList.toggle("active");
  };

  document.addEventListener("click", () => {
    avatarModal.classList.remove("active");
  });
}

const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const closeHistory = document.getElementById("closeHistory");
const upgradePlanBtn = document.getElementById("upgradePlanBtn");
const upgradePlanModal = document.getElementById("upgradePlanModal");
const closeUpgradePlan = document.getElementById("closeUpgradePlan");

if (historyBtn && historyModal) {
  historyBtn.addEventListener("click", () => {
    applyHistoryRoomImages();
    historyModal.style.display = "flex";
  });
}

if (closeHistory && historyModal) {
  closeHistory.addEventListener("click", () => {
    historyModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === historyModal) {
    historyModal.style.display = "none";
  }
  if (e.target === upgradePlanModal) {
    upgradePlanModal.style.display = "none";
  }
});

if (upgradePlanBtn && upgradePlanModal) {
  upgradePlanBtn.addEventListener("click", () => {
    upgradePlanModal.style.display = "flex";
    renderUpgradeProgress();
  });
}

if (closeUpgradePlan && upgradePlanModal) {
  closeUpgradePlan.addEventListener("click", () => {
    upgradePlanModal.style.display = "none";
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " VND";
}

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("profile-theme-dark", selectedTheme === "dark");
  localStorage.setItem("profileTheme", selectedTheme);

  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeValue === selectedTheme);
  });
}

function profileChangeLang(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  url.searchParams.set("panel", "settings");
  window.location.href = url.toString();
}

window.profileChangeLang = profileChangeLang;

if (themeButtons.length) {
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeValue);
    });
  });
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

applyHistoryRoomImages();
resetEditMode();
applyTheme(localStorage.getItem("profileTheme"));

const initialPanel = new URL(window.location.href).searchParams.get("panel") || "overview";
activatePanel(initialPanel);
