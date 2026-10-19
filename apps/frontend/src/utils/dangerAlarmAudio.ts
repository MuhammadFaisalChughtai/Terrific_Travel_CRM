// Web Audio API based Emergency Danger Alarm for Hotel Free Cancellation Deadlines
let audioCtx: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let isPlaying = false;
let stopTimer: any = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export async function unlockAudioContext(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn("Could not resume AudioContext:", e);
    }
  }
  return ctx.state === "running";
}

export function isAudioUnlocked(): boolean {
  return !!audioCtx && audioCtx.state === "running";
}

/**
 * Plays a loud, pulsing emergency danger siren sound
 * Pattern: High/Low alternating siren with pulsing beeps for urgent attention
 */
export async function playDangerAlarm(durationSeconds = 6): Promise<boolean> {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    if (ctx.state !== "running") {
      console.warn("AudioContext state is", ctx.state, "- waiting for user interaction to unlock.");
      return false;
    }

    // Stop previous if currently playing
    stopDangerAlarm();
    isPlaying = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Create 2 oscillators for dual-tone dissonant emergency siren
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "square";

    // Set frequencies: alternating urgent alarm frequencies (960Hz <-> 720Hz)
    const now = ctx.currentTime;
    const pulseCount = Math.max(2, Math.floor(durationSeconds * 2.5));
    const pulseStep = durationSeconds / pulseCount;

    for (let i = 0; i < pulseCount; i++) {
      const t = now + i * pulseStep;
      const freq = i % 2 === 0 ? 960 : 720;
      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 1.05, t); // slight dissonance for danger alarm feel

      // Pulsing volume envelope using linear ramps
      gainNode.gain.setValueAtTime(0.01, t);
      gainNode.gain.linearRampToValueAtTime(0.85, t + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.01, t + pulseStep - 0.03);
    }

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSeconds);
    osc2.stop(now + durationSeconds);

    currentOscillators = [osc1, osc2];

    stopTimer = setTimeout(() => {
      isPlaying = false;
      currentOscillators = [];
    }, durationSeconds * 1000);

    return true;
  } catch (err) {
    console.warn("Failed to play danger alarm audio:", err);
    return false;
  }
}

export function stopDangerAlarm(): void {
  try {
    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }
    currentOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    currentOscillators = [];
    isPlaying = false;
  } catch (e) {}
}

export function isAlarmPlaying(): boolean {
  return isPlaying;
}
