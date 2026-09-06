export type VideoPlatform = 'youtube' | 'vimeo' | 'tiktok' | 'instagram' | 'facebook' | 'direct' | 'custom';

export function detectPlatform(url: string): VideoPlatform {
  if (!url) return 'custom';
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('vimeo.com')) return 'vimeo';
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) return 'direct';
  return 'custom';
}

export function extractVideoId(url: string, platform?: VideoPlatform): string {
  if (!url) return '';
  const p = platform || detectPlatform(url);
  try {
    if (p === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : '';
    }
    if (p === 'vimeo') {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : '';
    }
    if (p === 'tiktok') {
      const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
      return match ? match[1] : '';
    }
  } catch {}
  return '';
}

export function getEmbedUrl(
  videoId: string,
  platform: VideoPlatform,
  options?: { autoplay?: boolean; muted?: boolean; loop?: boolean; controls?: boolean }
): string | null {
  const { autoplay = false, muted = true, loop = false, controls = true } = options || {};
  const params = new URLSearchParams();

  if (platform === 'youtube') {
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    if (loop) { params.set('loop', '1'); params.set('playlist', videoId); }
    if (!controls) params.set('controls', '0');
    params.set('rel', '0');
    params.set('modestbranding', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
  if (platform === 'vimeo') {
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (loop) params.set('loop', '1');
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }
  return null;
}

export function getThumbnailForPlatform(videoId: string, platform: VideoPlatform): string {
  if (platform === 'youtube' && videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '';
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    facebook: 'Facebook',
    direct: 'Direct Video',
    custom: 'Custom Embed',
  };
  return labels[platform] || platform;
}
