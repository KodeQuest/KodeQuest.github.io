// Efek suara murni dari Web Audio API, tanpa file eksternal.
let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(v: boolean) {
  enabled = v;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  click() {
    if (!enabled) return;
    tone(520, 0, 0.06, "triangle", 0.1);
  },
  correct() {
    if (!enabled) return;
    tone(523.25, 0, 0.12, "sine");
    tone(659.25, 0.1, 0.12, "sine");
    tone(783.99, 0.2, 0.22, "sine");
  },
  wrong() {
    if (!enabled) return;
    tone(220, 0, 0.18, "sawtooth", 0.1);
    tone(165, 0.14, 0.26, "sawtooth", 0.1);
  },
  complete() {
    if (!enabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle", 0.14));
  },
};
