# Spokio Studio promo (Remotion)

Responsive promo video in 3 formats (16:9 `1920x1080`, 1:1 `1080x1080`, 9:16 `1080x1920`), 30 fps, 40 seconds, no voiceover (captions + music + SFX).

## Formats

| Composition | Aspect | Resolution | Best for |
|---|---|---|---|
| `Promo` | 16:9 | 1920x1080 | Website hero, YouTube, pinned X post |
| `PromoSquare` | 1:1 | 1080x1080 | X feed, Reddit, LinkedIn |
| `PromoVertical` | 9:16 | 1080x1920 | Reels, TikTok, YouTube Shorts |

## Run it

```bash
npm install
npm run dev            # opens Remotion Studio with live preview for all 3 formats
npm run build          # renders out/spokio-studio-promo.mp4 (16:9, H.264)
npm run build:square   # renders out/spokio-studio-promo-1x1.mp4 (1:1, H.264)
npm run build:vertical # renders out/spokio-studio-promo-9x16.mp4 (9:16, H.264)
npm run build:all      # renders all 3 MP4 formats
npm run build:loop     # muted VP9 .webm for the website hero (also :square, :vertical)
npm run poster:all     # still frames for all 3 formats (or `npm run poster` for 16:9)
```

Needs Node 18+. The font (Baloo 2) is fetched from Google Fonts on first render.

## Timeline (120 BPM, 15 frames per beat)

| Time | Scene |
|---|---|
| 0-4s | Hook: mascot + "10 apps. 1 solo dev. Built with Love." |
| 4-24s | The lineup: 10 app cards, 2s each, cut on the beat (+ live 2x5 app dock in 9:16) |
| 24-34s | I build in public + tokenmaxxing + Prompt > Build > Ship > Share (2x2 loop in 1:1 & 9:16) |
| 34-40s | End card: spokiostudio.com + Follow on X + app icon strip (fades to cream for clean loop) |

## Edit

- `src/config.ts`: copy, app list, taglines, colors, site URL, optional `X_HANDLE`, format resolutions.
- `src/layout.ts`: responsive aspect-ratio hook and safe-area margins.
- Real app icons: put PNGs in `public/icons/` and set `icon` on that app.
- Each app has a short `tagline` shown under its name on the card.
- Scene files: `src/Hook.tsx`, `Showcase.tsx`, `Angle.tsx`, `Cta.tsx`. Mascot: `src/Mascot.tsx`.
- SFX placement: `src/PromoAudio.tsx`.

## Audio

`public/music/promo-loop.mp3` and `public/sfx/*.wav` are synthesized by `scripts/make_audio.py`
(original, no licensing issues). To regenerate or tweak: `pip install numpy`, edit the script,
run `npm run audio` (needs ffmpeg for the mp3). To use your own track, replace the mp3 or change
`MUSIC_FILE` in `src/config.ts`; keep it 40s or trim in `PromoAudio.tsx`.

## Website / Social

- Website hero: use the 16:9 `.webm` (or mp4) with `autoplay muted loop playsinline` and the poster still.
- X / Reddit: upload the 1:1 (`PromoSquare`) or 16:9 mp4 natively and put the URL in the post text.
- Reels / TikTok / Shorts: upload the 9:16 (`PromoVertical`) mp4 (key UI stays inside platform safe zones).

## CI / releases

`.github/workflows/render.yml` runs only when triggered manually from the Actions tab.
The **Video size to render** dropdown lets you pick `16:9`, `1:1`, `9:16`, or `all`
(the default). The selected size controls which MP4, muted webm loop, and poster get
rendered; `all` produces every format. It installs dependencies, typechecks, then
publishes the results as a GitHub pre-release tagged `remotion-build-<run-id>-<attempt>`
with assets named `<repo>-<output>-<tag>.<ext>`.
The 16:9 MP4 stays compatible with `mycli remotion play`.
