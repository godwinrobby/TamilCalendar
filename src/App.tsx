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
import { getTamilCalendarInfo, getCurrentISTDateString } from './utils/tamilCalendar';
import DailyCalendarView from './components/DailyCalendarView';
import MonthlyCalendarView from './components/MonthlyCalendarView';
import AstrologyView from './components/AstrologyView';
import FestivalsView from './components/FestivalsView';
import FastingDaysView from './components/FastingDaysView';
import AdminView from './components/AdminView';
import { motion, AnimatePresence } from 'motion/react';

type AppView = 'dashboard' | 'daily' | 'monthly' | 'astrology' | 'festivals' | 'fasting' | 'admin';

const parseHashRoute = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash || '#/dashboard' : '#/dashboard';
  const [pathPart, queryPart] = hash.split('?');
  const view = pathPart.replace('#/', '') || 'dashboard';
  
  const validViews: AppView[] = ['dashboard', 'daily', 'monthly', 'astrology', 'festivals', 'fasting', 'admin'];
  const activeView = validViews.includes(view as AppView) ? (view as AppView) : 'dashboard';
  
  let date = getCurrentISTDateString();
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const dateParam = params.get('date');
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      date = dateParam;
    }
  }
  return { activeView, selectedDateStr: date };
};

export default function App() {
  const initialRoute = parseHashRoute();
  const [activeView, setActiveView] = useState<AppView>(initialRoute.activeView);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(initialRoute.selectedDateStr);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Sync state with hash change
  React.useEffect(() => {
    const handleHashChange = () => {
      const { activeView: newView, selectedDateStr: newDate } = parseHashRoute();
      setActiveView(newView);
      setSelectedDateStr(newDate);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if none exists to make URL look beautiful
    if (!window.location.hash) {
      window.location.hash = '#/dashboard';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Router-based navigation helper
  const navigateTo = (view: AppView, dateStr?: string) => {
    const dateToUse = dateStr || selectedDateStr;
    let newHash = `#/${view}`;
    if (view === 'daily' && dateToUse) {
      newHash += `?date=${dateToUse}`;
    }
    window.location.hash = newHash;
  };

  // Sync date when sub-components update it
  const handleSelectDay = (dateStr: string) => {
    navigateTo('daily', dateStr);
  };

  // Get date information for the dashboard header
  const headerDateInfo = getTamilCalendarInfo(selectedDateStr);

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

  const dateNum = parseInt(selectedDateStr.split('-')[2]) || 1;
  const randomQuote = spiritualQuotes[dateNum % spiritualQuotes.length];

  return (
    <div className="min-h-screen bg-amber-50/20 md:bg-[#8A1A1A]/5 flex justify-center items-center text-[#5C1A1A] select-none md:p-6 lg:p-0 font-sans" id="app_root">
      
      {/* Centered Mobile Device Frame simulating a native mobile app (Visible ONLY on Mobile/Tablet screens) */}
      <div className="w-full max-w-md bg-[#FFFDF0] h-screen max-h-screen md:h-[92vh] md:max-h-[850px] flex flex-col justify-between shadow-2xl relative border-x border-amber-200 md:border md:border-amber-900/15 md:rounded-3xl overflow-hidden animate-fade-in lg:hidden" id="mobile_device_frame">
        
        {/* TOP STATUS BAR HEADER (Beautiful, elegant crimson and gold mobile header) */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706] shrink-0" id="top_status_bar">
          
          {activeView === 'dashboard' ? (
            <>
              {/* Logo & Branding */}
              <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigateTo('dashboard')} id="header_date_box">
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
                  onClick={() => navigateTo('dashboard')} 
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
                    onClick={() => navigateTo('daily')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_daily_sheet"
                  >
                    <Calendar className="w-6 h-6 text-amber-300 mb-1 group-hover:rotate-6 transition-transform" />
                    <span className="text-xs font-black tracking-tight">நாள்காட்டி</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Daily Sheet</span>
                  </button>

                  {/* Option 2: Monthly Grid Calendar */}
                  <button
                    onClick={() => navigateTo('monthly')}
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
                    onClick={() => navigateTo('festivals')}
                    className="bg-[#8A1A1A] text-[#FDF6E2] p-4 rounded-2xl shadow-sm border border-amber-400/20 flex flex-col items-center justify-center text-center transition hover:scale-[1.01] active:scale-95 cursor-pointer h-28 relative overflow-hidden group"
                    id="btn_to_festivals"
                  >
                    <Sparkles className="w-6 h-6 text-amber-300 mb-1 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-black tracking-tight leading-tight">விடுமுறைகள்</span>
                    <span className="text-[9px] opacity-75 mt-0.5 block">Festivals & Holidays</span>
                  </button>

                  {/* Option 4: Fasting schedule */}
                  <button
                    onClick={() => navigateTo('fasting')}
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
                    onClick={() => navigateTo('astrology')}
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
                      navigateTo('astrology', '2026-07-13');
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
                <DailyCalendarView initialDate={selectedDateStr} onClose={() => navigateTo('dashboard')} />
              </motion.div>
            )}

            {activeView === 'monthly' && (
              <motion.div key="monthly_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <MonthlyCalendarView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
              </motion.div>
            )}

            {activeView === 'astrology' && (
              <motion.div key="astrology_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <AstrologyView selectedDateStr={selectedDateStr} onClose={() => navigateTo('dashboard')} />
              </motion.div>
            )}

            {activeView === 'festivals' && (
              <motion.div key="festivals_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <FestivalsView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
              </motion.div>
            )}

            {activeView === 'fasting' && (
              <motion.div key="fasting_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <FastingDaysView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
              </motion.div>
            )}

            {activeView === 'admin' && (
              <motion.div key="admin_view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col overflow-hidden">
                <AdminView onClose={() => navigateTo('dashboard')} />
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
            onClick={() => navigateTo('astrology')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'astrology' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="ஜோதிடம்"
            id="nav_btn_astrology"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] block mt-0.5">ஜோதிடம்</span>
          </button>

          <button 
            onClick={() => navigateTo('dashboard')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'dashboard' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="முகப்பு"
            id="nav_btn_home"
          >
            <span className="text-xl leading-none">🕉</span>
            <span className="text-[10px] block mt-0.5">முகப்பு</span>
          </button>

          <button 
            onClick={() => navigateTo('fasting')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'fasting' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="விரதங்கள்"
            id="nav_btn_fasting"
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px] block mt-0.5">விரதங்கள்</span>
          </button>
        </nav>

      </div>

      {/* Brand New Dedicated Widescreen Desktop Website View (Visible ONLY on lg and above) */}
      <div className="hidden lg:flex flex-col w-screen h-screen bg-[#FFFDF0] overflow-hidden relative animate-fade-in" id="desktop_website_frame">
        {/* TOP STATUS BAR HEADER (Beautiful, elegant crimson and gold desktop header) */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706] shrink-0" id="desktop_header">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('dashboard')} id="desktop_header_logo_box">
            <span className="text-3xl leading-none animate-pulse">🕉</span>
            <div className="leading-tight flex flex-col">
              <span className="text-amber-300 font-black text-base tracking-wider font-display">தமிழ் பாரம்பரிய நாள்காட்டி 2026</span>
              <span className="text-[#FDF6E2]/85 text-[10px] font-bold">Tamil Traditional Calendar • பராபவ வருடம்</span>
            </div>
          </div>

          {/* Today's Auspicious Indicator */}
          <div className="hidden xl:flex items-center space-x-2.5 bg-white/10 px-4 py-1.5 rounded-full border border-amber-400/30 text-amber-100 text-xs font-bold" id="desktop_header_center_msg">
            <span>இன்றைய நாள்:</span>
            <span className="text-amber-300 font-extrabold">{headerDateInfo.tamilMonth} {headerDateInfo.tamilDay} ({headerDateInfo.dayOfWeek})</span>
            <span className="opacity-40">|</span>
            <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded text-[10px]">
              {headerDateInfo.isAuspicious ? 'சுப முகூர்த்த நாள்' : 'சாதாரண நாள்'}
            </span>
          </div>

          {/* Right Action Icons with gold circular outlines */}
          <div className="flex items-center space-x-3" id="desktop_header_right_buttons">
            {/* Spiritual Quote Button */}
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/30 text-[#FDF6E2] text-xs font-extrabold transition active:scale-95 cursor-pointer"
              title="ஆன்மீக பொன்மொழி (Spiritual Quote)"
            >
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>ஆன்மீக உரை</span>
            </button>

            {/* Sound Toggle Button */}
            <button 
              onClick={handleSoundToggle}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/30 text-[#FDF6E2] text-xs font-extrabold transition active:scale-95 cursor-pointer"
              title="ஒலி அமைப்புகள்"
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 animate-bounce text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isAudioPlaying ? 'ஒலி நிறுத்து' : 'ஒலி இயக்கு'}</span>
            </button>

            {/* Share button */}
            <button 
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/30 text-[#FDF6E2] text-xs font-extrabold transition active:scale-95 cursor-pointer"
              title="பகிரவும் (Share)"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>பகிர்க</span>
            </button>

            {/* About Button */}
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 border border-amber-400/30 text-[#FDF6E2] text-xs font-extrabold transition active:scale-95 cursor-pointer"
              title="விபரங்கள் (About)"
            >
              <MoreVertical className="w-3.5 h-3.5 text-amber-300" />
              <span>விவரங்கள்</span>
            </button>
          </div>
        </header>

        {/* MAIN SPLIT PANELS (Left: Persistent Daily Sheet, Right: Sub-views or Dashboard) */}
        <div className="flex-grow flex overflow-hidden w-full h-full" id="desktop_layout_body">
          
          {/* Left Column (38% width) - Persistent Daily Calendar view */}
          <div className="w-[370px] xl:w-[410px] border-r-4 border-[#8A1A1A]/15 bg-[#FFFDF5] flex flex-col overflow-hidden shrink-0" id="desktop_left_pane">
            <div className="bg-[#8A1A1A]/5 px-4 py-2 border-b-2 border-dashed border-[#8A1A1A]/15 flex items-center justify-between shrink-0" id="desktop_left_pane_header">
              <span className="text-[10px] font-black text-[#8A1A1A] tracking-wider uppercase">தினசரி நாட்காட்டி தாள் (Daily Sheet)</span>
              <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">பராபவ</span>
            </div>
            <div className="flex-grow overflow-hidden relative">
              <DailyCalendarView initialDate={selectedDateStr} onClose={() => {}} />
            </div>
          </div>

          {/* Right Column (62% width) - Dynamic view with modern custom tab-bar */}
          <div className="flex-grow flex flex-col overflow-hidden bg-[#FFFDF0]" id="desktop_right_pane">
            {/* Desktop Navigation Tabs */}
            <div className="bg-[#FFFCEB] border-b-2 border-[#8A1A1A]/10 px-6 py-3.5 flex items-center justify-between shrink-0" id="desktop_nav_tabs">
              <div className="flex items-center space-x-2.5" id="desktop_tabs_wrapper">
                {[
                  { id: 'dashboard', label: 'முகப்பு', desc: 'Dashboard', icon: '🕉' },
                  { id: 'monthly', label: 'மாதகாட்டி', desc: 'Monthly Grid', icon: '📅' },
                  { id: 'astrology', label: 'ஜோதிடம்', desc: 'Astrology', icon: '🪐' },
                  { id: 'festivals', label: 'விடுமுறைகள்', desc: 'Festivals', icon: '🎉' },
                  { id: 'fasting', label: 'விரதங்கள்', desc: 'Fasting Days', icon: '🔔' },
                ].map((tab) => {
                  const isTabActive = activeView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigateTo(tab.id as AppView)}
                      className={`px-4 py-2 rounded-2xl flex items-center space-x-2 border transition duration-150 cursor-pointer text-xs font-black ${
                        isTabActive
                          ? 'bg-[#8A1A1A] text-[#FDF6E2] border-[#8A1A1A] shadow-md scale-[1.03]'
                          : 'bg-white text-[#8A1A1A] border-amber-200 hover:bg-amber-50/50'
                      }`}
                      id={`desktop_tab_btn_${tab.id}`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <div className="text-left leading-none">
                        <span className="block">{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Gregorian / Tamil Date Badge */}
              <div className="bg-amber-100/50 border border-amber-200 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-amber-950 flex items-center space-x-2" id="desktop_date_badge">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>
                  {new Date(selectedDateStr).toLocaleDateString('ta-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Dynamic Workspace Panel */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-thin" id="desktop_workspace_content">
              <AnimatePresence mode="wait">
                {activeView === 'dashboard' && (
                  <motion.div
                    key="desktop_dashboard_tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                    id="desktop_dashboard_container"
                  >
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-[#8A1A1A] to-[#A82A2A] rounded-2xl p-5 text-white shadow-md border-b-4 border-amber-500 relative overflow-hidden" id="desktop_welcome_banner">
                      <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 text-9xl text-white/5 font-black">🕉</div>
                      <h2 className="text-xl font-black font-display text-amber-300">மங்களகரமான தமிழ் நாட்காட்டி இணையதளம்</h2>
                      <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                        அனைத்து ஆன்மீக விவரங்கள், நல்ல நேரம், சுப தினங்கள், கிரக நிலைகள் மற்றும் பண்டிகைகள் அடங்கிய முழுமையான பாரம்பரிய பஞ்சாங்கம்.
                      </p>
                    </div>

                    {/* Grand 2x2 Bento Grid for current day's summary */}
                    <div className="grid grid-cols-2 gap-4" id="desktop_bento_grid">
                      {/* Left: Traditional Year and Day Of Week */}
                      <div className="bg-[#FFFCEB] border-2 border-[#8A1A1A] rounded-2xl p-4 flex flex-col justify-between shadow-sm" id="desktop_bento_year">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">தமிழ் வருடம்</span>
                            <h4 className="text-lg font-black text-[#8A1A1A] mt-0.5">{headerDateInfo.tamilYear} வருடம்</h4>
                          </div>
                          <span className="text-2xl">🔱</span>
                        </div>
                        <div className="border-t border-amber-500/10 my-3"></div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">இன்றைய கிழமை</span>
                            <p className="text-base font-extrabold text-[#8A1A1A]">{headerDateInfo.dayOfWeek}</p>
                          </div>
                          <span className="bg-[#8A1A1A] text-white text-[9px] font-black px-2.5 py-1 rounded-lg">சுப நாள்</span>
                        </div>
                      </div>

                      {/* Right: Thithi and Nakshatram */}
                      <div className="bg-[#FFFCEB] border border-amber-300 rounded-2xl p-4 flex flex-col justify-between shadow-sm" id="desktop_bento_panchangam">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
                            <span className="text-[9px] text-amber-800 font-extrabold block">திதி (Thithi)</span>
                            <span className="font-extrabold text-sm text-[#8A1A1A]">{headerDateInfo.thithi}</span>
                          </div>
                          <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
                            <span className="text-[9px] text-amber-800 font-extrabold block">நட்சத்திரம் (Star)</span>
                            <span className="font-extrabold text-sm text-[#8A1A1A]">{headerDateInfo.nakshatram}</span>
                          </div>
                        </div>
                        <div className="bg-rose-50/50 p-2 rounded-xl border border-rose-100 text-[11px] mt-3 flex justify-between items-center text-rose-950 font-bold">
                          <span>ராகு காலம்: {headerDateInfo.raghuKalam}</span>
                          <span>எமகண்டம்: {headerDateInfo.yamagandam}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation bento blocks */}
                    <div className="grid grid-cols-3 gap-4" id="desktop_nav_bento_blocks">
                      {/* Monthly Calendar Tab Card */}
                      <div className="bg-white border border-amber-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center space-x-3 group" onClick={() => navigateTo('monthly')} id="desktop_card_monthly">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl text-amber-800 font-black group-hover:scale-105 transition-transform">📅</div>
                        <div className="leading-tight">
                          <h4 className="text-xs font-black text-[#8A1A1A]">மாதகாட்டி காண்க</h4>
                          <p className="text-[10px] text-amber-800/80 font-medium mt-0.5">மாதாந்திர பஞ்சாங்கம்</p>
                        </div>
                      </div>

                      {/* Festivals Tab Card */}
                      <div className="bg-white border border-amber-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center space-x-3 group" onClick={() => navigateTo('festivals')} id="desktop_card_festivals">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl text-amber-800 font-black group-hover:scale-105 transition-transform">🎉</div>
                        <div className="leading-tight">
                          <h4 className="text-xs font-black text-[#8A1A1A]">விடுமுறை தினங்கள்</h4>
                          <p className="text-[10px] text-amber-800/80 font-medium mt-0.5">பண்டிகைகள் மற்றும் அரசு விடுமுறைகள்</p>
                        </div>
                      </div>

                      {/* Astrology Tab Card */}
                      <div className="bg-white border border-amber-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center space-x-3 group" onClick={() => navigateTo('astrology')} id="desktop_card_astrology">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl text-amber-800 font-black group-hover:scale-105 transition-transform">🪐</div>
                        <div className="leading-tight">
                          <h4 className="text-xs font-black text-[#8A1A1A]">ஜாதகம் & ஜோதிடம்</h4>
                          <p className="text-[10px] text-amber-800/80 font-medium mt-0.5">இன்றைய ராசிபலன்கள்</p>
                        </div>
                      </div>
                    </div>

                    {/* Promo consultation banner */}
                    <div id="desktop_consultation_banner_row">
                      <button
                        onClick={() => {
                          navigateTo('astrology', '2026-07-13');
                          triggerToast('ஜாதகம் கணிக்கும் பக்கத்திற்கு செல்கிறது...');
                        }}
                        className="w-full bg-[#8A1A1A] text-[#FDF6E2] border-2 border-amber-400 rounded-2xl shadow-md p-4 flex items-center justify-between hover:bg-[#9C2020] hover:scale-[1.01] active:scale-95 transition relative overflow-hidden group cursor-pointer"
                        id="desktop_btn_jathagam_consultation"
                      >
                        <div className="flex items-center space-x-4 z-10">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-amber-300/30">
                            <Flame className="w-5 h-5 text-amber-300 fill-amber-200 animate-pulse" />
                          </div>
                          <div className="text-left leading-tight">
                            <h4 className="text-xs font-black text-amber-200">ஓம் ஆஸ்ட்ரோ கணினி ஜாதகம் (Om Astro Engine)</h4>
                            <p className="text-[10px] text-amber-100/95 font-medium mt-0.5">துல்லியமான முறையில் தமிழ் பஞ்சாங்க கணிதங்கள் அடிப்படையில் ஜாதக கட்டங்கள் கணிக்கும் அம்சம் - ₹30 முதல்</p>
                          </div>
                        </div>
                        <span className="bg-amber-400 text-[#8A1A1A] font-black text-xs rounded-xl px-4 py-1.5 shadow border border-amber-200 flex-shrink-0">இப்பொழுதே கணிக்க</span>
                      </button>
                    </div>

                    {/* Quote box & OM decoration */}
                    <div className="grid grid-cols-4 gap-4" id="desktop_decor_row">
                      <div className="col-span-3 bg-[#FCF8E3]/60 border border-dashed border-amber-400/80 rounded-2xl p-4 text-center shadow-inner relative flex flex-col justify-center min-h-[90px]" id="desktop_quote_panel_bento">
                        <span className="text-[9px] uppercase font-black tracking-widest text-amber-800 block mb-1">இன்றைய பொன்மொழி</span>
                        <p className="text-xs font-bold text-[#8A1A1A] italic leading-relaxed px-1">
                          "{randomQuote}"
                        </p>
                      </div>
                      <div className="bg-[#FCF8E3] border border-amber-200 rounded-2xl py-3 flex justify-center items-center shadow-inner relative overflow-hidden group col-span-1" id="desktop_om_decor_bento">
                        <span className="text-3xl text-[#8A1A1A]/85 font-black group-hover:rotate-12 transition-transform duration-300 ease-out">🕉</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* If daily view selected on desktop, show complete Astro Report */}
                {activeView === 'daily' && (
                  <motion.div
                    key="desktop_daily_details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border-2 border-[#8A1A1A] rounded-3xl p-6 shadow-sm space-y-6"
                    id="desktop_daily_expanded_report"
                  >
                    <div className="border-b border-amber-500/20 pb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-black text-[#8A1A1A] flex items-center space-x-2">
                          <span className="text-lg">📅</span>
                          <span>{headerDateInfo.tamilMonth} {headerDateInfo.tamilDay} - விரிவான பஞ்சாங்கம்</span>
                        </h3>
                        <p className="text-[11px] text-amber-800/80 font-bold mt-1">Detailed Daily Almanac for {selectedDateStr}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-1.5 rounded-full">
                        {headerDateInfo.isAuspicious ? 'சுப முகூர்த்த நாள்' : 'சாதாரண நாள்'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Thithi & Nakshatram */}
                      <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 space-y-1">
                        <span className="text-[10px] text-amber-800 font-extrabold block">திதி (Thithi)</span>
                        <span className="font-extrabold text-lg text-[#8A1A1A]">{headerDateInfo.thithi}</span>
                      </div>
                      <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 space-y-1">
                        <span className="text-[10px] text-amber-800 font-extrabold block">நட்சத்திரம் (Star)</span>
                        <span className="font-extrabold text-lg text-[#8A1A1A]">{headerDateInfo.nakshatram}</span>
                      </div>

                      {/* Nalla Neram */}
                      <div className="col-span-2 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-extrabold block mb-2">நல்ல நேரம் (Auspicious Timing)</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#8A1A1A]">
                          <div>காலை: <span className="font-extrabold">{headerDateInfo.nallaNeram.morning || '---'}</span></div>
                          <div>மாலை: <span className="font-extrabold">{headerDateInfo.nallaNeram.evening || '---'}</span></div>
                        </div>
                      </div>

                      {/* Yogam */}
                      <div className="col-span-2 bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
                        <span className="text-[10px] text-amber-800 font-extrabold block mb-1">யோகம் (Yogam)</span>
                        <span className="font-extrabold text-[#8A1A1A] text-sm">{headerDateInfo.yogam}</span>
                      </div>
                    </div>

                    {/* Unfavorable Timings */}
                    <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 space-y-3">
                      <h4 className="text-xs font-black text-rose-900 border-b border-rose-200 pb-1.5">விலக்க வேண்டிய காலங்கள் (Unfavorable Hours)</h4>
                      <div className="grid grid-cols-3 gap-4 text-xs font-bold">
                        <div className="bg-white p-3 rounded-xl border border-rose-200/50">
                          <span className="text-[9px] text-rose-800 block mb-1">ராகு காலம் (Rahu):</span>
                          <span className="font-extrabold text-rose-950">{headerDateInfo.raghuKalam}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-rose-200/50">
                          <span className="text-[9px] text-amber-800 block mb-1">எமகண்டம் (Yama):</span>
                          <span className="font-extrabold text-amber-950">{headerDateInfo.yamagandam}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-rose-200/50">
                          <span className="text-[9px] text-emerald-800 block mb-1">சூலம் / பரிகாரம்:</span>
                          <span className="font-extrabold text-emerald-950 leading-tight block mt-0.5">{headerDateInfo.soolam} ({headerDateInfo.parigaram})</span>
                        </div>
                      </div>
                    </div>

                    {/* Festivals list */}
                    {headerDateInfo.festivals.length > 0 && (
                      <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200/50">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 block mb-2">இன்றைய விசேஷங்கள் / விரதங்கள்</span>
                        <div className="flex flex-wrap gap-2">
                          {headerDateInfo.festivals.map((fest, idx) => (
                            <span key={idx} className="bg-[#8A1A1A] text-white font-extrabold text-[10px] px-3 py-1 rounded-xl shadow-sm">
                              {fest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeView === 'monthly' && (
                  <motion.div key="desktop_monthly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <MonthlyCalendarView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
                  </motion.div>
                )}

                {activeView === 'astrology' && (
                  <motion.div key="desktop_astrology" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <AstrologyView selectedDateStr={selectedDateStr} onClose={() => navigateTo('dashboard')} />
                  </motion.div>
                )}

                {activeView === 'festivals' && (
                  <motion.div key="desktop_festivals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <FestivalsView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
                  </motion.div>
                )}

                {activeView === 'fasting' && (
                  <motion.div key="desktop_fasting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <FastingDaysView onSelectDay={handleSelectDay} onClose={() => navigateTo('dashboard')} />
                  </motion.div>
                )}

                {activeView === 'admin' && (
                  <motion.div key="desktop_admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <AdminView onClose={() => navigateTo('dashboard')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Desktop Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-6 right-6 z-40 bg-[#8A1A1A] text-[#FDF6E2] px-5 py-3 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2 border border-amber-400 max-w-sm"
              id="desktop_toast_message"
            >
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
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
                <button
                  onClick={() => { setIsAboutOpen(false); navigateTo('admin'); }}
                  className="mt-2 w-full bg-amber-600 hover:bg-amber-700 text-white py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>நிர்வாகி பகுதி (Admin Login)</span>
                </button>
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
