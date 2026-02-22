const body = document.body;
body.classList.add("dark");

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.onclick = () => {
        body.classList.toggle("dark");
        body.classList.toggle("light");
    };
}

let mode = "simulation";
let deviceConnected = false;

const modeToggle = document.getElementById("modeToggle");
if (modeToggle) {
    modeToggle.onclick = () => {
        if (mode === "simulation") {
            mode = "live";
            deviceConnected = false;
            modeToggle.innerText = "Switch to Simulation";
            document.getElementById("systemStatus").innerText = "Status: LIVE (OFFLINE)";
        } else {
            mode = "simulation";
            modeToggle.innerText = "Switch to Live";
            document.getElementById("systemStatus").innerText = "Status: SIMULATION";
        }
        resetCharts();
    };
}

let tegData = [];
let cemsData = [];
let labels = [];

const tegChartCtx = document.getElementById("tegChart");
const cemsChartCtx = document.getElementById("cemsChart");

let tegChart, cemsChart;

if (tegChartCtx) {
    tegChart = new Chart(tegChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'TEG Power (W)',
                data: tegData,
                borderWidth: 2,
                tension: 0.4
            }]
        }
    });

    cemsChart = new Chart(cemsChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'CO (ppm)',
                data: cemsData,
                borderWidth: 2,
                tension: 0.4
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

function generateSimulationData() {
    const hot = 200 + Math.sin(Date.now()/2000)*20;
    const cold = 50;
    const deltaT = hot - cold;
    const power = deltaT * 0.05;
    const co = 60 + Math.sin(Date.now()/1500)*10;
    return { power, co };
}

setInterval(() => {
    if (!tegChart) return;

    labels.push(new Date().toLocaleTimeString());
    if (labels.length > 20) labels.shift();

    if (mode === "simulation") {
        const data = generateSimulationData();
        tegData.push(data.power);
        cemsData.push(data.co);
    } else {
        if (deviceConnected) {
            tegData.push(Math.random()*10);
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
