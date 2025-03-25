
import React from 'react';
import { Stock } from '@/store/stockStore';
import { formatCurrency, formatLargeNumber } from '@/lib/api';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface StockCardProps {
  stock: Stock;
  inWatchlist: boolean;
  isSelected?: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onClick: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  inWatchlist,
  isSelected = false,
  onToggleWatchlist,
  onClick,
}) => {
  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(stock.symbol);
  };

  // Determine chart color based on stock performance
  const chartColor = stock.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
  
  // Last few data points for the mini chart
  const chartData = stock.data.slice(-10);
  
  return (
    <div
      className={`stock-card overflow-hidden rounded-lg border hover:shadow-card-hover cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 bg-card shadow-card-hover' : 'bg-card'
      }`}
      onClick={() => onClick(stock.symbol)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center">
              <h3 className="text-xl font-medium">{stock.symbol}</h3>
              <Button
                variant="ghost"
                size="icon"
                className={`ml-1 ${inWatchlist ? 'text-warning' : 'text-muted-foreground'}`}
                onClick={handleToggleWatchlist}
              >
                <Star className="h-4 w-4" fill={inWatchlist ? 'currentColor' : 'none'} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{stock.name}</p>
          </div>
          
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#gradient-${stock.symbol})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-2xl font-medium">{formatCurrency(stock.price)}</p>
          <div className={`flex items-center mt-1 ${
            stock.change >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {stock.change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-medium">{formatLargeNumber(stock.volume)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatLargeNumber(stock.marketCap)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
