// Everything you are likely to edit lives here.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const BEAT = 15; // frames per beat (music is 120 BPM at 30 fps)

export const COLORS = {
  cream: "#FAF3E3",
  creamDark: "#EFE4CB",
  paper: "#FFFDF6",
  teal: "#1AA39B",
  tealDark: "#0F7C77",
  mustard: "#EDB23A",
  coral: "#F2634D",
  ink: "#1F2A33",
};

// Timeline (frames). Totals 1200 frames = 40 seconds.
export const T = {
  hook: {from: 0, dur: 120},
  showcase: {from: 120, dur: 600},
  angle: {from: 720, dur: 300},
  cta: {from: 1020, dur: 180},
};
export const TOTAL = 1200;

// Copy
export const HOOK_LINES = ["10 apps.", "1 solo dev.", "Built with AI."];
export const SITE = "spokiostudio.com";
// Optional: set to e.g. "@yourhandle" to show it on the end card.
export const X_HANDLE = "";

export const MUSIC_FILE = "music/promo-loop.mp3";

export type AppInfo = {
  name: string;
  color: string;
  tagline?: string; // shown under the name; falls back to "by Spokio Studio"
  icon?: string; // optional file in /public, e.g. "icons/inkribe.png"
};

// One card per app. Drop real icons into /public/icons and set `icon`.
export const APPS: AppInfo[] = [
  {name: "Spokio", color: COLORS.teal, tagline: "Text-to-speech for documents", icon: "icons/spokio.png"},
  {name: "MiLove", color: COLORS.coral, tagline: "Your relationship timeline", icon: "icons/milove.png"},
  {name: "Palette", color: COLORS.mustard, tagline: "Colors from photos to code", icon: "icons/palette.png"},
  {name: "Riidrr", color: COLORS.ink, tagline: "Audiobooks, fully offline", icon: "icons/riidrr.png"},
  {name: "DraftX", color: COLORS.tealDark, tagline: "Social drafts & variants", icon: "icons/draftx.png"},
  {name: "Onlink", color: COLORS.coral, tagline: "Spot internet dropouts", icon: "icons/onlink.png"},
  {name: "VietCal", color: COLORS.teal, tagline: "Lunar dates & good days", icon: "icons/vietcal.png"},
  {name: "BYOK Chat", color: COLORS.ink, tagline: "AI chat with your own API key", icon: "icons/byokchat.png"},
  {name: "Cinefy", color: COLORS.mustard, tagline: "Movies, shows & celebrities", icon: "icons/cinefy.png"},
  {name: "Inkribe", color: COLORS.tealDark, tagline: "Video captions with Whisper", icon: "icons/inkribe.png"},
];
