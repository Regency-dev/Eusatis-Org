/**
 * Eusatis Voice Accessibility & Screen Reader Engine
 * Provides universal text-to-speech, audible feedback chimes, keyboard shortcuts,
 * and page narration for blind and visually-impaired users.
 */

export interface VoiceState {
  enabled: boolean;
  speaking: boolean;
  paused: boolean;
  rate: number; // 0.8 to 2.0
  currentText: string;
}

type Listener = (state: VoiceState) => void;

class VoiceAccessibilityService {
  private enabled: boolean = false;
  private speaking: boolean = false;
  private paused: boolean = false;
  private rate: number = 1.0;
  private currentText: string = '';
  private listeners: Set<Listener> = new Set();
  private audioCtx: AudioContext | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved preferences
      try {
        const savedMode = localStorage.getItem('eusatis_voice_mode');
        this.enabled = savedMode === 'true';
        const savedRate = localStorage.getItem('eusatis_voice_rate');
        if (savedRate) {
          const parsed = parseFloat(savedRate);
          if (!isNaN(parsed) && parsed >= 0.7 && parsed <= 2.0) {
            this.rate = parsed;
          }
        }
      } catch (e) {
        console.warn('Voice accessibility local storage read error:', e);
      }

      this.initVoices();
      if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }

      // Global keyboard shortcuts
      this.initKeyboardShortcuts();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
      // Prefer high-quality English natural voices (Google, Samantha, Daniel, Natural, English US/UK)
      this.selectedVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    }
  }

  private initKeyboardShortcuts() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Check for Alt+V (Toggle Voice Mode)
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        this.toggleVoiceMode();
        return;
      }

      // Check for Alt+S (Stop Speech)
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.stop();
        this.playFeedbackChime('stop');
        return;
      }

      // Check for Alt+P (Pause/Resume Speech)
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (this.speaking) {
          if (this.paused) {
            this.resume();
          } else {
            this.pause();
          }
        }
        return;
      }
    });
  }

  /**
   * Generates a brief audible synthesizer tone for blind users so they get instant
   * auditory confirmation before or after actions (e.g. Mode On, Mode Off, Selection).
   */
  public playFeedbackChime(type: 'enable' | 'disable' | 'navigate' | 'select' | 'stop' | 'alert') {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'enable') {
        // Ascending harmonic chime
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'disable') {
        // Descending chime
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'select') {
        // Soft focus chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'navigate') {
        // Gentle page change ping
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'stop') {
        // Low click
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // AudioContext may be restricted by autoplay policy before user gesture
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getState(): VoiceState {
    return {
      enabled: this.enabled,
      speaking: this.speaking,
      paused: this.paused,
      rate: this.rate,
      currentText: this.currentText
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  public toggleVoiceMode(): boolean {
    return this.setVoiceMode(!this.enabled);
  }

  public setVoiceMode(enabled: boolean): boolean {
    this.enabled = enabled;
    try {
      localStorage.setItem('eusatis_voice_mode', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }

    if (enabled) {
      this.playFeedbackChime('enable');
      this.speak(
        'Voice Accessibility Mode activated. Eusatis will read page content, academic disciplines, and navigation aloud. Press Alt plus V anytime to toggle.',
        { interrupt: true }
      );
    } else {
      this.stop();
      this.playFeedbackChime('disable');
    }
    this.notify();
    return this.enabled;
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.7, Math.min(2.0, rate));
    try {
      localStorage.setItem('eusatis_voice_rate', this.rate.toString());
    } catch {
      // ignore
    }
    this.notify();
    if (this.enabled) {
      this.speak(`Voice speed set to ${this.rate.toFixed(1)} times`, { interrupt: true });
    }
  }

  /**
   * Speak a text string using SpeechSynthesis
   */
  public speak(
    text: string,
    options?: {
      interrupt?: boolean;
      rate?: number;
      onEnd?: () => void;
      force?: boolean; // speak even if voice mode isn't globally enabled (e.g. user clicked "Listen to Lesson")
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!this.enabled && !options?.force) return;

    const cleanText = text
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\$\$[\s\S]*?\$\$/g, ' mathematical equation ') // handle latex math
      .replace(/\$([^\$]+)\$/g, ' $1 ')
      .trim();

    if (!cleanText) return;

    if (options?.interrupt !== false) {
      window.speechSynthesis.cancel();
    }

    if (!this.voicesLoaded) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = options?.rate || this.rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.speaking = true;
      this.paused = false;
      this.currentText = cleanText;
      this.notify();
    };

    utterance.onend = () => {
      this.speaking = false;
      this.paused = false;
      this.currentText = '';
      this.notify();
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      // Don't warn on deliberate user cancellations
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      this.speaking = false;
      this.paused = false;
      this.currentText = '';
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Announce an action (like choosing a subject filter or changing route)
   * Plays a chime and speaks smoothly
   */
  public announce(text: string, chime: 'select' | 'navigate' | 'alert' = 'select') {
    if (!this.enabled) return;
    this.playFeedbackChime(chime);
    this.speak(text, { interrupt: true });
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
    this.paused = false;
    this.currentText = '';
    this.notify();
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.paused = true;
    this.notify();
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.paused = false;
    this.notify();
  }

  /**
   * Sequentially read a comprehensive list of sections aloud
   */
  public readSections(sections: { heading?: string; text: string }[]) {
    this.stop();
    if (sections.length === 0) return;

    const fullScript = sections
      .map((s) => {
        if (s.heading) {
          return `${s.heading}. ${s.text}`;
        }
        return s.text;
      })
      .join(' ... ');

    this.speak(fullScript, { interrupt: true, force: true });
  }
}

export const voiceService = new VoiceAccessibilityService();
