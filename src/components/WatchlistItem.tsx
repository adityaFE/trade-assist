
import React from 'react';
import { Stock } from '@/store/stockStore';
import { formatCurrency } from '@/lib/api';
import { Star, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WatchlistItemProps {
  stock: Stock;
  onRemove: (symbol: string) => void;
  onClick: (symbol: string) => void;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ stock, onRemove, onClick }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(stock.symbol);
  };
  
  return (
    <div
      className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 border rounded-lg transition-all cursor-pointer group"
      onClick={() => onClick(stock.symbol)}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-primary">{stock.symbol.slice(0, 2)}</span>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
      </div>
      
      <div className="flex items-end flex-col">
        <p className="font-medium text-card-foreground">
          {formatCurrency(stock.price)}
        </p>
        <p className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
        </p>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from watchlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default WatchlistItem;
