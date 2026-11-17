import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, HOOK_LINES} from "./config";
import {Mascot} from "./Mascot";
import {Pop} from "./ui";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = spring({frame: frame - 6, fps, config: {damping: 9, stiffness: 120}});
  const lineColors = [COLORS.ink, COLORS.teal, COLORS.coral];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 230,
          transform: `scale(${m}) rotate(${(1 - m) * -20}deg)`,
          transformOrigin: "50% 85%",
        }}
      >
        <Mascot size={540} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 850,
          top: 250,
          width: 1000,
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 1.05,
        }}
      >
        {HOOK_LINES.map((line, i) => (
          <Pop key={line} at={30 + i * 15} style={{color: lineColors[i % lineColors.length]}}>
            {line}
          </Pop>
        ))}
        <Pop at={90} style={{marginTop: 36}}>
          <span
            style={{
              display: "inline-block",
              background: COLORS.ink,
              color: COLORS.cream,
              fontSize: 44,
              fontWeight: 600,
              padding: "10px 34px",
              borderRadius: 999,
            }}
          >
            Spokio Studio
          </span>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
