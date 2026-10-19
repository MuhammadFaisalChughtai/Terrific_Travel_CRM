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
 * Plays an urgent 4-second intermittent electric buzzer sound.
 * Pattern: 8 punchy buzzer pulses across 4.0 seconds (0.35s buzz, 0.15s pause).
 * Frequency: Dual-harmonic 440Hz / 220Hz buzzer tone.
 */
export async function playDangerAlarm(durationSeconds = 4): Promise<boolean> {
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
    masterGain.gain.setValueAtTime(0.45, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Create 2 oscillators for a rich, raspy electric buzzer tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "square";

    const now = ctx.currentTime;
    const pulseStep = 0.5; // 0.35s buzz + 0.15s pause = 0.5s per pulse
    const pulseCount = Math.floor(durationSeconds / pulseStep); // 8 pulses for 4s

    for (let i = 0; i < pulseCount; i++) {
      const t = now + i * pulseStep;
      const buzzDuration = 0.35;

      // Punchy industrial alarm buzzer tone
      osc1.frequency.setValueAtTime(440, t);
      osc2.frequency.setValueAtTime(220, t);

      // Sharp, crisp buzzer pulses
      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(0.85, t + 0.02);
      gainNode.gain.setValueAtTime(0.85, t + buzzDuration - 0.02);
      gainNode.gain.linearRampToValueAtTime(0.0001, t + buzzDuration);
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
    console.warn("Failed to play danger buzzer audio:", err);
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
