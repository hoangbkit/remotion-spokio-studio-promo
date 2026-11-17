import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, SITE, X_HANDLE} from "./config";
import {Mascot} from "./Mascot";
import {Pop, XGlyph} from "./ui";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = spring({frame, fps, config: {damping: 9, stiffness: 120}});

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 230,
          transform: `scale(${m})`,
          transformOrigin: "50% 85%",
        }}
      >
        <Mascot size={520} wave />
      </div>
      <div style={{position: "absolute", left: 850, top: 260, width: 1000}}>
        <Pop at={0} style={{fontSize: 128, fontWeight: 800, color: COLORS.ink, lineHeight: 1.05}}>
          Follow along.
        </Pop>
        <Pop at={20} style={{marginTop: 40}}>
          <span
            style={{
              display: "inline-block",
              background: COLORS.teal,
              color: COLORS.cream,
              fontSize: 80,
              fontWeight: 800,
              padding: "14px 46px",
              borderRadius: 999,
              border: `6px solid ${COLORS.ink}`,
              boxShadow: `10px 10px 0 ${COLORS.ink}`,
            }}
          >
            {SITE}
          </span>
        </Pop>
        <Pop at={45} style={{marginTop: 54, display: "flex", alignItems: "center", gap: 22}}>
          <XGlyph size={76} />
          <span style={{fontSize: 58, fontWeight: 800, color: COLORS.ink}}>
            {X_HANDLE ? `Follow ${X_HANDLE} on X` : "Follow on X"}
          </span>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
