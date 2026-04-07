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
  return num.toLocaleString("vi-VN") + " ₫";
}

async function fetchData(month) {
  const res = await fetch(`/api/revenue?month=${month}`);
  return await res.json();
}

function renderTable(data) {
  const tbody = document.querySelector("#revenueTable tbody");
  tbody.innerHTML = "";

  data.forEach((d) => {
    tbody.innerHTML += `
      <tr>
        <td>${d.date}</td>
        <td>${d.totalGuests}</td>
        <td>${d.roomsBooked}</td>
        <td>${formatMoney(d.revenue)}</td>
        <td>${formatMoney(d.profit)}</td>
      </tr>
    `;
  });
}

function renderChart(data) {
  const ctx = document.getElementById("revenueChart").getContext("2d");

  const labels = data.map((d) => d.date.split("-")[2]);
  const values = data.map((d) => d.profit);

  if (chart) chart.destroy();

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
    totalRevenue += d.revenue;
    totalProfit += d.profit;
  });

  document.getElementById("totalRevenue").innerText = formatMoney(totalRevenue);
  document.getElementById("totalProfit").innerText = formatMoney(totalProfit);
}

async function updateUI() {
  const month = document.getElementById("monthFilter").value;
  const data = await fetchData(month);

  renderTable(data);
  renderChart(data);
  updateKPI(data);
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  document.getElementById("monthFilter").addEventListener("change", updateUI);
});

function formatMoney(num) {
  return Number(num || 0).toLocaleString("vi-VN") + " đ";
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
        <td colspan="5">Chưa có dữ liệu doanh thu cho tháng này.</td>
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
        <td>${formatMoney(d.revenue)}</td>
        <td>${formatMoney(d.profit)}</td>
      </tr>
    `;
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

const monthFilter = document.getElementById("monthFilter");
if (monthFilter) {
  monthFilter.value = getCurrentMonthValue();
  startAutoRefresh();
}

function formatMoney(num) {
  return Math.round(Number(num || 0)).toLocaleString("vi-VN") + " đ";
}
