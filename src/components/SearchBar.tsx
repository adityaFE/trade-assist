
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useStockStore } from '@/store/stockStore';

// Mock data for demonstration purposes
const stockSuggestions = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.' }
];

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(stockSuggestions);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchStock } = useStockStore();

  useOnClickOutside(searchRef, () => setIsOpen(false));

  useEffect(() => {
    if (query) {
      const filtered = stockSuggestions.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(stockSuggestions);
    }
  }, [query]);

  const handleSelectStock = (symbol: string) => {
    console.log(`Selected stock: ${symbol}`);
    // Close the dropdown
    setIsOpen(false);
    setQuery('');
    
    // Fetch the stock data
    fetchStock(symbol);
    
    // Navigate to watchlist if not already there
    if (location.pathname !== '/watchlist') {
      navigate(`/watchlist?symbol=${symbol}`);
    } else {
      // If already on watchlist, update the URL to reflect selected stock
      navigate(`/watchlist?symbol=${symbol}`, { replace: true });
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-64" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks..."
          className="w-full pl-10 h-9 pr-8"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) {
              setIsOpen(true);
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Command className="rounded-lg border shadow-md">
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading="Stocks">
                  {filteredResults.map((stock) => (
                    <CommandItem
                      key={stock.symbol}
                      onSelect={() => handleSelectStock(stock.symbol)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-sm text-muted-foreground">{stock.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
