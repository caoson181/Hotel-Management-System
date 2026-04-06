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

function formatVND(number) {
  return Number(number || 0).toLocaleString("vi-VN") + " đ";
}

function readCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
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

    await response.json();
    localStorage.removeItem("cart");
    alert(`${selectedMethod} payment success. Booking has been saved as paid.`);
    window.location.href = "/homepage";
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
  window.location.href = "/room-detail" + window.location.search;
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
