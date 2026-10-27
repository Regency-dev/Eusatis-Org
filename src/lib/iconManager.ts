import React from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface IconBoxDimensions {
  pixelSize: number;       // default width & height in px (e.g. 16, 24, 20)
  className: string;       // default Tailwind icon size classes (e.g. 'w-4 h-4', 'w-6 h-6')
  boxClassName: string;    // default container box classes (e.g. 'w-6 h-6 rounded-lg', 'w-12 h-12 rounded-2xl')
  boxPadding?: string;     // optical padding within box
  boxDescription: string;  // human readable description of the container box
}

export interface SiteIconConfig {
  id: string;
  label: string;
  category: 'Hero Pathways' | 'Core Pillars' | 'Academic Subjects' | 'Badges & Emblems' | 'Contact Channels';
  description: string;
  type: 'lucide' | 'svg' | 'url' | 'emblem';
  value: string; // Lucide icon name, raw SVG code, or Image URL
  fallbackLucide: string;
  defaultDimensions: IconBoxDimensions;
}

/**
 * Clean, sanitize, and automatically fit raw SVG markup into standard icon boxes:
 * - Strips XML headers, doctypes, and comments.
 * - Extracts width and height to construct viewBox if viewBox is missing.
 * - Strips hardcoded width/height/style attributes from root <svg> so CSS sizing governs 100%.
 * - Adds preserveAspectRatio="xMidYMid meet" so the icon is centered and never distorts.
 * - Normalizes black/hardcoded fills to currentColor so it adopts container theme colors.
 */
