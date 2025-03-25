
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, TrendingDown, Newspaper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface NotificationProps {
  children?: React.ReactNode;
}

const NotificationPanel: React.FC<NotificationProps> = ({ children }) => {
  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: 'stock-up',
      title: 'AAPL is up 2.5%',
      description: 'Apple Inc. stock has risen by 2.5% in the last hour.',
      time: '1 hour ago',
    },
    {
      id: 2,
      type: 'stock-down',
      title: 'TSLA is down 1.8%',
      description: 'Tesla Inc. stock has dropped by 1.8% today.',
      time: '3 hours ago',
    },
    {
      id: 3,
      type: 'news',
      title: 'Market Report: Tech Sector',
      description: 'Tech stocks rally as Fed signals potential rate cut.',
      time: '5 hours ago',
    },
    {
      id: 4,
      type: 'stock-up',
      title: 'MSFT reaches new high',
      description: 'Microsoft stock reaches an all-time high after earnings.',
      time: '1 day ago',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'stock-up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stock-down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[440px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.map((notification) => (
            <div key={notification.id} className="hover:bg-muted/50 transition-colors">
              <div className="p-4 flex items-start gap-3">
                <div className="mt-1 bg-background p-2 rounded-full border">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
