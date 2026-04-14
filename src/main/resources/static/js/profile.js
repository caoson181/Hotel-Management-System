const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const profileEditForm = document.getElementById("profileEditForm");
const breadcrumb = document.getElementById("profileBreadcrumb");
const panels = Array.from(document.querySelectorAll(".profile-panel"));
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const themeButtons = Array.from(document.querySelectorAll("[data-theme-value]"));
const PROFILE_THEME_STORAGE_KEY = "customerTheme";
const membershipMeta = document.querySelector(".profile-membership-meta");
const rankCouponList = document.getElementById("rankCouponList");
const levelServicePolicyList = document.getElementById("levelServicePolicyList");
const rankPrivilegeTitle = document.getElementById("rankPrivilegeTitle");
const levelPrivilegeTitle = document.getElementById("levelPrivilegeTitle");
const membershipHeroTitle = document.getElementById("membershipHeroTitle");
const membershipHeroText = document.getElementById("membershipHeroText");
const membershipHeroBadge = document.getElementById("membershipHeroBadge");
const membershipProgressTitle = document.getElementById("membershipProgressTitle");
const membershipProgressCopy = document.getElementById("membershipProgressCopy");
const membershipProgressFill = document.getElementById("membershipProgressFill");
const membershipProgressCurrent = document.getElementById("membershipProgressCurrent");
const membershipProgressTarget = document.getElementById("membershipProgressTarget");
const membershipLevelValue = document.getElementById("membershipLevelValue");
const membershipRankValue = document.getElementById("membershipRankValue");
const membershipSpentValue = document.getElementById("membershipSpentValue");
const membershipCouponCount = document.getElementById("membershipCouponCount");
const membershipNextTitle = document.getElementById("membershipNextTitle");
const membershipNextCopy = document.getElementById("membershipNextCopy");
const membershipNextPills = document.getElementById("membershipNextPills");

const RANK_COUPON_CATALOG = {
  normal: [
    { value: "5%", name: "Welcome Saver", code: "NORMAL05", meta: "5% off room rate on weekday bookings." },
    { value: "10%", name: "Cafe Voucher", code: "CAFE10", meta: "10% off drinks and pastries at the hotel cafe." },
  ],
  vip: [
    { value: "10%", name: "Signature Stay", code: "VIP10", meta: "10% off premium room bookings and suite upgrades." },
    { value: "15%", name: "Spa Credit", code: "SPA15", meta: "15% off spa and wellness treatments during your stay." },
    { value: "20%", name: "Dining Select", code: "DINE20", meta: "20% off one in-house dining bill per booking." },
  ],
  vvip: [
    { value: "15%", name: "Elite Escape", code: "VVIP15", meta: "15% off direct bookings across all room categories." },
    { value: "25%", name: "Private Lounge", code: "LOUNGE25", meta: "25% off executive lounge and afternoon tea packages." },
    { value: "30%", name: "Celebration Gift", code: "GIFT30", meta: "30% off selected occasion setup and in-room gifts." },
  ],
};

const LEVEL_SERVICE_POLICY_CATALOG = {
  bronze: {
    title: "Bronze service policies",
    description: "Entry member benefits for a smoother booking and check-in experience.",
    benefits: ["Priority booking support", "Early promotion alerts", "Basic birthday offer"],
  },
  silver: {
    title: "Silver service policies",
    description: "More flexible services for returning guests with better convenience during the stay.",
    benefits: ["Late check-out priority", "Flexible room preference note", "Faster support response"],
  },
  gold: {
    title: "Gold service policies",
    description: "Premium service handling with more personalized support and stay flexibility.",
    benefits: ["Priority room assignment", "Complimentary welcome amenity", "Service recovery priority"],
  },
  platinum: {
    title: "Platinum service policies",
    description: "Top-tier service treatment with the highest priority across guest support touchpoints.",
    benefits: ["Highest support priority", "Preferred upgrade consideration", "Dedicated premium check-in handling"],
  },
};

