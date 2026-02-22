let mode = "simulation";
let intervalRef = null;

const modeText = document.getElementById("modeText");
const deviceStatus = document.getElementById("deviceStatus");
const modeSwitchBtn = document.getElementById("modeSwitchBtn");

const tegStatus = document.getElementById("tegStatus");
const cemsStatus = document.getElementById("cemsStatus");

const tegCtx = document.getElementById("tegChart")?.getContext("2d");
const cemsCtx = document.getElementById("cemsChart")?.getContext("2d");

function createChart(ctx, label, color) {
  if (!ctx) return null;
  return new Chart(ctx, {
    type: "line",
    data: { labels: [], datasets: [{ label, data: [], borderColor: color, tension: 0.4 }] },
    options: { responsive: true, animation: false, scales: { y: { min: 0, max: 150 } } }
  });
}

const tegChart = createChart(tegCtx, "TEG Power (W)", "cyan");
const cemsChart = createChart(cemsCtx, "CEMS CO₂ (ppm)", "orange");

function pushData(chart, value) {
  if (!chart) return;
  chart.data.labels.push("");
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function updateParameter(teg, cems) {
  const tegCard = document.querySelector(".param-column:nth-child(1) .param-card");
  const cemsCard = document.querySelector(".param-column:nth-child(2) .param-card");

  if (tegCard) {
    tegCard.innerHTML = `
      <p>Power: ${teg.toFixed(2)} W</p>
      <p>Voltage: ${(teg/10).toFixed(2)} V</p>
      <p>Hot Temp: ${(teg+70).toFixed(1)} °C</p>
    `;
  }

  if (cemsCard) {
    cemsCard.innerHTML = `
      <p>CO₂: ${cems.toFixed(1)} ppm</p>
      <p>NOx: ${(cems/4).toFixed(1)} ppm</p>
      <p>SO₂: ${(cems/5).toFixed(1)} ppm</p>
    `;
  }
}

let tegBase = 60;
let cemsBase = 50;

function generateSim() {
  tegBase += (Math.random()-0.5)*3;
  cemsBase += (Math.random()-0.5)*8;
  return {
    teg: tegBase + (Math.random()-0.5)*15,
    cems: cemsBase + (Math.random()-0.5)*30
  };
}

function startSimulation() {
  clearInterval(intervalRef);
  mode = "simulation";
  modeText.textContent = "SIMULATION MODE";
  deviceStatus.textContent = "SIMULATED";
  deviceStatus.className = "status warning";
  if (tegStatus) tegStatus.innerHTML = "Status: <span style='color:yellow'>SIM</span>";
  if (cemsStatus) cemsStatus.innerHTML = "Status: <span style='color:yellow'>SIM</span>";

  intervalRef = setInterval(()=>{
    const d = generateSim();
    pushData(tegChart, d.teg);
    pushData(cemsChart, d.cems);
    updateParameter(d.teg, d.cems);
  },1000);
}

async function fetchLive() {
  try {
    const res = await fetch("http://192.168.4.1/data");
    return await res.json();
  } catch {
    return null;
  }
}

function startLive() {
  clearInterval(intervalRef);
  mode = "live";
  modeText.textContent = "LIVE MODE";
  deviceStatus.textContent = "CONNECTING...";
  deviceStatus.className = "status warning";

  intervalRef = setInterval(async ()=>{
    const d = await fetchLive();
    if (d) {
      deviceStatus.textContent = "ONLINE";
      deviceStatus.className = "status online";
      if (tegStatus) tegStatus.innerHTML = "Status: <span style='color:#0f0'>ONLINE</span>";
      if (cemsStatus) cemsStatus.innerHTML = "Status: <span style='color:#0f0'>ONLINE</span>";
      pushData(tegChart, d.teg);
      pushData(cemsChart, d.cems);
      updateParameter(d.teg, d.cems);
    } else {
      deviceStatus.textContent = "OFFLINE";
      deviceStatus.className = "status offline";
    }
  },1000);
}

if (modeSwitchBtn) {
  modeSwitchBtn.addEventListener("click", ()=>{
    mode === "simulation" ? startLive() : startSimulation();
  });
}

startSimulation();
