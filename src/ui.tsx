import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS} from "./config";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Cream dotted background with a few slow-moving shapes (uses global frame).
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 60;
  return (
    <AbsoluteFill style={{background: COLORS.cream}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.creamDark} 3px, transparent 3px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 90 + Math.sin(frame / 25) * 14,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: COLORS.coral,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 110,
          bottom: 100 + Math.cos(frame / 30) * 14,
          width: 80,
          height: 80,
          background: COLORS.mustard,
          borderRadius: 18,
          transform: `rotate(${frame * 0.6}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 190,
          top: 80 + Math.sin(frame / 20 + 2) * 10,
          width: 70,
          height: 70,
          borderRadius: "50%",
          border: `12px solid ${COLORS.teal}`,
          boxSizing: "border-box",
        }}
      />
    </AbsoluteFill>
  );
};

// Springs a block in (slide up + scale) at a local frame.
export const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
  const opacity = interpolate(frame - at, [0, 4], [0, 1], clamp);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`,
        transformOrigin: "0% 50%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Full-screen slab that slides across at a scene boundary.
export const Wipe: React.FC<{at: number; color: string; lag?: number}> = ({at, color, lag = 0}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const p = (frame - (at - 9 + lag)) / 18;
  if (p <= 0 || p >= 1) return null;
  const x =
    p < 0.5
      ? -width * (1 - Easing.out(Easing.cubic)(p * 2))
      : width * Easing.in(Easing.cubic)((p - 0.5) * 2);
  return <AbsoluteFill style={{transform: `translateX(${x}px)`, background: color}} />;
};

export const XGlyph: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill={COLORS.ink} />
    <path d="M30 28 L70 72 M70 28 L30 72" stroke={COLORS.cream} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const Arrow: React.FC<{size?: number}> = ({size = 70}) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 70 42">
    <path
      d="M4 21 H56 M42 6 L58 21 L42 36"
      fill="none"
      stroke={COLORS.ink}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
