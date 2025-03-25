
import { create } from 'zustand';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  data: { time: string; value: number }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  imageUrl: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
}

interface StockState {
  stocks: Stock[];
  watchlist: string[];
  selectedStock: Stock | null;
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchStocks: () => Promise<void>;
  fetchStock: (symbol: string) => Promise<void>;
  fetchNews: () => Promise<void>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

// Mock data for development
const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 184.25,
    change: 2.15,
    changePercent: 1.18,
    volume: 59482653,
    marketCap: 2894563214589,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 170 + Math.random() * 20,
    })),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 410.34,
    change: -1.52,
    changePercent: -0.37,
    volume: 23156984,
    marketCap: 3045691235478,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 400 + Math.random() * 20,
    })),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 147.60,
    change: 1.85,
    changePercent: 1.27,
    volume: 28945612,
    marketCap: 1853694521365,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 140 + Math.random() * 20,
    })),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.25,
    change: -0.89,
    changePercent: -0.5,
    volume: 42361589,
    marketCap: 1845632145698,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 170 + Math.random() * 15,
    })),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.10,
    change: 5.42,
    changePercent: 2.29,
    volume: 112568943,
    marketCap: 768945213654,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 220 + Math.random() * 40,
    })),
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 475.98,
    change: 3.67,
    changePercent: 0.78,
    volume: 18643259,
    marketCap: 1216549873265,
    data: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 450 + Math.random() * 50,
    })),
  },
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Apple unveils new iPhone with AI capabilities',
    summary: 'Apple announced its latest iPhone model with advanced AI features at their annual event.',
    url: '#',
    source: 'TechCrunch',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    relatedSymbols: ['AAPL'],
  },
  {
    id: '2',
    title: 'Microsoft reports record quarterly earnings',
    summary: 'Microsoft exceeded analyst expectations with strong cloud services growth and increased AI adoption.',
    url: '#',
    source: 'Bloomberg',
    imageUrl: 'https://images.unsplash.com/photo-1633419461338-3ee583157cde?q=80&w=300',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    relatedSymbols: ['MSFT'],
  },
  {
    id: '3',
    title: 'Tesla faces manufacturing delays for new Model 2',
    summary: 'Supply chain issues have delayed production of Tesla\'s most affordable electric vehicle.',
    url: '#',
    source: 'Reuters',
    imageUrl: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=300',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    sentiment: 'negative',
    relatedSymbols: ['TSLA'],
  },
  {
    id: '4',
    title: 'Google introduces new AI-powered search features',
    summary: 'Alphabet\'s Google is enhancing its search algorithms with more contextual understanding.',
    url: '#',
    source: 'The Verge',
    imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=300',
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    relatedSymbols: ['GOOGL'],
  },
  {
    id: '5',
    title: 'Meta invests $10 billion in metaverse development',
    summary: 'Facebook parent company continues massive investment in virtual reality and metaverse technologies.',
    url: '#',
    source: 'Wall Street Journal',
    imageUrl: 'https://images.unsplash.com/photo-1635786517077-33906a29123c?q=80&w=300',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    sentiment: 'neutral',
    relatedSymbols: ['META'],
  },
];

export const useStockStore = create<StockState>()((set, get) => ({
  stocks: [],
  watchlist: ['AAPL', 'MSFT', 'GOOGL'],
  selectedStock: null,
  news: [],
  isLoading: false,
  error: null,
  
  fetchStocks: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would fetch from a stock API
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({
        stocks: mockStocks,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stocks',
        isLoading: false,
      });
    }
  },
  
  fetchStock: async (symbol) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would fetch from a stock API
      await new Promise(resolve => setTimeout(resolve, 800));
      const stock = mockStocks.find(s => s.symbol === symbol);
      if (stock) {
        set({
          selectedStock: stock,
          isLoading: false,
        });
      } else {
        throw new Error(`Stock ${symbol} not found`);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stock',
        isLoading: false,
      });
    }
  },
  
  fetchNews: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would fetch from a news API
      await new Promise(resolve => setTimeout(resolve, 1200));
      set({
        news: mockNews,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        isLoading: false,
      });
    }
  },
  
  addToWatchlist: (symbol) => {
    const { watchlist } = get();
    if (!watchlist.includes(symbol)) {
      set({ watchlist: [...watchlist, symbol] });
    }
  },
  
  removeFromWatchlist: (symbol) => {
    const { watchlist } = get();
    set({ watchlist: watchlist.filter(s => s !== symbol) });
  },
}));
