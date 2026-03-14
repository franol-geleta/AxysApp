import React from 'react';
import Svg, { Path, Rect, G } from 'react-native-svg';

interface FaceIdIconProps {
  size?: number;
  color?: string;
}

export const FaceIdIcon: React.FC<FaceIdIconProps> = ({
  size = 80,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Corner brackets */}
      {/* Top-left */}
      <Path
        d="M4 20V12C4 7.58172 7.58172 4 12 4H20"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Top-right */}
      <Path
        d="M60 4H68C72.4183 4 76 7.58172 76 12V20"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Bottom-left */}
      <Path
        d="M4 60V68C4 72.4183 7.58172 76 12 76H20"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Bottom-right */}
      <Path
        d="M60 76H68C72.4183 76 76 72.4183 76 68V60"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Face elements */}
      {/* Left eye */}
      <Path
        d="M26 28V36"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Right eye */}
      <Path
        d="M54 28V36"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Nose */}
      <Path
        d="M40 36V46"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Mouth - smile */}
      <Path
        d="M28 52C28 52 32 58 40 58C48 58 52 52 52 52"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
};
