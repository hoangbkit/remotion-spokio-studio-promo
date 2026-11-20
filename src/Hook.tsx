import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, HOOK_LINES} from "./config";
import {useLayout} from "./layout";
import {Mascot} from "./Mascot";
import {Pop, Sparkle} from "./ui";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {isLandscape, isSquare, isPortrait, safeTop, safeBottom, safeX} = useLayout();
  const m = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 120}});
  const s1 = spring({frame: frame - 18, fps, config: {damping: 10, stiffness: 160}});
  const s2 = spring({frame: frame - 28, fps, config: {damping: 10, stiffness: 160}});
  const underlineW = interpolate(frame, [66, 82], [0, 100], clamp);
  const lineColors = [COLORS.ink, COLORS.teal, COLORS.coral];

  const mascotSize = isLandscape ? 510 : isPortrait ? 410 : 280;

  const mascotBlock = (
    <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
      {/* Twinkling sparkles around mascot */}
      <div
        style={{
          position: "absolute",
          left: -mascotSize * 0.04,
          top: mascotSize * 0.08,
          transform: `scale(${s1}) rotate(${frame * 1.2}deg)`,
        }}
      >
        <Sparkle size={isSquare ? 34 : 46} color={COLORS.mustard} />
      </div>
      <div
        style={{
          position: "absolute",
          right: -mascotSize * 0.04,
          top: mascotSize * 0.16,
          transform: `scale(${s2}) rotate(${-frame * 1.4}deg)`,
        }}
      >
        <Sparkle size={isSquare ? 28 : 38} color={COLORS.coral} />
      </div>

      <div
        style={{
          transform: `scale(${m}) rotate(${(1 - m) * -20}deg)`,
          transformOrigin: "50% 85%",
        }}
      >
        <Mascot size={mascotSize} />
      </div>
      {/* Soft ground shadow ellipse */}
      <div
        style={{
          width: mascotSize * 0.56,
          height: mascotSize * 0.065,
          borderRadius: "50%",
          background: COLORS.ink,
          opacity: 0.14 * m,
          marginTop: -mascotSize * 0.03,
          transform: `scaleX(${0.92 + 0.08 * Math.sin(frame / 12)})`,
        }}
      />
    </div>
  );

  const badge = (
    <Pop at={90} origin={isLandscape ? "0% 50%" : "50% 50%"} style={{marginTop: isLandscape ? 38 : isPortrait ? 52 : 30}}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          background: COLORS.ink,
          color: COLORS.cream,
          fontSize: isLandscape ? 44 : isPortrait ? 44 : 38,
          fontWeight: 600,
          padding: isSquare ? "10px 34px" : "12px 38px",
          borderRadius: 999,
          border: `5px solid ${COLORS.ink}`,
          boxShadow: `8px 8px 0 ${COLORS.mustard}`,
        }}
      >
        <span
          style={{
            width: isSquare ? 16 : 20,
            height: isSquare ? 16 : 20,
            borderRadius: "50%",
            background: COLORS.teal,
            display: "inline-block",
          }}
        />
        Spokio Studio
      </span>
    </Pop>
  );

  if (isLandscape) {
    return (
      <AbsoluteFill>
        <div style={{position: "absolute", left: 195, top: 225}}>{mascotBlock}</div>
        <div
          style={{
            position: "absolute",
            left: 840,
            top: 235,
            width: 980,
            fontWeight: 800,
            fontSize: 130,
            lineHeight: 1.05,
          }}
        >
          {HOOK_LINES.map((line, i) => (
            <Pop key={line} at={30 + i * 15} style={{color: lineColors[i % lineColors.length]}}>
              {line}
            </Pop>
          ))}
          {badge}
        </div>
      </AbsoluteFill>
    );
  }

  // Centered editorial poster layout for 1:1 (square) and 9:16 (portrait)
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${safeTop}px ${safeX}px ${safeBottom}px`,
        boxSizing: "border-box",
      }}
    >
      {mascotBlock}

      <div
        style={{
          marginTop: isPortrait ? 48 : 22,
          fontWeight: 800,
          fontSize: isPortrait ? 104 : 92,
          lineHeight: 1.05,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {HOOK_LINES.map((line, i) => {
          const isLast = i === HOOK_LINES.length - 1;
          return (
            <Pop
              key={line}
              at={30 + i * 15}
              origin="50% 50%"
              style={{
                color: lineColors[i % lineColors.length],
                position: "relative",
                display: "inline-block",
              }}
            >
              <span>{line}</span>
              {isLast && (
                <div
                  style={{
                    height: isPortrait ? 12 : 10,
                    width: `${underlineW}%`,
                    background: COLORS.mustard,
                    borderRadius: 999,
                    margin: "4px auto 0",
                  }}
                />
              )}
            </Pop>
          );
        })}
        {badge}
      </div>
    </AbsoluteFill>
  );
};
