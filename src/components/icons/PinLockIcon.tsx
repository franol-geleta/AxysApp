import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

interface PinLockIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const PinLockIcon: React.FC<PinLockIconProps> = ({
  size = 100,
  color = '#FFFFFF',
  backgroundColor = '#1C1C1E'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Background frame */}
      <Rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="8"
        fill={backgroundColor}
        stroke="#3A3A3C"
        strokeWidth={2}
      />

      {/* Inner border */}
      <Rect
        x="16"
        y="16"
        width="68"
        height="68"
        rx="4"
        stroke="#3A3A3C"
        strokeWidth={1}
        fill="none"
      />

      {/* Handle bars at top */}
      <G>
        {/* Left handle */}
        <Path
          d="M30 8V16"
          stroke="#3A3A3C"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Middle handle */}
        <Path
          d="M50 8V16"
          stroke="#3A3A3C"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Right handle */}
        <Path
          d="M70 8V16"
          stroke="#3A3A3C"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </G>

      {/* Pin dots - 2x2 grid */}
      <G>
        {/* Top row */}
        <Circle cx="38" cy="42" r="5" fill={color} opacity={0.8} />
        <Circle cx="62" cy="42" r="5" fill={color} opacity={0.8} />
        {/* Bottom row */}
        <Circle cx="38" cy="66" r="5" fill={color} opacity={0.8} />
        <Circle cx="62" cy="66" r="5" fill={color} opacity={0.8} />
      </G>
    </Svg>
  );
};
