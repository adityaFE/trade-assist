
import React from 'react';
import { usePaperTradingStore, Position } from '@/store/paperTradingStore';
import { motion, AnimatePresence } from 'framer-motion';

const PaperPortfolioSummary: React.FC = () => {
  const { balance, positions, startingBalance } = usePaperTradingStore();
  
  // Calculate portfolio value
  const positionsValue = positions.reduce(
    (total, position) => total + position.quantity * position.currentPrice, 
    0
  );
  
  const totalValue = balance + positionsValue;
  const profitLoss = totalValue - startingBalance;
  const profitLossPercent = (profitLoss / startingBalance) * 100;
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  const statsVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={statsVariants}
      >
        <motion.div 
          className="p-4 bg-muted rounded-lg hover-card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="text-sm text-muted-foreground">Cash Balance</div>
          <div className="text-xl font-semibold">${balance.toFixed(2)}</div>
        </motion.div>
        
        <motion.div 
          className="p-4 bg-muted rounded-lg hover-card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="text-sm text-muted-foreground">Portfolio Value</div>
          <div className="text-xl font-semibold">${positionsValue.toFixed(2)}</div>
        </motion.div>
        
        <motion.div 
          className="p-4 bg-muted rounded-lg hover-card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-xl font-semibold">${totalValue.toFixed(2)}</div>
        </motion.div>
        
        <motion.div 
          className={`p-4 rounded-lg hover-card ${profitLoss >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="text-sm text-muted-foreground">Profit/Loss</div>
          <div className={`text-xl font-semibold ${profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
            {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
          </div>
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {positions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-medium mb-3 glow-text">Current Positions</h3>
            <motion.div 
              className="border rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Symbol</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Company</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Shares</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Avg. Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Current Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Value</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <AnimatePresence>
                    {positions.map((position: Position) => {
                      const value = position.quantity * position.currentPrice;
                      const cost = position.quantity * position.averagePrice;
                      const profit = value - cost;
                      const profitPercent = (profit / cost) * 100;
                      
                      return (
                        <motion.tr 
                          key={position.symbol} 
                          className="hover:bg-muted/50"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "rgba(var(--primary), 0.05)" }}
                        >
                          <td className="px-4 py-3 text-sm font-medium">{position.symbol}</td>
                          <td className="px-4 py-3 text-sm">{position.companyName}</td>
                          <td className="px-4 py-3 text-sm text-right">{position.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">${position.averagePrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right">${position.currentPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right">${value.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-sm text-right ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-10 border rounded-lg bg-muted/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-muted-foreground">You don't have any positions yet.</p>
            <p className="text-sm">Switch to the Trade tab to start buying stocks.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaperPortfolioSummary;
