import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Timer,
  Award,
  Play,
  Pause,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { KnowledgeCheck } from '../types';
import { CreativeBadge } from './CreativeBadge';
import { MathText } from './MathText';

interface KnowledgeCheckQuizProps {
  questions: KnowledgeCheck[];
}

/**
 * Play a celebratory harmonic chime using Web Audio API (zero external assets needed)
 */
function playCelebrationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Ascending major chord fanfare: C5, E5, G5, C6 with warm sparkle resonance
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.52);
    });
  } catch {
    // AudioContext blocked or not allowed in browser
  }
}

export const KnowledgeCheckQuiz: React.FC<KnowledgeCheckQuizProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [submitted, setSubmitted] = useState<{ [qIndex: number]: boolean }>({});

  // Slideshow navigation state: one question at a time
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Post-lesson countdown timer (120 seconds) - starts ONLY when visitor begins answering
  const TOTAL_TIME = 120;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeExpired, setTimeExpired] = useState<boolean>(false);
  const [hasPlayedCelebration, setHasPlayedCelebration] = useState<boolean>(false);

  // Sparkles canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!hasStarted || !timerRunning || timeExpired) return;

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setTimerRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeExpired(true);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timerRunning, timeLeft, timeExpired]);

  // Check if all questions are answered and correct
  const allAnswered = questions.length > 0 && questions.every((_, i) => submitted[i]);
  const allCorrect = allAnswered && questions.every((q, i) => selectedAnswers[i] === q.correctIndex);
  const correctCount = questions.filter((q, i) => submitted[i] && selectedAnswers[i] === q.correctIndex).length;

  // Trigger celebratory sounds and sparkling animation upon achieving all correct answers
  useEffect(() => {
    if (allCorrect && !hasPlayedCelebration) {
      playCelebrationChime();
      setHasPlayedCelebration(true);
      startSparkles();
    }
  }, [allCorrect, hasPlayedCelebration]);

  const startSparkles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#0891B2', '#D6A348', '#D67546', '#22C55E', '#38BDF8', '#F59E0B', '#E11D48'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: 60 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 7 - 2,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!questions || questions.length === 0) return null;

  // Start timer automatically on first answer interaction
  const ensureTimerStarted = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setTimerRunning(true);
    }
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx] || timeExpired) return;
    ensureTimerStarted();
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) {
      ensureTimerStarted();
      setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted({});
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);
    setHasStarted(false);
    setTimerRunning(false);
    setHasPlayedCelebration(false);
    setCurrentIndex(0);
  };

  const handleSingleReset = (qIdx: number) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
    setSubmitted((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
    setHasPlayedCelebration(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const currentQ = questions[currentIndex];
  const isCurrentAnswered = submitted[currentIndex];
  const currentChosenOpt = selectedAnswers[currentIndex];
  const isCurrentCorrect = currentChosenOpt === currentQ?.correctIndex;

  return (
    <div className="bg-[#FAF7F5] rounded-3xl p-6 md:p-8 border border-slate-200 mt-8 relative overflow-hidden shadow-xs">
      {/* Sparkling particle canvas for victory celebration */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* Quiz Header with Timer & Slideshow Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-6">
        <div>
          <div className="mb-2">
            <CreativeBadge label="CONCEPT VERIFICATION" theme="terracotta" size="md" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
            Timed Challenge: One Question at a Time ({questions.length} Total)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            The 120-second timer begins as soon as you select your first answer. Move through each question to test your understanding.
          </p>
        </div>

        {/* Timed Challenge Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              !hasStarted
                ? 'bg-slate-100 border-slate-300 text-slate-600'
                : timeLeft <= 20
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <Timer className={`w-4 h-4 ${!hasStarted ? 'text-slate-400' : timeLeft <= 20 ? 'text-rose-600' : 'text-[#0891B2]'}`} />
            <span>
              {!hasStarted ? '120s (Ready)' : timeFormatted}
            </span>
          </div>

          {hasStarted && (
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors"
              title={timerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleResetQuiz}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors"
            title="Reset Quiz & Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slideshow Progress Stepper */}
      <div className="flex items-center justify-between gap-2 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {questions.map((q, idx) => {
            const isSub = submitted[idx];
            const isCorr = isSub && selectedAnswers[idx] === q.correctIndex;
            const isCurr = currentIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-['Outfit'] ${
                  isCurr
                    ? 'bg-[#1F272A] text-white shadow-xs ring-2 ring-[#0891B2]/40'
                    : isSub
                    ? isCorr
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Question {idx + 1}</span>
                {isSub && (
                  isCorr ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono font-bold text-slate-600">
          Score: {correctCount}/{questions.length}
        </div>
      </div>

      {/* Time expired notification banner */}
      {timeExpired && !allCorrect && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
          <div>
            <strong className="font-bold block font-['Outfit']">Time limit reached!</strong>
            <span>Take your time to review the lesson principles above and restart the challenge whenever you are ready.</span>
          </div>
          <button
            onClick={handleResetQuiz}
            className="px-4 py-2 rounded-xl font-bold bg-[#1F272A] text-white hover:bg-slate-800 shrink-0 cursor-pointer font-['Outfit']"
          >
            Restart Challenge
          </button>
        </div>
      )}

      {/* Grand Victory Celebration Banner (Sparklings + Awesome/Amazing Remark + Chime) */}
      {allCorrect && (
        <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-500/15 via-[#47C3D3]/15 to-[#D6A348]/20 border-2 border-emerald-500/40 text-center space-y-3 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-emerald-500 text-white shadow-md mb-1">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D6A348] animate-bounce" />
            <span>Amazing! Awesome Concept Mastery!</span>
            <Sparkles className="w-6 h-6 text-[#47C3D3] animate-bounce" />
          </h4>
          <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed font-medium">
            Awesome! You completed the timed verification with 100% precision. You have mastered every principle of this lesson!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 shadow-2xs cursor-pointer font-['Outfit']"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Timed Verification</span>
            </button>
          </div>
        </div>
      )}

      {/* Single Question Slide Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500 font-['Outfit']">
                QUESTION {currentIndex + 1} OF {questions.length}
              </span>
              {!hasStarted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>Timer starts upon answering</span>
                </span>
              )}
            </div>

            {isCurrentAnswered && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg font-['Outfit'] ${
                  isCurrentCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCurrentCorrect ? 'CORRECT' : 'INCORRECT'}
              </span>
            )}
          </div>

          <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            <MathText content={currentQ.question} />
          </div>

          {/* Options for current question */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentChosenOpt === optIdx;
              let optStyle =
                'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';

              if (isCurrentAnswered) {
                if (optIdx === currentQ.correctIndex) {
                  optStyle =
                    'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                } else if (isSelected && !isCurrentCorrect) {
                  optStyle =
                    'border-rose-300 bg-rose-50 text-rose-900 font-medium';
                } else {
                  optStyle = 'border-slate-100 opacity-60 text-slate-400';
                }
              } else if (isSelected) {
                optStyle =
                  'border-[#0891B2] bg-[#EEF8FA] text-slate-900 font-semibold ring-1 ring-[#0891B2]';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isCurrentAnswered || timeExpired}
                  onClick={() => handleSelect(currentIndex, optIdx)}
                  className={`w-full text-left p-4 text-xs sm:text-sm rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span><MathText content={opt} /></span>
                  </div>
                  {isCurrentAnswered && optIdx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isCurrentAnswered && isSelected && !isCurrentCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Verification feedback & explanation */}
          {isCurrentAnswered && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm ${
                isCurrentCorrect
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <span className="font-bold block mb-1">
                {isCurrentCorrect ? 'Clarity Achieved!' : 'Key Distinction:'}
              </span>
              <MathText content={currentQ.explanation} />
            </div>
          )}

          {/* Slideshow Actions: Verify, Previous, Next */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer font-['Outfit']"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {!isCurrentAnswered ? (
                <button
                  onClick={() => handleCheck(currentIndex)}
                  disabled={currentChosenOpt === undefined || timeExpired}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1F272A] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer font-['Outfit'] shadow-xs"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={() => handleSingleReset(currentIndex)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Question</span>
                </button>
              )}

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#0891B2] hover:bg-[#0e7490] rounded-xl transition-colors cursor-pointer font-['Outfit'] shadow-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                allAnswered && (
                  <span className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    <Check className="w-4 h-4" />
                    <span>All Answered</span>
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
