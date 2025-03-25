
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import WatchlistItem from '@/components/WatchlistItem';
import StockChart from '@/components/StockChart';
import { useStockStore } from '@/store/stockStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Search, PlusCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const { 
    stocks, 
    watchlist, 
    selectedStock, 
    fetchStocks, 
    fetchStock, 
    addToWatchlist, 
    removeFromWatchlist, 
    isLoading 
  } = useStockStore();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    fetchStocks();
    
    // If there are stocks and watchlist items, select the first watchlist stock
    if (stocks.length > 0 && watchlist.length > 0) {
      const firstWatchlistStock = stocks.find(stock => stock.symbol === watchlist[0]);
      if (firstWatchlistStock) {
        fetchStock(firstWatchlistStock.symbol);
      }
    }
  }, [fetchStocks, fetchStock, stocks.length, watchlist]);
  
  const handleSelectStock = (symbol: string) => {
    fetchStock(symbol);
  };
  
  const handleRemoveFromWatchlist = (symbol: string) => {
    removeFromWatchlist(symbol);
    toast({
      title: 'Removed from watchlist',
      description: `${symbol} has been removed from your watchlist.`,
    });
  };
  
  const handleAddToWatchlist = () => {
    if (!newStockSymbol) {
      toast({
        title: 'Symbol required',
        description: 'Please enter a stock symbol.',
        variant: 'destructive',
      });
      return;
    }
    
    const stockExists = stocks.some(stock => stock.symbol === newStockSymbol.toUpperCase());
    
    if (!stockExists) {
      toast({
        title: 'Stock not found',
        description: `Could not find stock with symbol ${newStockSymbol.toUpperCase()}.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (watchlist.includes(newStockSymbol.toUpperCase())) {
      toast({
        title: 'Already in watchlist',
        description: `${newStockSymbol.toUpperCase()} is already in your watchlist.`,
        variant: 'destructive',
      });
      return;
    }
    
    addToWatchlist(newStockSymbol.toUpperCase());
    setNewStockSymbol('');
    toast({
      title: 'Added to watchlist',
      description: `${newStockSymbol.toUpperCase()} has been added to your watchlist.`,
    });
  };
  
  // Filter watchlist stocks by search query
  const filteredWatchlistStocks = stocks.filter(stock => 
    watchlist.includes(stock.symbol) && 
    (stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
     stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 pb-12">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-medium mb-2">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your watchlist and track your favorite stocks.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/login">Log In</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/signup">Sign Up</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-medium">My Watchlist</h1>
              <p className="text-muted-foreground">
                Track and monitor your favorite stocks
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search watchlist..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Stock Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <Skeleton className="h-[300px] w-full mb-4" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  ) : selectedStock ? (
                    <StockChart stock={selectedStock} height={400} />
                  ) : (
                    <div className="h-[400px] w-full flex items-center justify-center">
                      <p className="text-muted-foreground">Select a stock from your watchlist to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Watchlist</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {watchlist.length} stocks
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add stock symbol..."
                      value={newStockSymbol}
                      onChange={(e) => setNewStockSymbol(e.target.value.toUpperCase())}
                      className="flex-grow"
                      maxLength={5}
                    />
                    <Button onClick={handleAddToWatchlist} className="shrink-0">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                          <div className="flex items-center">
                            <Skeleton className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <Skeleton className="h-4 w-16 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex items-end flex-col">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))
                    ) : filteredWatchlistStocks.length > 0 ? (
                      filteredWatchlistStocks.map(stock => (
                        <WatchlistItem
                          key={stock.symbol}
                          stock={stock}
                          onRemove={handleRemoveFromWatchlist}
                          onClick={handleSelectStock}
                        />
                      ))
                    ) : watchlist.length > 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">Your watchlist is empty</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add stocks to track their performance
                        </p>
                        <Button onClick={() => navigate('/dashboard')}>
                          Browse Stocks
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Watchlist;
