import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useSiteIcon, sanitizeAndFitSvg, DEFAULT_SITE_ICONS } from '../lib/iconManager';

interface DynamicIconProps {
  id: string;
  className?: string;
  size?: number | string;
  fallback?: React.ReactNode;
}

/**
 * High-performance DynamicIcon component.
 * Automatically enforces the design system's default sizing, aspect-ratio,
 * and container box fitting for editable icons across Hero sections,
 * The Eusatis Experience pillars, contact channels, and academic subjects.
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  id,
  className = '',
  size,
  fallback
}) => {
  const config = useSiteIcon(id);
  const defaultDimensions = config.defaultDimensions || DEFAULT_SITE_ICONS[id]?.defaultDimensions;
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    setImgFailed(false);
  }, [config.value, config.type]);

  // Determine sizing: if caller provided w- or h- in className, respect it;
  // otherwise, automatically lock to the design system's canonical default size.
  const hasWidth = /\bw-[0-9.]+/.test(className);
  const hasHeight = /\bh-[0-9.]+/.test(className);
  const fallbackSizeClass = defaultDimensions?.className || 'w-5 h-5';
  
  const sizeClass = (!hasWidth || !hasHeight) ? fallbackSizeClass : '';
  const resolvedPixelSize = size || defaultDimensions?.pixelSize || 20;

  const styleOverride = typeof resolvedPixelSize === 'number'
    ? undefined
    : undefined;

  // 1. If custom SVG code
  if (config.type === 'svg' && config.value && config.value.includes('<svg')) {
    const sanitized = sanitizeAndFitSvg(config.value);
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden relative select-none pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block [&>svg]:object-contain ${sizeClass} ${className}`}
        style={styleOverride}
        dangerouslySetInnerHTML={{ __html: sanitized }}
        aria-hidden="true"
      />
    );
  }

  // 2. If Image URL or uploaded graphic asset (with resilient local and Lucide fallback)
  if (config.type === 'url' && config.value && !imgFailed) {
    let localMirrorUrl = '';
    if (id.includes('mind')) localMirrorUrl = '/assets/icons/eusatis_mind.png';
    else if (id === 'hero_talks' || id === 'arm_talks') localMirrorUrl = '/assets/icons/beautiful_talks.png';
    else if (id === 'pillar_talks' || id === 'talks_recommend_guest') localMirrorUrl = '/assets/icons/podcast_1.png';
    else if (id.includes('impact')) localMirrorUrl = '/assets/icons/eusatis_impact.png';
    else if (id === 'badge_emblem') localMirrorUrl = '/assets/icons/sparkles.png';

    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden relative select-none pointer-events-none ${sizeClass} ${className}`}
        style={styleOverride}
        aria-hidden="true"
      >
        <img
          src={config.value}
          alt={config.label}
          className="w-full h-full max-w-full max-h-full object-contain object-center block shrink-0"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (localMirrorUrl && target.src !== window.location.origin + localMirrorUrl && !target.src.endsWith(localMirrorUrl)) {
              target.src = localMirrorUrl;
            } else {
              setImgFailed(true);
            }
          }}
        />
      </span>
    );
  }

  // 3. Lucide icon name resolution (used as high-fidelity fallback or explicit icon choice)
  const iconName = config.type === 'lucide' && config.value ? config.value : (config.fallbackLucide || 'Sparkles');
  const IconComponent = (LucideIcons as Record<string, any>)[iconName] ||
    (LucideIcons as Record<string, any>)[config.fallbackLucide] ||
    LucideIcons.Sparkles;

  if (IconComponent) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden relative select-none pointer-events-none ${sizeClass} ${className}`}
        style={styleOverride}
        aria-hidden="true"
      >
        <IconComponent
          className="w-full h-full max-w-full max-h-full block shrink-0"
          size={typeof resolvedPixelSize === 'number' ? resolvedPixelSize : 24}
          aria-hidden="true"
        />
      </span>
    );
  }

  if (fallback) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden relative ${sizeClass} ${className}`}
        aria-hidden="true"
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden relative ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <LucideIcons.Sparkles className="w-full h-full max-w-full max-h-full block shrink-0" aria-hidden="true" />
    </span>
  );
};

interface DynamicIconBoxProps {
  id: string;
  iconClassName?: string;
  boxClassName?: string;
  onClick?: () => void;
}

/**
 * Automated Container Box that pairs an editable icon with its exact
 * architectural box dimensions (e.g. Hero action button badge, Experience Pillar box).
 */
export const DynamicIconBox: React.FC<DynamicIconBoxProps> = ({
  id,
  iconClassName = '',
  boxClassName = '',
  onClick
}) => {
  const config = useSiteIcon(id);
  const defaultDim = config.defaultDimensions || DEFAULT_SITE_ICONS[id]?.defaultDimensions;
  const canonicalBoxClass = defaultDim?.boxClassName || 'w-10 h-10 rounded-xl bg-slate-100';

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center shrink-0 overflow-hidden relative transition-all ${canonicalBoxClass} ${boxClassName}`}
    >
      <DynamicIcon id={id} className={iconClassName} />
    </div>
  );
};
