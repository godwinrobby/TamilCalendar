/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Share2, 
  MoreVertical, 
  Coins, 
  Compass, 
  Sparkles, 
  Award, 
  Flame,
  Bell, 
  Volume2, 
  VolumeX, 
  Check, 
  HelpCircle,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { getTamilCalendarInfo } from './utils/tamilCalendar';
import DailyCalendarView from './components/DailyCalendarView';
import MonthlyCalendarView from './components/MonthlyCalendarView';
import AstrologyView from './components/AstrologyView';
import FestivalsView from './components/FestivalsView';
import FastingDaysView from './components/FastingDaysView';
import { motion, AnimatePresence } from 'motion/react';

type AppView = 'dashboard' | 'daily' | 'monthly' | 'astrology' | 'festivals' | 'fasting';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-13'); // Default to target local time date
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Sync date when sub-components update it
  const handleSelectDay = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setActiveView('daily');
  };

  // Get date information for the dashboard header
  const headerDateInfo = getTamilCalendarInfo(new Date(selectedDateStr));

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Copy app link to clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast('முகவரி நகலெடுக்கப்பட்டது! (Share link copied!)');
  };

  // Sound play simulation
  const handleSoundToggle = () => {
    setIsAudioPlaying(!isAudioPlaying);
    triggerToast(!isAudioPlaying ? 'மங்களகரமான மணி ஒலி இயக்கப்பட்டது (Bell sound enabled!)' : 'மணி ஒலி நிறுத்தப்பட்டது (Mute)');
  };

  const spiritualQuotes = [
    "உள்ளுவதெல்லாம் உயர்வுள்ளல் மற்றது தள்ளினுந் தள்ளாமை நீர்த்து. - திருவள்ளுவர்",
    "நன்றே நம்புங்கள், நன்மையே நடக்கும். எல்லாம் நன்மைக்கே!",
    "அன்பே சிவம். கோபத்தை விடுத்து அமைதியையும் அன்பையும் பகிருங்கள்.",
    "ஒன்றே குலம், ஒருவனே தேவன். மனித நேயமே மாபெரும் தர்மம்.",
    "அகராதி என்பது புத்தக அறிவு, ஆன்மீகம் என்பது அனுபவ அறிவு."
  ];

  const randomQuote = spiritualQuotes[new Date(selectedDateStr).getDate() % spiritualQuotes.length];

  return (
    <div className="min-h-screen bg-amber-50/20 md:bg-[#8A1A1A]/5 flex justify-center items-center text-[#5C1A1A] select-none md:p-6 font-sans" id="app_root">
      
      {/* Centered Mobile Device Frame simulating a native mobile app */}
      <div className="w-full max-w-md bg-[#FFFDF0] h-screen max-h-screen md:h-[92vh] md:max-h-[850px] flex flex-col justify-between shadow-2xl relative border-x border-amber-200 md:border md:border-amber-900/15 md:rounded-3xl overflow-hidden animate-fade-in" id="mobile_device_frame">
        
        {/* TOP STATUS BAR HEADER (Beautiful, elegant crimson and gold mobile header) */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706] shrink-0" id="top_status_bar">
          
          {activeView === 'dashboard' ? (
            <>
              {/* Logo & Branding */}
              <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')} id="header_date_box">
                <span className="text-2xl leading-none animate-pulse">🕉</span>
                <div className="leading-tight flex flex-col">
                  <span className="text-amber-300 font-extrabold text-sm tracking-wide">தமிழ் நாள்காட்டி</span>
                  <span className="text-[#FDF6E2] opacity-80 text-[10px] font-semibold">Tamil Calendar 2026</span>
                </div>
              </div>

              {/* Right Action Icons with gold circular outlines */}
              <div className="flex items-center space-x-1.5" id="header_utility_buttons">
                {/* Spiritual Quote Button */}
                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/50 text-[#FDF6E2] transition active:scale-95 cursor-pointer"
                  title="ஆன்மீக பொன்மொழி (Spiritual Quote)"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-300" />
                </button>

                {/* Sound Toggle Button */}
                <button 
                  onClick={handleSoundToggle}
                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/50 text-[#FDF6E2] transition active:scale-95 cursor-pointer"
                  title="ஒலி அமைப்புகள்"
                >
                  {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 animate-bounce text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-amber-300" />}
                </button>

                {/* Share button */}
                <button 
                  onClick={handleShare}
                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/50 text-[#FDF6E2] transition active:scale-95 cursor-pointer"
                  title="பகிரவும் (Share)"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                </button>

                {/* About Button */}
                <button 
                  onClick={() => setIsAboutOpen(true)}
                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/50 text-[#FDF6E2] transition active:scale-95 cursor-pointer"
                  title="விபரங்கள் (About)"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Back Button & Title */}
              <div className="flex items-center space-x-2.5" id="sub_header_left">
                <button 
                  onClick={() => setActiveView('dashboard')} 
                  className="flex items-center justify-center w-8 h-8 bg-[#FFFDF0] text-[#8A1A1A] rounded-full hover:bg-amber-50 transition shadow-md border border-amber-200/50 active:scale-95 flex-shrink-0 cursor-pointer"
                  title="முகப்பு (Home)"
                  id="header_back_btn"
                >
                  <ChevronLeft className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
                </button>
                <div className="flex items-center space-x-2">
                  {activeView === 'daily' && <Calendar className="w-4 h-4 text-amber-300" />}
                  {activeView === 'monthly' && <Calendar className="w-4 h-4 text-amber-300 animate-pulse" />}
                  {activeView === 'astrology' && <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />}
                  {activeView === 'festivals' && <Flame className="w-4 h-4 text-amber-300 animate-bounce" />}
                  {activeView === 'fasting' && <Bell className="w-4 h-4 text-amber-300 animate-pulse" />}
                  <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide text-white whitespace-nowrap">
                    {activeView === 'daily' && 'நாள்காட்டி (Daily Sheet)'}
                    {activeView === 'monthly' && 'மாதகாட்டி (Monthly Calendar)'}
                    {activeView === 'astrology' && 'ஜோதிடம் (Astrology)'}
                    {activeView === 'festivals' && 'விடுமுறைகள் (Festivals)'}
                    {activeView === 'fasting' && 'விரத நாட்கள் (Fasting)'}
                  </span>
                </div>
              </div>

              {/* Right Badge */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-amber-400 bg-[#701515] text-amber-300 shadow-inner flex-shrink-0 font-mono text-[11px] font-black" id="header_right_badge">
                {activeView === 'daily' && new Date(selectedDateStr).getDate()}
                {activeView === 'monthly' && (new Date(selectedDateStr).getMonth() + 1).toString().padStart(2, '0')}
                {activeView === 'astrology' && '🪐'}
                {activeView === 'festivals' && '🎉'}
                {activeView === 'fasting' && '🔔'}
              </div>
            </>
          )}
        </header>

        {/* 2. MAIN WEBSITE CONTENT BODY */}
        <main className={`flex-grow w-full overflow-y-auto bg-[#FFFDF0] scrollbar-none relative transition-all duration-200 ${
          activeView === 'dashboard' ? 'px-4 py-3' : 'px-2 py-1'
        }`} id="web_main_content">
          
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div 
                key="dashboard_view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-5 pb-20"
                id="dashboard_view"
              >
                
                {/* Centered Title */}
                <div className="text-center py-2 px-1" id="main_banner_title">
                  <h2 className="text-xl font-black font-display text-[#8A1A1A] tracking-wider">நாள்காட்டி & நாட்குறிப்பு</h2>
                  <div className="w-11/12 mx-auto border-b-2 border-amber-500/25 mt-1.5"></div>
                </div>

                {/* 2x2 Feature Grid */}
                <div className="grid grid-cols-2 gap-3" id="main_features_grid">
                  
                  {/* Option 1: Daily Sheet Calendar */}
                  <button
                    onClick={() => setActiveView('daily')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_daily_sheet"
                  >
                    <Calendar className="w-6 h-6 text-amber-300 mb-1 group-hover:rotate-6 transition-transform" />
                    <span className="text-xs font-black tracking-tight">நாள்காட்டி</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Daily Sheet</span>
                  </button>

                  {/* Option 2: Monthly Grid Calendar */}
                  <button
                    onClick={() => setActiveView('monthly')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_monthly_grid"
                  >
                    <div className="grid grid-cols-3 gap-0.5 w-5 h-5 mb-1.5 text-amber-300 group-hover:scale-105 transition-transform">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-amber-300 w-1.5 h-1.5 rounded-sm" />
                      ))}
                    </div>
                    <span className="text-xs font-black tracking-tight">மாதகாட்டி</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Monthly Calendar</span>
                  </button>

                  {/* Option 3: Festivals list */}
                  <button
                    onClick={() => setActiveView('festivals')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_festivals"
                  >
                    <Sparkles className="w-6 h-6 text-amber-300 mb-1 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-black tracking-tight leading-tight">விடுமுறைகள்</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Festivals & Holidays</span>
                  </button>

                  {/* Option 4: Fasting schedule */}
                  <button
                    onClick={() => setActiveView('fasting')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_fasting"
                  >
                    <Award className="w-6 h-6 text-amber-300 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black tracking-tight leading-tight">விரத நாட்கள்</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Fasting Days</span>
                  </button>

                </div>



                {/* Horizontal Astrology Row */}
                <div id="astrology_row">
                  <button
                    onClick={() => setActiveView('astrology')}
                    className="w-full bg-white border-2 border-[#8A1A1A] rounded-2xl p-3 flex items-center justify-center space-x-3 shadow-sm hover:bg-amber-50/40 active:scale-95 transition cursor-pointer"
                    id="btn_to_astrology"
                  >
                    <div className="w-6 h-6 bg-[#8A1A1A]/10 rounded-full flex items-center justify-center border border-amber-300">
                      <Compass className="w-3.5 h-3.5 text-[#8A1A1A] animate-spin-slow" />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-xs font-black text-[#8A1A1A] block">ஜோதிடம் மற்றும் ஜாதகம்</span>
                      <span className="text-[9px] font-bold text-amber-800 block">Daily Horoscopes & Astro Guide</span>
                    </div>
                  </button>
                </div>

                {/* Promo consultation banner */}
                <div id="consultation_banner_row">
                  <button
                    onClick={() => {
                      setSelectedDateStr('2026-07-13');
                      setActiveView('astrology');
                      triggerToast('ஜாதகம் கணிக்கும் பக்கத்திற்கு செல்கிறது...');
                    }}
                    className="w-full bg-[#8A1A1A] text-[#FDF6E2] border-2 border-amber-400 rounded-2xl shadow-md p-3.5 flex items-center justify-between hover:bg-[#9C2020] hover:scale-[1.01] active:scale-95 transition relative overflow-hidden group cursor-pointer"
                    id="btn_jathagam_consultation"
                  >
                    <div className="flex items-center space-x-3 z-10">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-amber-300/30">
                        <Flame className="w-4 h-4 text-amber-300 fill-amber-200 animate-pulse" />
                      </div>
                      <div className="text-left leading-tight">
                        <h4 className="text-[11px] font-black text-amber-200">ஓம் ஆஸ்ட்ரோ (Om Astro)</h4>
                        <p className="text-[9px] text-amber-100/90 font-medium mt-0.5">கணினி ஜாதகம் கணித்தல் - வெறும் ₹30 முதல்</p>
                      </div>
                    </div>
                    <span className="bg-amber-400 text-[#8A1A1A] font-black text-[9px] rounded-lg px-2.5 py-1 shadow border border-amber-200 flex-shrink-0">கணிக்க</span>
                  </button>
                </div>

                {/* Today's Panchangam (தினசரி பஞ்சாங்கம்) Widget */}
                <div className="bg-white border-2 border-[#8A1A1A] rounded-2xl p-4 shadow-sm space-y-3" id="panchangam_widget">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <h3 className="text-xs font-black text-[#8A1A1A] flex items-center space-x-1.5">
                      <span className="text-sm">📅</span>
                      <span>இன்றைய பஞ்சாங்கம் (Almanac)</span>
                    </h3>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {headerDateInfo.isAuspicious ? 'சுப நாள் (Auspicious)' : 'சாதாரண நாள்'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-amber-50/40 p-2 rounded-xl border border-amber-100">
                      <span className="text-[9px] text-amber-800 font-bold block">திதி (Thithi)</span>
                      <span className="font-extrabold text-[#8A1A1A]">{headerDateInfo.thithi}</span>
                    </div>
                    <div className="bg-amber-50/40 p-2 rounded-xl border border-amber-100">
                      <span className="text-[9px] text-amber-800 font-bold block">நட்சத்திரம் (Star)</span>
                      <span className="font-extrabold text-[#8A1A1A]">{headerDateInfo.nakshatram}</span>
                    </div>
                    <div className="bg-amber-50/40 p-2 rounded-xl border border-amber-100 col-span-2 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-amber-800 font-bold block">நல்ல நேரம் (Auspicious Time)</span>
                        <span className="font-extrabold text-[#8A1A1A] text-[10px]">காலை: {headerDateInfo.nallaNeram.morning} • மாலை: {headerDateInfo.nallaNeram.evening}</span>
                      </div>
                    </div>
                    <div className="bg-amber-50/40 p-2 rounded-xl border border-amber-100 col-span-2">
                      <span className="text-[9px] text-amber-800 font-bold block">யோகம் (Yogam)</span>
                      <span className="font-extrabold text-[#8A1A1A]">{headerDateInfo.yogam}</span>
                    </div>
                  </div>

                  <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100/60 text-[11px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-semibold text-rose-900">ராகு காலம் (Rahu):</span>
                      <span className="font-bold text-rose-950">{headerDateInfo.raghuKalam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-amber-900">எமகண்டம் (Yama):</span>
                      <span className="font-bold text-amber-950">{headerDateInfo.yamagandam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-emerald-900">சூலம் & பரிகாரம்:</span>
                      <span className="font-bold text-emerald-950">{headerDateInfo.soolam} ({headerDateInfo.parigaram})</span>
                    </div>
                  </div>

                  {headerDateInfo.festivals.length > 0 && (
                    <div className="bg-amber-100/55 p-3 rounded-xl border border-amber-200/50">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 block mb-1">விசேஷங்கள் / விரதங்கள்</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {headerDateInfo.festivals.map((fest, idx) => (
                          <span key={idx} className="bg-[#8A1A1A] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-lg">
                            {fest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Spiritual Quote Block */}
                <div className="bg-[#FCF8E3]/60 border border-dashed border-amber-400/80 rounded-2xl p-4 text-center shadow-inner relative flex flex-col justify-center min-h-[90px]" id="desktop_quote_panel">
                  <span className="text-[9px] uppercase font-black tracking-widest text-amber-800 block mb-1">இன்றைய பொன்மொழி</span>
                  <p className="text-xs font-bold text-[#8A1A1A] italic leading-relaxed px-1">
                    "{randomQuote}"
                  </p>
                </div>

                {/* Bottom decorative segment */}
                <div className="bg-[#FCF8E3] border border-amber-200 rounded-2xl py-3 flex justify-center items-center shadow-inner relative overflow-hidden group" id="decor_om_box">
                  <span className="text-2xl text-[#8A1A1A]/85 font-black group-hover:rotate-12 transition-transform duration-300 ease-out">🕉</span>
                </div>

              </motion.div>
            )}

            {/* Active Sub-views (Render inside the frame) */}
            {activeView === 'daily' && (
              <motion.div key="daily_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <DailyCalendarView initialDate={selectedDateStr} onClose={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {activeView === 'monthly' && (
              <motion.div key="monthly_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <MonthlyCalendarView onSelectDay={handleSelectDay} onClose={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {activeView === 'astrology' && (
              <motion.div key="astrology_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <AstrologyView onClose={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {activeView === 'festivals' && (
              <motion.div key="festivals_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <FestivalsView onSelectDay={handleSelectDay} onClose={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {activeView === 'fasting' && (
              <motion.div key="fasting_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <FastingDaysView onSelectDay={handleSelectDay} onClose={() => setActiveView('dashboard')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification element (Renders inside the device frame) */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#8A1A1A] text-[#FDF6E2] px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-1.5 border border-amber-400 w-[90%]"
                id="toast_message"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* 3. PERSISTENT NAVIGATION BAR FOR CONTAINER */}
        <nav className="h-16 bg-[#8A1A1A] border-t-4 border-[#D97706] flex items-center justify-around text-[#FDF6E2] shrink-0 z-30 shadow-lg" id="bottom_navbar">
          <button 
            onClick={() => setActiveView('astrology')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'astrology' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="ஜோதிடம்"
            id="nav_btn_astrology"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] block mt-0.5">ஜோதிடம்</span>
          </button>

          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'dashboard' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="முகப்பு"
            id="nav_btn_home"
          >
            <span className="text-xl leading-none">🕉</span>
            <span className="text-[10px] block mt-0.5">முகப்பு</span>
          </button>

          <button 
            onClick={() => setActiveView('fasting')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'fasting' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="விரதங்கள்"
            id="nav_btn_fasting"
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px] block mt-0.5">விரதங்கள்</span>
          </button>
        </nav>

      </div>

      {/* 4. DIALOGS & OVERLAY MODALS (Rendered outside mobile frame for full screen overlays) */}
      {/* Info/About Dialogue Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="about_modal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <HelpCircle className="w-12 h-12 text-[#8A1A1A] mx-auto animate-pulse" />
              <h3 className="text-base md:text-lg font-black text-[#8A1A1A] mt-3">தமிழ் நாள்காட்டி (Tamil Calendar)</h3>
              <p className="text-xs text-amber-950 font-medium leading-relaxed mt-2 text-justify">
                இது 2026 பராபவ & விஸ்வாவசு வருடத்திற்கான துல்லியமான தமிழ் நாள்காட்டி மற்றும் பஞ்சாங்கம் ஆகும். தினசரி நல்ல நேரம், ராகு காலம், எமகண்டம், திதி, நட்சத்திரம், பண்டிகைகள், விரத நாட்கள் மற்றும் கணினி ஜாதகங்களை எளிமையாகக் கணித்தலை இந்த இணையதளம் வழங்குகிறது.
              </p>
              <div className="mt-4 p-2 bg-white/70 border border-amber-200 rounded-xl text-left text-[10px] font-bold text-amber-900 leading-tight">
                <p>• பதிப்பு (Version): 1.0.0 (பராபவ வருடம்)</p>
                <p>• தொழில்நுட்பம்: React 19, Tailwind CSS v4, Motion</p>
                <p>• தளம்: AI Studio Sandbox Space</p>
              </div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="mt-5 w-full bg-[#8A1A1A] text-[#FDF6E2] py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#A32222] transition cursor-pointer"
                id="btn_close_about"
              >
                மூடவும் (Close)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spiritual Quote Dialogue Modal */}
      <AnimatePresence>
        {isQuoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="quote_modal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <Compass className="w-10 h-10 text-amber-600 mx-auto animate-spin-slow mb-2" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block mb-1">இன்றைய ஆன்மீக உரை</span>
              <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 my-2 shadow-inner">
                <p className="text-xs md:text-sm font-extrabold text-[#8A1A1A] italic leading-relaxed">
                  "{randomQuote}"
                </p>
              </div>
              <p className="text-[10px] text-amber-900/60 font-semibold mt-1">
                நாள்தோறும் நற்சிந்தனைகளுடன் நாளைத் தொடங்குங்கள்.
              </p>
              <button
                onClick={() => setIsQuoteOpen(false)}
                className="mt-5 w-full bg-[#8A1A1A] text-[#FDF6E2] py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#A32222] transition cursor-pointer"
                id="btn_close_quote"
              >
                அருள் பெறுக (Close)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
