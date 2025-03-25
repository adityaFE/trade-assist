
import React from 'react';
import { usePaperTradingStore, Trade } from '@/store/paperTradingStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const TradeHistory: React.FC = () => {
  const { trades } = usePaperTradingStore();
  
  if (trades.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-10 border rounded-lg bg-muted/30 backdrop-blur-sm"
      >
        <p className="text-muted-foreground">You haven't made any trades yet.</p>
      </motion.div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border rounded-lg overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm"
    >
      <table className="w-full">
        <thead className="bg-muted/80">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date & Time</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Symbol</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Quantity</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Price</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
          </tr>
        </thead>
        <motion.tbody 
          className="divide-y"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {trades.map((trade: Trade) => {
              const total = trade.price * trade.quantity;
              
              return (
                <motion.tr 
                  key={trade.id} 
                  className="hover:bg-muted/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.4, 
                    type: "spring", 
                    stiffness: 120, 
                    damping: 15 
                  }}
                  whileHover={{ 
                    backgroundColor: "rgba(var(--primary), 0.05)",
                    transition: { duration: 0.2 } 
                  }}
                >
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(trade.timestamp), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className="inline-flex items-center">
                      {trade.symbol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <motion.span 
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        trade.type === 'buy' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {trade.type === 'buy' ? 'Buy' : 'Sell'}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{trade.quantity}</td>
                  <td className="px-4 py-3 text-sm text-right">${trade.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">${total.toFixed(2)}</td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </motion.tbody>
      </table>
    </motion.div>
  );
};

export default TradeHistory;
