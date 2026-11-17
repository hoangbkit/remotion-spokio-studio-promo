import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {APPS, AppInfo, COLORS} from "./config";

export const STEP = 60; // frames per app (4 beats)
const TRANS = 18; // slide time between apps
const SPACING = 640;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Card: React.FC<{app: AppInfo}> = ({app}) => (
  <div
    style={{
      width: 520,
      height: 640,
      background: COLORS.paper,
      border: `8px solid ${COLORS.ink}`,
      borderRadius: 56,
      boxShadow: `14px 14px 0 ${COLORS.ink}`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 56,
    }}
  >
    <div
      style={{
        width: 280,
        height: 280,
        borderRadius: 60,
        background: app.icon ? undefined : app.color,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: app.color === COLORS.mustard ? COLORS.ink : COLORS.cream,
        fontSize: 170,
        fontWeight: 800,
      }}
    >
      {app.icon ? (
        <Img src={staticFile(app.icon)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
      ) : (
        app.name.charAt(0)
      )}
    </div>
    <div style={{marginTop: 44, fontSize: 70, fontWeight: 800, color: COLORS.ink, textAlign: "center"}}>
      {app.name}
    </div>
    <div
      style={{
        marginTop: 6,
        fontSize: 30,
        fontWeight: 600,
        color: COLORS.ink,
        opacity: 0.7,
        textAlign: "center",
        padding: "0 36px",
        lineHeight: 1.15,
      }}
    >
      {app.tagline ?? "by Spokio Studio"}
    </div>
  </div>
);

export const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(APPS.length - 1, Math.floor(frame / STEP));
  const local = frame - s * STEP;
  const p = s === 0 ? 0 : s - 1 + Easing.out(Easing.cubic)(Math.min(1, local / TRANS));
  const intro = spring({frame: frame - 8, fps, config: {damping: 12, stiffness: 140}});

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 64,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 20,
          alignItems: "center",
        }}
      >
        <span
          style={{
            background: COLORS.ink,
            color: COLORS.cream,
            fontSize: 44,
            fontWeight: 800,
            padding: "8px 36px",
            borderRadius: 999,
          }}
        >
          The lineup
        </span>
        <span style={{fontSize: 44, fontWeight: 800, color: COLORS.ink}}>
          {s + 1} of {APPS.length}
        </span>
      </div>

      {APPS.map((app, k) => {
        const d = k - p;
        const ad = Math.abs(d);
        if (ad > 2.2) return null;
        const scale = interpolate(ad, [0, 1, 2], [1, 0.74, 0.55], clamp) * (k === 0 ? 0.6 + 0.4 * intro : 1);
        const opacity = interpolate(ad, [0, 1, 1.9], [1, 0.6, 0], clamp);
        return (
          <div
            key={app.name}
            style={{
              position: "absolute",
              left: 960 + d * SPACING - 260,
              top: 220,
              opacity,
              zIndex: 10 - Math.round(ad * 3),
              transform: `scale(${scale}) rotate(${d * 4}deg)`,
            }}
          >
            <Card app={app} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: 62,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {APPS.map((app, i) => (
          <div
            key={app.name}
            style={{
              width: i === s ? 56 : 22,
              height: 22,
              borderRadius: 11,
              background: i === s ? COLORS.coral : COLORS.ink,
              opacity: i === s ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
