export interface ChannelStats {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: number | null;
  videoCount: number;
  totalViews: number;
  avgViews: number;
}

export interface VideoStats {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  url: string;
  isTrending?: boolean;
  engagementRate?: number; // (likes + comments) / views * 100
}

export interface AnalyzeResponse {
  channel: ChannelStats;
  videos: VideoStats[];
}

export interface AIInsights {
  summary: string;
  insights: string[];
  patterns: string[];
  recommendations: string[];
}
