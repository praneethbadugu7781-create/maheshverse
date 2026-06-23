"use client";

import { useState } from "react";
import { Play, Eye, Clock, X } from "lucide-react";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  embedId: string;
  views: string;
  duration: string;
}

const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: "yt1",
    title: "Inside Jubilee Hills ₹65 Cr Ultra-Luxury Mansion Tour",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    embedId: "dQw4w9WgXcQ", // Standard test ID (RickRoll) or replace with public real estate video ids
    views: "45K views",
    duration: "12:45",
  },
  {
    id: "yt2",
    title: "Exploring 300 Sq Yds Gated Plots in Greenfield Estate",
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    embedId: "dQw4w9WgXcQ",
    views: "18K views",
    duration: "8:20",
  },
  {
    id: "yt3",
    title: "ECR Beach Villa Beachfront Walkthrough & Sea Views",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    embedId: "dQw4w9WgXcQ",
    views: "32K views",
    duration: "10:15",
  },
];

export default function YoutubeVideosSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handlePlayClick = (embedId: string) => {
    setActiveVideoId(embedId);
  };

  const closeLightbox = () => {
    setActiveVideoId(null);
  };

  return (
    <div className="space-y-8">
      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {YOUTUBE_VIDEOS.map((video) => (
          <div
            key={video.id}
            onClick={() => handlePlayClick(video.embedId)}
            className="group relative cursor-pointer flex flex-col rounded-xl overflow-hidden bg-card border border-border/60 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="p-4 rounded-full bg-primary text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 fill-white" />
                </div>
              </div>

              {/* Video duration badge */}
              <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </span>
            </div>

            {/* Title & View Count */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <svg className="h-4 w-4 fill-current text-primary shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Video Tour</span>
              </div>
              <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {video.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{video.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Video Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-border shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black border border-white/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* YouTube Embed Frame */}
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
