import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {BEAT, COLORS} from "./config";
import {useLayout} from "./layout";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// 4-point neo-brutalist sparkle star.
export const Sparkle: React.FC<{
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({size = 38, color = COLORS.mustard, style}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{overflow: "visible", ...style}}>
    <path
      d="M32 4 C35 22 42 29 60 32 C42 35 35 42 32 60 C29 42 22 35 4 32 C22 29 29 22 32 4 Z"
      fill={color}
      stroke={COLORS.ink}
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Cream dotted background with beat-reactive floating shapes adapted per aspect ratio.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {isPortrait, isSquare} = useLayout();
  const dotSpacing = isSquare ? 52 : isPortrait ? 56 : 60;
  const drift = (frame * 0.4) % dotSpacing;
  const beatBump = 1 + 0.06 * Math.exp(-((frame % BEAT) / 3.5));

  const circleSize = isSquare ? 68 : isPortrait ? 82 : 90;
  const sqSize = isSquare ? 62 : isPortrait ? 76 : 80;
  const ringSize = isSquare ? 58 : isPortrait ? 68 : 70;

  return (
    <AbsoluteFill style={{background: COLORS.cream, overflow: "hidden"}}>
      {/* Subtle warm ambient corner washes */}
      <div
        style={{
          position: "absolute",
          left: isPortrait ? -180 : -140,
          top: isPortrait ? 80 : -120,
          width: isSquare ? 520 : 680,
          height: isSquare ? 520 : 680,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.teal}20 0%, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: isPortrait ? -180 : -140,
          bottom: isPortrait ? 120 : -120,
          width: isSquare ? 520 : 680,
          height: isSquare ? 520 : 680,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.mustard}28 0%, transparent 68%)`,
        }}
      />

      {/* Drifting dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.creamDark} 3px, transparent 3px)`,
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />

      {/* Top-left coral orb */}
      <div
        style={{
          position: "absolute",
          left: isPortrait ? 52 : isSquare ? 42 : 70,
          top: (isPortrait ? 92 : isSquare ? 46 : 90) + Math.sin(frame / 25) * 14,
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          background: COLORS.coral,
          border: `5px solid ${COLORS.ink}`,
          boxSizing: "border-box",
          opacity: 0.92,
          transform: `scale(${beatBump})`,
        }}
      />

      {/* Bottom-right rotating mustard squircle */}
      <div
        style={{
          position: "absolute",
          right: isPortrait ? 60 : isSquare ? 46 : 110,
          bottom: (isPortrait ? 130 : isSquare ? 52 : 100) + Math.cos(frame / 30) * 14,
          width: sqSize,
          height: sqSize,
          background: COLORS.mustard,
          border: `5px solid ${COLORS.ink}`,
          boxSizing: "border-box",
          borderRadius: 18,
          transform: `rotate(${frame * 0.6}deg) scale(${beatBump})`,
        }}
      />

      {/* Top-right teal ring */}
      <div
        style={{
          position: "absolute",
          right: isPortrait ? 72 : isSquare ? 52 : 190,
          top: (isPortrait ? 120 : isSquare ? 54 : 80) + Math.sin(frame / 20 + 2) * 10,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `11px solid ${COLORS.teal}`,
          boxSizing: "border-box",
        }}
      />

      {/* Bottom-left accent pill/sparkle (balances tall 9:16 and tight 1:1 corners) */}
      <div
        style={{
          position: "absolute",
          left: isPortrait ? 68 : isSquare ? 50 : 96,
          bottom: (isPortrait ? 160 : isSquare ? 56 : 86) + Math.sin(frame / 22 + 1) * 10,
          transform: `rotate(${-frame * 0.8}deg) scale(${beatBump})`,
        }}
      >
        <Sparkle size={isPortrait ? 52 : 40} color={COLORS.teal} />
      </div>

      {/* Extra mid-edge pill accents for tall 9:16 canvas */}
      {isPortrait && (
        <>
          <div
            style={{
              position: "absolute",
              left: -26,
              top: 860 + Math.sin(frame / 28) * 18,
              width: 58,
              height: 112,
              borderRadius: 999,
              background: COLORS.mustard,
              border: `5px solid ${COLORS.ink}`,
              opacity: 0.75,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -24,
              top: 1160 + Math.cos(frame / 26) * 18,
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: COLORS.coral,
              border: `5px solid ${COLORS.ink}`,
              opacity: 0.75,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

// Springs a block in (slide up + scale) at a local frame.
export const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  origin?: string;
  distance?: number;
}> = ({at, children, style, origin = "0% 50%", distance = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
  const opacity = interpolate(frame - at, [0, 4], [0, 1], clamp);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - s) * distance}px) scale(${0.85 + 0.15 * s})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Full-screen slab that slides horizontally (16:9, 1:1) or vertically (9:16) at scene boundaries.
export const Wipe: React.FC<{at: number; color: string; lag?: number}> = ({at, color, lag = 0}) => {
  const frame = useCurrentFrame();
  const {width, height, isPortrait} = useLayout();
  const p = (frame - (at - 9 + lag)) / 18;
  if (p <= 0 || p >= 1) return null;

  if (isPortrait) {
    // Bottom-to-top swipe for native vertical short-form energy
    const y =
      p < 0.5
        ? height * (1 - Easing.out(Easing.cubic)(p * 2))
        : -height * Easing.in(Easing.cubic)((p - 0.5) * 2);
    return (
      <AbsoluteFill
        style={{
          transform: `translateY(${y}px)`,
          background: color,
          borderTop: `8px solid ${COLORS.ink}`,
          borderBottom: `8px solid ${COLORS.ink}`,
          boxSizing: "border-box",
        }}
      />
    );
  }

  const x =
    p < 0.5
      ? -width * (1 - Easing.out(Easing.cubic)(p * 2))
      : width * Easing.in(Easing.cubic)((p - 0.5) * 2);
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px)`,
        background: color,
        borderLeft: `8px solid ${COLORS.ink}`,
        borderRight: `8px solid ${COLORS.ink}`,
        boxSizing: "border-box",
      }}
    />
  );
};

export const XGlyph: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill={COLORS.ink} />
    <path d="M30 28 L70 72 M70 28 L30 72" stroke={COLORS.cream} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const Arrow: React.FC<{size?: number; rotate?: number; color?: string}> = ({
  size = 70,
  rotate = 0,
  color = COLORS.ink,
}) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 70 42"
    style={{transform: rotate ? `rotate(${rotate}deg)` : undefined, display: "block"}}
  >
    <path
      d="M4 21 H56 M42 6 L58 21 L42 36"
      fill="none"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
