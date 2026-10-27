import React, { useState } from 'react';
import { X, CheckCircle, HeartHandshake } from 'lucide-react';
import { contentService } from '../lib/supabaseClient';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInitiative?: string;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  defaultInitiative = 'STEM Learning Kits for Schools'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initiative, setInitiative] = useState(defaultInitiative);
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('Weekends (Flexible)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [autoCloseActive, setAutoCloseActive] = useState(true);

  // Auto-dismiss and return visitor to page after submission
  React.useEffect(() => {
    if (!isSuccess || !autoCloseActive) return;

    if (countdown <= 0) {
      handleReset();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSuccess, autoCloseActive, countdown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await contentService.submitVolunteer({
        name,
        email,
        initiative,
        skills,
        availability
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSkills('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D67546] uppercase tracking-wider mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>Eusatis Impact Participation</span>
            </div>
            <h3 className="text-2xl font-bold font-['Outfit'] text-[#1F272A] tracking-tight">
              Join a Community Initiative
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Knowledge is meant to improve lives. Tell us how you would like to participate in outreach workshops or school mentoring.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Initiative
                </label>
                <select
                  value={initiative}
                  onChange={(e) => setInitiative(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] bg-white"
                >
                  <option value="Practical STEM Learning Kits for Schools">
                    Practical STEM Learning Kits for Schools
                  </option>
                  <option value="Hospital Pediatric Learning Corners">
                    Hospital Pediatric Learning Corners
                  </option>
                  <option value="Community Mentorship & Tutoring">
                    Community Mentorship & Tutoring
                  </option>
                  <option value="Curriculum Translation & Accessibility">
                    Curriculum Translation & Accessibility
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How can you contribute? (Background / Skills)
                </label>
                <textarea
                  rows={3}
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Science teaching background, logistics coordination, kit assembly..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-[#1F272A] bg-[#47C3D3] hover:bg-[#3db0bf] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold font-['Outfit'] text-slate-900">
                Application Received!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{name}</strong>. Our outreach coordinator will review your background and reach out to align on upcoming initiatives.
              </p>
            </div>

            {autoCloseActive ? (
              <div className="p-4 rounded-2xl bg-[#47C3D3]/10 border border-[#47C3D3]/30 max-w-xs mx-auto space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0F6F7B] font-['Outfit']">
                  <span className="w-2 h-2 rounded-full bg-[#47C3D3] animate-ping" />
                  <span>Returning you back in {countdown}s...</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-[#47C3D3] to-[#D6A348] h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleReset}
                    className="px-4 py-1.5 rounded-xl font-bold text-xs bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer font-['Outfit']"
                  >
                    Return Now
                  </button>
                  <button
                    onClick={() => setAutoCloseActive(false)}
                    className="px-3 py-1.5 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Stay
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold bg-[#1F272A] text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
