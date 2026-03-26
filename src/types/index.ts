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
}

export interface AnalyzeResponse {
  channel: ChannelStats;
  videos: VideoStats[];
}
