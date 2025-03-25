
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import {
  ChevronRight,
  BarChart4,
  TrendingUp,
  LineChart,
  Bell,
  BadgeDollarSign,
  Award,
  Shield,
} from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-24 md:pt-28 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 md:gap-6 items-center">
              <div className="order-2 md:order-1 animate-slide-up">
                <div className="inline-block px-3 py-1.5 mb-4 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Financial intelligence at your fingertips
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6">
                  Trade smarter with real-time market insights
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Get personalized stock recommendations, real-time market data, and AI-powered analysis to make informed investment decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="h-12 px-8 font-medium">
                    <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                      {isAuthenticated ? "Go to Dashboard" : "Try Dashboard"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {!isAuthenticated && (
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 font-medium">
                      <Link to="/signup">Create Account</Link>
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-5">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">10,000+</span> active traders trust us
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative animate-fade-in">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-2xl opacity-70"></div>
                  <div className="relative overflow-hidden bg-card rounded-xl border shadow-xl">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline">
                          <h3 className="text-xl font-medium">AAPL</h3>
                          <span className="ml-2 text-sm text-muted-foreground">Apple Inc.</span>
                        </div>
                        <div className="px-2 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
                          +2.15%
                        </div>
                      </div>
                      <div className="mt-4 h-[300px] w-full bg-card">
                        <img 
                          src="https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=800&auto=format&fit=crop&q=80" 
                          alt="Stock chart" 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 rounded-md bg-muted">
                          <p className="text-sm text-muted-foreground">Current Price</p>
                          <p className="text-lg font-medium">$184.25</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted">
                          <p className="text-sm text-muted-foreground">Market Cap</p>
                          <p className="text-lg font-medium">$2.89T</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-block px-3 py-1.5 mb-4 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Powerful Features
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-4">
                Everything you need to trade successfully
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides comprehensive tools to help you make informed investment decisions and stay ahead of market trends.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="transition-all hover:translate-y-[-4px] rounded-xl border bg-card shadow-sm p-6 animate-slide-up">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Real-Time Market Data</h3>
                <p className="text-muted-foreground">
                  Get instant access to live stock prices, market trends, and trading volumes from global exchanges.
                </p>
              </div>
              
              <div className="transition-all hover:translate-y-[-4px] rounded-xl border bg-card shadow-sm p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI-Powered Predictions</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithms analyze market data to provide accurate stock predictions and investment opportunities.
                </p>
              </div>
              
              <div className="transition-all hover:translate-y-[-4px] rounded-xl border bg-card shadow-sm p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Personalized Watchlists</h3>
                <p className="text-muted-foreground">
                  Create custom watchlists to track your favorite stocks and monitor their performance in real-time.
                </p>
              </div>
              
              <div className="transition-all hover:translate-y-[-4px] rounded-xl border bg-card shadow-sm p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Price Alerts & Notifications</h3>
                <p className="text-muted-foreground">
                  Set up custom alerts to notify you when stocks reach specific price points or exhibit important patterns.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-4 mb-12">
          <div className="container mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"></div>
              <div className="relative z-10 py-12 px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-4">
                  Ready to transform your trading experience?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                  Join thousands of traders who are already using our platform to make smarter investment decisions.
                </p>
                {!isAuthenticated ? (
                  <Button asChild size="lg" variant="secondary" className="h-12 px-8 font-medium">
                    <Link to="/signup">Get Started Now</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="secondary" className="h-12 px-8 font-medium">
                    <Link to="/paper-trading">Try Paper Trading</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">T</div>
                  <span className="text-lg font-display font-medium">TradeAssist</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Making trading accessible and intelligent for everyone.
                </p>
                <div className="flex space-x-3">
                  {/* Social icons would go here */}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                  <li><Link to="/watchlist" className="text-sm text-muted-foreground hover:text-foreground">Watchlist</Link></li>
                  <li><Link to="/news" className="text-sm text-muted-foreground hover:text-foreground">News</Link></li>
                  <li><Link to="/paper-trading" className="text-sm text-muted-foreground hover:text-foreground">Paper Trading</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Disclaimers</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} TradeAssist. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
