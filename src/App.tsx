/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Clock
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
    <div className="min-h-screen bg-amber-50/40 md:bg-[#8A1A1A]/5 flex justify-center items-center text-[#5C1A1A] select-none md:p-6" id="app_root">
      
      {/* Responsive Centered App Frame: spacious desktop layout, classic mobile on small screens */}
      <div className="w-full max-w-md md:max-w-5xl bg-[#FFFDF0] h-screen max-h-screen md:h-[88vh] md:max-h-[800px] flex flex-col justify-between shadow-2xl relative border-x border-amber-200 md:border md:border-amber-900/15 md:rounded-3xl overflow-hidden" id="mobile_device_frame">
        
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col overflow-hidden"
              id="dashboard_view"
            >
              
              {/* 1. TOP HEADER (As per original image) */}
              <div className="p-4 flex items-center justify-between border-b border-amber-200 bg-[#FCF8E3]" id="top_status_bar">
                
                {/* Date display (Left) */}
                <div className="flex items-center space-x-2" id="header_date_box">
                  <div className="text-4xl font-extrabold font-mono text-[#8A1A1A] tracking-tighter" id="header_day_num">
                    {new Date(selectedDateStr).getDate().toString().padStart(2, '0')}
                  </div>
                  <div className="leading-tight text-xs font-bold text-amber-950 flex flex-col" id="header_day_words">
                    <span className="text-[#8A1A1A] font-black">{headerDateInfo.dayOfWeek}</span>
                    <span className="opacity-80">{headerDateInfo.tamilMonth}</span>
                  </div>
                </div>

                {/* Right utility buttons (Rupee, Share, Sound, Menu) */}
                <div className="flex items-center space-x-2" id="header_utility_buttons">
                  {/* Donation/Coins Quote button */}
                  <button 
                    onClick={() => setIsQuoteOpen(true)}
                    className="p-1.5 bg-amber-100 rounded-full hover:bg-amber-200 active:scale-95 transition text-[#8A1A1A] border border-amber-300/40"
                    title="ஆன்மீக பொன்மொழி (Spiritual Quote)"
                  >
                    <Coins className="w-4 h-4" />
                  </button>

                  {/* Sound Toggle Button */}
                  <button 
                    onClick={handleSoundToggle}
                    className="p-1.5 bg-amber-100 rounded-full hover:bg-amber-200 active:scale-95 transition text-[#8A1A1A] border border-amber-300/40"
                    title="ஒலி அமைப்புகள்"
                  >
                    {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Share button */}
                  <button 
                    onClick={handleShare}
                    className="p-1.5 bg-amber-100 rounded-full hover:bg-amber-200 active:scale-95 transition text-[#8A1A1A] border border-amber-300/40"
                    title="பகிரவும் (Share)"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* About Button */}
                  <button 
                    onClick={() => setIsAboutOpen(true)}
                    className="p-1.5 bg-amber-100 rounded-full hover:bg-amber-200 active:scale-95 transition text-[#8A1A1A] border border-amber-300/40"
                    title="விபரங்கள் (About)"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. MAIN BODY (Tamil Almanac style) - Clean Responsive Layout */}
              <div className="px-4 py-3 flex-grow overflow-y-auto pb-20 scrollbar-thin" id="main_dashboard_body">
                
                {/* Desktop Split Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:py-4 max-w-4xl mx-auto" id="dashboard_responsive_layout">
                  
                  {/* Left Column: Calendar Header Info & Decorative block on Desktop (5 cols) */}
                  <div className="hidden md:flex md:col-span-5 flex-col space-y-4" id="desktop_left_panel">
                    
                    {/* Premium Date Card */}
                    <div className="bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl p-6 text-center shadow-md relative flex flex-col justify-center items-center h-44 border-b-8" id="desktop_date_card">
                      {/* Torn Sheet Pattern */}
                      <div className="absolute top-0 left-0 right-0 h-3 bg-[#8A1A1A] flex justify-around items-end overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3.5 h-3.5 bg-[#FFFDF0] rounded-full -mb-2 shadow-inner"></div>
                        ))}
                      </div>
                      <span className="text-6xl font-black font-mono text-[#8A1A1A] tracking-tighter mt-1">
                        {new Date(selectedDateStr).getDate().toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm font-extrabold text-amber-950 mt-1">{headerDateInfo.dayOfWeek}</span>
                      <span className="text-xs font-bold text-[#8A1A1A] opacity-90 mt-0.5">{headerDateInfo.tamilMonth} • {headerDateInfo.tamilYear}</span>
                    </div>

                    {/* Spiritual Quote Block */}
                    <div className="bg-[#FCF8E3]/60 border border-dashed border-amber-300 rounded-2xl p-4 text-center shadow-inner relative flex-grow flex flex-col justify-center min-h-[110px]" id="desktop_quote_panel">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-amber-800 block mb-1">இன்றைய பொன்மொழி (Spiritual Quote)</span>
                      <p className="text-xs font-bold text-[#8A1A1A] italic leading-relaxed px-1">
                        "{randomQuote}"
                      </p>
                    </div>

                    {/* Desktop Om Astro banner */}
                    <button
                      onClick={() => {
                        setSelectedDateStr('2026-07-13');
                        setActiveView('astrology');
                        triggerToast('ஜாதகம் கணிக்கும் பக்கத்திற்கு செல்கிறது...');
                      }}
                      className="w-full bg-[#8A1A1A] text-[#FDF6E2] border-2 border-amber-400 rounded-2xl shadow-lg p-3.5 flex items-center justify-between hover:bg-[#9C2020] hover:scale-[1.01] active:scale-95 transition relative overflow-hidden group cursor-pointer text-left"
                      id="btn_jathagam_consultation_desktop"
                    >
                      <div className="flex items-center space-x-3 z-10">
                        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-amber-300/30">
                          <Flame className="w-5 h-5 text-amber-300 fill-amber-200 animate-pulse" />
                        </div>
                        <div className="leading-tight">
                          <h4 className="text-xs font-black text-amber-200">ஓம் ஆஸ்ட்ரோ</h4>
                          <p className="text-[10px] text-amber-100/95 font-medium mt-0.5">ஜாதகம் கணித்தல் - ₹30 முதல்</p>
                        </div>
                      </div>
                      <span className="bg-amber-400 text-[#8A1A1A] font-black text-[10px] rounded-xl px-2.5 py-1 shadow border border-amber-200">கணிக்க</span>
                    </button>

                    {/* Bottom decorative segment */}
                    <div className="bg-[#FCF8E3] border border-amber-200 rounded-2xl py-3 flex justify-center items-center shadow-inner relative overflow-hidden group h-14" id="decor_om_box_desktop">
                      <span className="text-4xl text-[#8A1A1A]/85 font-black group-hover:rotate-12 transition-transform duration-300 ease-out">🕉</span>
                    </div>
                  </div>

                  {/* Right Column: Menu Grid and Navigation (7 cols on Desktop, 1 col on Mobile) */}
                  <div className="md:col-span-7 space-y-4" id="desktop_right_panel">
                    
                    {/* Title Banner (நாள்காட்டி) */}
                    <div className="text-center py-1 border-b-2 border-amber-500/30" id="main_banner_title">
                      <h2 className="text-xl md:text-2xl font-black font-display text-[#8A1A1A] tracking-wider">நாள்காட்டி & நாட்குறிப்பு</h2>
                      <p className="hidden md:block text-[11px] text-amber-900/70 font-semibold mt-0.5">Interactive Daily Sheet & Monthly Panchangam</p>
                    </div>

                    {/* Grid menu: 4 main features layout */}
                    <div className="grid grid-cols-2 gap-3" id="main_features_grid_responsive">
                      {/* Option 1: Daily Sheet Calendar */}
                      <button
                        onClick={() => setActiveView('daily')}
                        className="bg-[#8A1A1A] text-[#FDF6E2] p-5 rounded-2xl shadow-lg border-2 border-amber-400/50 flex flex-col items-center justify-center text-center transition hover:bg-[#9C2020] hover:scale-[1.02] active:scale-95 cursor-pointer h-36 md:h-32 relative overflow-hidden group"
                        id="btn_to_daily_sheet"
                      >
                        <Calendar className="w-8 h-8 md:w-7 md:h-7 text-amber-300 mb-2 md:mb-1.5 group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-black font-display tracking-tight">நாள்காட்டி</span>
                        <span className="text-[10px] opacity-75 mt-1 md:mt-0.5 block">Daily Sheet</span>
                        <span className="absolute bottom-2 right-3 font-mono font-black text-2xl text-white/5 group-hover:text-white/10 transition-colors">31</span>
                      </button>

                      {/* Option 2: Monthly Grid Calendar */}
                      <button
                        onClick={() => setActiveView('monthly')}
                        className="bg-[#8A1A1A] text-[#FDF6E2] p-5 rounded-2xl shadow-lg border-2 border-amber-400/50 flex flex-col items-center justify-center text-center transition hover:bg-[#9C2020] hover:scale-[1.02] active:scale-95 cursor-pointer h-36 md:h-32 relative overflow-hidden group"
                        id="btn_to_monthly_grid"
                      >
                        <div className="grid grid-cols-3 gap-0.5 w-7 h-7 md:w-6 md:h-6 mb-2 md:mb-1.5 group-hover:scale-110 transition-transform text-amber-300">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-amber-300 w-1.5 h-1.5 rounded-sm" />
                          ))}
                        </div>
                        <span className="text-sm font-black font-display tracking-tight">மாதகாட்டி</span>
                        <span className="text-[10px] opacity-75 mt-1 md:mt-0.5 block">Monthly Calendar</span>
                      </button>

                      {/* Option 3: Festivals list */}
                      <button
                        onClick={() => setActiveView('festivals')}
                        className="bg-[#8A1A1A] text-[#FDF6E2] p-5 rounded-2xl shadow-lg border-2 border-amber-400/50 flex flex-col items-center justify-center text-center transition hover:bg-[#9C2020] hover:scale-[1.02] active:scale-95 cursor-pointer h-36 md:h-32 relative overflow-hidden group"
                        id="btn_to_festivals"
                      >
                        <Sparkles className="w-8 h-8 md:w-7 md:h-7 text-amber-300 mb-2 md:mb-1.5 group-hover:rotate-45 transition-transform" />
                        <span className="text-xs md:text-sm font-black font-display tracking-tight leading-tight">பண்டிகை, விடுமுறைகள்</span>
                        <span className="text-[9px] opacity-75 mt-1 md:mt-0.5 block">Festivals / Holidays</span>
                      </button>

                      {/* Option 4: Fasting schedule */}
                      <button
                        onClick={() => setActiveView('fasting')}
                        className="bg-[#8A1A1A] text-[#FDF6E2] p-5 rounded-2xl shadow-lg border-2 border-amber-400/50 flex flex-col items-center justify-center text-center transition hover:bg-[#9C2020] hover:scale-[1.02] active:scale-95 cursor-pointer h-36 md:h-32 relative overflow-hidden group"
                        id="btn_to_fasting"
                      >
                        <Award className="w-8 h-8 md:w-7 md:h-7 text-amber-300 mb-2 md:mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs md:text-sm font-black font-display tracking-tight leading-tight">முக்கிய விரத நாட்கள்</span>
                        <span className="text-[9px] opacity-75 mt-1 md:mt-0.5 block">Fasting Schedule</span>
                      </button>
                    </div>

                    {/* Full-width Astrology row */}
                    <button
                      onClick={() => setActiveView('astrology')}
                      className="w-full bg-white border-2 border-[#8A1A1A]/80 rounded-2xl p-4 flex items-center justify-center space-x-3 shadow hover:bg-amber-50 transition cursor-pointer"
                      id="btn_to_astrology"
                    >
                      <Compass className="w-6 h-6 text-[#8A1A1A] animate-spin-slow flex-shrink-0" />
                      <div className="text-left">
                        <span className="text-sm font-black text-[#8A1A1A] block">ஜோதிடம் மற்றும் ஜாதகம்</span>
                        <span className="text-[10px] font-bold text-amber-800 block leading-none">Daily Astrology Guide & Horoscopes</span>
                      </div>
                    </button>

                    {/* Mobile-only Banners (hidden on desktop to avoid repetition) */}
                    <button
                      onClick={() => {
                        setSelectedDateStr('2026-07-13');
                        setActiveView('astrology');
                        triggerToast('ஜாதகம் கணிக்கும் பக்கத்திற்கு செல்கிறது...');
                      }}
                      className="w-full md:hidden bg-[#8A1A1A] text-[#FDF6E2] border-2 border-amber-400 rounded-2xl shadow-lg p-4 flex items-center justify-between hover:bg-[#9C2020] hover:scale-[1.01] active:scale-95 transition relative overflow-hidden group cursor-pointer"
                      id="btn_jathagam_consultation"
                    >
                      <div className="flex items-center space-x-3 z-10">
                        <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center border border-amber-300/40 relative">
                          <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping" />
                          <Flame className="w-6 h-6 text-amber-300 fill-amber-200 animate-pulse" />
                        </div>
                        <div className="text-left leading-tight">
                          <h4 className="text-xs md:text-sm font-black text-amber-200">ஓம் ஆஸ்ட்ரோ (Om Astro)</h4>
                          <p className="text-[9px] md:text-xs text-amber-100/90 font-medium mt-0.5">கணினி ஜாதகம் கணித்தல் - வெறும் ₹30 முதல்</p>
                        </div>
                      </div>
                      <span className="bg-amber-400 text-[#8A1A1A] font-black text-[9px] md:text-xs rounded-xl px-2.5 py-1.5 shadow border border-amber-200 flex-shrink-0">கணிக்க</span>
                    </button>

                    <div className="bg-[#FCF8E3] border border-amber-200 rounded-2xl py-3.5 flex md:hidden justify-center items-center shadow-inner relative overflow-hidden group" id="decor_om_box">
                      <span className="text-4xl text-[#8A1A1A]/85 font-black group-hover:rotate-12 transition-transform duration-300 ease-out">🕉</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Toast Notification element */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#8A1A1A] text-[#FDF6E2] px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-1.5 border border-amber-400"
                    id="toast_message"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* Active Sub-views (Interactive containers loaded on screen when chosen) */}
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

        {/* 3. BOTTOM FIXED NAVIGATION BAR (Persistent shell bottom nav as shown in the original image) */}
        <nav className="absolute bottom-0 left-0 right-0 h-14 bg-[#8A1A1A] border-t-4 border-[#D97706] flex items-center justify-around text-[#FDF6E2] z-30" id="bottom_navbar">
          
          {/* Nav Item 1: Astrology Guide */}
          <button 
            onClick={() => setActiveView('astrology')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'astrology' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="ஜோதிடம்"
            id="nav_btn_astrology"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] block mt-0.5">ஜோதிடம்</span>
          </button>

          {/* Nav Item 2: Central Home/Dashboard or Astrology */}
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'dashboard' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="முகப்பு"
            id="nav_btn_home"
          >
            <span className="text-lg leading-none">🕉</span>
            <span className="text-[9px] block mt-0.5">முகப்பு</span>
          </button>

          {/* Nav Item 3: Fasting reminders / Notification Bell */}
          <button 
            onClick={() => setActiveView('fasting')}
            className={`flex flex-col items-center justify-center flex-grow py-1.5 transition cursor-pointer hover:bg-black/10 ${activeView === 'fasting' ? 'text-amber-300 font-extrabold bg-black/15' : 'opacity-80'}`}
            title="அறிவிப்புகள் / விரதங்கள்"
            id="nav_btn_fasting"
          >
            <Bell className="w-5 h-5" />
            <span className="text-[9px] block mt-0.5">அறிவிப்புகள்</span>
          </button>

        </nav>

        {/* 4. DIALOGS & OVERLAY MODALS */}
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
                  இது 2026 பராபவ & விஸ்வாவசு வருடத்திற்கான துல்லியமான தமிழ் நாள்காட்டி மற்றும் பஞ்சாங்கம் ஆகும். தினசரி நல்ல நேரம், ராகு காலம், எமகண்டம், திதி, நட்சத்திரம், பண்டிகைகள், விரத நாட்கள் மற்றும் கணினி ஜாதகங்களை எளிமையாகக் கணிக்க இது உதவுகிறது.
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
    </div>
  );
}

