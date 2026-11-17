import React from "react";
import {Audio, interpolate, Sequence, staticFile} from "remotion";
import {MUSIC_FILE, T, TOTAL} from "./config";
import {STEP} from "./Showcase";
import {CHIP_FRAMES} from "./Angle";

type Cue = {file: "pop" | "click" | "swish" | "whoosh" | "chime"; at: number; vol: number};

const buildCues = (): Cue[] => {
  const c: Cue[] = [];
  const A = T.angle.from;
  const C = T.cta.from;

  // Scene wipes
  [T.showcase.from, T.angle.from, T.cta.from].forEach((b) => c.push({file: "whoosh", at: b - 9, vol: 0.55}));

  // Hook
  c.push({file: "pop", at: 6, vol: 0.8});
  [30, 45, 60].forEach((f) => c.push({file: "click", at: f, vol: 0.55}));
  c.push({file: "pop", at: 90, vol: 0.5});

  // Showcase: swish on every slide, pop on landing
  for (let s = 0; s < 10; s++) {
    const at = T.showcase.from + s * STEP;
    if (s > 0) c.push({file: "swish", at, vol: 0.45});
    c.push({file: "pop", at: at + (s === 0 ? 8 : 14), vol: 0.4});
  }

  // Angle
  [0, 30, 45, 75].forEach((f) => c.push({file: "click", at: A + f, vol: 0.5}));
  CHIP_FRAMES.forEach((f) => c.push({file: "pop", at: A + f, vol: 0.55}));
  c.push({file: "click", at: A + 240, vol: 0.5});

  // CTA
  c.push({file: "pop", at: C, vol: 0.7});
  c.push({file: "chime", at: C + 20, vol: 0.6});
  [0, 45].forEach((f) => c.push({file: "click", at: C + f + 3, vol: 0.45}));

  return c;
};

const CUES = buildCues();

export const PromoAudio: React.FC = () => (
  <>
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) =>
        interpolate(f, [0, 20, TOTAL - 45, TOTAL], [0, 0.5, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    {CUES.map((cue, i) => (
      <Sequence key={i} from={Math.max(0, cue.at)} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${cue.file}.wav`)} volume={cue.vol} />
      </Sequence>
    ))}
  </>
);
