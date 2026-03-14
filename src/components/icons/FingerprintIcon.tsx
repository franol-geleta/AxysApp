import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FingerprintIconProps {
  size?: number;
  color?: string;
}

export const FingerprintIcon: React.FC<FingerprintIconProps> = ({
  size = 80,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Fingerprint pattern - concentric arcs */}
      {/* Innermost */}
      <Path
        d="M40 56C40 56 40 40 40 32"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Second ring */}
      <Path
        d="M34 58C33 50 32 40 34 30C36 22 44 22 46 30C48 38 47 52 46 58"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Third ring */}
      <Path
        d="M28 60C26 48 26 36 28 26C31 16 49 16 52 26C55 36 54 50 52 60"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Fourth ring */}
      <Path
        d="M22 62C19 46 19 32 22 22C26 10 54 10 58 22C61 32 61 48 58 62"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Outer ring */}
      <Path
        d="M16 64C12 44 12 28 16 18C22 4 58 4 64 18C68 28 68 46 64 64"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
};
