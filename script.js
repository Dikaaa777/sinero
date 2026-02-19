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

// ===== Chart Setup (Static) =====
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
        data: Array.from({length:20}, ()=>0), // chart kosong
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

// ===== Status Chart OFFLINE =====
const tegStatus = document.getElementById('tegStatus');
const cemsStatus = document.getElementById('cemsStatus');

if(tegStatus) tegStatus.innerHTML = 'Status: <span style="color:#f00;">OFFLINE</span>';
if(cemsStatus) cemsStatus.innerHTML = 'Status: <span style="color:#f00;">OFFLINE</span>';

// ===== Parameter Cards remain empty (no simulation) =====
const tegCard = document.querySelector('.param-column:nth-child(1) .param-card');
const cemsCard = document.querySelector('.param-column:nth-child(2) .param-card');

if(tegCard) tegCard.innerHTML = '<p>Data TEG belum tersedia</p>';
if(cemsCard) cemsCard.innerHTML = '<p>Data CEMS belum tersedia</p>';
