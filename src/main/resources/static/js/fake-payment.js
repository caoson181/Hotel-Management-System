const gatewayCards = Array.from(document.querySelectorAll(".gateway-card"));
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const paymentForm = document.getElementById("paymentForm");
const gatewayHint = document.getElementById("gatewayHint");
const codeLabel = document.getElementById("codeLabel");
const paymentCode = document.getElementById("paymentCode");
const backBtn = document.getElementById("backBtn");
const cancelBtn = document.getElementById("cancelBtn");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

let selectedMethod = "VNPAY";
const BOOKING_NOTIFICATION_STORAGE_KEY = "gravity.notifications";
const BOOKING_NOTIFICATION_LIMIT = 10;
const BOOKING_NOTIFICATION_AUTO_OPEN_KEY = "gravity.notifications.autoOpen";

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
    codeLabel.textContent = "Wallet ID";
    paymentCode.placeholder = "MOMO-998877";
    gatewayHint.textContent =
      "MoMo demo mode: enter any 6-digit OTP to simulate a successful wallet payment.";
  } else {
    codeLabel.textContent = "Bank / Wallet Code";
    paymentCode.placeholder = "VNPAY-998877";
    gatewayHint.textContent =
      "VNPay demo mode: enter any 6-digit OTP to simulate a successful transaction.";
  }
}

async function submitFakePayment() {
  const cart = readCart();
  if (!cart.length) {
    alert("Cart is empty.");
    window.location.href = "/rooms";
    return;
  }

  const payload = {
    payMode: "PAY_NOW",
    paymentMethod: selectedMethod,
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

  try {
    const response = await fetch("/api/customer-bookings/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Payment failed");
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
    alert(`${selectedMethod} payment success. Booking has been saved as paid.`);
    window.setTimeout(() => {
      window.location.href = "/homepage";
    }, 400);
  } catch (error) {
    console.error(error);
    alert(error.message || "Payment failed");
  } finally {
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.textContent = "Confirm Payment";
  }
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

  const otpValue = document.getElementById("otpCode").value.trim();
  if (!/^\d{6}$/.test(otpValue)) {
    alert("Enter a valid 6-digit OTP.");
    return;
  }

  await submitFakePayment();
});

renderSummary(readCart());
syncGatewayUI();
