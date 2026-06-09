"use client";

import { useState } from "react";
import { FiPlay, FiClock, FiExternalLink } from "react-icons/fi";
import type { Video } from "@/types/Catalog";

function formatDuration(s?: number) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

const CATEGORY_TINT: Record<Video["category"], string> = {
  "Product Demo": "bg-primary-100 text-primary-800",
  "Application Technique": "bg-secondary-100 text-secondary-800",
  "Case Study": "bg-accent-100 text-accent-800",
  Tutorial: "bg-neutral-100 text-neutral-800",
  "System Solution": "bg-success-50 text-success-700",
};

export default function VideoCard({
  video,
  compact = false,
}: {
  video: Video;
  compact?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const duration = formatDuration(video.durationSeconds);
  const thumbnail = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <article className={`group flex flex-col ${compact ? "" : "rounded-2xl overflow-hidden bg-white-base border border-neutral-100 shadow-soft hover:shadow-primary transition-shadow"}`}>
      <div className={`relative aspect-video bg-neutral-900 ${compact ? "rounded-xl overflow-hidden" : ""}`}>
        {playing ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            {/* Fallback when the uploader disables embedding / the video is
                region-locked / private. The iframe will show YouTube's own
                error, and this badge gives the viewer a way through to the
                YouTube page where it usually plays fine. */}
            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900/85 hover:bg-neutral-900 text-white-base text-[11px] font-semibold backdrop-blur"
              title="If the player shows an error, open it on YouTube"
            >
              <FiExternalLink className="text-[10px]" />
              Open on YouTube
            </a>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 w-full h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={video.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/0 to-neutral-900/30 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-500 text-white-base shadow-lg group-hover:scale-110 transition-transform">
                <FiPlay className="ml-1 text-2xl" />
              </span>
            </span>
            {duration && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900/85 text-white-base text-xs font-semibold">
                <FiClock className="text-[10px]" /> {duration}
              </span>
            )}
          </button>
        )}
      </div>

      <div className={compact ? "pt-3" : "p-5 flex-1"}>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
            CATEGORY_TINT[video.category]
          }`}
        >
          {video.category}
        </span>
        <h3 className={`mt-2 font-bold leading-snug line-clamp-2 ${compact ? "text-sm text-accent-400" : "text-base text-neutral-900"}`}>
          {video.title}
        </h3>
        {!compact && video.description && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </article>
  );
}
