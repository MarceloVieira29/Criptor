// script.js
const coinSelect = document.getElementById('coinSelect');
const periodSelect = document.getElementById('periodSelect');
const loadBtn = document.getElementById('loadBtn');
const signalText = document.getElementById('signalText');
const infoText = document.getElementById('infoText');
const ctx = document.getElementById('priceChart').getContext('2d');
const themeSwitch = document.getElementById('themeSwitch');
let chart;

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

loadBtn.addEventListener('click', () => {
  const coinId = coinSelect.value;
  const days = periodSelect.value;
  fetch(`/api/coin/${coinId}?days=${days}`)
    .then(res => res.json())
    .then(data => {
      updateUI(data);
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao carregar dados');
    });
});

function updateUI(data) {
  signalText.textContent = `Sinal: ${data.signal}`;
  infoText.textContent = `Último preço: USD ${data.lastPrice.toFixed(2)} | RSI: ${data.indicators.rsi.toFixed(2)} | SMA (${data.indicators.smaPeriod}): ${data.indicators.sma.toFixed(2)}`;

  const labels = data.prices.map((_, idx) => idx + 1);
  const values = data.prices;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${data.coinId} Price (USD)`,
        data: values,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      scales: {
        x: { display: true, title: { display: true, text: 'Dias' } },
        y: { display: true, title: { display: true, text: 'Preço (USD)' } }
      }
    }
  });
}
