/**
 * Tiny helpers for the banner video feature. A stored video URL is either a
 * YouTube link (paste) or a direct file URL (an uploaded /files/....mp4/webm).
 * These detect which and extract the YouTube id for the embed player.
 */

/** True when the URL points at YouTube (youtube.com or youtu.be). */
export function isYouTube(url: string | null | undefined): boolean {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

/**
 * Extract the 11-char video id from any common YouTube URL form:
 *   youtu.be/<id>, youtube.com/watch?v=<id>, /embed/<id>, /shorts/<id>.
 * Returns "" when none is found.
 */
export function youTubeId(url: string | null | undefined): string {
  if (!url) return "";
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /\/embed\/([A-Za-z0-9_-]{11})/,
    /\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return "";
}
