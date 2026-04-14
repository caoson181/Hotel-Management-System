let chart;
let currentDateKey = getCurrentDateKey();

function getCurrentMonthValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function getCurrentDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(num) {
  return Math.round(Number(num || 0)).toLocaleString("vi-VN") + " d";
}

async function fetchData(month) {
  const res = await fetch(`/api/revenue?month=${month}`);
  if (!res.ok) {
    throw new Error("Failed to load revenue data");
  }
  return await res.json();
}

function renderTable(data) {
  const tbody = document.querySelector("#revenueTable tbody");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">Chua co du lieu doanh thu cho thang nay.</td>
      </tr>
    `;
    return;
  }

  data.forEach((d) => {
    tbody.innerHTML += `
      <tr>
        <td>${d.date}</td>
        <td>${d.totalGuests}</td>
        <td>${d.roomsBooked}</td>
        <td>${formatMoney(d.cashIn)}</td>
        <td>${formatMoney(d.refundOut)}</td>
        <td>${formatMoney(d.cancellationFee)}</td>
        <td>${formatMoney(d.netCash)}</td>
        <td>
          <button type="button" class="revenue-value-btn" data-kind="revenue" data-date="${d.date}">
            ${formatMoney(d.revenue)}
          </button>
        </td>
        <td>
          <button type="button" class="revenue-value-btn" data-kind="profit" data-date="${d.date}">
            ${formatMoney(d.profit)}
          </button>
        </td>
      </tr>
    `;
  });

  tbody.querySelectorAll(".revenue-value-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const item = data.find((row) => row.date === button.dataset.date);
      if (item) {
        openRevenueDetail(item, button.dataset.kind);
      }
    });
  });
}

function renderChart(data) {
  const ctx = document.getElementById("revenueChart").getContext("2d");
  const labels = data.map((d) => d.date.split("-")[2]);
  const values = data.map((d) => d.profit);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Profit",
          data: values,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    },
  });
}

function updateKPI(data) {
  let totalRevenue = 0;
  let totalProfit = 0;

  data.forEach((d) => {
    totalRevenue += Number(d.revenue || 0);
    totalProfit += Number(d.profit || 0);
  });

  document.getElementById("totalRevenue").innerText = formatMoney(totalRevenue);
  document.getElementById("totalProfit").innerText = formatMoney(totalProfit);
}

function openRevenueDetail(item, kind) {
  const modal = document.getElementById("revenueDetailModal");
  const title = document.getElementById("revenueDetailTitle");
  const body = document.getElementById("revenueDetailBody");

  if (!modal || !title || !body) {
    return;
  }

  const cashRows = `
    <div class="revenue-detail-row">
      <span>Cash In</span>
      <strong>${formatMoney(item.cashIn)}</strong>
    </div>
    <div class="revenue-detail-row">
      <span>Refund Out</span>
      <strong>${formatMoney(item.refundOut)}</strong>
    </div>
    <div class="revenue-detail-row">
      <span>Cancellation Fee</span>
      <strong>${formatMoney(item.cancellationFee)}</strong>
    </div>
    <div class="revenue-detail-row">
      <span>Net Cash</span>
      <strong>${formatMoney(item.netCash)}</strong>
    </div>
  `;

  if (kind === "revenue") {
    title.textContent = `Revenue Details - ${item.date}`;
    body.innerHTML = `
      ${cashRows}
      <div class="revenue-detail-row">
        <span>Booking Revenue</span>
        <strong>${formatMoney(item.bookingRevenue)}</strong>
      </div>
      <div class="revenue-detail-row">
        <span>Rental Revenue</span>
        <strong>${formatMoney(item.rentalRevenue)}</strong>
      </div>
      <div class="revenue-detail-row total-row">
        <span>Total Revenue</span>
        <strong>${formatMoney(item.revenue)}</strong>
      </div>
    `;
  } else {
    title.textContent = `Profit Details - ${item.date}`;
    body.innerHTML = `
      ${cashRows}
      <div class="revenue-detail-row">
        <span>Booking Revenue</span>
        <strong>${formatMoney(item.bookingRevenue)}</strong>
      </div>
      <div class="revenue-detail-row">
        <span>Rental Revenue</span>
        <strong>${formatMoney(item.rentalRevenue)}</strong>
      </div>
      <div class="revenue-detail-row">
        <span>Salary Cost</span>
        <strong>${formatMoney(item.salaryCost)}</strong>
      </div>
      <div class="revenue-detail-row">
        <span>Other Cost</span>
        <strong>${formatMoney(item.otherCost)}</strong>
      </div>
      <div class="revenue-detail-row total-row">
        <span>Total Revenue</span>
        <strong>${formatMoney(item.revenue)}</strong>
      </div>
      <div class="revenue-detail-row profit-row">
        <span>Profit</span>
        <strong>${formatMoney(item.profit)}</strong>
      </div>
    `;
  }

  modal.classList.remove("hidden");
}

function closeRevenueDetail() {
  document.getElementById("revenueDetailModal")?.classList.add("hidden");
}

async function updateUI() {
  const month = document.getElementById("monthFilter").value;

  try {
    const data = await fetchData(month);
    renderTable(data);
    renderChart(data);
    updateKPI(data);
  } catch (error) {
    console.error(error);
  }
}

function startAutoRefresh() {
  window.setInterval(() => {
    const latestDateKey = getCurrentDateKey();
    const selectedMonth = document.getElementById("monthFilter").value;
    const currentMonth = getCurrentMonthValue();

    if (latestDateKey !== currentDateKey) {
      currentDateKey = latestDateKey;
      updateUI();
      return;
    }

    if (selectedMonth === currentMonth) {
      updateUI();
    }
  }, 60000);
}

document.addEventListener("DOMContentLoaded", () => {
  const monthFilter = document.getElementById("monthFilter");
  if (monthFilter) {
    monthFilter.value = getCurrentMonthValue();
    monthFilter.addEventListener("change", updateUI);
  }

  document.getElementById("closeRevenueDetail")?.addEventListener("click", closeRevenueDetail);
  document.getElementById("revenueDetailModal")?.addEventListener("click", (event) => {
    if (event.target.id === "revenueDetailModal") {
      closeRevenueDetail();
    }
  });

  startAutoRefresh();
  updateUI();
});
