import * as React from 'react';

import VerifyGlyph from '@/assets/icons/verify.svg';

export type VerifiedIconProps = {
  color: string;
  size?: number;
  accessibilityLabel?: string;
};

export const VerifiedIcon = React.memo(function VerifiedIcon({
  color,
  size = 20,
  accessibilityLabel = 'Verified',
}: VerifiedIconProps) {
  return (
    <VerifyGlyph
      width={size}
      height={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
});
VerifiedIcon.displayName = 'VerifiedIcon';
