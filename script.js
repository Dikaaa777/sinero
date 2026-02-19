// ===== Sidebar Dark/Light Mode Toggle =====
const modeToggle = document.getElementById('modeToggle');
if(modeToggle){
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
  });
}

// ===== Pop-up Info =====
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');

function showPopup(text){
  if(!popup || !overlay) return;
  popupText.textContent = text;
  popup.style.display = 'block';
  overlay.style.display = 'block';
}

function closePopup(){
  if(!popup || !overlay) return;
  popup.style.display = 'none';
  overlay.style.display = 'none';
}

// ===== Fake Parameter Data =====
function randomTEG(){
  return {
    Thot: (120 + Math.random()*30).toFixed(1),
    Tcold: (40 + Math.random()*20).toFixed(1),
    Tegangan: (2 + Math.random()*2).toFixed(2),
    Seebeck: (50 + Math.random()*10).toFixed(1)
  };
}

function randomCEMS(){
  return {
    CO: (10 + Math.random()*20).toFixed(1),
    NOx: (40 + Math.random()*40).toFixed(1),
    SO2: (5 + Math.random()*20).toFixed(1),
    O2: (18 + Math.random()*2).toFixed(1)
  };
}

// ===== Chart Setup =====
const tegCtx = document.getElementById('tegChart')?.getContext('2d');
const cemsCtx = document.getElementById('cemsChart')?.getContext('2d');

function createChart(ctx, label){
  if(!ctx) return null;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length:20}, (_,i)=>i+1),
      datasets: [{
        label: label,
        data: Array.from({length:20}, ()=>Math.random()*50+10),
        borderColor: 'rgba(0,200,255,0.7)',
        backgroundColor: 'rgba(0,200,255,0.2)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true }},
      scales: {
        x: { display: true },
        y: { display: true, suggestedMin: 0, suggestedMax: 100 }
      }
    }
  });
}

const tegChart = createChart(tegCtx, 'TEG Output');
const cemsChart = createChart(cemsCtx, 'CEMS Output');

// ===== Status Chart Elements =====
const tegStatus = document.getElementById('tegStatus');
const cemsStatus = document.getElementById('cemsStatus');

// ===== Update Fake Data & Chart Every 2s =====
setInterval(()=>{
  // Update Parameter Cards
  const tegParam = randomTEG();
  const cemsParam = randomCEMS();

  const tegCard = document.querySelector('.param-column:nth-child(1) .param-card');
  const cemsCard = document.querySelector('.param-column:nth-child(2) .param-card');

  if(tegCard){
    tegCard.innerHTML = `
      <p>Thot: ${tegParam.Thot} °C</p>
      <p>Tcold: ${tegParam.Tcold} °C</p>
      <p>Tegangan: ${tegParam.Tegangan} V</p>
      <p>Seebeck: ${tegParam.Seebeck} µV/K</p>
      <p>Status: <span style="color:#0f0;">ONLINE</span></p>
    `;
  }

  if(cemsCard){
    cemsCard.innerHTML = `
      <p>CO: ${cemsParam.CO} ppm</p>
      <p>NOx: ${cemsParam.NOx} ppm</p>
      <p>SO2: ${cemsParam.SO2} ppm</p>
      <p>O2: ${cemsParam.O2} %</p>
      <p>Status: <span style="color:#0f0;">ONLINE</span></p>
    `;
  }

  // Update Chart Data
  function updateChart(chart){
    if(!chart) return;
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(Math.random()*50 + 10);
    chart.update();
  }

  updateChart(tegChart);
  updateChart(cemsChart);

  // Update chart status ONLINE
  if(tegStatus) tegStatus.innerHTML = 'Status: <span style="color:#0f0;">ONLINE</span>';
  if(cemsStatus) cemsStatus.innerHTML = 'Status: <span style="color:#0f0;">ONLINE</span>';

}, 2000);