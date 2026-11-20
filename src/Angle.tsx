import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {COLORS} from "./config";
import {useLayout} from "./layout";
import {Mascot} from "./Mascot";
import {Arrow, Pop} from "./ui";

const CHIPS = [
  {label: "Prompt", bg: COLORS.teal, fg: COLORS.cream},
  {label: "Build", bg: COLORS.mustard, fg: COLORS.ink},
  {label: "Ship", bg: COLORS.coral, fg: COLORS.cream},
  {label: "Share", bg: COLORS.ink, fg: COLORS.cream},
];
export const CHIP_FRAMES = [120, 150, 180, 210];

const ChipBadge: React.FC<{
  label: string;
  bg: string;
  fg: string;
  fontSize: number;
  width?: number;
  height?: number;
  padding?: string;
}> = ({label, bg, fg, fontSize, width, height, padding}) => (
  <div
    style={{
      background: bg,
      color: fg,
      fontSize,
      fontWeight: 800,
      width,
      height,
      padding,
      borderRadius: 999,
      border: `6px solid ${COLORS.ink}`,
      boxShadow: `8px 8px 0 ${COLORS.ink}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
    }}
  >
    {label}
  </div>
);

export const Angle: React.FC = () => {
  const frame = useCurrentFrame();
  const {isLandscape, isPortrait, safeTop, safeBottom, safeX} = useLayout();
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, frame - 240) / 3);
  const mascotIn = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: "clamp"});

  if (isLandscape) {
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
                <ChipBadge label={c.label} bg={c.bg} fg={c.fg} fontSize={54} padding="16px 40px" />
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
  }

  // 2x2 clockwise workflow cycle for 1:1 (square) and 9:16 (portrait):
  // Prompt -> Build
  //   ^        v
  // Share  <- Ship
  const chipW = isPortrait ? 305 : 268;
  const chipH = isPortrait ? 106 : 90;
  const chipFont = isPortrait ? 52 : 44;
  const arrowSize = isPortrait ? 62 : 54;
  const midRowH = isPortrait ? 78 : 62;
  const midColW = isPortrait ? 96 : 82;

  const cycleGrid = (
    <div
      style={{
        marginTop: isPortrait ? 52 : 34,
        display: "grid",
        gridTemplateColumns: `${chipW}px ${midColW}px ${chipW}px`,
        gridTemplateRows: `${chipH}px ${midRowH}px ${chipH}px`,
        alignItems: "center",
        justifyItems: "center",
        transform: `scale(${pulse})`,
        transformOrigin: "50% 50%",
      }}
    >
      {/* Row 1: Prompt -> Build */}
      <Pop at={CHIP_FRAMES[0]} origin="50% 50%">
        <ChipBadge {...CHIPS[0]} fontSize={chipFont} width={chipW} height={chipH} />
      </Pop>
      <Pop at={CHIP_FRAMES[0] + 10} origin="50% 50%">
        <Arrow size={arrowSize} />
      </Pop>
      <Pop at={CHIP_FRAMES[1]} origin="50% 50%">
        <ChipBadge {...CHIPS[1]} fontSize={chipFont} width={chipW} height={chipH} />
      </Pop>

      {/* Row 2: Loop-back Up arrow (at f=240) and Down arrow (Build -> Ship) */}
      <Pop at={240} origin="50% 50%">
        <Arrow size={arrowSize} rotate={-90} color={COLORS.coral} />
      </Pop>
      <div />
      <Pop at={CHIP_FRAMES[1] + 10} origin="50% 50%">
        <Arrow size={arrowSize} rotate={90} />
      </Pop>

      {/* Row 3: Share <- Ship */}
      <Pop at={CHIP_FRAMES[3]} origin="50% 50%">
        <ChipBadge {...CHIPS[3]} fontSize={chipFont} width={chipW} height={chipH} />
      </Pop>
      <Pop at={CHIP_FRAMES[2] + 10} origin="50% 50%">
        <Arrow size={arrowSize} rotate={180} />
      </Pop>
      <Pop at={CHIP_FRAMES[2]} origin="50% 50%">
        <ChipBadge {...CHIPS[2]} fontSize={chipFont} width={chipW} height={chipH} />
      </Pop>
    </div>
  );

  if (isPortrait) {
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `${safeTop}px ${safeX}px ${safeBottom}px`,
          boxSizing: "border-box",
          color: COLORS.ink,
        }}
      >
        <div style={{opacity: mascotIn}}>
          <Mascot size={240} />
        </div>

        <Pop at={0} origin="50% 50%" style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 18, textAlign: "center"}}>
          I build in public.
        </Pop>

        {/* Neo-brutalist Tokenmaxxing definition card */}
        <div
          style={{
            marginTop: 30,
            width: "100%",
            background: COLORS.paper,
            border: `6px solid ${COLORS.ink}`,
            borderRadius: 36,
            boxShadow: `10px 10px 0 ${COLORS.ink}`,
            padding: "26px 32px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Pop at={30} origin="50% 50%" style={{fontSize: 60, fontWeight: 800, color: COLORS.teal, lineHeight: 1.1}}>
            Tokenmaxxing:
          </Pop>
          <Pop at={45} origin="50% 50%" style={{fontSize: 40, fontWeight: 600, lineHeight: 1.2, marginTop: 10}}>
            build apps with heavy AI use
          </Pop>
          <Pop at={75} origin="50% 50%" style={{fontSize: 40, fontWeight: 600, lineHeight: 1.2}}>
            and share everything along the way.
          </Pop>
        </div>

        {cycleGrid}

        <Pop at={240} origin="50% 50%" style={{marginTop: 42, fontSize: 58, fontWeight: 800, color: COLORS.coral}}>
          Then repeat.
        </Pop>
      </AbsoluteFill>
    );
  }

  // 1:1 Square layout
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${safeTop}px ${safeX}px`,
        boxSizing: "border-box",
        color: COLORS.ink,
      }}
    >
      {/* Top lockup: Mascot + Headline */}
      <div style={{display: "flex", alignItems: "center", gap: 30, width: "100%"}}>
        <div style={{opacity: mascotIn, flexShrink: 0}}>
          <Mascot size={180} />
        </div>
        <div style={{flex: 1}}>
          <Pop at={0} style={{fontSize: 70, fontWeight: 800, lineHeight: 1.02}}>
            I build in public.
          </Pop>
          <Pop at={30} style={{fontSize: 52, fontWeight: 800, color: COLORS.teal, marginTop: 10}}>
            Tokenmaxxing:
          </Pop>
        </div>
      </div>

      {/* Definition strip card */}
      <div
        style={{
          marginTop: 18,
          width: "100%",
          background: COLORS.paper,
          border: `5px solid ${COLORS.ink}`,
          borderRadius: 28,
          boxShadow: `8px 8px 0 ${COLORS.ink}`,
          padding: "18px 28px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <Pop at={45} origin="50% 50%" style={{fontSize: 38, fontWeight: 600, lineHeight: 1.18}}>
          build apps with heavy AI use
        </Pop>
        <Pop at={75} origin="50% 50%" style={{fontSize: 38, fontWeight: 600, lineHeight: 1.18}}>
          and share everything along the way.
        </Pop>
      </div>

      {cycleGrid}

      <Pop at={240} origin="50% 50%" style={{marginTop: 28, fontSize: 48, fontWeight: 800, color: COLORS.coral}}>
        Then repeat.
      </Pop>
    </AbsoluteFill>
  );
};
