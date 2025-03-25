
// Dummy data for paper trading
interface StockData {
  symbol: string;
  name: string;
  price: number;
}

const dummyStocks: StockData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 417.88 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.98 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 474.31 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 172.63 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 950.02 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 196.46 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.51 },
  { symbol: 'V', name: 'Visa Inc.', price: 276.96 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 162.52 },
  { symbol: 'DIS', name: 'The Walt Disney Company', price: 94.28 },
  { symbol: 'HD', name: 'Home Depot Inc.', price: 375.09 },
  { symbol: 'BAC', name: 'Bank of America Corp.', price: 39.14 },
  { symbol: 'KO', name: 'The Coca-Cola Company', price: 62.64 },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 26.63 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 656.75 },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 499.52 },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 66.58 },
  { symbol: 'INTC', name: 'Intel Corporation', price: 34.20 },
];

// Add some random variation to the stock prices to simulate price movements
const getRandomPriceVariation = (price: number) => {
  const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
  return price * (1 + variation);
};

export const getDummyStockData = async (symbol: string): Promise<StockData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stock = dummyStocks.find(s => s.symbol === symbol);
  
  if (!stock) return null;
  
  // Return a copy with a slightly varied price to simulate market movement
  return {
    ...stock,
    price: getRandomPriceVariation(stock.price)
  };
};

export const getDummyStocks = async (): Promise<StockData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return copies with varied prices
  return dummyStocks.map(stock => ({
    ...stock,
    price: getRandomPriceVariation(stock.price)
  }));
};
