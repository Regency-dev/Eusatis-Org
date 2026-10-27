import React from 'react';

/**
 * Parses any common video link (YouTube, Vimeo, direct MP4) into an embeddable player or iframe.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Support watch?v=, youtu.be/, embed/, v/, shorts/, live/
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  return match ? match[1] : null;
}

export function extractVimeoVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i
  );
  return match ? match[3] : null;
}

export function renderUniversalVideoPlayer(url: string, title = 'Video Broadcast') {
  if (!url) return null;

  const ytId = extractYouTubeVideoId(url);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  const vimeoId = extractVimeoVideoId(url);
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // Direct video file (mp4, webm, ogg)
  return (
    <video controls src={url} className="w-full h-full object-cover">
      Your browser does not support HTML5 video playback.
    </video>
  );
}
