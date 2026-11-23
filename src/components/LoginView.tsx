'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { initialUsers } from '@/lib/store';
import { User } from '@/types';
import AppLogo from '@/components/AppLogo';
import {
  Smartphone,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Bell,
  ShieldCheck,
  User as UserIcon,
  Wrench,
  Check,
} from 'lucide-react';

interface LoginViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function LoginView({ isModal = false, onClose }: LoginViewProps) {
  const { language, setLanguage, t, loginWithPhone, loginAsUser } = useApp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulatedSmsVisible, setSimulatedSmsVisible] = useState(false);

  // Send OTP handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.trim().replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబరును నమోదు చేయండి'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setOtpSent(true);
      setLoading(false);
      setSimulatedSmsVisible(true);
    }, 500);
  };

  // Verify OTP handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = enteredOtp.join('');

    if (otpString.length !== 4) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి 4 అంకెల OTP ని నమోదు చేయండి'
          : 'Please enter the 4-digit OTP'
      );
      return;
    }

    if (otpString !== generatedOtp && otpString !== '1234') {
      setErrorMsg(
        language === 'te'
          ? 'తప్పు OTP. దయచేసి మళ్లీ ప్రయత్నించండి'
          : 'Invalid OTP. Please try again or click Auto-fill'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginWithPhone(phoneNumber, otpString);
      setLoading(false);
      if (onClose) onClose();
    }, 400);
  };

  const handleOtpBoxChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newArr = [...enteredOtp];
    newArr[index] = val;
    setEnteredOtp(newArr);

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const fillDemoOtp = () => {
    setEnteredOtp(generatedOtp.split(''));
  };

  const quickLoginAs = (user: User) => {
    loginAsUser(user);
    if (onClose) onClose();
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-emerald-50/30 ${isModal ? 'py-4' : ''}`}>
      {/* Decorative Tricolor Ribbons and Harvest Motifs (SVG Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
        {/* Top-Right Flowing Green & Orange Ribbons */}
        <svg
          className="absolute -top-12 -right-12 w-96 h-96 sm:w-[500px] sm:h-[500px] text-emerald-600/15"
          style={{ width: '400px', height: '400px', maxWidth: '100vw' }}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M500 0C400 120 350 250 500 400V0Z"
            fill="currentColor"
          />
          <path
            d="M500 80C380 180 320 300 480 480V80Z"
            fill="#ea580c"
            fillOpacity="0.12"
          />
        </svg>

        {/* Bottom-Left Flowing Orange & Green Waves */}
        <svg
          className="absolute -bottom-16 -left-16 w-96 h-96 sm:w-[500px] sm:h-[500px]"
          style={{ width: '400px', height: '400px', maxWidth: '100vw' }}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 500C120 380 250 350 400 500H0Z"
            fill="#ea580c"
            fillOpacity="0.14"
          />
          <path
            d="M0 420C150 320 280 300 450 450H0Z"
            fill="#15803d"
            fillOpacity="0.10"
          />
        </svg>

        {/* Wheat Stalk Silhouette (Left) */}
        <div
          className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 opacity-25 text-amber-600 select-none pointer-events-none overflow-hidden"
          style={{ width: '100px', height: '380px' }}
        >
          <svg style={{ width: '100px', height: '380px' }} viewBox="0 0 100 400" fill="currentColor">
            <path d="M50 400 Q45 200 48 50" stroke="#d97706" strokeWidth="3" fill="none" />
            <ellipse cx="36" cy="120" rx="12" ry="6" transform="rotate(-30 36 120)" />
            <ellipse cx="64" cy="130" rx="12" ry="6" transform="rotate(30 64 130)" />
            <ellipse cx="34" cy="160" rx="14" ry="7" transform="rotate(-30 34 160)" />
            <ellipse cx="66" cy="170" rx="14" ry="7" transform="rotate(30 66 170)" />
            <ellipse cx="32" cy="200" rx="14" ry="7" transform="rotate(-30 32 200)" />
            <ellipse cx="68" cy="210" rx="14" ry="7" transform="rotate(30 68 210)" />
            <ellipse cx="30" cy="240" rx="14" ry="7" transform="rotate(-30 30 240)" />
            <ellipse cx="70" cy="250" rx="14" ry="7" transform="rotate(30 70 250)" />
          </svg>
        </div>

        {/* Wheat Stalk Silhouette (Right) */}
        <div
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-25 text-amber-600 select-none pointer-events-none overflow-hidden"
          style={{ width: '100px', height: '380px' }}
        >
          <svg style={{ width: '100px', height: '380px' }} viewBox="0 0 100 400" fill="currentColor">
            <path d="M50 400 Q55 200 52 50" stroke="#d97706" strokeWidth="3" fill="none" />
            <ellipse cx="64" cy="120" rx="12" ry="6" transform="rotate(30 64 120)" />
            <ellipse cx="36" cy="130" rx="12" ry="6" transform="rotate(-30 36 130)" />
            <ellipse cx="66" cy="160" rx="14" ry="7" transform="rotate(30 66 160)" />
            <ellipse cx="34" cy="170" rx="14" ry="7" transform="rotate(-30 34 170)" />
            <ellipse cx="68" cy="200" rx="14" ry="7" transform="rotate(30 68 200)" />
            <ellipse cx="32" cy="210" rx="14" ry="7" transform="rotate(-30 32 210)" />
            <ellipse cx="70" cy="240" rx="14" ry="7" transform="rotate(30 70 240)" />
            <ellipse cx="30" cy="250" rx="14" ry="7" transform="rotate(-30 30 250)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Screen Title (Matching Screenshots 1 & 2) */}
        <div className="text-center mb-6">
          {!otpSent ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 tracking-tight">
                Quick OTP Login
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mt-1">
                సులభమైన OTP లాగిన్
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 tracking-tight">
                Verify OTP
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mt-1">
                OTP నిర్ధారించండి
              </h2>
            </>
          )}
        </div>

        {/* Simulated SMS Notification Banner */}
        {simulatedSmsVisible && (
          <div className="mb-4 bg-emerald-700 text-white p-3 rounded-2xl shadow-xl border border-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    SMS from: GOV-GRAM
                  </span>
                  <button
                    onClick={fillDemoOtp}
                    className="text-[10px] bg-white text-emerald-900 font-bold px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors shadow-xs"
                  >
                    Auto-Fill ({generatedOtp})
                  </button>
                </div>
                <p className="text-xs font-medium mt-0.5">
                  &ldquo;Your GramConnect verification OTP is{' '}
                  <span className="font-extrabold text-amber-200 text-sm tracking-wider underline">
                    {generatedOtp}
                  </span>
                  . Valid for 10 mins. మన గ్రామం · మన బాధ్యత&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Mockup Card Container */}
        <div className="relative bg-white rounded-[36px] shadow-2xl border-[3px] border-slate-200/90 p-6 sm:p-8 overflow-hidden backdrop-blur-xs">
          {/* Subtle phone speaker notch at top */}
          <div className="w-16 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>

          {/* Centered Logo with GramConnect Branding */}
          <div className="flex justify-center mb-5">
            <AppLogo size="xl" layout="col" showSubtitle={false} />
          </div>

          {/* Language Toggle Capsule (Image 2 style) */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200/80 shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'te'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
              <span className="text-slate-300 text-xs px-0.5">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Content: Step 1 vs Step 2 */}
          {!otpSent ? (
            /* STEP 1: MOBILE NUMBER INPUT */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder={language === 'te' ? 'మొబైల్ నంబర్ (Mobile Number)' : 'Mobile Number'}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Big Vibrant Orange Pill Button: "Get OTP" */}
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{language === 'te' ? 'OTP పంపుతోంది...' : 'Sending OTP...'}</span>
                  </>
                ) : (
                  <span>{language === 'te' ? 'Get OTP (OTP పొందండి)' : 'Get OTP'}</span>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 4-DIGIT OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold mb-3">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>+91 {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-orange-600 underline font-bold ml-1 hover:text-orange-700"
                  >
                    {language === 'te' ? 'మార్చు' : 'Edit'}
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-800 mb-4">
                  {language === 'te' ? 'OTP నమోదు చేయండి' : 'Enter OTP'}
                </p>

                {/* 4 Square Rounded OTP Boxes */}
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={enteredOtp[idx]}
                      onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-black bg-white border-2 border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Resend OTP Link */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newOtp);
                      setSimulatedSmsVisible(true);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    {language === 'te' ? 'OTP మళ్లీ పంపండి (Resend OTP)' : 'Resend OTP'}
                  </button>
                </div>
              </div>

              {/* Big Vibrant Orange Pill Button: "Verify & Login" */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-base rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{language === 'te' ? 'ధృవీకరిస్తోంది...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <span>{language === 'te' ? 'Verify & Login (ధృవీకరించి లాగిన్)' : 'Verify & Login'}</span>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo 1-Click Role Logins (Citizen, Admin, Worker) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'te'
                  ? '⚡ త్వరిత డెమో లాగిన్'
                  : '⚡ Quick Demo Logins'}
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                1-Click Test
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Citizen */}
              <button
                type="button"
                onClick={() => quickLoginAs(initialUsers[0])}
                className="p-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-center transition-all group flex flex-col items-center justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-1">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Citizen
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  పౌరుడు
                </span>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => quickLoginAs(initialUsers[2])}
                className="p-2.5 rounded-2xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-center transition-all group flex flex-col items-center justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center mb-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-orange-800">
                  Admin
                </span>
                <span className="text-[10px] text-orange-700 font-semibold">
                  పంచాయతీ
                </span>
              </button>

              {/* Worker */}
              <button
                type="button"
                onClick={() => quickLoginAs(initialUsers[3])}
                className="p-2.5 rounded-2xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100 text-center transition-all group flex flex-col items-center justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center mb-1">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                  Worker
                </span>
                <span className="text-[10px] text-teal-700 font-semibold">
                  సిబ్బంది
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Brand Motto */}
        <div className="text-center mt-5 text-xs text-slate-600 font-medium">
          <span className="text-emerald-800 font-bold">స్మార్ట్ గ్రామం</span> • <span className="text-orange-600 font-bold">మన బాధ్యత</span>
        </div>
      </div>
    </div>
  );
}
