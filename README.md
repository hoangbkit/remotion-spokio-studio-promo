# Spokio Studio promo (Remotion)

16:9, 1920x1080, 30 fps, 40 seconds, no voiceover (captions + music + SFX).

## Run it

```bash
npm install
npm run dev          # opens Remotion Studio with live preview
npm run build        # renders out/spokio-studio-promo.mp4 (H.264)
npm run build:loop   # muted VP9 .webm for the website hero
npm run poster       # still frame for the video poster / X preview
```

Needs Node 18+. The font (Baloo 2) is fetched from Google Fonts on first render.

## Timeline (120 BPM, 15 frames per beat)

| Time | Scene |
|---|---|
| 0-4s | Hook: mascot + "10 apps. 1 solo dev. Built with AI." |
| 4-24s | The lineup: 10 app cards, 2s each, cut on the beat |
| 24-34s | I build in public + tokenmaxxing + Prompt > Build > Ship > Share |
| 34-40s | End card: spokiostudio.com + Follow on X (fades to cream so the loop restarts cleanly) |

## Edit

- `src/config.ts`: copy, app list, taglines, colors, site URL, optional `X_HANDLE`.
- Real app icons: put PNGs in `public/icons/` and set `icon` on that app.
- Each app has a short `tagline` shown under its name on the card.
- Scene files: `src/Hook.tsx`, `Showcase.tsx`, `Angle.tsx`, `Cta.tsx`. Mascot: `src/Mascot.tsx`.
- SFX placement: `src/PromoAudio.tsx`.

## Audio

`public/music/promo-loop.mp3` and `public/sfx/*.wav` are synthesized by `scripts/make_audio.py`
(original, no licensing issues). To regenerate or tweak: `pip install numpy`, edit the script,
run `npm run audio` (needs ffmpeg for the mp3). To use your own track, replace the mp3 or change
`MUSIC_FILE` in `src/config.ts`; keep it 40s or trim in `PromoAudio.tsx`.

## Website / X

- Website hero: use the `.webm` (or mp4) with `autoplay muted loop playsinline` and the poster still.
- Pinned X post: upload the mp4 natively and put the URL in the post text.

## CI / releases

`.github/workflows/render.yml` runs only when triggered manually from the Actions tab.
It installs dependencies, typechecks, renders
the MP4, the muted webm loop and the poster still, then publishes them as a GitHub
pre-release tagged `remotion-build-<run-id>-<attempt>` with assets named
`<repo>-<output>-<tag>.<ext>`. The MP4 stays compatible with `mycli remotion play`.