const MEMBERSHIP_TIER_FLOW = {
  bronze: { baseline: 0, target: 50000000, nextLevel: "Silver", nextRank: "VIP" },
  silver: { baseline: 50000000, target: 100000000, nextLevel: "Gold", nextRank: "VIP" },
  gold: { baseline: 100000000, target: 200000000, nextLevel: "Platinum", nextRank: "VVIP" },
  platinum: { baseline: 200000000, target: 200000000, nextLevel: null, nextRank: null },
};

const panelTitles = {
  overview: "Account",
  profile: "Account > Profile",
  wallet: "Account > Wallet & Transactions",
  membership: "Account > Membership Center",
  coupons: "Account > My Coupons",
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

function renderMembershipPrivileges() {
  if (!membershipMeta || !rankCouponList || !levelServicePolicyList) {
    return;
  }

  const customerRank = String(membershipMeta.dataset.customerRank || "Normal").toLowerCase();
  const memberLevel = String(membershipMeta.dataset.memberLevel || "Bronze").toLowerCase();
  const totalSpent = Number(document.querySelector(".upgrade-plan-summary")?.dataset.totalSpent || 0);

  const coupons = RANK_COUPON_CATALOG[customerRank] || RANK_COUPON_CATALOG.normal;
  const servicePolicy = LEVEL_SERVICE_POLICY_CATALOG[memberLevel] || LEVEL_SERVICE_POLICY_CATALOG.bronze;
  const tierFlow = MEMBERSHIP_TIER_FLOW[memberLevel] || MEMBERSHIP_TIER_FLOW.bronze;

  if (rankPrivilegeTitle) {
    rankPrivilegeTitle.textContent = `${capitalize(customerRank)} rank coupons`;
  }

  if (levelPrivilegeTitle) {
    levelPrivilegeTitle.textContent = servicePolicy.title;
  }

  rankCouponList.innerHTML = coupons
    .map(
      (coupon) => `
        <article class="coupon-card">
          <div class="coupon-card__top">
            <div>
              <div class="coupon-card__value">${escapeHtml(coupon.value)}</div>
              <div class="coupon-card__name">${escapeHtml(coupon.name)}</div>
            </div>
            <span class="coupon-card__code">${escapeHtml(coupon.code)}</span>
          </div>
          <div class="coupon-card__meta">${escapeHtml(coupon.meta)}</div>
        </article>
      `,
    )
    .join("");

  levelServicePolicyList.innerHTML = `
    <article class="service-policy-card">
      <div class="service-policy-card__top">
        <div>
          <div class="service-policy-card__badge">${escapeHtml(capitalize(memberLevel))}</div>
          <div class="service-policy-card__name">${escapeHtml(servicePolicy.title)}</div>
        </div>
      </div>
      <div class="service-policy-card__desc">${escapeHtml(servicePolicy.description)}</div>
      <div class="service-policy-card__benefits">
        ${servicePolicy.benefits
          .map((benefit) => `<span class="service-policy-pill"><i class="fas fa-check"></i>${escapeHtml(benefit)}</span>`)
          .join("")}
      </div>
    </article>
  `;

  renderMembershipCenter({
    customerRank,
    memberLevel,
    totalSpent,
    coupons,
    servicePolicy,
    tierFlow,
  });
}

function renderMembershipCenter({ customerRank, memberLevel, totalSpent, coupons, servicePolicy, tierFlow }) {
  if (membershipHeroBadge) {
    membershipHeroBadge.textContent = `${capitalize(memberLevel)} / ${customerRank.toUpperCase()}`;
  }

  if (membershipHeroTitle) {
    membershipHeroTitle.textContent = `${capitalize(memberLevel)} member journey`;
  }

  if (membershipHeroText) {
    membershipHeroText.textContent = `You are currently in ${capitalize(memberLevel)} level with ${customerRank.toUpperCase()} rank perks unlocked for your account.`;
  }

  if (membershipLevelValue) {
    membershipLevelValue.textContent = capitalize(memberLevel);
  }

  if (membershipRankValue) {
    membershipRankValue.textContent = customerRank.toUpperCase();
  }

  if (membershipSpentValue) {
    membershipSpentValue.textContent = formatMoney(totalSpent);
  }

  if (membershipCouponCount) {
    membershipCouponCount.textContent = String(coupons.length);
  }

  if (membershipProgressTitle) {
    membershipProgressTitle.textContent = tierFlow.nextLevel
      ? `Progress to ${tierFlow.nextLevel} / ${tierFlow.nextRank}`
      : "Top tier reached";
  }

  const progress = tierFlow.target === tierFlow.baseline
    ? 100
    : Math.max(0, Math.min(100, ((totalSpent - tierFlow.baseline) / (tierFlow.target - tierFlow.baseline)) * 100));

  if (membershipProgressFill) {
    membershipProgressFill.style.width = `${progress}%`;
  }

  if (membershipProgressCurrent) {
    membershipProgressCurrent.textContent = formatMoney(totalSpent);
  }

  if (membershipProgressTarget) {
    membershipProgressTarget.textContent = tierFlow.nextLevel ? formatMoney(tierFlow.target) : "Top tier";
  }

  if (membershipProgressCopy) {
    membershipProgressCopy.textContent = tierFlow.nextLevel
      ? `Spend ${formatMoney(Math.max(0, tierFlow.target - totalSpent))} more to unlock ${tierFlow.nextLevel} level and ${tierFlow.nextRank} rank benefits.`
      : "You already unlocked the highest membership tier in this frontend preview.";
  }

  if (membershipNextTitle) {
    membershipNextTitle.textContent = tierFlow.nextLevel
      ? `Next milestone: ${tierFlow.nextLevel} / ${tierFlow.nextRank}`
      : "All milestone benefits unlocked";
  }

  if (membershipNextCopy) {
    membershipNextCopy.textContent = tierFlow.nextLevel
      ? `At the next milestone, your account can unlock stronger coupons and upgraded service handling policies.`
      : "No higher milestone remains. You are already at the top of the preview ladder.";
  }

  if (membershipNextPills) {
    const nextBenefits = tierFlow.nextLevel
      ? [
          `${tierFlow.nextRank} coupons`,
          `More flexible service policies`,
          `Higher booking priority`,
        ]
      : [...servicePolicy.benefits];

    membershipNextPills.innerHTML = nextBenefits
      .map((benefit) => `<span class="membership-next-pill"><i class="fas fa-star"></i>${escapeHtml(benefit)}</span>`)
      .join("");
  }
}

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
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
const cancelBookingModal = document.getElementById("cancelBookingModal");
const closeCancelBooking = document.getElementById("closeCancelBooking");
const cancelBookingDismiss = document.getElementById("cancelBookingDismiss");
const confirmCancelBooking = document.getElementById("confirmCancelBooking");
const cancelPolicyConfirm = document.getElementById("cancelPolicyConfirm");

let selectedBookingForCancellation = null;

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
  if (e.target === cancelBookingModal) {
    closeCancellationModal();
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

function closeCancellationModal() {
  if (!cancelBookingModal) {
    return;
  }

  cancelBookingModal.style.display = "none";
  selectedBookingForCancellation = null;
  if (cancelPolicyConfirm) {
    cancelPolicyConfirm.checked = false;
  }
}

function openCancellationModal(button) {
  if (!cancelBookingModal || !button) {
    return;
  }

  selectedBookingForCancellation = {
    targetType: String(button.dataset.targetType || "booking").toLowerCase(),
    targetId: button.dataset.targetId,
    totalAmount: Number(button.dataset.totalAmount || 0),
    paymentMode: String(button.dataset.paymentMode || "PAY_LATER").toUpperCase(),
    refundAmount: Number(button.dataset.refundAmount || 0),
    cancellationFee: Number(button.dataset.cancellationFee || 0),
  };

  const isPrepaid = selectedBookingForCancellation.paymentMode === "PAY_NOW";
  const isDetailCancellation = selectedBookingForCancellation.targetType === "detail";
  const modalTitle = document.getElementById("cancelBookingTitle");
  const amountLabel = document.getElementById("cancelBookingAmountLabel");

  if (modalTitle) {
    modalTitle.textContent = isDetailCancellation ? "Room Cancellation Policy" : "Booking Cancellation Policy";
  }
  if (amountLabel) {
    amountLabel.textContent = isDetailCancellation ? "Room total" : "Booking total";
  }
  document.getElementById("cancelBookingTotal").textContent = formatMoney(selectedBookingForCancellation.totalAmount);
  document.getElementById("cancelBookingRefund").textContent = formatMoney(selectedBookingForCancellation.refundAmount);
  document.getElementById("cancelBookingFee").textContent = formatMoney(selectedBookingForCancellation.cancellationFee);
  document.getElementById("cancelBookingNote").textContent = isPrepaid
    ? `Refund only applies to prepaid ${isDetailCancellation ? "rooms" : "bookings"}. The amount above will be credited back to your wallet.`
    : `This ${isDetailCancellation ? "room" : "booking"} is pay-later, so no refund will be credited. Cancellation fee is still recorded based on policy.`;

  if (cancelPolicyConfirm) {
    cancelPolicyConfirm.checked = false;
  }

  cancelBookingModal.style.display = "flex";
}

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("profile-theme-dark", selectedTheme === "dark");
  document.body.classList.toggle("customer-theme-dark", selectedTheme === "dark");
  document.documentElement.setAttribute("data-customer-theme", selectedTheme);
  localStorage.setItem(PROFILE_THEME_STORAGE_KEY, selectedTheme);

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
      if (window.CustomerTheme?.set) {
        window.CustomerTheme.set(button.dataset.themeValue);
      } else {
        applyTheme(button.dataset.themeValue);
      }
    });
  });
}

