import type { MediaAsset } from './types';

export const mockMediaLibrary: MediaAsset[] = [
  { id: 'media_1', url: 'https://picsum.photos/seed/space/1200/800', type: 'image', fileName: 'galaxy.jpg', derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }] },
  { id: 'media_2', url: 'https://dummy-media.s3.amazonaws.com/video-1.mp4', type: 'video', fileName: 'tech_intro.mp4', derivedFormats: [{ name: 'HD', resolution: '720p' }] },
  { id: 'media_3', url: 'https://picsum.photos/seed/nature/1200/800', type: 'image', fileName: 'forest_stream.jpg', derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }] },
  // --- NEW MOCK AUDIO FILE ---
  { id: 'media_5', url: '#', type: 'audio', fileName: 'upbeat_music.mp3', derivedFormats: [{ name: 'MP3', resolution: '128kbps' }] },
  { id: 'media_4', url: 'https://picsum.photos/seed/architecture/1200/800', type: 'image', fileName: 'cityscape.jpg', derivedFormats: [{ name: 'Thumbnail', resolution: '300x200' }] },
];