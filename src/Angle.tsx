import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {COLORS} from "./config";
import {Mascot} from "./Mascot";
import {Arrow, Pop} from "./ui";

const CHIPS = [
  {label: "Prompt", bg: COLORS.teal, fg: COLORS.cream},
  {label: "Build", bg: COLORS.mustard, fg: COLORS.ink},
  {label: "Ship", bg: COLORS.coral, fg: COLORS.cream},
  {label: "Share", bg: COLORS.ink, fg: COLORS.cream},
];
export const CHIP_FRAMES = [120, 150, 180, 210];

export const Angle: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, frame - 240) / 3);
  const mascotIn = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 110, top: 250, opacity: mascotIn}}>
        <Mascot size={400} />
      </div>
      <div style={{position: "absolute", left: 640, top: 130, width: 1180, color: COLORS.ink}}>
        <Pop at={0} style={{fontSize: 118, fontWeight: 800, lineHeight: 1.05}}>
          I build in public.
        </Pop>
        <Pop at={30} style={{fontSize: 80, fontWeight: 800, color: COLORS.teal, marginTop: 26}}>
          Tokenmaxxing:
        </Pop>
        <Pop at={45} style={{fontSize: 56, fontWeight: 600, lineHeight: 1.15}}>
          build apps with heavy AI use
        </Pop>
        <Pop at={75} style={{fontSize: 56, fontWeight: 600, lineHeight: 1.15}}>
          and share everything along the way.
        </Pop>
      </div>

      <div
        style={{
          position: "absolute",
          left: 640,
          top: 650,
          display: "flex",
          alignItems: "center",
          gap: 26,
          transform: `scale(${pulse})`,
          transformOrigin: "0% 50%",
        }}
      >
        {CHIPS.map((c, i) => (
          <React.Fragment key={c.label}>
            <Pop at={CHIP_FRAMES[i]}>
              <div
                style={{
                  background: c.bg,
                  color: c.fg,
                  fontSize: 54,
                  fontWeight: 800,
                  padding: "16px 40px",
                  borderRadius: 999,
                  border: `6px solid ${COLORS.ink}`,
                  boxShadow: `8px 8px 0 ${COLORS.ink}`,
                }}
              >
                {c.label}
              </div>
            </Pop>
            {i < CHIPS.length - 1 && (
              <Pop at={CHIP_FRAMES[i] + 10}>
                <Arrow size={64} />
              </Pop>
            )}
          </React.Fragment>
        ))}
      </div>
      <Pop at={240} style={{position: "absolute", left: 640, top: 830, fontSize: 56, fontWeight: 800, color: COLORS.coral}}>
        Then repeat.
      </Pop>
    </AbsoluteFill>
  );
};
