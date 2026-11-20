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
import {useLayout} from "./layout";

export const STEP = 60; // frames per app (4 beats)
const TRANS = 18; // slide time between apps
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

type CardMetrics = {
  width: number;
  height: number;
  iconSize: number;
  iconRadius: number;
  nameSize: number;
  taglineSize: number;
  radius: number;
  barHeight: number;
  padTop: number;
};

const Card: React.FC<{app: AppInfo; index: number; metrics: CardMetrics}> = ({app, index, metrics}) => {
  const num = String(index + 1).padStart(2, "0");
  const badgeFg = app.color === COLORS.mustard ? COLORS.ink : COLORS.cream;

  return (
    <div
      style={{
        width: metrics.width,
        height: metrics.height,
        background: COLORS.paper,
        border: `8px solid ${COLORS.ink}`,
        borderRadius: metrics.radius,
        boxShadow: `14px 14px 0 ${COLORS.ink}`,
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Signature brand-color top bar */}
      <div
        style={{
          width: "100%",
          height: metrics.barHeight,
          background: app.color,
          borderBottom: `6px solid ${COLORS.ink}`,
          flexShrink: 0,
        }}
      />

      {/* App index pill */}
      <div
        style={{
          position: "absolute",
          top: metrics.barHeight + 22,
          right: 26,
          background: app.color,
          color: badgeFg,
          fontSize: 24,
          fontWeight: 800,
          padding: "4px 16px",
          borderRadius: 999,
          border: `4px solid ${COLORS.ink}`,
        }}
      >
        #{num}
      </div>

      {/* Framed icon squircle */}
      <div
        style={{
          marginTop: metrics.padTop,
          width: metrics.iconSize,
          height: metrics.iconSize,
          borderRadius: metrics.iconRadius,
          background: app.icon ? COLORS.paper : app.color,
          border: `6px solid ${COLORS.ink}`,
          boxShadow: `8px 8px 0 ${COLORS.ink}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: badgeFg,
          fontSize: Math.round(metrics.iconSize * 0.6),
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {app.icon ? (
          <Img src={staticFile(app.icon)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        ) : (
          app.name.charAt(0)
        )}
      </div>

      <div
        style={{
          marginTop: Math.round(metrics.height * 0.055),
          fontSize: metrics.nameSize,
          fontWeight: 800,
          color: COLORS.ink,
          textAlign: "center",
          lineHeight: 1.05,
          padding: "0 24px",
        }}
      >
        {app.name}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: metrics.taglineSize,
          fontWeight: 600,
          color: COLORS.ink,
          opacity: 0.72,
          textAlign: "center",
          padding: "0 36px",
          lineHeight: 1.18,
        }}
      >
        {app.tagline ?? "by Spokio Studio"}
      </div>
    </div>
  );
};

export const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {width, isLandscape, isSquare, isPortrait} = useLayout();

  const s = Math.min(APPS.length - 1, Math.floor(frame / STEP));
  const local = frame - s * STEP;
  const p = s === 0 ? 0 : s - 1 + Easing.out(Easing.cubic)(Math.min(1, local / TRANS));
  const intro = spring({frame: frame - 8, fps, config: {damping: 12, stiffness: 140}});

  // Tactile micro-pop synced to the landing SFX on each card
  const landAt = s === 0 ? 8 : 14;
  const landPop =
    local >= landAt ? 1 + 0.045 * Math.exp(-((local - landAt) / 4.5)) * Math.sin(((local - landAt) / 2.2)) : 1;

  const metrics: CardMetrics = isPortrait
    ? {
        width: 740,
        height: 820,
        iconSize: 330,
        iconRadius: 72,
        nameSize: 82,
        taglineSize: 38,
        radius: 62,
        barHeight: 28,
        padTop: 48,
      }
    : isSquare
      ? {
          width: 570,
          height: 625,
          iconSize: 246,
          iconRadius: 56,
          nameSize: 66,
          taglineSize: 30,
          radius: 52,
          barHeight: 22,
          padTop: 38,
        }
      : {
          width: 520,
          height: 650,
          iconSize: 256,
          iconRadius: 58,
          nameSize: 66,
          taglineSize: 30,
          radius: 56,
          barHeight: 22,
          padTop: 40,
        };

  const spacing = isPortrait ? 760 : isSquare ? 630 : 640;
  const cardTop = isPortrait ? 305 : isSquare ? 225 : 205;
  const activeColor = APPS[s].color;

  return (
    <AbsoluteFill>
      {/* Ambient aura tinted with the active app's color */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - (isPortrait ? 420 : 380),
          top: cardTop + metrics.height / 2 - (isPortrait ? 420 : 380),
          width: isPortrait ? 840 : 760,
          height: isPortrait ? 840 : 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeColor}2E 0%, transparent 68%)`,
          transform: `scale(${landPop})`,
        }}
      />

      {/* Top header pill + counter */}
      <div
        style={{
          position: "absolute",
          top: isPortrait ? 176 : isSquare ? 52 : 58,
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
            fontSize: isSquare ? 38 : 44,
            fontWeight: 800,
            padding: "8px 34px",
            borderRadius: 999,
            boxShadow: `6px 6px 0 ${COLORS.mustard}`,
          }}
        >
          The lineup
        </span>
        <span style={{fontSize: isSquare ? 38 : 44, fontWeight: 800, color: COLORS.ink}}>
          {s + 1} of {APPS.length}
        </span>
      </div>

      {/* Carousel cards */}
      {APPS.map((app, k) => {
        const d = k - p;
        const ad = Math.abs(d);
        if (ad > (isLandscape ? 2.2 : 1.7)) return null;
        const baseScale = interpolate(ad, [0, 1, 2], [1, 0.75, 0.55], clamp);
        const scale = baseScale * (k === 0 ? 0.6 + 0.4 * intro : 1) * (k === s ? landPop : 1);
        const opacity = interpolate(ad, [0, 1, 1.85], [1, 0.58, 0], clamp);
        const tilt = isPortrait ? d * 5.5 : d * 4;
        return (
          <div
            key={app.name}
            style={{
              position: "absolute",
              left: width / 2 + d * spacing - metrics.width / 2,
              top: cardTop,
              opacity,
              zIndex: 10 - Math.round(ad * 3),
              transform: `scale(${scale}) rotate(${tilt}deg)`,
            }}
          >
            <Card app={app} index={k} metrics={metrics} />
          </div>
        );
      })}

      {/* 9:16 Live 2x5 App Icon Dock — fills vertical space & spotlights the full 10-app suite */}
      {isPortrait && (
        <div
          style={{
            position: "absolute",
            top: 1190,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 92px)",
              gap: 24,
              padding: "24px 30px",
              background: `${COLORS.paper}E8`,
              border: `6px solid ${COLORS.ink}`,
              borderRadius: 40,
              boxShadow: `10px 10px 0 ${COLORS.ink}`,
            }}
          >
            {APPS.map((app, i) => {
              const isActive = i === s;
              const isSeen = i < s;
              const badgeFg = app.color === COLORS.mustard ? COLORS.ink : COLORS.cream;
              return (
                <div
                  key={app.name}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 24,
                    overflow: "hidden",
                    background: app.icon ? COLORS.paper : app.color,
                    border: isActive ? `5px solid ${COLORS.ink}` : `3px solid ${COLORS.ink}`,
                    boxShadow: isActive ? `0 0 0 5px ${app.color}, 6px 6px 0 ${COLORS.ink}` : "none",
                    transform: `scale(${isActive ? 1.14 * landPop : isSeen ? 1 : 0.92})`,
                    opacity: isActive ? 1 : isSeen ? 0.85 : 0.35,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: badgeFg,
                    fontSize: 44,
                    fontWeight: 800,
                    boxSizing: "border-box",
                  }}
                >
                  {app.icon ? (
                    <Img src={staticFile(app.icon)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                  ) : (
                    app.name.charAt(0)
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: isPortrait ? 390 : isSquare ? 52 : 58,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: isSquare ? 14 : 18,
        }}
      >
        {APPS.map((app, i) => (
          <div
            key={app.name}
            style={{
              width: i === s ? (isSquare ? 48 : 56) : isSquare ? 18 : 22,
              height: isSquare ? 18 : 22,
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
