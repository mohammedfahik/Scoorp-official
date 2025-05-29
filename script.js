// Array of coin objects to fetch data for
const coins = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "binancecoin", name: "BNB" },
  { id: "dogecoin", name: "Dogecoin" }
];

// Sample forecast data (can be dynamically adjusted later)
const forecasts = [
  "+112% (next month)",
  "Possible dip -15%",
  "Volatile: range ±10%",
  "Stable growth +5%",
  "Surge expected +40%",
];

// Function to toggle between dark and light themes
function toggleTheme() {
  document.body.classList.toggle("light");
  // Save the user's theme preference in localStorage
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

// Function to load and display live prices
async function loadPrices() {
  const currency = document.getElementById("currency").value;
  const ids = coins.map(c => c.id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("market");
    container.innerHTML = ""; // Clear previous market cards

    coins.forEach((coin, index) => {
      const price = data[coin.id][currency];
      const change = data[coin.id][`${currency}_24h_change`].toFixed(2);
      const forecast = forecasts[index % forecasts.length];

      const card = document.createElement("div");
      card.className = "coin";
      card.innerHTML = `
        <h3>${coin.name}</h3>
        <p>${currency.toUpperCase()}: ${price.toLocaleString()}</p>
        <p class="change">24h Change: ${change}%</p>
        <p class="forecast">Forecast: ${forecast}</p>
      `;

      // Add smooth transition effect when coin cards appear
      card.classList.add('coin-animation');
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching prices:", error);
    const container = document.getElementById("market");
    container.innerHTML = "<p>Failed to load live data. Please try again later.</p>";
  }
}

// Event listener for currency change to reload prices
document.getElementById("currency").addEventListener("change", loadPrices);

// Initialize the page with live data and theme based on previous preference
window.onload = () => {
  // Check if theme preference exists in localStorage and apply it
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
  }

  loadPrices(); // Load live prices on page load
  setInterval(loadPrices, 30000); // Auto-refresh prices every 30 seconds
};
