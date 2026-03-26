import { NextResponse } from 'next/server';
import type { AnalyzeResponse, VideoStats } from '@/types';

// Mock generator fallback
function generateMockData(channelName: string): AnalyzeResponse {
  const baseViews = Math.floor(Math.random() * 500000) + 50000;

  // Spread 20 videos across 90 days so 30/90/all-time filters all work
  const videos = Array.from({ length: 20 }).map((_, i) => {
    const daysAgo = Math.floor((i / 20) * 90); // uniform spread 0..90d
    const isTrending = Math.random() > 0.8;
    const views = Math.floor(baseViews * (isTrending ? (Math.random() * 3 + 2) : (Math.random() * 0.8 + 0.5)));
    return {
      id: `mock_vid_${i}`,
      title: `${channelName} — Video ${i + 1}: ${['Deep Dive', 'Review', 'Hands-On', 'First Look', 'Unboxing', 'Explained'][i % 6]} ${['2026', 'S2', 'Edition', ''][i % 4]}`.trim(),
      thumbnail: `https://picsum.photos/seed/${channelName}${i}/320/180`,
      publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      views,
      likes: Math.floor(views * (Math.random() * 0.05 + 0.01)),
      comments: Math.floor(views * (Math.random() * 0.005 + 0.001)),
      url: `https://youtube.com/watch?v=mock_vid_${i}`,
      isTrending: false, // will be recalculated below
    };
  });

  // Trending = 80th percentile
  if (videos.length > 1) {
    const sorted = [...videos].map(v => v.views).sort((a, b) => a - b);
    const p80 = sorted[Math.floor(0.8 * sorted.length)];
    videos.forEach(v => { v.isTrending = v.views >= p80; });
  }

  // Channel summary stats based on last-30d subset
  const cutoff30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = videos.filter(v => new Date(v.publishedAt) >= cutoff30);
  const totalViews = recent.reduce((acc, v) => acc + v.views, 0);

  return {
    channel: {
      id: 'mock_channel_123',
      title: channelName,
      thumbnail: `https://picsum.photos/seed/${channelName}/200/200`,
      subscriberCount: Math.floor(totalViews * 2.5),
      videoCount: recent.length,
      totalViews,
      avgViews: recent.length > 0 ? Math.floor(totalViews / recent.length) : 0,
    },
    videos, // full 90-day set
  };
}

function extractChannelInfo(url: string): { type: 'handle' | 'id', value: string } | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathname = urlObj.pathname;
    
    if (pathname.startsWith('/@')) {
      return { type: 'handle', value: pathname.substring(2).split('/')[0] };
    }
    if (pathname.startsWith('/channel/')) {
      return { type: 'id', value: pathname.split('/')[2] };
    }
    if (pathname.startsWith('/c/') || pathname.startsWith('/user/')) {
       return { type: 'handle', value: pathname.split('/')[2] };
    }
    return null;
  } catch(e) {
    if (url.startsWith('@')) {
       return { type: 'handle', value: url.substring(1) };
    }
    // If it's just a raw handle word, let's assume it's a handle
    if (!url.includes('/')) {
        return { type: 'handle', value: url };
    }
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json({ error: 'Missing channel URL' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    let mockName = "Demo Channel";
    const info = extractChannelInfo(urlParam);
    if (info) mockName = info.value;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return NextResponse.json(generateMockData(mockName));
  }

  try {
    const info = extractChannelInfo(urlParam);
    if (!info) {
      return NextResponse.json({ error: 'Invalid YouTube URL format' }, { status: 400 });
    }

    // 1. Get Channel ID and Uploads Playlist ID
    let channelRes;
    if (info.type === 'handle') {
      // Search channels by handle
      channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=${info.value}&key=${apiKey}`);
      // Fallback if forHandle fails (some older channels)
      if (!channelRes.ok || (await channelRes.clone().json()).items?.length === 0) {
          channelRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${info.value}&key=${apiKey}`);
          const searchData = await channelRes.json();
          if (!searchData.items || searchData.items.length === 0) throw new Error('Channel not found');
          const channelId = searchData.items[0].snippet.channelId;
          channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`);
      }
    } else {
      channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${info.value}&key=${apiKey}`);
    }

    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const channelItem = channelData.items[0];
    const uploadsPlaylistId = channelItem.contentDetails.relatedPlaylists.uploads;
    
    const channelStats = {
      id: channelItem.id,
      title: channelItem.snippet.title,
      thumbnail: channelItem.snippet.thumbnails.high?.url || channelItem.snippet.thumbnails.default?.url,
      subscriberCount: parseInt(channelItem.statistics.subscriberCount || '0'),
      videoCount: 0, // will compute for 30d
      totalViews: 0, // will compute for 30d
      avgViews: 0
    };

    // 2. Fetch ALL recent videos from Uploads playlist (max 50, no date cutoff)
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}`);
    const playlistData = await playlistRes.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ channel: channelStats, videos: [] });
    }

    // All video IDs — no date cutoff; client-side filters will handle date ranges
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId);

    if (videoIds.length === 0) {
       return NextResponse.json({
         channel: channelStats,
         videos: []
      });
    }

    // 3. Fetch stats for these recent videos
    const videoStatsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`);
    const videoStatsData = await videoStatsRes.json();

    let totalViews = 0;
    const videos: VideoStats[] = videoStatsData.items.map((v: any) => {
      const views = parseInt(v.statistics.viewCount || '0');
      totalViews += views;
      return {
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.maxres?.url || v.snippet.thumbnails.high?.url || v.snippet.thumbnails.default?.url,
        publishedAt: v.snippet.publishedAt,
        views: views,
        likes: parseInt(v.statistics.likeCount || '0'),
        comments: parseInt(v.statistics.commentCount || '0'),
        url: `https://youtube.com/watch?v=${v.id}`
      };
    });

    // Channel summary stats: compute from last-30d subset only
    const cutoff30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recent30 = videos.filter(v => new Date(v.publishedAt) >= cutoff30);
    const totalViews30 = recent30.reduce((sum, v) => sum + v.views, 0);

    channelStats.videoCount = recent30.length;
    channelStats.totalViews = totalViews30;
    channelStats.avgViews   = recent30.length > 0 ? Math.floor(totalViews30 / recent30.length) : 0;

    // Trending = 80th percentile across ALL fetched videos
    if (videos.length > 1) {
      const sorted = [...videos].map(v => v.views).sort((a, b) => a - b);
      const p80Index = Math.floor(0.8 * sorted.length);
      const p80Threshold = sorted[p80Index] ?? Infinity;
      videos.forEach(v => { v.isTrending = v.views >= p80Threshold; });
    }

    return NextResponse.json({
      channel: channelStats,
      videos
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal API Error' }, { status: 500 });
  }
}
