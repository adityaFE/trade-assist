
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StockChart from '@/components/StockChart';
import StockCard from '@/components/StockCard';
import { useStockStore } from '@/store/stockStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatLargeNumber } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Search,
  Activity,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const { stocks, fetchStocks, fetchStock, isLoading, watchlist, addToWatchlist, removeFromWatchlist } = useStockStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);
  
  const handleStockClick = (symbol: string) => {
    fetchStock(symbol);
    setSelectedStock(symbol);
    toast({
      title: `Selected ${symbol}`,
      description: 'Stock chart updated with selected stock data.',
    });
  };
  
  const handleToggleWatchlist = (symbol: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to manage your watchlist.',
        variant: 'destructive',
      });
      return;
    }
    
    if (watchlist.includes(symbol)) {
      removeFromWatchlist(symbol);
      toast({
        title: 'Removed from watchlist',
        description: `${symbol} has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist(symbol);
      toast({
        title: 'Added to watchlist',
        description: `${symbol} has been added to your watchlist.`,
      });
    }
  };
  
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Market summary data
  const marketSummary = {
    totalVolume: stocks.reduce((sum, stock) => sum + stock.volume, 0),
    avgChange: stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / (stocks.length || 1),
    activeStocks: stocks.length,
    topGainer: stocks.reduce((top, stock) => (stock.changePercent > (top?.changePercent || 0) ? stock : top), stocks[0]),
    topLoser: stocks.reduce((bottom, stock) => (stock.changePercent < (bottom?.changePercent || 0) ? stock : bottom), stocks[0]),
  };
  
  // Find the selected stock or default to the first one
  const displayedStock = selectedStock 
    ? stocks.find(s => s.symbol === selectedStock) 
    : stocks[0];
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-medium">Market Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time market data and insights
              </p>
            </div>
            
            <div className="w-full lg:w-auto">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search stocks..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => navigate('/watchlist')}>
                  My Watchlist
                </Button>
              </div>
            </div>
          </div>
          
          {/* Market Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="animate-slide-up">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <span className="text-2xl font-medium">{formatLargeNumber(marketSummary.totalVolume)}</span>
                    )}
                    <span className="text-xs text-muted-foreground">24h trading volume</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Change</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <span className={`text-2xl font-medium ${marketSummary.avgChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {marketSummary.avgChange >= 0 ? '+' : ''}{marketSummary.avgChange.toFixed(2)}%
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">24h price change</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Top Gainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-medium">{marketSummary.topGainer?.symbol}</span>
                          <span className="ml-2 text-success text-sm">
                            +{marketSummary.topGainer?.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">24h best performer</span>
                      </>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Top Loser</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-medium">{marketSummary.topLoser?.symbol}</span>
                          <span className="ml-2 text-destructive text-sm">
                            {marketSummary.topLoser?.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">24h worst performer</span>
                      </>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 animate-slide-up">
              <CardHeader>
                <CardTitle>
                  {displayedStock ? `${displayedStock.name} (${displayedStock.symbol})` : 'Market Overview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] w-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-[300px] w-full mb-4" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                ) : displayedStock ? (
                  <StockChart stock={displayedStock} height={400} />
                ) : (
                  <div className="h-[400px] w-full flex items-center justify-center">
                    <p className="text-muted-foreground">Select a stock to view chart</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Movers</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/watchlist')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))
                  ) : (
                    filteredStocks
                      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                      .slice(0, 5)
                      .map((stock) => (
                        <div
                          key={stock.symbol}
                          className={`flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                            selectedStock === stock.symbol ? 'bg-muted' : ''
                          }`}
                          onClick={() => handleStockClick(stock.symbol)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">{stock.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Stock Cards Grid */}
          <h2 className="text-2xl font-display font-medium mb-4">Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Skeleton className="h-6 w-20 mb-1" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-10 w-20" />
                      </div>
                      <Skeleton className="h-8 w-32 mb-1" />
                      <Skeleton className="h-4 w-24 mb-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredStocks.slice(0, 6).map((stock, i) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  inWatchlist={watchlist.includes(stock.symbol)}
                  onToggleWatchlist={handleToggleWatchlist}
                  onClick={handleStockClick}
                  isSelected={selectedStock === stock.symbol}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
