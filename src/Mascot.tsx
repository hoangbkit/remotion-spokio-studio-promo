import React from "react";
import {useCurrentFrame} from "remotion";
import {COLORS} from "./config";

const {teal, tealDark, ink, mustard, coral, cream} = COLORS;

// Teal robot mascot. Blinks, bobs, antenna wobbles; optional wave.
export const Mascot: React.FC<{size?: number; wave?: boolean}> = ({size = 420, wave = false}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12) * 6;
  const antenna = Math.sin(frame / 7) * 8;
  const blink = frame % 90 > 84 ? 0.1 : 1;
  const wing = wave ? Math.sin(frame / 3.5) * 16 - 140 : 12;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 400 440"
      style={{transform: `translateY(${bob}px)`, overflow: "visible"}}
    >
      {/* antenna */}
      <g transform={`rotate(${antenna} 200 100)`}>
        <line x1="200" y1="100" x2="200" y2="52" stroke={ink} strokeWidth="10" strokeLinecap="round" />
        <circle cx="200" cy="40" r="19" fill={coral} stroke={ink} strokeWidth="8" />
      </g>
      {/* ears */}
      <rect x="46" y="170" width="38" height="84" rx="16" fill={mustard} stroke={ink} strokeWidth="8" />
      <rect x="316" y="170" width="38" height="84" rx="16" fill={mustard} stroke={ink} strokeWidth="8" />
      {/* left arm */}
      <g transform="rotate(12 128 340)">
        <rect x="70" y="326" width="70" height="30" rx="15" fill={mustard} stroke={ink} strokeWidth="8" />
      </g>
      {/* body */}
      <rect x="120" y="305" width="160" height="110" rx="40" fill={tealDark} stroke={ink} strokeWidth="8" />
      <circle cx="200" cy="360" r="15" fill={mustard} stroke={ink} strokeWidth="6" />
      {/* head */}
      <rect x="70" y="95" width="260" height="215" rx="72" fill={teal} stroke={ink} strokeWidth="8" />
      {/* face screen */}
      <rect x="105" y="133" width="190" height="136" rx="46" fill={ink} />
      <g transform={`translate(160 192) scale(1 ${blink}) translate(-160 -192)`}>
        <ellipse cx="160" cy="192" rx="16" ry="23" fill={cream} />
      </g>
      <g transform={`translate(240 192) scale(1 ${blink}) translate(-240 -192)`}>
        <ellipse cx="240" cy="192" rx="16" ry="23" fill={cream} />
      </g>
      <path d="M178 235 Q200 254 222 235" fill="none" stroke={mustard} strokeWidth="9" strokeLinecap="round" />
      <circle cx="132" cy="232" r="9" fill={coral} />
      <circle cx="268" cy="232" r="9" fill={coral} />
      {/* right arm (waves) */}
      <g transform={`rotate(${wing} 272 340)`}>
        <rect x="260" y="326" width="76" height="30" rx="15" fill={mustard} stroke={ink} strokeWidth="8" />
      </g>
    </svg>
  );
};
