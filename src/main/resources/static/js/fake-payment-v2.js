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

    await response.json();
    localStorage.removeItem("cart");
    showPaymentAlert(`${selectedMethod} payment success. Booking has been saved as paid.`, "success");
    window.location.href = "/homepage";
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
