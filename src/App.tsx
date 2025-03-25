
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { create } from "zustand";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import PaperTrading from "./pages/PaperTrading";

// Create theme store for light/dark mode
interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Get theme from localStorage or default to system
  const savedTheme = localStorage.getItem('theme') as "light" | "dark" | "system" || "system";
  
  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      set({ theme });
    }
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Route animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Wrapper component with animation
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    className="min-h-[calc(100vh-80px)] w-full"
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const { initializeAuth } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<AnimatedRoute><Index /></AnimatedRoute>} />
        <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
        <Route path="/signup" element={<AnimatedRoute><Signup /></AnimatedRoute>} />
        <Route path="/forgot-password" element={<AnimatedRoute><ForgotPassword /></AnimatedRoute>} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><Dashboard /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watchlist" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><Watchlist /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/news" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><News /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><Profile /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><Settings /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/paper-trading" 
          element={
            <ProtectedRoute>
              <AnimatedRoute><PaperTrading /></AnimatedRoute>
            </ProtectedRoute>
          } 
        />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<AnimatedRoute><NotFound /></AnimatedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