window.addEventListener("customer-theme-change", (event) => {
  applyTheme(event.detail?.theme);
});

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

document.querySelectorAll(".booking-cancel-btn").forEach((button) => {
  button.addEventListener("click", () => openCancellationModal(button));
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".booking-cancel-btn");
  if (!button) {
    return;
  }
  openCancellationModal(button);
});

if (closeCancelBooking) {
  closeCancelBooking.addEventListener("click", closeCancellationModal);
}

if (cancelBookingDismiss) {
  cancelBookingDismiss.addEventListener("click", closeCancellationModal);
}

if (confirmCancelBooking) {
  confirmCancelBooking.addEventListener("click", async () => {
    if (!selectedBookingForCancellation?.targetId) {
      return;
    }
    if (!cancelPolicyConfirm?.checked) {
      alert("Please confirm the cancellation policy before continuing.");
      return;
    }

    confirmCancelBooking.disabled = true;

    try {
      const apiPath = selectedBookingForCancellation.targetType === "detail"
        ? `/api/customer-bookings/details/${selectedBookingForCancellation.targetId}/cancel`
        : selectedBookingForCancellation.targetType === "pending"
          ? `/api/customer-bookings/pending/${selectedBookingForCancellation.targetId}/cancel`
        : `/api/customer-bookings/${selectedBookingForCancellation.targetId}/cancel`;

      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmed: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Cancellation failed");
      }

      window.location.reload();
    } catch (error) {
      alert(error.message || "Cancellation failed");
    } finally {
      confirmCancelBooking.disabled = false;
    }
  });
}

applyHistoryRoomImages();
renderMembershipPrivileges();
resetEditMode();
applyTheme(window.CustomerTheme?.get?.() || localStorage.getItem(PROFILE_THEME_STORAGE_KEY));

const initialPanel = new URL(window.location.href).searchParams.get("panel") || "overview";
activatePanel(initialPanel);
