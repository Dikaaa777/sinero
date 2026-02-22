const modeBtn = document.getElementById("modeBtn");
const modeStatus = document.getElementById("modeStatus");
const connectionStatus = document.getElementById("connectionStatus");
const announcement = document.getElementById("announcement");

let isLive = false;
let deviceActive = false;
let connectionInterval;

/* ===== CREATE CHART ===== */

function createChart(ctx, label) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

const tegChart = createChart(document.getElementById("tegChart"), "TEG Watt");
const cemsChart = createChart(document.getElementById("cemsChart"), "CEMS ppm");

/* ===== RESET ===== */

function resetChart(chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

/* ===== ADD DATA ===== */

function addData(chart, label, value) {
  if (chart.data.labels.length > 25) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);
  chart.update();
}

/* ===== DATA ===== */

function simulationData() {
  return {
    teg: 40 + Math.random() * 20,
    cems: 80 + Math.random() * 30
  };
}

function liveData() {
  if (!deviceActive) {
    return { teg: 0, cems: 0 };
  }

  return {
    teg: 60 + Math.random() * 10,
    cems: 70 + Math.random() * 10
  };
}

/* ===== UPDATE LOOP ===== */

function updateCharts() {

  const time = new Date().toLocaleTimeString();
  let data;

  if (isLive) {
    data = liveData();
  } else {
    data = simulationData();
  }

  addData(tegChart, time, data.teg);
  addData(cemsChart, time, data.cems);
}

setInterval(updateCharts, 1000);

/* ===== MODE SWITCH ===== */

modeBtn.addEventListener("click", () => {

  isLive = !isLive;

  resetChart(tegChart);
  resetChart(cemsChart);

  if (connectionInterval) {
    clearInterval(connectionInterval);
  }

  if (isLive) {

    deviceActive = false;
    modeStatus.textContent = "Live";
    connectionStatus.textContent = "Offline";
    announcement.textContent = "Live Mode Active";
    modeBtn.textContent = "Switch to Simulation";

    connectionInterval = setInterval(() => {
      deviceActive = Math.random() > 0.5;
      connectionStatus.textContent = deviceActive ? "Online" : "Offline";
    }, 5000);

  } else {

    modeStatus.textContent = "Simulation";
    connectionStatus.textContent = "Offline";
    announcement.textContent = "Simulation Mode Active";
    modeBtn.textContent = "Switch to Live Mode";
  }
});
