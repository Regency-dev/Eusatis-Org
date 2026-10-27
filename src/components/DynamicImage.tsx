import React, { useState } from 'react';
import { useSiteImage } from '../lib/imageManager';

interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  id: string;
  fallbackSrc?: string;
  containerClassName?: string;
}

export const DynamicImage: React.FC<DynamicImageProps> = ({
  id,
  fallbackSrc,
  alt: customAlt,
  className = '',
  containerClassName,
  style,
  ...props
}) => {
  const { url, alt: configAlt } = useSiteImage(id, fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const rawSrc = hasError && fallbackSrc ? fallbackSrc : url;
  const finalSrc = rawSrc && rawSrc.startsWith('/src/assets/')
    ? rawSrc.replace('/src/assets/', '/assets/')
    : rawSrc;
  const finalAlt = customAlt || configAlt || 'Eusatis Brand Visual';

  const imgElement = (
    <img
      src={finalSrc}
      alt={finalAlt}
      className={className}
      onError={(e) => {
        if (!hasError && fallbackSrc) {
          setHasError(true);
        } else if (finalSrc.startsWith('/assets/')) {
          // Fallback attempt to public/src/assets/ if server has mirrored path
          e.currentTarget.src = finalSrc.replace('/assets/', '/src/assets/');
        }
      }}
      referrerPolicy="no-referrer"
      style={style}
      {...props}
    />
  );

  if (containerClassName) {
    return <div className={containerClassName}>{imgElement}</div>;
  }

  return imgElement;
};
