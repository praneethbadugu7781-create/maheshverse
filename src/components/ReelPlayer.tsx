"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Heart, Share2, ExternalLink, MessageSquare } from "lucide-react";
import { formatPrice } from "./PropertyCard";

interface ReelPlayerProps {
  property: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    location: string;
    videoUrl: string;
    images?: string[];
  };
  onEnquireClick?: (propertyId: string, propertyName: string) => void;
}

export default function ReelPlayer({ property, onEnquireClick }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartPopup, setShowHeartPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Autoplay/pause on scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch((err) => {
                console.log("Autoplay blocked by browser: ", err);
              });
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.6 } // Video must be 60% visible to trigger
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeartPopup(true);
    setTimeout(() => {
      setShowHeartPopup(false);
    }, 800);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${property.slug || property._id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div
      ref={containerRef}
      className="reel-section relative mx-auto w-full max-w-[420px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group select-none flex items-center justify-center"
      onClick={handlePlayPause}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={property.videoUrl}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover cursor-pointer"
        onDoubleClick={handleDoubleTap}
      />

      {/* Double tap heart animation */}
      {showHeartPopup && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
          <Heart className="h-20 w-20 text-red-500 fill-red-500 opacity-90 scale-[1.3] transition-transform duration-300" />
        </div>
      )}

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/60 pointer-events-none" />

      {/* Play/Pause state indicator icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="p-4 rounded-full bg-black/50 text-white backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white" />
          </div>
        </div>
      )}

      {/* Volume mute button on top right */}
      <button
        onClick={handleMuteUnmute}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 cursor-pointer"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Right side floating buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-10">
        {/* Like/Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="flex flex-col items-center group/btn cursor-pointer"
        >
          <div className={`p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all ${
            isLiked ? "text-red-500" : ""
          }`}>
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
          </div>
          <span className="text-[10px] text-white/90 mt-1 font-semibold">
            {isLiked ? "Liked" : "Like"}
          </span>
        </button>

        {/* Enquiry Form button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEnquireClick) {
              onEnquireClick(property._id, property.title);
            }
          }}
          className="flex flex-col items-center group/btn cursor-pointer"
        >
          <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-white/90 mt-1 font-semibold">Enquire</span>
        </button>

        {/* Share Link */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center relative cursor-pointer"
        >
          <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-white/90 mt-1 font-semibold">
            {copySuccess ? "Copied!" : "Share"}
          </span>
        </button>
      </div>

      {/* Bottom text information and CTA */}
      <div className="absolute left-4 right-20 bottom-4 text-white z-10 space-y-3">
        {/* Info */}
        <div className="space-y-1 select-text">
          <div className="flex items-baseline gap-2">
            <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-bold">
              {formatPrice(property.price)}
            </span>
          </div>
          <h3 className="text-base font-extrabold line-clamp-1 leading-snug drop-shadow-md">
            {property.title}
          </h3>
          <p className="text-xs text-white/70 line-clamp-1 drop-shadow-sm">
            {property.location}
          </p>
        </div>

        {/* View Details CTA */}
        <Link
          href={`/properties/${property.slug || property._id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-primary to-amber-500 py-2.5 text-xs font-bold text-background shadow-lg hover:scale-102 transition-transform"
        >
          Explore Property
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
