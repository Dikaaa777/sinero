const modeBtn = document.getElementById("modeBtn");
const modeStatus = document.getElementById("modeStatus");
const connectionStatus = document.getElementById("connectionStatus");
const announcement = document.getElementById("announcement");

let isLive = false;
let isOnline = false;
let interval;

/* ===== Chart Setup ===== */

function createChart(ctx, label) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderWidth: 2,
        tension: 0.4, // smooth curve
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

/* ===== Reset Chart ===== */

function resetChart(chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

/* ===== Fake Simulation ===== */

function fakeSimulation() {
  let tegBase = 40 + Math.random() * 20;
  let cemsBase = 80 + Math.random() * 30;

  return {
    teg: tegBase + (Math.random() - 0.5) * 10,
    cems: cemsBase + (Math.random() - 0.5) * 15
  };
}

/* ===== Live Mode (Simulated Online/Offline) ===== */

function liveData() {
  if (!isOnline) {
    return { teg: 0, cems: 0 };
  }

  return {
    teg: 60 + Math.random() * 10,
    cems: 70 + Math.random() * 10
  };
}

/* ===== Update Chart ===== */

function updateCharts() {

  const time = new Date().toLocaleTimeString();
  let data;

  if (isLive) {
    data = liveData();
  } else {
    data = fakeSimulation();
  }

  addData(tegChart, time, data.teg);
  addData(cemsChart, time, data.cems);
}

function addData(chart, label, value) {
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);
  chart.update();
}

/* ===== Mode Toggle ===== */

modeBtn.addEventListener("click", () => {
  isLive = !isLive;

  resetChart(tegChart);
  resetChart(cemsChart);

  if (isLive) {
    modeStatus.textContent = "Live";
    announcement.textContent = "Live Mode Active";
    modeBtn.textContent = "Switch to Simulation";
    simulateConnection();
  } else {
    modeStatus.textContent = "Simulation";
    connectionStatus.textContent = "Offline";
    announcement.textContent = "Simulation Mode Active";
    modeBtn.textContent = "Switch to Live Mode";
  }
});

/* ===== Simulate Online Status ===== */

function simulateConnection() {
  isOnline = Math.random() > 0.3; // 70% chance online

  connectionStatus.textContent = isOnline ? "Online" : "Offline";
}

/* ===== Start Loop ===== */

interval = setInterval(updateCharts, 1000);
