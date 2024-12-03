// Create arrays to store price history data for the chart
let priceHistory = {
    bitcoin: [],
    ethereum: [],
    litecoin: []
  };
  
  // Chart.js setup
  const ctx = document.getElementById('cryptoChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Time labels for the chart (e.g., timestamps)
      datasets: [
        {
          label: 'Bitcoin',
          data: [], // Bitcoin price history
          borderColor: '#FF5733',
          fill: false
        },
        {
          label: 'Ethereum',
          data: [], // Ethereum price history
          borderColor: '#4287f5',
          fill: false
        },
        {
          label: 'Litecoin',
          data: [], // Litecoin price history
          borderColor: '#f5b041',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          beginAtZero: false
        }
      }
    }
  });
  
  // Function to fetch cryptocurrency data from CoinGecko API
  async function fetchCryptoData(timeRange = 'day') {
    // Prepare the API request based on selected time range
    const timeRanges = {
      hour: '1',       // 1 hour ago
      day: '1',        // 1 day ago
      week: '7',       // 7 days ago
      month: '30',     // 30 days ago
      year: '365'      // 365 days ago
    };
  
    // URL to get the historical data for the last period
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${timeRanges[timeRange]}&interval=daily`;
  
    // Fetch data for Bitcoin (can repeat this for Ethereum and Litecoin)
    const response = await fetch(url);
    const data = await response.json();
    
    // Update chart with the fetched historical data
    updateChart(data);
    
    // Fetch the current prices for real-time update
    fetchRealTimePrices();
  }
  
  // Update the chart with new historical data
  function updateChart(data) {
    const { prices } = data;  // The price data for the selected time range
  
    // Prepare the data for the chart
    const labels = [];
    const bitcoinData = [];
    const ethereumData = [];
    const litecoinData = [];
  
    prices.forEach((entry) => {
      const [timestamp, price] = entry;
      labels.push(new Date(timestamp).toLocaleTimeString());  // Add time label
      bitcoinData.push({ x: timestamp, y: price });
      ethereumData.push({ x: timestamp, y: price });  // Simulate for Ethereum (replace with actual API)
      litecoinData.push({ x: timestamp, y: price });  // Simulate for Litecoin (replace with actual API)
    });
  
    // Update the chart with new data
    chart.data.labels = labels;
    chart.data.datasets[0].data = bitcoinData;
    chart.data.datasets[1].data = ethereumData;
    chart.data.datasets[2].data = litecoinData;
    chart.update();
  }
  
  // Function to fetch real-time prices for the dashboard
  function fetchRealTimePrices() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd')
      .then(response => response.json())
      .then(data => {
        // Update cryptocurrency prices
        document.getElementById('bitcoin-price').innerText = `$${data.bitcoin.usd.toLocaleString()}`;
        document.getElementById('ethereum-price').innerText = `$${data.ethereum.usd.toLocaleString()}`;
        document.getElementById('litecoin-price').innerText = `$${data.litecoin.usd.toLocaleString()}`;
      })
      .catch(error => {
        console.error("Error fetching real-time prices:", error);
      });
  
    // Fetch Market Overview Data
    fetch('https://api.coingecko.com/api/v3/global')
      .then(response => response.json())
      .then(data => {
        document.getElementById('market-cap').innerText = `Market Cap: $${data.data.total_market_cap.usd.toLocaleString()}`;
        document.getElementById('total-volume').innerText = `24h Trading Volume: $${data.data.total_24h_volume.usd.toLocaleString()}`;
      })
      .catch(error => {
        console.error("Error fetching market data:", error);
      });
  }
  
  // Event listener for time range selector
  document.getElementById('time-range').addEventListener('change', (event) => {
    const timeRange = event.target.value;
    fetchCryptoData(timeRange);
  });
  
  // Initial data fetch (1 Day historical data)
  fetchCryptoData('day');
  
  // Set up an interval to refresh real-time prices every 30 seconds
  setInterval(fetchRealTimePrices, 30000);
  