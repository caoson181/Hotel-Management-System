const gatewayCards = Array.from(document.querySelectorAll(".gateway-card"));
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const paymentForm = document.getElementById("paymentForm");
const paymentAlert = document.getElementById("paymentAlert");
const gatewayHint = document.getElementById("gatewayHint");
const codeLabel = document.getElementById("codeLabel");
const paymentCode = document.getElementById("paymentCode");
const accountName = document.getElementById("accountName");
const phoneNumber = document.getElementById("phoneNumber");
const backBtn = document.getElementById("backBtn");
const cancelBtn = document.getElementById("cancelBtn");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

let selectedMethod = "VNPAY";
const BOOKING_NOTIFICATION_STORAGE_KEY = "gravity.notifications";
const BOOKING_NOTIFICATION_LIMIT = 10;
const BOOKING_NOTIFICATION_AUTO_OPEN_KEY = "gravity.notifications.autoOpen";

function showPaymentAlert(message, type = "error") {
  paymentAlert.hidden = false;
  paymentAlert.textContent = message;
  paymentAlert.classList.toggle("is-success", type === "success");
}

function hidePaymentAlert() {
  paymentAlert.hidden = true;
  paymentAlert.textContent = "";
  paymentAlert.classList.remove("is-success");
}

function formatVND(number) {
  return Number(number || 0).toLocaleString("vi-VN") + " đ";
}

function persistBookingNotification(payload) {
  if (window.GravityNotifications?.addBookingSuccessNotification) {
    window.GravityNotifications.addBookingSuccessNotification(payload);
    return;
  }

  try {
    const existing = JSON.parse(
      localStorage.getItem(BOOKING_NOTIFICATION_STORAGE_KEY) || "[]"
    );
    const notifications = Array.isArray(existing) ? existing : [];
    const roomCount = Number(payload.roomCount || 0);

    notifications.unshift({
      id: `${Date.now()}`,
      title: "Booking created successfully",
      message: `Your booking for ${
        roomCount === 1 ? "1 room" : `${roomCount} room(s)`
      } from ${payload.checkIn} to ${payload.checkOut} was recorded successfully.`,
      codeLabel: `Code: ${String(payload.groupCode || "")
        .slice(0, 8)
        .toUpperCase()} | ${payload.status || "UNPAID"}`,
      amount: payload.totalAmount || 0,
      createdAt: payload.createdAt || new Date().toISOString(),
      read: false,
    });

    localStorage.setItem(
      BOOKING_NOTIFICATION_STORAGE_KEY,
      JSON.stringify(notifications.slice(0, BOOKING_NOTIFICATION_LIMIT))
    );
    sessionStorage.setItem(BOOKING_NOTIFICATION_AUTO_OPEN_KEY, "true");
  } catch (error) {
    console.error("Failed to persist booking notification", error);
  }
}

function readCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function buildRoomDetailUrl(rank, type) {
  return `/room-detail?rank=${encodeURIComponent(rank || "")}&type=${encodeURIComponent(type || "")}`;
}

function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  const explicitReturnUrl = params.get("returnUrl");
  if (explicitReturnUrl) {
    return explicitReturnUrl;
  }

  const cart = readCart();
  const lastItem = cart[cart.length - 1];
  if (lastItem?.detailUrl) {
    return lastItem.detailUrl;
  }

  if (lastItem?.roomRank && lastItem?.roomType) {
    return buildRoomDetailUrl(lastItem.roomRank, lastItem.roomType);
  }

  return "/rooms";
}

function parseTypeRank(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return {
    roomType: parts[0] || "",
    roomRank: parts.slice(1).join(" ") || "",
  };
}

