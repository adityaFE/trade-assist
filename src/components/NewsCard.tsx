
import React from 'react';
import { NewsItem } from '@/store/stockStore';
import { timeAgo } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const sentimentColor = 
    news.sentiment === 'positive' 
      ? 'bg-success/10 text-success hover:bg-success/20' 
      : news.sentiment === 'negative'
        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
        : 'bg-info/10 text-info hover:bg-info/20';
  
  return (
    <a 
      href={news.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all group-hover:shadow-md h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 z-20">
            <Badge className={sentimentColor}>
              {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-3 z-20">
            <p className="text-xs text-white/80">{news.source} • {timeAgo(news.publishedAt)}</p>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-medium mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {news.summary}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {news.relatedSymbols.map((symbol) => (
                <span 
                  key={symbol}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/5 text-xs font-medium text-primary"
                >
                  ${symbol}
                </span>
              ))}
            </div>
            
            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
