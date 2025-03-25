
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In a real application, you would implement these functions
// to interact with actual stock market APIs
export const stockApi = {
  getStocks: async () => {
    // Placeholder for actual API call
    const response = await api.get('/stocks');
    return response.data;
  },
  
  getStock: async (symbol: string) => {
    // Placeholder for actual API call
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  },
  
  getStockHistory: async (symbol: string, timeframe: string) => {
    // Placeholder for actual API call
    const response = await api.get(`/stocks/${symbol}/history`, {
      params: { timeframe },
    });
    return response.data;
  },
};

export const newsApi = {
  getNews: async () => {
    // Placeholder for actual API call
    const response = await api.get('/news');
    return response.data;
  },
  
  getStockNews: async (symbol: string) => {
    // Placeholder for actual API call
    const response = await api.get(`/news/stock/${symbol}`);
    return response.data;
  },
};

// This function would be used to format numbers for display
export const formatCurrency = (value: number, precision = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
};

// Format large numbers with appropriate suffixes (K, M, B, T)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(2) + 'T';
  }
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B';
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M';
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K';
  }
  return value.toString();
};

// Format date strings for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format time elapsed since a given date
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }
  
  return formatDate(dateString);
};
