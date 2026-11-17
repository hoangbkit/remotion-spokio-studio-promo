import React from "react";
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from "remotion";
import {COLORS, T, TOTAL} from "./config";
import {fontFamily} from "./fonts";
import {Background, Wipe} from "./ui";
import {Hook} from "./Hook";
import {Showcase} from "./Showcase";
import {Angle} from "./Angle";
import {Cta} from "./Cta";
import {PromoAudio} from "./PromoAudio";

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  // Fade to cream on the last frames so the website loop restarts cleanly.
  const endFade = interpolate(frame, [TOTAL - 12, TOTAL - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <Sequence from={T.hook.from} durationInFrames={T.hook.dur}>
        <Hook />
      </Sequence>
      <Sequence from={T.showcase.from} durationInFrames={T.showcase.dur}>
        <Showcase />
      </Sequence>
      <Sequence from={T.angle.from} durationInFrames={T.angle.dur}>
        <Angle />
      </Sequence>
      <Sequence from={T.cta.from} durationInFrames={T.cta.dur}>
        <Cta />
      </Sequence>

      {[
        {at: T.showcase.from, color: COLORS.teal},
        {at: T.angle.from, color: COLORS.coral},
        {at: T.cta.from, color: COLORS.teal},
      ].map(({at, color}) => (
        <React.Fragment key={at}>
          <Wipe at={at} color={COLORS.mustard} lag={3} />
          <Wipe at={at} color={color} />
        </React.Fragment>
      ))}

      <AbsoluteFill style={{background: COLORS.cream, opacity: endFade}} />
      <PromoAudio />
    </AbsoluteFill>
  );
};
