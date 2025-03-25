
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Stock } from '@/store/stockStore';
import { formatCurrency } from '@/lib/api';

interface StockChartProps {
  stock: Stock;
  height?: number;
  showControls?: boolean;
  className?: string;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

const StockChart: React.FC<StockChartProps> = ({ 
  stock, 
  height = 300,
  showControls = true,
  className = '',
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  
  // Simulate different data ranges
  const getData = () => {
    switch (timeRange) {
      case '1D':
        return stock.data.slice(-1);
      case '1W':
        return stock.data.slice(-7);
      case '1M':
        return stock.data;
      case '3M':
        return stock.data;
      case '1Y':
        return stock.data;
      case 'ALL':
        return stock.data;
      default:
        return stock.data;
    }
  };
  
  // Determine chart color based on stock performance
  const chartColor = stock.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
  
  const timeRanges: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">Price: </span>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showControls && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-medium">{stock.name}</h3>
            <span className="text-sm text-muted-foreground">{stock.symbol}</span>
          </div>
          
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={getData()}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => value.split('-')[2]} // Show only day
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => formatCurrency(value, 0)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {showControls && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-medium">
                {formatCurrency(stock.price)}
              </p>
              <div className={`flex items-center mt-1 ${
                stock.change >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                <span className="text-sm font-medium">
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
