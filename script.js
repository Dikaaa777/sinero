// ===== Sidebar Dark/Light Mode Toggle =====
const modeToggle = document.getElementById('modeToggle');
if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    modeToggle.textContent =
      document.body.classList.contains('light-mode')
        ? 'Dark Mode'
        : 'Light Mode';
  });
}

// ===== Pop-up Info =====
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');

function showPopup(text) {
  if (!popup || !overlay) return;
  popupText.textContent = text;
  popup.style.display = 'block';
  overlay.style.display = 'block';
}

function closePopup() {
  if (!popup || !overlay) return;
  popup.style.display = 'none';
  overlay.style.display = 'none';
}

// ===== Chart Setup =====
const tegCtx = document.getElementById('tegChart')?.getContext('2d');
const cemsCtx = document.getElementById('cemsChart')?.getContext('2d');

function createChart(ctx, label, color) {
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: { min: 0, max: 100 }
      }
    }
  });
}

const tegChart = createChart(tegCtx, 'TEG Output (W)', 'rgba(0,200,255,0.8)');
const cemsChart = createChart(cemsCtx, 'CEMS CO₂ (ppm)', 'rgba(255,100,100,0.8)');

// ===== Status ONLINE =====
const tegStatus = document.getElementById('tegStatus');
const cemsStatus = document.getElementById('cemsStatus');

if (tegStatus) tegStatus.innerHTML = 'Status: <span style="color:#0f0;">ONLINE</span>';
if (cemsStatus) cemsStatus.innerHTML = 'Status: <span style="color:#0f0;">ONLINE</span>';

// ===== Fake Simulation Logic =====
let time = 0;
let tegBase = 50;
let cemsBase = 40;

function randomFluctuation(base, variance) {
  return base + (Math.random() - 0.5) * variance;
}

function updateChart(chart, value) {
  if (!chart) return;

  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

// ===== Parameter Page Simulation =====
const tegCard = document.querySelector('.param-column:nth-child(1) .param-card');
const cemsCard = document.querySelector('.param-column:nth-child(2) .param-card');

function updateParameterCards(tegValue, cemsValue) {
  if (tegCard) {
    tegCard.innerHTML = `
      <p><strong>Teg Power:</strong> ${tegValue.toFixed(2)} W</p>
      <p><strong>Temp Hot Side:</strong> ${(tegValue + 80).toFixed(1)} °C</p>
      <p><strong>Voltage:</strong> ${(tegValue / 10).toFixed(2)} V</p>
    `;
  }

  if (cemsCard) {
    cemsCard.innerHTML = `
      <p><strong>CO₂:</strong> ${cemsValue.toFixed(1)} ppm</p>
      <p><strong>NOx:</strong> ${(cemsValue / 3).toFixed(1)} ppm</p>
      <p><strong>SO₂:</strong> ${(cemsValue / 4).toFixed(1)} ppm</p>
    `;
  }
}

// ===== Interval Simulation =====
setInterval(() => {
  time++;

  // TEG lebih stabil
  tegBase += (Math.random() - 0.5) * 2;
  let tegValue = randomFluctuation(tegBase, 10);

  // CEMS lebih fluktuatif
  cemsBase += (Math.random() - 0.5) * 5;
  let cemsValue = randomFluctuation(cemsBase, 20);

  updateChart(tegChart, tegValue);
  updateChart(cemsChart, cemsValue);
  updateParameterCards(tegValue, cemsValue);

}, 1000);
