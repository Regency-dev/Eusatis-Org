import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface SiteImageConfig {
  id: string;
  label: string;
  locationDescription: string;
  category: 'hero' | 'navigation' | 'footer';
  currentUrl: string;
  defaultUrl: string;
  altText: string;
  aspectRatioLabel?: string;
}

export const DEFAULT_SITE_IMAGES: Record<string, SiteImageConfig> = {
  hero_card: {
    id: 'hero_card',
    label: 'Hero Featured Showcase Visual',
    locationDescription: 'The large visual card displayed on the right side of the Hero section on the homepage.',
    category: 'hero',
    currentUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    defaultUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    altText: 'Students engaged in learning experiments at Eusatis',
    aspectRatioLabel: '4:3 Landscape'
  },
  plane_mind: {
    id: 'plane_mind',
    label: 'Eusatis Mind Navigation Plane',
    locationDescription: 'Featured preview visual for the Eusatis Mind educational resources navigation plane.',
    category: 'navigation',
    currentUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    defaultUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    altText: 'Eusatis Mind interactive educational learning',
    aspectRatioLabel: '16:10 Wide'
  },
  plane_talks: {
    id: 'plane_talks',
    label: 'Beyoutiful Talks Navigation Plane',
    locationDescription: 'Featured podcast visual card for Beyoutiful Talks navigation plane.',
    category: 'navigation',
    currentUrl: '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    defaultUrl: '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    altText: 'Beyoutiful Talks podcast recording studio and conversations',
    aspectRatioLabel: '16:9 / 4:3'
  },
  plane_impact: {
    id: 'plane_impact',
    label: 'Eusatis Impact Navigation Plane',
    locationDescription: 'Featured community action and stewardship visual for Eusatis Impact.',
    category: 'navigation',
    currentUrl: '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    defaultUrl: '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    altText: 'Eusatis Impact community educational outreach in action',
    aspectRatioLabel: '4:3 Landscape'
  },
  plane_aha: {
    id: 'plane_aha',
    label: 'The Eusatis Aha Experience Visual',
    locationDescription: 'Discovery and clarity visual accompanying the interactive Snell refraction stage.',
    category: 'navigation',
    currentUrl: '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    defaultUrl: '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    altText: 'Student experiencing an Aha moment of clarity',
    aspectRatioLabel: '4:3 or 16:9'
  },
  plane_about: {
    id: 'plane_about',
    label: 'About Page Visual Philosophy Card',
    locationDescription: 'Visual showcase displayed alongside the brand philosophy and dual reality metaphor.',
    category: 'navigation',
    currentUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    defaultUrl: '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    altText: 'Eusatis purpose, vision, and educational foundation',
    aspectRatioLabel: '4:3 Landscape'
  },
  footer_band_pattern: {
    id: 'footer_band_pattern',
    label: 'Footer Brand Band Pattern (Coloured)',
    locationDescription: 'The official repeating coloured band pattern spanning across the top edge of the footer (height 1/20 of footer).',
    category: 'footer',
    currentUrl: 'https://i.ibb.co/Z1Bb3LgG/eusatis-assets-Band-Pattern-Coloured.png',
    defaultUrl: 'https://i.ibb.co/Z1Bb3LgG/eusatis-assets-Band-Pattern-Coloured.png',
    altText: 'Official Eusatis Brand Band Pattern Coloured',
    aspectRatioLabel: 'Repeating Banner Pattern'
  }
};

const STORAGE_KEY = 'eusatis_custom_site_images_v2';
const EVENT_NAME = 'eusatis_site_images_updated';

class ImageManager {
  private cache: Record<string, SiteImageConfig>;
  private isSyncing = false;

  constructor() {
    this.cache = this.loadFromStorage();
    if (typeof window !== 'undefined') {
      this.fetchFromSupabase();
    }
  }

