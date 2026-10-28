import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, HelpCircle, X, ChevronDown, Sparkles } from 'lucide-react';
import { voiceService, VoiceState } from '../lib/voiceAccessibility';

interface VoiceAccessibilityBarProps {
  currentRoute: string;
}

export const VoiceAccessibilityBar: React.FC<VoiceAccessibilityBarProps> = ({ currentRoute }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(voiceService.getState());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = voiceService.subscribe((state) => {
      setVoiceState(state);
      // Auto-open if speech starts so user sees playback controls
      if (state.speaking) {
        setIsOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    const nextState = voiceService.toggleVoiceMode();
    if (nextState) {
      setIsOpen(true);
    }
  };

  const handleReadPage = () => {
    const mainEl = document.querySelector('main');
    if (!mainEl) {
      voiceService.speak('Eusatis educational platform ready.', { force: true });
      return;
    }

    const h1 = mainEl.querySelector('h1')?.textContent || 'Current Page';
    const paragraphs = Array.from(mainEl.querySelectorAll('p, h2, h3'))
      .map((el) => el.textContent?.trim() || '')
      .filter((t) => t.length > 20)
      .slice(0, 8);

    const script = [
      `Reading page: ${h1}.`,
      ...paragraphs
    ].join(' ... ');

    voiceService.speak(script, { force: true, interrupt: true });
  };

  const rates = [0.8, 1.0, 1.25, 1.5];

  return (
    <>
      {/* Screen reader live region */}
      <div
        id="eusatis-voice-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {voiceState.currentText || (voiceState.enabled ? 'Voice Mode Active' : '')}
      </div>

      {/* Floating Container: Minimal & Unobtrusive */}
      <aside
        role="region"
        aria-label="Voice Accessibility Controller"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto"
      >
        {/* State 1: Cute Compact Floating Pill (Default - Takes up minimal space) */}
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-[#1F272A]/95 hover:bg-[#1F272A] text-white shadow-xl hover:shadow-2xl border border-[#47C3D3]/40 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
            title="Voice Accessibility (Alt+V) - Click to open controls"
            aria-label="Open Voice Accessibility panel"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              voiceState.speaking
                ? 'bg-[#47C3D3] text-[#1F272A] animate-pulse'
                : voiceState.enabled
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-400 group-hover:text-[#47C3D3]'
            }`}>
              {voiceState.speaking ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : voiceState.enabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold font-['Outfit'] leading-none text-slate-100 flex items-center gap-1">
                {voiceState.speaking ? 'Reading Aloud' : voiceState.enabled ? 'Voice Active' : 'Voice Mode'}
              </span>
              <span className="text-[9px] font-mono text-slate-400 leading-tight">
                Alt+V
              </span>
            </div>
          </button>
        ) : (
          /* State 2: Cute Micro-Card (Expanded with Sleek, Clean Controls & Quick Hide) */
          <div className="bg-[#1F272A] text-white rounded-3xl shadow-2xl border border-[#47C3D3]/50 p-4 w-[290px] sm:w-[320px] backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 space-y-3.5">
            {/* Header: Title + Hide (X) Button */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  voiceState.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-['Outfit'] text-slate-200">
                  Voice Accessibility
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowHelp(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#47C3D3] transition-colors cursor-pointer"
                  title="Keyboard Shortcuts"
                  aria-label="View shortcuts guide"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Hide voice bar"
                  aria-label="Close voice controls"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Toggle Switch & Read Page Button */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggle}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold font-['Outfit'] transition-all cursor-pointer ${
                  voiceState.enabled
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                aria-pressed={voiceState.enabled}
                aria-label="Toggle voice mode"
              >
                {voiceState.enabled ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                    <span>Mode ON</span>
                  </>
                ) : (
                  <span>Mode OFF</span>
                )}
              </button>

              <button
                onClick={handleReadPage}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#0891B2] hover:bg-[#47C3D3] text-white hover:text-slate-950 text-xs font-bold font-['Outfit'] transition-all cursor-pointer shadow-sm"
                aria-label="Read this page out loud"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Read Page</span>
              </button>
            </div>

            {/* Active Speech Progress Banner */}
            {voiceState.speaking && (
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-[#47C3D3]/30 space-y-2">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-[#47C3D3] font-mono truncate max-w-[170px]">
                    {voiceState.currentText || 'Speaking...'}
                  </span>
                  <div className="flex items-center gap-1">
                    {voiceState.paused ? (
                      <button
                        onClick={() => voiceService.resume()}
                        className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 cursor-pointer"
                        title="Resume"
                        aria-label="Resume speech"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    ) : (
                      <button
                        onClick={() => voiceService.pause()}
                        className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 cursor-pointer"
                        title="Pause"
                        aria-label="Pause speech"
                      >
                        <Pause className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => voiceService.stop()}
                      className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 cursor-pointer"
                      title="Stop"
                      aria-label="Stop speech"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Speed Multipliers & Hide Action */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400 font-['Outfit'] font-semibold">Speed:</span>
              <div className="flex items-center gap-1">
                {rates.map((r) => (
                  <button
                    key={r}
                    onClick={() => voiceService.setRate(r)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      voiceState.rate === r
                        ? 'bg-[#47C3D3] text-[#1F272A]'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Dismiss Cue */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono">Shortcut: Alt+V</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#47C3D3] hover:underline cursor-pointer font-bold font-['Outfit']"
              >
                Minimize & Hide
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Accessible Shortcuts Guide Modal */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-help-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-[#1F272A] border-2 border-[#47C3D3] text-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close guide"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h2 id="voice-help-modal-title" className="text-xl font-bold font-['Outfit'] text-white">
                Voice Accessibility
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Listen to curriculum lessons and navigate with keyboard commands.
              </p>
            </div>

            <div className="space-y-2 bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-300">Toggle Voice Mode</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[#47C3D3] border border-slate-700 font-mono">Alt + V</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-300">Stop Speech</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700 font-mono">Alt + S</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-300">Pause / Resume</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">Alt + P</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300">Browse Controls</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Tab</kbd>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 rounded-xl bg-[#47C3D3] hover:bg-[#0891B2] text-[#1F272A] font-bold text-xs transition-all cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
