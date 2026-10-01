import type { ImageMetadata } from 'astro';
import fallback from '../assets/consultation-hero.png';

export const consultationHero: ImageMetadata = fallback;

const assetImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*', { eager: true });

export function getAssetImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = path.startsWith('/assets/') ? `/src/assets/${path.slice(8)}` : path;
  return (assetImages[key] as any)?.default;
}