function renderSummary(cart) {
  if (!cart.length) {
    window.location.href = "/rooms";
    return;
  }

  let total = 0;
  summaryItems.innerHTML = "";

  cart.forEach((item) => {
    total += Number(item.price || 0);

    const card = document.createElement("div");
    card.className = "summary-item";
    card.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.checkin} -> ${item.checkout}</p>
      <p>${item.guests} guest(s) · ${formatVND(item.price)}</p>
    `;
    summaryItems.appendChild(card);
  });

  summaryTotal.textContent = formatVND(total);
}

function syncGatewayUI() {
  gatewayCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.method === selectedMethod);
  });

  if (selectedMethod === "MOMO") {
    codeLabel.textContent = "MoMo Code";
    paymentCode.placeholder = "MOMO-998877";
    gatewayHint.textContent =
      "Enter your account holder, phone number, and MoMo code. The system will verify your user info and wallet before charging.";
  } else {
    codeLabel.textContent = "VNPay Code";
    paymentCode.placeholder = "VNPAY-998877";
    gatewayHint.textContent =
      "Enter your account holder, phone number, and VNPay code. The system will verify your user info and wallet before charging.";
  }
}

async function submitFakePayment() {
  const cart = readCart();
  if (!cart.length) {
    showPaymentAlert("Your booking list is empty.");
    window.location.href = "/rooms";
    return;
  }

  const payload = {
    payMode: "PAY_NOW",
    paymentMethod: selectedMethod,
    accountName: accountName.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    paymentCode: paymentCode.value.trim(),
    items: cart.map((item) => {
      const parsed = parseTypeRank(item.name);
      return {
        roomType: parsed.roomType,
        roomRank: parsed.roomRank,
        checkIn: item.checkin,
        checkOut: item.checkout,
        guests: item.guests,
        price: item.price,
      };
    }),
  };

  confirmPaymentBtn.disabled = true;
  confirmPaymentBtn.textContent = `Processing ${selectedMethod}...`;
  hidePaymentAlert();

  try {
    const response = await fetch("/api/customer-bookings/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(extractErrorMessage(errorText));
    }

    const result = await response.json();
    const checkInDates = cart.map((item) => item.checkin).filter(Boolean).sort();
    const checkOutDates = cart.map((item) => item.checkout).filter(Boolean).sort();

    persistBookingNotification({
      groupCode: result.groupCode,
      status: result.status,
      totalAmount: result.totalAmount,
      roomCount: cart.length,
      checkIn: checkInDates[0] || "",
      checkOut: checkOutDates[checkOutDates.length - 1] || "",
      createdAt: new Date().toISOString(),
    });

    localStorage.removeItem("cart");
    showPaymentAlert(`${selectedMethod} payment success. Booking has been saved as paid.`, "success");
    window.setTimeout(() => {
      window.location.href = "/homepage";
    }, 600);
  } catch (error) {
    console.error(error);
    showPaymentAlert(error.message || "Payment failed");
  } finally {
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.textContent = "Confirm Payment";
  }
}

function extractErrorMessage(rawText) {
  if (!rawText) {
    return "Payment failed";
  }

  try {
    const parsed = JSON.parse(rawText);
    if (parsed.message && parsed.message !== "No message available") {
      return parsed.message;
    }
  } catch (_) {
    // Ignore JSON parse errors and fall back to plain text handling.
  }

  return rawText
    .replace(/\{"timestamp".*?"message":"?/s, "")
    .replace(/","path".*/s, "")
    .replace(/\\r\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Payment failed";
}

gatewayCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedMethod = card.dataset.method || "VNPAY";
    syncGatewayUI();
  });
});

backBtn.addEventListener("click", () => {
  window.history.back();
});

cancelBtn.addEventListener("click", () => {
  window.location.href = getReturnUrl();
});

paymentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hidePaymentAlert();

  if (!accountName.value.trim()) {
    showPaymentAlert("Enter account holder.");
    return;
  }

  if (!phoneNumber.value.trim()) {
    showPaymentAlert("Enter phone number.");
    return;
  }

  if (!paymentCode.value.trim()) {
    showPaymentAlert(`Enter ${selectedMethod === "MOMO" ? "MoMo" : "VNPay"} code.`);
    return;
  }

  const otpValue = document.getElementById("otpCode").value.trim();
  if (!/^\d{6}$/.test(otpValue)) {
    showPaymentAlert("Enter a valid 6-digit OTP.");
    return;
  }

  await submitFakePayment();
});

renderSummary(readCart());
syncGatewayUI();