  private loadFromStorage(): Record<string, SiteImageConfig> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: Record<string, SiteImageConfig> = { ...DEFAULT_SITE_IMAGES };
        for (const [key, val] of Object.entries(parsed)) {
          if (merged[key] && val && typeof val === 'object') {
            merged[key] = {
              ...merged[key],
              ...(val as Partial<SiteImageConfig>)
            };
          }
        }
        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse stored site images', e);
    }
    return { ...DEFAULT_SITE_IMAGES };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.cache }));
    } catch (e) {
      console.warn('Local storage write skipped or full:', e);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.cache }));
    }
  }

  /**
   * Sync durable image configurations from Supabase public.site_images table
   */
  public async fetchFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || this.isSyncing) return;

    this.isSyncing = true;
    try {
      const { data, error } = await supabase.from('site_images').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        let updated = false;
        for (const row of data) {
          const id = row.id;
          const currentConfig = this.cache[id] || DEFAULT_SITE_IMAGES[id];
          if (currentConfig && row.current_url) {
            this.cache[id] = {
              ...currentConfig,
              currentUrl: row.current_url,
              altText: row.alt_text ?? currentConfig.altText,
              defaultUrl: row.default_url ?? currentConfig.defaultUrl
            };
            updated = true;
          }
        }
        if (updated) {
          this.saveToStorage();
        }
      }
    } catch (err) {
      console.warn('Non-fatal: could not fetch site_images from Supabase:', err);
    } finally {
      this.isSyncing = false;
    }
  }

  public getAll(): Record<string, SiteImageConfig> {
    return { ...this.cache };
  }

  public getImage(id: string): SiteImageConfig {
    return this.cache[id] || DEFAULT_SITE_IMAGES[id] || {
      id,
      label: id,
      locationDescription: '',
      category: 'navigation',
      currentUrl: '',
      defaultUrl: '',
      altText: ''
    };
  }

  public getImageUrl(id: string, fallback?: string): string {
    const config = this.getImage(id);
    return config?.currentUrl || fallback || config?.defaultUrl || '';
  }

  /**
   * Persistently update a site image record in Supabase and local cache
   */
  public async updateImage(id: string, newUrl: string, newAlt?: string): Promise<void> {
    const existing = this.getImage(id);
    const updatedConfig: SiteImageConfig = {
      ...existing,
      currentUrl: newUrl,
      altText: newAlt !== undefined ? newAlt : existing.altText
    };

    this.cache[id] = updatedConfig;
    this.saveToStorage();

    // Persist to Supabase if configured and authenticated
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('site_images').upsert({
          id,
          label: updatedConfig.label,
          location_description: updatedConfig.locationDescription,
          category: updatedConfig.category,
          current_url: updatedConfig.currentUrl,
          default_url: updatedConfig.defaultUrl,
          alt_text: updatedConfig.altText,
          aspect_ratio_label: updatedConfig.aspectRatioLabel,
          updated_at: new Date().toISOString()
        });
        if (error) {
          console.warn('Supabase site_images upsert notice:', error.message);
        }
      } catch (err) {
        console.warn('Could not persist image to Supabase site_images:', err);
      }
    }
  }

  public async reset(id: string): Promise<void> {
    if (DEFAULT_SITE_IMAGES[id]) {
      const def = DEFAULT_SITE_IMAGES[id];
      this.cache[id] = { ...def };
      this.saveToStorage();

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from('site_images').upsert({
            id,
            label: def.label,
            location_description: def.locationDescription,
            category: def.category,
            current_url: def.defaultUrl,
            default_url: def.defaultUrl,
            alt_text: def.altText,
            aspect_ratio_label: def.aspectRatioLabel,
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn('Could not reset site_images row in Supabase:', err);
        }
      }
    }
  }

  public async resetAll(): Promise<void> {
    this.cache = { ...DEFAULT_SITE_IMAGES };
    this.saveToStorage();

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = Object.values(DEFAULT_SITE_IMAGES).map((img) => ({
          id: img.id,
          label: img.label,
          location_description: img.locationDescription,
          category: img.category,
          current_url: img.defaultUrl,
          default_url: img.defaultUrl,
          alt_text: img.altText,
          aspect_ratio_label: img.aspectRatioLabel,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('site_images').upsert(rows);
      } catch (err) {
        console.warn('Could not reset all site_images in Supabase:', err);
      }
    }
  }

  /**
   * Helper to process, downscale, and compress uploaded files into clean data URLs if direct storage is pending
   */
  public async processUploadedFile(file: File, maxDimension = 1400, quality = 0.88): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image for processing'));
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const imageManager = new ImageManager();

/**
 * Hook to subscribe to an individual site image
 */
export function useSiteImage(id: string, defaultSrc?: string): { url: string; alt: string; config: SiteImageConfig } {
  const [config, setConfig] = useState<SiteImageConfig>(() => imageManager.getImage(id));

  useEffect(() => {
    const handler = () => {
      setConfig(imageManager.getImage(id));
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [id]);

  return {
    url: config.currentUrl || defaultSrc || config.defaultUrl,
    alt: config.altText,
    config
  };
}

/**
 * Hook to subscribe to all site images (for Admin Dashboard)
 */
export function useAllSiteImages(): Record<string, SiteImageConfig> {
  const [images, setImages] = useState<Record<string, SiteImageConfig>>(() => imageManager.getAll());

  useEffect(() => {
    const handler = () => {
      setImages(imageManager.getAll());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return images;
}
