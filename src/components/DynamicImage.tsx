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

  const finalSrc = hasError && fallbackSrc ? fallbackSrc : url;
  const finalAlt = customAlt || configAlt || 'Eusatis Brand Visual';

  const imgElement = (
    <img
      src={finalSrc}
      alt={finalAlt}
      className={className}
      onError={() => {
        if (!hasError) setHasError(true);
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
