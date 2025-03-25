
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePaperTradingStore } from '@/store/paperTradingStore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getDummyStockData } from '@/lib/dummyData';

const formSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(5),
  quantity: z.coerce.number().int().positive('Quantity must be a positive integer'),
  type: z.enum(['buy', 'sell']),
});

type FormValues = z.infer<typeof formSchema>;

interface PaperTradeFormProps {
  onSuccess?: () => void;
}

const PaperTradeForm: React.FC<PaperTradeFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { balance, executeTrade, positions } = usePaperTradingStore();
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [stockName, setStockName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
      quantity: 1,
      type: 'buy',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!stockPrice || !stockName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please search for a valid stock symbol first.',
      });
      return;
    }

    setIsLoading(true);
    
    const trade = {
      symbol: values.symbol.toUpperCase(),
      companyName: stockName,
      quantity: values.quantity,
      price: stockPrice,
      type: values.type,
    };

    const success = executeTrade(trade);

    if (success) {
      toast({
        title: 'Trade Executed',
        description: `Successfully ${values.type === 'buy' ? 'bought' : 'sold'} ${values.quantity} shares of ${values.symbol.toUpperCase()}.`,
      });
      form.reset();
      setStockPrice(null);
      setStockName(null);
      if (onSuccess) onSuccess();
    } else {
      toast({
        variant: 'destructive',
        title: 'Trade Failed',
        description: values.type === 'buy' 
          ? 'Insufficient funds for this purchase.' 
          : 'You don\'t have enough shares to sell.',
      });
    }
    
    setIsLoading(false);
  };

  const handleSearchStock = async () => {
    const symbol = form.getValues('symbol').toUpperCase();
    if (!symbol) return;

    setIsLoading(true);
    
    try {
      // In a real app, you would call an API here
      const stockData = await getDummyStockData(symbol);
      
      if (stockData) {
        setStockPrice(stockData.price);
        setStockName(stockData.name);
        form.setValue('symbol', symbol);
      } else {
        setStockPrice(null);
        setStockName(null);
        toast({
          variant: 'destructive',
          title: 'Stock Not Found',
          description: `Could not find data for symbol ${symbol}.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch stock data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find any existing position for the current symbol
  const selectedSymbol = form.watch('symbol').toUpperCase();
  const currentPosition = positions.find(p => p.symbol === selectedSymbol);
  const currentShares = currentPosition?.quantity || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">Available Cash</div>
          <div className="font-semibold">${balance.toFixed(2)}</div>
        </div>

        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stock Symbol</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. AAPL" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      setStockPrice(null);
                      setStockName(null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSearchStock}
              disabled={isLoading || !form.getValues('symbol')}
            >
              Search
            </Button>
          </div>
        </div>

        {stockPrice && stockName && (
          <div className="rounded-md border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{form.getValues('symbol').toUpperCase()}</span>
              <span className="font-medium">${stockPrice.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">{stockName}</div>
            {currentShares > 0 && (
              <div className="text-sm">
                Current position: <span className="font-medium">{currentShares} shares</span>
              </div>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell" disabled={currentShares <= 0}>Sell</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min="1" step="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {stockPrice && (
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm">Estimated {form.watch('type') === 'buy' ? 'Cost' : 'Proceeds'}</div>
            <div className="font-semibold">
              ${(stockPrice * (form.watch('quantity') || 0)).toFixed(2)}
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !stockPrice || !stockName}
        >
          {isLoading ? 'Processing...' : form.watch('type') === 'buy' ? 'Buy' : 'Sell'}
        </Button>
      </form>
    </Form>
  );
};

export default PaperTradeForm;
