import {useVideoConfig} from "remotion";

export type LayoutFormat = "landscape" | "square" | "portrait";

export type LayoutInfo = {
  format: LayoutFormat;
  width: number;
  height: number;
  isLandscape: boolean;
  isSquare: boolean;
  isPortrait: boolean;
  // Safe margins (clears TikTok/Reels/Shorts HUD overlays in 9:16).
  safeTop: number;
  safeBottom: number;
  safeX: number;
};

export const useLayout = (): LayoutInfo => {
  const {width, height} = useVideoConfig();
  const format: LayoutFormat =
    width > height ? "landscape" : height > width ? "portrait" : "square";

  return {
    format,
    width,
    height,
    isLandscape: format === "landscape",
    isSquare: format === "square",
    isPortrait: format === "portrait",
    safeTop: format === "portrait" ? 170 : 56,
    safeBottom: format === "portrait" ? 260 : 56,
    safeX: format === "landscape" ? 96 : 64,
  };
};
