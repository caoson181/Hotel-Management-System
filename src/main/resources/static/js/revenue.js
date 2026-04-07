let chart;

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
