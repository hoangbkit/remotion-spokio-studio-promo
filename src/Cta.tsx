import React from "react";
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {APPS, COLORS, SITE, X_HANDLE} from "./config";
import {useLayout} from "./layout";
import {Mascot} from "./Mascot";
import {Pop, Sparkle, XGlyph} from "./ui";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {isLandscape, isSquare, isPortrait, safeTop, safeBottom, safeX} = useLayout();
  const m = spring({frame, fps, config: {damping: 9, stiffness: 120}});
  const s1 = spring({frame: frame - 14, fps, config: {damping: 10, stiffness: 160}});
  const s2 = spring({frame: frame - 24, fps, config: {damping: 10, stiffness: 160}});

  // Glossy diagonal sheen sweeps across the CTA pill twice
  const sheen1 = interpolate(frame, [34, 58], [-35, 135], clamp);
  const sheen2 = interpolate(frame, [106, 130], [-35, 135], clamp);
  const sheenX = frame < 82 ? sheen1 : sheen2;
  const sheenVisible = (frame >= 34 && frame <= 58) || (frame >= 106 && frame <= 130);

  const mascotSize = isLandscape ? 500 : isPortrait ? 390 : 270;

  const mascotBlock = (
    <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div
        style={{
          position: "absolute",
          left: -mascotSize * 0.03,
          top: mascotSize * 0.06,
          transform: `scale(${s1}) rotate(${frame * 1.4}deg)`,
        }}
      >
        <Sparkle size={isSquare ? 34 : 44} color={COLORS.mustard} />
      </div>
      <div
        style={{
          position: "absolute",
          right: -mascotSize * 0.05,
          top: mascotSize * 0.14,
          transform: `scale(${s2}) rotate(${-frame * 1.2}deg)`,
        }}
      >
        <Sparkle size={isSquare ? 28 : 38} color={COLORS.teal} />
      </div>
      <div style={{transform: `scale(${m})`, transformOrigin: "50% 85%"}}>
        <Mascot size={mascotSize} wave />
      </div>
      <div
        style={{
          width: mascotSize * 0.56,
          height: mascotSize * 0.065,
          borderRadius: "50%",
          background: COLORS.ink,
          opacity: 0.14 * m,
          marginTop: -mascotSize * 0.03,
        }}
      />
    </div>
  );

  const sitePill = (
    <Pop at={20} origin={isLandscape ? "0% 50%" : "50% 50%"} style={{marginTop: isLandscape ? 34 : isPortrait ? 38 : 22}}>
      <span
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
          background: COLORS.teal,
          color: COLORS.cream,
          fontSize: isLandscape ? 78 : isPortrait ? 64 : 60,
          fontWeight: 800,
          padding: isLandscape ? "14px 46px" : isPortrait ? "16px 48px" : "12px 42px",
          borderRadius: 999,
          border: `6px solid ${COLORS.ink}`,
          boxShadow: `10px 10px 0 ${COLORS.ink}`,
        }}
      >
        {SITE}
        {sheenVisible && (
          <span
            style={{
              position: "absolute",
              top: -20,
              bottom: -20,
              left: `${sheenX}%`,
              width: 72,
              background: "rgba(255, 253, 246, 0.35)",
              transform: "skewX(-22deg)",
              pointerEvents: "none",
            }}
          />
        )}
      </span>
    </Pop>
  );

  const xRow = (
    <Pop
      at={45}
      origin={isLandscape ? "0% 50%" : "50% 50%"}
      style={{
        marginTop: isLandscape ? 44 : isPortrait ? 44 : 30,
        display: "flex",
        alignItems: "center",
        justifyContent: isLandscape ? "flex-start" : "center",
        gap: isSquare ? 18 : 22,
      }}
    >
      <XGlyph size={isLandscape ? 72 : isPortrait ? 66 : 56} />
      <span style={{fontSize: isLandscape ? 56 : isPortrait ? 52 : 46, fontWeight: 800, color: COLORS.ink}}>
        {X_HANDLE ? `Follow ${X_HANDLE} on X` : "Follow on X"}
      </span>
    </Pop>
  );

  // Celebratory 10-app icon strip reminding viewers of the full studio lineup
  const iconSize = isPortrait ? 78 : isSquare ? 56 : 54;
  const iconStrip = (
    <div
      style={{
        marginTop: isLandscape ? 46 : isPortrait ? 52 : 36,
        display: isPortrait ? "grid" : "flex",
        gridTemplateColumns: isPortrait ? `repeat(5, ${iconSize}px)` : undefined,
        gap: isPortrait ? 20 : 14,
        alignItems: "center",
        justifyContent: isLandscape ? "flex-start" : "center",
      }}
    >
      {APPS.map((app, i) => {
        const p = spring({frame: frame - (58 + i * 2), fps, config: {damping: 12, stiffness: 180}});
        const badgeFg = app.color === COLORS.mustard ? COLORS.ink : COLORS.cream;
        return (
          <div
            key={app.name}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: Math.round(iconSize * 0.25),
              overflow: "hidden",
              background: app.icon ? COLORS.paper : app.color,
              border: `4px solid ${COLORS.ink}`,
              boxShadow: `4px 4px 0 ${COLORS.ink}`,
              transform: `scale(${p})`,
              opacity: p,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: badgeFg,
              fontSize: Math.round(iconSize * 0.5),
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
  );

  if (isLandscape) {
    return (
      <AbsoluteFill>
        <div style={{position: "absolute", left: 185, top: 245}}>{mascotBlock}</div>
        <div style={{position: "absolute", left: 830, top: 235, width: 990}}>
          <Pop at={0} style={{fontSize: 124, fontWeight: 800, color: COLORS.ink, lineHeight: 1.05}}>
            Follow along.
          </Pop>
          {sitePill}
          {xRow}
          {iconStrip}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${safeTop}px ${safeX}px ${safeBottom}px`,
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {mascotBlock}
      <Pop
        at={0}
        origin="50% 50%"
        style={{
          marginTop: isPortrait ? 32 : 14,
          fontSize: isPortrait ? 100 : 88,
          fontWeight: 800,
          color: COLORS.ink,
          lineHeight: 1.05,
        }}
      >
        Follow along.
      </Pop>
      {sitePill}
      {xRow}
      {iconStrip}
    </AbsoluteFill>
  );
};
