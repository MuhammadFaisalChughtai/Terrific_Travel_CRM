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
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function unlockAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

/**
 * Plays a loud, pulsing emergency danger siren sound
 * Pattern: High/Low alternating siren with pulsing beeps for urgent attention
 */
export function playDangerAlarm(durationSeconds = 6): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Stop previous if currently playing
    stopDangerAlarm();
    isPlaying = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Create 2 oscillators for dual-tone dissonant emergency siren
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "square";

    // Set frequencies: alternating urgent alarm frequencies (880Hz <-> 660Hz)
    const now = ctx.currentTime;
    const pulseCount = Math.floor(durationSeconds * 2.5);
    const pulseStep = durationSeconds / pulseCount;

    for (let i = 0; i < pulseCount; i++) {
      const t = now + i * pulseStep;
      const freq = i % 2 === 0 ? 960 : 720;
      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 1.05, t); // slight dissonance for danger alarm feel

      // Pulsing volume envelope
      gainNode.gain.setValueAtTime(0.01, t);
      gainNode.gain.linearRampToValueAtTime(0.8, t + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + pulseStep - 0.02);
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
  } catch (err) {
    console.warn("Failed to play danger alarm audio:", err);
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
