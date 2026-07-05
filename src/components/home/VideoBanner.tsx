"use client";

import { useEffect, useRef, useState } from "react";
import { FiPlay, FiVolume2, FiVolumeX, FiX } from "react-icons/fi";
import { isYouTube, youTubeId } from "@/lib/video";

/**
 * Video banner (bannerMode === "video"). A short video loops as a full-bleed
 * background with a single "Watch video" play button (no heading/text). The
 * background MUST start muted (browsers block autoplay with sound), so we add a
 * mute/unmute toggle — like McCownGordon's "S" control — for visitors to turn
 * the audio on. Clicking "Watch video" opens the long video in an overlay (the
 * background pauses/mutes while it's open), or a "coming soon" message when no
 * long video is set.
 */
export default function VideoBanner({
  shortUrl,
  longUrl,
  poster,
}: {
  shortUrl: string;
  longUrl: string;
  poster: string;
  // Passed by Hero from the shared hero fields; not rendered in video mode.
  eyebrow?: string;
  headline?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const shortRef = useRef<HTMLVideoElement>(null);

  const shortIsYt = isYouTube(shortUrl);
  const longIsYt = isYouTube(longUrl);
  const hasLong = longUrl.trim().length > 0;

  // The background is silent while the overlay is open (so it never clashes
  // with the long video) or when the visitor hasn't turned sound on.
  const bgMuted = !soundOn || open;

  // Drive the uploaded background video: mute state + pause while overlay open.
  useEffect(() => {
    const v = shortRef.current;
    if (!v || shortIsYt) return;
    v.muted = bgMuted;
    if (open) v.pause();
    else void v.play().catch(() => {});
  }, [bgMuted, open, shortIsYt]);

  // Lock body scroll + close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white-base min-h-[calc(60vh_+_80px)] md:min-h-[calc(68vh_+_80px)] flex">
      {/* Background video */}
      <div className="absolute inset-0">
        {shortIsYt ? (
          <iframe
            // key forces a reload when the mute param changes so YouTube
            // actually (un)mutes; the toggle click satisfies autoplay policy.
            key={bgMuted ? "muted" : "sound"}
            src={`https://www.youtube.com/embed/${youTubeId(
              shortUrl
            )}?autoplay=1&mute=${bgMuted ? 1 : 0}&loop=1&playlist=${youTubeId(
              shortUrl
            )}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`}
            title="Banner video"
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full brightness-105 contrast-110 saturate-125"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video
            ref={shortRef}
            src={shortUrl}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-105 contrast-110 saturate-125"
          />
        )}
        {/* Light scrim — only a soft darkening at the bottom so the Watch Video
            button stays readable; the rest of the footage stays bright. */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/45 via-transparent to-transparent" />
        {/* Cinematic vignette — subtly darkens the corners for an HD/premium
            depth while keeping the centre bright and crisp. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.34) 100%)",
          }}
        />
      </div>

      {/* Mute / unmute toggle — bottom-right */}
      <button
        type="button"
        onClick={() => setSoundOn((s) => !s)}
        aria-label={soundOn ? "Mute video" : "Unmute video"}
        title={soundOn ? "Mute" : "Unmute"}
        className="absolute z-10 bottom-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white-base hover:bg-white/25 transition-colors"
      >
        {soundOn ? <FiVolume2 /> : <FiVolumeX />}
      </button>

      {/* Watch-video button — bottom-left, McCownGordon style */}
      <div className="relative container-page flex items-end pt-24 pb-14 md:pb-20">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-4 md:gap-5"
          aria-label="Watch video"
        >
          <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white-base text-neutral-900 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] group-hover:bg-accent-300 group-hover:scale-105 transition-all">
            <FiPlay className="text-2xl md:text-3xl ml-1" />
          </span>
          <span className="text-lg md:text-2xl font-bold tracking-[0.14em] uppercase">
            Watch video
          </span>
        </button>
      </div>

      {/* Overlay: long video, or a friendly coming-soon message */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white-base hover:bg-white/20"
          >
            <FiX className="text-xl" />
          </button>

          {hasLong ? (
            <div
              className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {longIsYt ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youTubeId(
                    longUrl
                  )}?autoplay=1&rel=0`}
                  title="Watch video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={longUrl} controls autoPlay className="w-full h-full" />
              )}
            </div>
          ) : (
            <div
              className="text-center px-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white-base">
                The full video is coming soon
              </h3>
              <p className="mt-3 text-white/70">
                We&apos;re still cooking it up — check back shortly to watch the
                full story.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center h-11 px-6 rounded-full bg-white-base text-neutral-900 font-bold hover:bg-accent-300 transition-colors"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