export function sanitizeAndFitSvg(rawSvg: string): string {
  if (!rawSvg || !rawSvg.includes('<svg')) return '';

  let cleaned = rawSvg
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  const svgOpenMatch = cleaned.match(/<svg([^>]*)>/i);
  if (!svgOpenMatch) return cleaned;

  let attrs = svgOpenMatch[1];

  // Check for width and height if viewBox is missing
  const widthMatch = attrs.match(/\bwidth=["']?([0-9.]+)(?:px)?["']?/i);
  const heightMatch = attrs.match(/\bheight=["']?([0-9.]+)(?:px)?["']?/i);
  const hasViewBox = /\bviewBox=/i.test(attrs);

  if (!hasViewBox) {
    const w = widthMatch ? widthMatch[1] : '24';
    const h = heightMatch ? heightMatch[1] : '24';
    attrs += ` viewBox="0 0 ${w} ${h}"`;
  }

  // Strip hardcoded fixed root dimensions and styles so CSS controls sizing
  attrs = attrs
    .replace(/\bwidth=["'][^"']*["']/gi, '')
    .replace(/\bheight=["'][^"']*["']/gi, '')
    .replace(/\bstyle=["'][^"']*["']/gi, '');

  // Ensure preserveAspectRatio="xMidYMid meet"
  if (!/preserveAspectRatio=/i.test(attrs)) {
    attrs += ' preserveAspectRatio="xMidYMid meet"';
  }

  // Ensure SVG fills container box cleanly with zero overflow
  attrs += ' class="w-full h-full max-w-full max-h-full block object-contain aspect-square shrink-0 pointer-events-none"';

  cleaned = cleaned.replace(/<svg[^>]*>/i, `<svg${attrs}>`);

  // Convert pure black fills / strokes to currentColor so theme color cascade functions
  cleaned = cleaned
    .replace(/\bfill=["'](?:#000(?:000)?|black)["']/gi, 'fill="currentColor"')
    .replace(/\bstroke=["'](?:#000(?:000)?|black)["']/gi, 'stroke="currentColor"');

  return cleaned;
}

// Pre-seeded icon catalog with high-quality defaults and exact container box dimensions
export const DEFAULT_SITE_ICONS: Record<string, SiteIconConfig> = {
  // Hero Pathway Buttons (Hero Section)
  hero_mind: {
    id: 'hero_mind',
    label: 'Explore Eusatis Mind (Hero Button)',
    category: 'Hero Pathways',
    description: 'Icon shown in the principal "Explore Eusatis Mind" hero action button',
    type: 'lucide',
    value: 'BookOpen',
    fallbackLucide: 'BookOpen',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-white/30',
      boxPadding: 'p-1',
      boxDescription: '24×24px Hero Action Button Badge'
    }
  },
  hero_talks: {
    id: 'hero_talks',
    label: 'Beyoutiful Talks (Hero Button)',
    category: 'Hero Pathways',
    description: 'Icon shown in the "Beyoutiful Talks" hero action button',
    type: 'lucide',
    value: 'Mic',
    fallbackLucide: 'Mic',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-[#D6A348]/30',
      boxPadding: 'p-1',
      boxDescription: '24×24px Hero Action Button Badge'
    }
  },
  hero_impact: {
    id: 'hero_impact',
    label: 'Eusatis Impact (Hero Button)',
    category: 'Hero Pathways',
    description: 'Icon shown in the "Eusatis Impact" hero action button',
    type: 'lucide',
    value: 'Heart',
    fallbackLucide: 'Heart',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-[#D67546]/30',
      boxPadding: 'p-1',
      boxDescription: '24×24px Hero Action Button Badge'
    }
  },

  // Three Core Pillars (The Eusatis Experience section)
  pillar_mind: {
    id: 'pillar_mind',
    label: 'Eusatis Mind (Philosophy Pillar)',
    category: 'Core Pillars',
    description: 'Emblem for the Eusatis Mind educational card in The Eusatis Experience',
    type: 'lucide',
    value: 'Lightbulb',
    fallbackLucide: 'Lightbulb',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#47C3D3]/20',
      boxPadding: 'p-3',
      boxDescription: '48×48px Eusatis Experience Rounded Pillar Box'
    }
  },
  pillar_talks: {
    id: 'pillar_talks',
    label: 'Beyoutiful Talks (Philosophy Pillar)',
    category: 'Core Pillars',
    description: 'Emblem for the Beyoutiful Talks authenticity card in The Eusatis Experience',
    type: 'lucide',
    value: 'Compass',
    fallbackLucide: 'Compass',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#D6A348]/20',
      boxPadding: 'p-3',
      boxDescription: '48×48px Eusatis Experience Rounded Pillar Box'
    }
  },
  pillar_impact: {
    id: 'pillar_impact',
    label: 'Eusatis Impact (Philosophy Pillar)',
    category: 'Core Pillars',
    description: 'Emblem for the Eusatis Impact action card in The Eusatis Experience',
    type: 'lucide',
    value: 'Users',
    fallbackLucide: 'Users',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#D67546]/20',
      boxPadding: 'p-3',
      boxDescription: '48×48px Eusatis Experience Rounded Pillar Box'
    }
  },

  // The Three Eusatis Arms (About Page)
  arm_mind: {
    id: 'arm_mind',
    label: 'The Three Arms: Eusatis Mind (About Page)',
    category: 'Core Pillars',
    description: 'Icon shown in the Eusatis Mind card under "The Three Eusatis Arms" on the About page',
    type: 'lucide',
    value: 'BookOpen',
    fallbackLucide: 'BookOpen',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#47C3D3]/15 text-[#0891B2]',
      boxPadding: 'p-3',
      boxDescription: '48×48px Three Arms Box'
    }
  },
  arm_talks: {
    id: 'arm_talks',
    label: 'The Three Arms: Eusatis Talks (About Page)',
    category: 'Core Pillars',
    description: 'Icon shown in the Eusatis Talks card under "The Three Eusatis Arms" on the About page',
    type: 'lucide',
    value: 'Mic',
    fallbackLucide: 'Mic',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#D6A348]/15 text-[#B47818]',
      boxPadding: 'p-3',
      boxDescription: '48×48px Three Arms Box'
    }
  },
  arm_impact: {
    id: 'arm_impact',
    label: 'The Three Arms: Eusatis Impact (About Page)',
    category: 'Core Pillars',
    description: 'Icon shown in the Eusatis Impact card under "The Three Eusatis Arms" on the About page',
    type: 'lucide',
    value: 'Heart',
    fallbackLucide: 'Heart',
    defaultDimensions: {
      pixelSize: 24,
      className: 'w-6 h-6',
      boxClassName: 'w-12 h-12 rounded-2xl bg-[#D67546]/15 text-[#D67546]',
      boxPadding: 'p-3',
      boxDescription: '48×48px Three Arms Box'
    }
  },

  // Academic Subjects
  subject_agriculture: {
    id: 'subject_agriculture',
    label: 'Agriculture Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Agriculture & Soil Science lessons',
    type: 'lucide',
    value: 'Sprout',
    fallbackLucide: 'Sprout',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-emerald-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_engineering: {
    id: 'subject_engineering',
    label: 'Engineering Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Structural & Mechanical Engineering lessons',
    type: 'lucide',
    value: 'Cpu',
    fallbackLucide: 'Cpu',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-cyan-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_interdisciplinary: {
    id: 'subject_interdisciplinary',
    label: 'Interdisciplinary Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Biomimicry and cross-disciplinary topics',
    type: 'lucide',
    value: 'Compass',
    fallbackLucide: 'Compass',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-amber-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_biology: {
    id: 'subject_biology',
    label: 'Biology Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Biological and Life Sciences lessons',
    type: 'lucide',
    value: 'Dna',
    fallbackLucide: 'Dna',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-emerald-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_chemistry: {
    id: 'subject_chemistry',
    label: 'Chemistry Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Molecular & Chemical Sciences lessons',
    type: 'lucide',
    value: 'FlaskConical',
    fallbackLucide: 'FlaskConical',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-amber-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_physics: {
    id: 'subject_physics',
    label: 'Physics Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Wave Optics, Mechanics & Classical Physics',
    type: 'lucide',
    value: 'Atom',
    fallbackLucide: 'Atom',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-cyan-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },
  subject_mathematics: {
    id: 'subject_mathematics',
    label: 'Mathematics Subject Icon',
    category: 'Academic Subjects',
    description: 'Displayed for Geometry, Calculus & Mathematical Algorithms',
    type: 'lucide',
    value: 'Calculator',
    fallbackLucide: 'Calculator',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-6 h-6 rounded-lg bg-rose-500/15',
      boxPadding: 'p-1',
      boxDescription: '24×24px Subject Pill Badge'
    }
  },

  // Brand Badges & Emblems
  badge_emblem: {
    id: 'badge_emblem',
    label: 'Creative Badge Graphic Motif',
    category: 'Badges & Emblems',
    description: 'The geometric emblem rendered beside uppercase section headers',
    type: 'emblem',
    value: 'brand_dual_oval',
    fallbackLucide: 'Sparkles',
    defaultDimensions: {
      pixelSize: 16,
      className: 'w-4 h-4',
      boxClassName: 'w-5 h-5 rounded-md',
      boxPadding: 'p-0.5',
      boxDescription: '20×20px Typographic Eyebrow Badge'
    }
  },

  // Contact Channels
  contact_phone: {
    id: 'contact_phone',
    label: 'Telephone Call Icon',
    category: 'Contact Channels',
    description: 'Vector scalable icon for phone lines (+233544272394 / +233544916847)',
    type: 'lucide',
    value: 'PhoneCall',
    fallbackLucide: 'PhoneCall',
    defaultDimensions: {
      pixelSize: 20,
      className: 'w-5 h-5',
      boxClassName: 'w-10 h-10 rounded-xl bg-[#47C3D3]/15 text-[#0891B2]',
      boxPadding: 'p-2.5',
      boxDescription: '40×40px Direct Contact Badge'
    }
  },
  contact_whatsapp: {
    id: 'contact_whatsapp',
    label: 'WhatsApp Messaging Icon',
    category: 'Contact Channels',
    description: 'Vector scalable icon for WhatsApp (+447925136956 / +233544272394)',
    type: 'svg',
    value: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.88-.38-4.13-1.11l-.3-.18-3.07.81.82-2.99-.19-.31a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.42.1-.13.19-.48.61-.59.74-.11.13-.22.14-.4.05-.19-.09-.79-.29-1.5-.93-.56-.49-.93-1.11-1.04-1.3-.11-.19-.01-.29.08-.38.08-.08.19-.22.28-.33.09-.11.13-.19.19-.31.06-.13.03-.24-.02-.33-.04-.09-.42-1.01-.58-1.39-.15-.36-.31-.31-.42-.31h-.36c-.13 0-.33.05-.5.24-.17.19-.66.65-.66 1.58s.68 1.83.77 1.96c.09.13 1.33 2.04 3.23 2.86.45.2.8.31 1.08.4.46.15.87.13 1.2.08.37-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.9-.05-.09-.19-.14-.38-.24z"/></svg>`,
    fallbackLucide: 'MessageCircle',
    defaultDimensions: {
      pixelSize: 20,
      className: 'w-5 h-5',
      boxClassName: 'w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#128C7E]',
      boxPadding: 'p-2.5',
      boxDescription: '40×40px Direct Contact Badge'
    }
  }
};

const STORAGE_KEY = 'eusatis_custom_site_icons_v2';
const LISTEN_EVENT = 'eusatis_icons_updated';

class IconManagerService {
  private icons: Record<string, SiteIconConfig>;
  private listeners: Set<() => void> = new Set();
  private isSyncing = false;

  constructor() {
    this.icons = this.loadFromStorage();
    if (typeof window !== 'undefined') {
      this.fetchFromSupabase();
    }
  }

  private loadFromStorage(): Record<string, SiteIconConfig> {
    if (typeof window === 'undefined') return { ...DEFAULT_SITE_ICONS };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: Record<string, SiteIconConfig> = { ...DEFAULT_SITE_ICONS };
        for (const [key, val] of Object.entries(parsed)) {
          if (merged[key] && val && typeof val === 'object') {
            merged[key] = {
              ...merged[key],
              ...(val as Partial<SiteIconConfig>),
              // Preserve official defaultDimensions so sizing remains guaranteed
              defaultDimensions: DEFAULT_SITE_ICONS[key]?.defaultDimensions || (val as any).defaultDimensions
            };
          }
        }
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load custom icons from storage:', e);
    }
    return { ...DEFAULT_SITE_ICONS };
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.icons));
      window.dispatchEvent(new CustomEvent(LISTEN_EVENT));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save icons:', e);
    }
  }

  public async fetchFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || this.isSyncing) return;
    this.isSyncing = true;
    try {
      const { data, error } = await supabase.from('site_icons').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        let updated = false;
        for (const row of data) {
          const id = row.id;
          const current = this.icons[id] || DEFAULT_SITE_ICONS[id];
          if (current && (row.type || row.value)) {
            this.icons[id] = {
              ...current,
              type: row.type || current.type,
              value: row.value || current.value
            };
            updated = true;
          }
        }
        if (updated) {
          this.saveToStorage();
        }
      }
    } catch {
      // Table might not exist yet; gracefully fallback to localStorage
    } finally {
      this.isSyncing = false;
    }
  }

  public async syncToSupabase(id: string, config: SiteIconConfig): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      await supabase.from('site_icons').upsert({
        id,
        label: config.label,
        category: config.category,
        description: config.description,
        type: config.type,
        value: config.value,
        fallback_lucide: config.fallbackLucide,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase icon sync non-fatal warning:', err);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error(err);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getAll(): Record<string, SiteIconConfig> {
    return { ...this.icons };
  }

  public get(id: string): SiteIconConfig {
    return this.icons[id] || DEFAULT_SITE_ICONS[id] || {
      id,
      label: id,
      category: 'Badges & Emblems',
      description: '',
      type: 'lucide',
      value: 'Sparkles',
      fallbackLucide: 'Sparkles',
      defaultDimensions: {
        pixelSize: 20,
        className: 'w-5 h-5',
        boxClassName: 'w-10 h-10 rounded-xl',
        boxPadding: 'p-2',
        boxDescription: 'Standard Box'
      }
    };
  }

  public update(id: string, updates: Partial<SiteIconConfig>) {
    const existing = this.get(id);
    let finalValue = updates.value !== undefined ? updates.value : existing.value;
    const finalType = updates.type || existing.type;

    // If custom SVG is supplied, automatically sanitize and fit it
    if (finalType === 'svg' && finalValue.includes('<svg')) {
      finalValue = sanitizeAndFitSvg(finalValue);
    }

    const updatedConfig: SiteIconConfig = {
      ...existing,
      ...updates,
      type: finalType,
      value: finalValue,
      // Retain canonical default dimensions
      defaultDimensions: existing.defaultDimensions || DEFAULT_SITE_ICONS[id]?.defaultDimensions
    };

    this.icons[id] = updatedConfig;
    this.saveToStorage();
    this.syncToSupabase(id, updatedConfig);
  }

  public reset(id: string) {
    if (DEFAULT_SITE_ICONS[id]) {
      this.icons[id] = { ...DEFAULT_SITE_ICONS[id] };
      this.saveToStorage();
      this.syncToSupabase(id, DEFAULT_SITE_ICONS[id]);
    }
  }

  public resetAll() {
    this.icons = { ...DEFAULT_SITE_ICONS };
    this.saveToStorage();
    for (const [id, cfg] of Object.entries(DEFAULT_SITE_ICONS)) {
      this.syncToSupabase(id, cfg);
    }
  }

  /**
   * Reads an uploaded icon file (SVG, PNG, JPG, WebP) and returns
   * either the normalized SVG code or a clean data URL ready for storage.
   */
  public async processUploadedIconFile(file: File): Promise<{ type: 'svg' | 'url'; value: string }> {
    return new Promise((resolve, reject) => {
      const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
      const reader = new FileReader();

      if (isSvg) {
        reader.onload = (e) => {
          const rawText = e.target?.result as string;
          if (rawText && rawText.includes('<svg')) {
            const cleaned = sanitizeAndFitSvg(rawText);
            resolve({ type: 'svg', value: cleaned });
          } else {
            reject(new Error('Uploaded file is not a valid SVG icon markup.'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read SVG file.'));
        reader.readAsText(file);
      } else {
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          resolve({ type: 'url', value: dataUrl });
        };
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      }
    });
  }
}

export const iconManager = new IconManagerService();

// React hook for consuming and reacting to icon changes
export function useSiteIcon(id: string): SiteIconConfig {
  const [icon, setIcon] = React.useState<SiteIconConfig>(() => iconManager.get(id));

  React.useEffect(() => {
    const unsubscribe = iconManager.subscribe(() => {
      setIcon(iconManager.get(id));
    });

    const handleStorageEvent = () => {
      setIcon(iconManager.get(id));
    };

    window.addEventListener(LISTEN_EVENT, handleStorageEvent);
    return () => {
      unsubscribe();
      window.removeEventListener(LISTEN_EVENT, handleStorageEvent);
    };
  }, [id]);

  return icon;
}

export function useAllSiteIcons(): Record<string, SiteIconConfig> {
  const [icons, setIcons] = React.useState<Record<string, SiteIconConfig>>(() => iconManager.getAll());

  React.useEffect(() => {
    const unsubscribe = iconManager.subscribe(() => {
      setIcons(iconManager.getAll());
    });

    const handleStorageEvent = () => {
      setIcons(iconManager.getAll());
    };

    window.addEventListener(LISTEN_EVENT, handleStorageEvent);
    return () => {
      unsubscribe();
      window.removeEventListener(LISTEN_EVENT, handleStorageEvent);
    };
  }, []);

  return icons;
}
