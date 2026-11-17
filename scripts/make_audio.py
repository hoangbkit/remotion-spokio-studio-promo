#!/usr/bin/env python3
"""Synthesizes the promo's music loop and sound effects (original, royalty-free).

Needs: python3 + numpy. For mp3 output it also uses ffmpeg (if not found, the
music is written as .wav and you should set MUSIC_FILE in src/config.ts).

Run from the project root:  python3 scripts/make_audio.py
Music: 120 BPM, 20 bars = 40 s, matches the 1200-frame timeline.
"""
import os
import shutil
import subprocess
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
BARS = 20
rng = np.random.default_rng(7)
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MUSIC_DIR = os.path.join(ROOT, "public", "music")
SFX_DIR = os.path.join(ROOT, "public", "sfx")
os.makedirs(MUSIC_DIR, exist_ok=True)
os.makedirs(SFX_DIR, exist_ok=True)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / fc) ** 4), len(x))


def highpass(x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = (f / fc) ** 4
    return np.fft.irfft(X * g / (1 + g), len(x))


def mix_in(buf, sig, start_s, gain=1.0):
    i = int(start_s * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def norm(x, peak=0.9):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


# ---------- instruments ----------
def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 45 + 120 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def snare():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    nz = highpass(rng.standard_normal(n), 1500)
    return (nz * 0.8 + np.sin(2 * np.pi * 190 * t) * 0.4) * np.exp(-t / 0.07)


def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return highpass(rng.standard_normal(n), 7000) * np.exp(-t / (0.08 if open_ else 0.015))


def crash():
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    return highpass(rng.standard_normal(n), 3000) * np.exp(-t / 0.45)


def bass(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)
    return s * np.minimum(1, t / 0.005) * np.exp(-t / (dur * 0.8))


def pluck(f, dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for h in range(1, 7):
        s += (1 / h) * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (6 + 5 * h))
    return s * np.minimum(1, t / 0.003)


def pad(notes, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.12, 0.0, 0.12):
            s += np.sin(2 * np.pi * hz(m + det) * t)
    env = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.6)
    return lowpass(s * env / (len(notes) * 3), 2500)


# ---------- music ----------
N = int(SR * BAR * BARS)
music = np.zeros(N)

CHORDS = [  # C, G, Am, F
    {"root": 36, "tones": [60, 64, 67]},
    {"root": 43, "tones": [59, 62, 67]},
    {"root": 45, "tones": [57, 60, 64]},
    {"root": 41, "tones": [57, 60, 65]},
]
K, S, H, HO, CR = kick(), snare(), hat(), hat(True), crash()

for b in range(BARS):
    ch = CHORDS[b % 4]
    t0 = b * BAR
    hook = b < 2
    show = 2 <= b < 12
    angle = 12 <= b < 17
    cta = b >= 17
    final = b == BARS - 1

    mix_in(music, pad(ch["tones"], BAR + 0.5), t0, 0.55 if angle else 0.4)

    arp = [t + 12 for t in ch["tones"]]
    arp = arp + [arp[0] + 12]
    if hook:
        steps = [(i * BEAT, arp[(i * 2) % 4]) for i in range(4)]
    elif angle:
        steps = [(i * BEAT, arp[(i * 2) % 4]) for i in range(4)] + [(i * BEAT + BEAT / 2, arp[(i + 1) % 4]) for i in (1, 3)]
    else:
        pat = [0, 1, 2, 3, 2, 1, 2, 3]
        steps = [(i * BEAT / 2, arp[pat[i]]) for i in range(8)]
    if not final:
        for off, m in steps:
            mix_in(music, pluck(hz(m)), t0 + off, 0.22)
    else:
        mix_in(music, pluck(hz(arp[0]), 1.6), t0, 0.3)
        mix_in(music, pluck(hz(arp[2]), 1.6), t0, 0.22)

    if hook:
        mix_in(music, bass(hz(ch["root"]), BAR * 0.9), t0, 0.45)
        if b == 1:  # build-up hats into the drop
            for i in range(8):
                mix_in(music, hat(), t0 + 3 * BEAT + i * BEAT / 8, 0.08 + 0.03 * i)
    elif final:
        mix_in(music, bass(hz(ch["root"]), 1.8), t0, 0.5)
        mix_in(music, K, t0, 0.9)
    else:
        if angle:
            for i in range(4):
                mix_in(music, bass(hz(ch["root"]), BEAT * 0.9), t0 + i * BEAT, 0.5)
            for i in (0, 2):
                mix_in(music, K, t0 + i * BEAT, 0.85)
            for i in (1, 3):
                mix_in(music, S, t0 + i * BEAT, 0.32)
            for i in range(8):
                mix_in(music, H, t0 + i * BEAT / 2, 0.12)
        else:
            for i in range(8):
                note = ch["root"] + (12 if i % 4 == 3 else 0)
                mix_in(music, bass(hz(note), BEAT * 0.5), t0 + i * BEAT / 2, 0.5)
            for i in range(4):
                mix_in(music, K, t0 + i * BEAT, 0.9)
            for i in (1, 3):
                mix_in(music, S, t0 + i * BEAT, 0.45)
            for i in range(4):
                mix_in(music, HO if i == 3 else H, t0 + i * BEAT + BEAT / 2, 0.16)
                mix_in(music, H, t0 + i * BEAT + BEAT / 4, 0.05)

    if b in (2, 12, 17):
        mix_in(music, CR, t0, 0.25)

music = np.tanh(music * 1.2)
music = norm(music, 0.85)
write_wav(os.path.join(MUSIC_DIR, "promo-loop.wav"), music)

# ---------- sfx ----------
def sfx_pop():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    f = 250 + 900 * np.exp(-t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06) * np.minimum(1, t / 0.002)


def sfx_click():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    nz = highpass(rng.standard_normal(n), 2500) * np.exp(-t / 0.006)
    return nz * 0.6 + np.sin(2 * np.pi * 1500 * t) * np.exp(-t / 0.02) * 0.5


def sfx_swish():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    nz = highpass(lowpass(rng.standard_normal(n), 5000), 600)
    return nz * np.sin(np.pi * np.clip(t / 0.28, 0, 1)) ** 2


def sfx_whoosh():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    nz = highpass(lowpass(rng.standard_normal(n), 3500), 300)
    env = np.where(t < 0.3, (t / 0.3) ** 2, np.exp(-(t - 0.3) / 0.1))
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / 0.6) ** 2) / SR) * 0.25
    return (nz + sweep) * env


def sfx_chime():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for i, f in enumerate([1046.5, 1318.5, 1568.0]):
        d = t - 0.08 * i
        s += np.where(d > 0, np.sin(2 * np.pi * f * np.maximum(d, 0)) * np.exp(-np.maximum(d, 0) / 0.5), 0)
    return s


for name, fn in [("pop", sfx_pop), ("click", sfx_click), ("swish", sfx_swish), ("whoosh", sfx_whoosh), ("chime", sfx_chime)]:
    write_wav(os.path.join(SFX_DIR, f"{name}.wav"), norm(fn(), 0.9))

# ---------- mp3 for the music ----------
wav_path = os.path.join(MUSIC_DIR, "promo-loop.wav")
if shutil.which("ffmpeg"):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path, "-codec:a", "libmp3lame", "-q:a", "3",
         os.path.join(MUSIC_DIR, "promo-loop.mp3")],
        check=True,
    )
    os.remove(wav_path)
    print("Wrote public/music/promo-loop.mp3 + public/sfx/*.wav")
else:
    print("ffmpeg not found: kept public/music/promo-loop.wav. Set MUSIC_FILE to 'music/promo-loop.wav' in src/config.ts")
