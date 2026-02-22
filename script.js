// THEME
const body = document.body;
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.onclick = () => {
    body.classList.toggle("dark");
    body.classList.toggle("light");
  };
}

// MODE
let mode = "simulation";
let deviceConnected = false;

const modeToggle = document.getElementById("modeToggle");
const systemStatus = document.getElementById("systemStatus");

if (modeToggle) {
  modeToggle.onclick = () => {
    if (mode === "simulation") {
      mode = "live";
      deviceConnected = false;
      modeToggle.innerText = "Switch to Simulation";
      systemStatus.innerText = "LIVE MODE (OFFLINE)";
    } else {
      mode = "simulation";
      modeToggle.innerText = "Switch to Live";
      systemStatus.innerText = "SIMULATION MODE";
    }
    resetCharts();
  };
}

// CHARTS
let labels = [];
let tegData = [];
let cemsData = [];

const tegCanvas = document.getElementById("tegChart");
const cemsCanvas = document.getElementById("cemsChart");

let tegChart, cemsChart;

if (tegCanvas) {
  tegChart = new Chart(tegCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Power (W)",
        data: tegData,
        tension: 0.4,
        borderWidth: 2
      }]
    }
  });

  cemsChart = new Chart(cemsCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "CO (ppm)",
        data: cemsData,
        tension: 0.4,
        borderWidth: 2
      }]
    }
  });
}

function resetCharts() {
  labels.length = 0;
  tegData.length = 0;
  cemsData.length = 0;
  if (tegChart) tegChart.update();
  if (cemsChart) cemsChart.update();
}

function simulationData() {
  const hot = 220 + Math.sin(Date.now()/2000)*20;
  const cold = 60;
  const deltaT = hot - cold;
  const voltage = deltaT * 0.05;
  const current = voltage / 5;
  const power = voltage * current;
  const co = 70 + Math.sin(Date.now()/1500)*10;
  return { power, co };
}

setInterval(() => {

  if (!tegChart) return;

  labels.push(new Date().toLocaleTimeString());
  if (labels.length > 20) labels.shift();

  if (mode === "simulation") {
    const data = simulationData();
    tegData.push(data.power);
    cemsData.push(data.co);
  } else {
    if (deviceConnected) {
      tegData.push(Math.random()*20);
      cemsData.push(Math.random()*100);
    } else {
      tegData.push(0);
      cemsData.push(0);
    }
  }

  if (tegData.length > 20) tegData.shift();
  if (cemsData.length > 20) cemsData.shift();

  tegChart.update();
  cemsChart.update();

}, 1000);

// PARAMETER PAGE
const tegDiv = document.getElementById("tegParams");
const cemsDiv = document.getElementById("cemsParams");

if (tegDiv && cemsDiv) {
  setInterval(() => {

    const hot = 220 + Math.sin(Date.now()/2000)*20;
    const cold = 60;
    const deltaT = hot - cold;
    const voltage = deltaT * 0.05;
    const current = voltage / 5;
    const power = voltage * current;

    const co = 70 + Math.sin(Date.now()/1500)*10;
    const nox = 180 + Math.sin(Date.now()/1700)*15;
    const so2 = 90 + Math.sin(Date.now()/2100)*8;

    tegDiv.innerHTML = `
      <div class="parameter-card"><h4>Hot Temp</h4><p>${hot.toFixed(1)} °C</p></div>
      <div class="parameter-card"><h4>Cold Temp</h4><p>${cold} °C</p></div>
      <div class="parameter-card"><h4>Delta T</h4><p>${deltaT.toFixed(1)} °C</p></div>
      <div class="parameter-card"><h4>Voltage</h4><p>${voltage.toFixed(2)} V</p></div>
      <div class="parameter-card"><h4>Current</h4><p>${current.toFixed(2)} A</p></div>
      <div class="parameter-card"><h4>Power</h4><p>${power.toFixed(2)} W</p></div>
    `;

    cemsDiv.innerHTML = `
      <div class="parameter-card"><h4>CO</h4><p>${co.toFixed(1)} ppm</p></div>
      <div class="parameter-card"><h4>NOx</h4><p>${nox.toFixed(1)} ppm</p></div>
      <div class="parameter-card"><h4>SO₂</h4><p>${so2.toFixed(1)} ppm</p></div>
    `;

  }, 1000);
}
