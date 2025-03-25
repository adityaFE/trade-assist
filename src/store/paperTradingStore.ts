
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Trade {
  id: string;
  symbol: string;
  companyName: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  timestamp: number;
}

export interface Position {
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
}

interface PaperTradingState {
  balance: number;
  startingBalance: number;
  trades: Trade[];
  positions: Position[];
  resetPortfolio: () => void;
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => boolean;
  updatePositionPrice: (symbol: string, price: number) => void;
}

export const usePaperTradingStore = create<PaperTradingState>()(
  persist(
    (set, get) => ({
      balance: 100000, // Starting with $100,000
      startingBalance: 100000,
      trades: [],
      positions: [],

      resetPortfolio: () => {
        set({
          balance: 100000,
          startingBalance: 100000,
          trades: [],
          positions: []
        });
      },

      executeTrade: (trade) => {
        const { balance, positions } = get();
        const tradeValue = trade.price * trade.quantity;
        
        // For buy orders, check if user has enough balance
        if (trade.type === 'buy') {
          if (balance < tradeValue) {
            return false; // Insufficient funds
          }

          // Find existing position
          const existingPositionIndex = positions.findIndex(p => p.symbol === trade.symbol);
          
          // Update positions
          const updatedPositions = [...positions];
          if (existingPositionIndex >= 0) {
            // Update existing position
            const existingPosition = updatedPositions[existingPositionIndex];
            const totalShares = existingPosition.quantity + trade.quantity;
            const totalValue = (existingPosition.quantity * existingPosition.averagePrice) + tradeValue;
            
            updatedPositions[existingPositionIndex] = {
              ...existingPosition,
              quantity: totalShares,
              averagePrice: totalValue / totalShares,
              currentPrice: trade.price
            };
          } else {
            // Add new position
            updatedPositions.push({
              symbol: trade.symbol,
              companyName: trade.companyName,
              quantity: trade.quantity,
              averagePrice: trade.price,
              currentPrice: trade.price
            });
          }

          // Execute the trade
          set({
            balance: balance - tradeValue,
            positions: updatedPositions,
            trades: [
              {
                id: Date.now().toString(),
                timestamp: Date.now(),
                ...trade
              },
              ...get().trades
            ]
          });
          
          return true;
        } else if (trade.type === 'sell') {
          // Find position
          const existingPositionIndex = positions.findIndex(p => p.symbol === trade.symbol);
          
          // Cannot sell what you don't own
          if (existingPositionIndex === -1) {
            return false;
          }
          
          const existingPosition = positions[existingPositionIndex];
          
          // Cannot sell more than you own
          if (existingPosition.quantity < trade.quantity) {
            return false;
          }
          
          // Update positions
          const updatedPositions = [...positions];
          const remainingQuantity = existingPosition.quantity - trade.quantity;
          
          if (remainingQuantity > 0) {
            // Update existing position
            updatedPositions[existingPositionIndex] = {
              ...existingPosition,
              quantity: remainingQuantity,
              currentPrice: trade.price
            };
          } else {
            // Remove position if all shares are sold
            updatedPositions.splice(existingPositionIndex, 1);
          }
          
          // Execute the trade
          set({
            balance: balance + tradeValue,
            positions: updatedPositions,
            trades: [
              {
                id: Date.now().toString(),
                timestamp: Date.now(),
                ...trade
              },
              ...get().trades
            ]
          });
          
          return true;
        }
        
        return false;
      },
      
      updatePositionPrice: (symbol, price) => {
        const { positions } = get();
        const positionIndex = positions.findIndex(p => p.symbol === symbol);
        
        if (positionIndex >= 0) {
          const updatedPositions = [...positions];
          updatedPositions[positionIndex] = {
            ...updatedPositions[positionIndex],
            currentPrice: price
          };
          
          set({ positions: updatedPositions });
        }
      }
    }),
    {
      name: 'paper-trading-storage'
    }
  )
);
