
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { useStockStore } from '@/store/stockStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative';
type TimeFilter = 'today' | 'week' | 'month';

const News: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const { news, fetchNews, isLoading, stocks } = useStockStore();
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  // Filter news based on search query, sentiment, and time
  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedSymbols.some(symbol => symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
    
    // In a real app, this would filter by actual date
    const matchesTime = true;
    
    return matchesSearch && matchesSentiment && matchesTime;
  });
  
  // Calculate news sentiment summary
  const sentimentSummary = {
    positive: news.filter(item => item.sentiment === 'positive').length,
    neutral: news.filter(item => item.sentiment === 'neutral').length,
    negative: news.filter(item => item.sentiment === 'negative').length,
    total: news.length,
  };
  
  // Calculate percentages
  const positivePercent = (sentimentSummary.positive / sentimentSummary.total) * 100 || 0;
  const neutralPercent = (sentimentSummary.neutral / sentimentSummary.total) * 100 || 0;
  const negativePercent = (sentimentSummary.negative / sentimentSummary.total) * 100 || 0;
  
  // Overall market sentiment
  const marketSentiment = 
    positivePercent > negativePercent + 10 
      ? 'Bullish' 
      : negativePercent > positivePercent + 10 
        ? 'Bearish' 
        : 'Neutral';
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-medium">Market News</h1>
              <p className="text-muted-foreground">
                Latest updates and financial insights
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sentimentFilter} onValueChange={(value) => setSentimentFilter(value as SentimentFilter)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Market Sentiment Overview */}
          <div className="mb-8">
            <Card className="animate-slide-up">
              <Tabs defaultValue="sentiment" className="w-full">
                <CardHeader className="pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Market Sentiment Analysis</CardTitle>
                    <TabsList>
                      <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="sentiment" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                        <div className="text-center p-6 border rounded-xl">
                          <div className="text-2xl font-medium mb-2">{marketSentiment}</div>
                          <div className="text-sm text-muted-foreground mb-4">Overall Market Sentiment</div>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                            marketSentiment === 'Bullish' 
                              ? 'bg-success/10' 
                              : marketSentiment === 'Bearish' 
                                ? 'bg-destructive/10' 
                                : 'bg-info/10'
                          }`}>
                            {marketSentiment === 'Bullish' ? (
                              <TrendingUp className={`h-6 w-6 text-success`} />
                            ) : marketSentiment === 'Bearish' ? (
                              <TrendingDown className={`h-6 w-6 text-destructive`} />
                            ) : (
                              <BarChart className={`h-6 w-6 text-info`} />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Positive</span>
                              <span className="text-sm font-medium text-success">{sentimentSummary.positive} articles</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-success h-2.5 rounded-full" 
                                style={{ width: `${positivePercent}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Neutral</span>
                              <span className="text-sm font-medium text-info">{sentimentSummary.neutral} articles</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-info h-2.5 rounded-full" 
                                style={{ width: `${neutralPercent}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Negative</span>
                              <span className="text-sm font-medium text-destructive">{sentimentSummary.negative} articles</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-destructive h-2.5 rounded-full" 
                                style={{ width: `${negativePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trending" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stocks.slice(0, 4).map(stock => (
                        <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-baseline">
                              <h3 className="text-lg font-medium">{stock.symbol}</h3>
                              <span className="ml-2 text-xs text-muted-foreground">Mentions: {Math.floor(Math.random() * 15) + 1}</span>
                            </div>
                            <p className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stock.change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {stock.change >= 0 ? 'Positive' : 'Negative'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
          
          {/* News grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                No news articles match your search criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSentimentFilter('all');
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
