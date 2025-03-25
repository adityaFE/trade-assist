
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaperTradingStore } from '@/store/paperTradingStore';
import PaperTradeForm from '@/components/paper-trading/PaperTradeForm';
import PaperPortfolioSummary from '@/components/paper-trading/PaperPortfolioSummary';
import TradeHistory from '@/components/paper-trading/TradeHistory';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaperTrading: React.FC = () => {
  const { toast } = useToast();
  const { resetPortfolio } = usePaperTradingStore();
  const [activeTab, setActiveTab] = useState('portfolio');

  const handleResetPortfolio = () => {
    if (window.confirm('Are you sure you want to reset your portfolio? This action cannot be undone.')) {
      resetPortfolio();
      toast({
        title: 'Portfolio Reset',
        description: 'Your paper trading portfolio has been reset to $100,000.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Paper Trading</h1>
            <p className="text-muted-foreground">Practice trading stocks with virtual money</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleResetPortfolio}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Portfolio
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="trade">Trade</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Portfolio</CardTitle>
                    <CardDescription>Current holdings and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaperPortfolioSummary />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="trade" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Place a Trade</CardTitle>
                    <CardDescription>Buy or sell stocks with virtual money</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaperTradeForm onSuccess={() => setActiveTab('portfolio')} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trade History</CardTitle>
                    <CardDescription>Record of your past trades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TradeHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About Paper Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Paper trading allows you to practice trading stocks without risking real money. 
                  It's a great way to test strategies and learn how the market works.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-4">
                  <li>Start with $100,000 of virtual money</li>
                  <li>Practice buying and selling stocks</li>
                  <li>Track your performance over time</li>
                  <li>Reset your portfolio anytime</li>
                  <li>No real money is involved</li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <h4 className="text-sm font-medium">Tips:</h4>
                <p className="text-xs text-muted-foreground">
                  Try to build a diversified portfolio and track your performance over time.
                  Use the watchlist feature to monitor potential investments before trading.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaperTrading;
