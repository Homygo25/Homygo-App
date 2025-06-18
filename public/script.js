const range = document.getElementById('maxPrice');
const display = document.getElementById('maxPriceValue');

function formatPrice(value) {
  return `P${Number(value).toLocaleString()}`;
}

function updateDisplay() {
  display.textContent = formatPrice(range.value);
}

range.addEventListener('input', updateDisplay);

updateDisplay();
