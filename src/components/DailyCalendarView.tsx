/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getTamilCalendarInfo } from '../utils/tamilCalendar';
import { Calendar, ChevronLeft, ChevronRight, Award, Flame, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyCalendarViewProps {
  initialDate?: string;
  onClose: () => void;
}

export default function DailyCalendarView({ initialDate, onClose }: DailyCalendarViewProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const calendarInfo = getTamilCalendarInfo(new Date(selectedDateStr));

  const changeDate = (offset: number) => {
    const currentDate = new Date(selectedDateStr);
    currentDate.setDate(currentDate.getDate() + offset);
    setDirection(offset > 0 ? 'right' : 'left');
    setSelectedDateStr(currentDate.toISOString().split('T')[0]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    if (dateVal) {
      const isLater = new Date(dateVal).getTime() > new Date(selectedDateStr).getTime();
      setDirection(isLater ? 'right' : 'left');
      setSelectedDateStr(dateVal);
    }
  };

  // Convert English Month to Tamil name for header
  const getEngMonthInTamil = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    return months[d.getMonth()];
  };

  const engDay = new Date(selectedDateStr).getDate();
  const engYear = new Date(selectedDateStr).getFullYear();

  // Animation variants
  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 300 : -300,
      opacity: 0,
      rotateY: dir === 'right' ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -300 : 300,
      opacity: 0,
      rotateY: dir === 'right' ? -45 : 45,
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="daily_calendar_container">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706]" id="daily_header">
        <button 
          onClick={onClose} 
          className="flex items-center justify-center w-9 h-9 bg-[#FCF8E3] text-[#8A1A1A] rounded-full hover:bg-amber-50 transition shadow-sm border border-amber-200/50 active:scale-95 flex-shrink-0"
          title="முகப்பு (Home)"
          id="btn_back_dashboard"
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0" />
        </button>
        <h1 className="text-lg md:text-xl font-bold font-display flex items-center space-x-2" id="header_title">
          <Calendar className="w-5 h-5 text-amber-300" />
          <span>நாள்காட்டி (Daily Sheet)</span>
        </h1>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <span className="font-mono text-sm font-bold">{engDay}</span>
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-20 scrollbar-thin flex flex-col" id="daily_scroll_body">

      {/* Date Navigation and Selector Bar */}
      <div className="max-w-md w-full mx-auto px-4 mt-4" id="navigation_controls">
        <div className="flex items-center justify-between bg-amber-100/70 p-2 rounded-2xl border border-amber-200 shadow-sm">
          <button 
            onClick={() => changeDate(-1)} 
            className="p-2 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] active:scale-95 transition"
            title="முந்தைய நாள் (Previous Day)"
            id="btn_prev_day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative flex items-center space-x-1 bg-white border border-amber-300 px-3 py-1.5 rounded-xl shadow-inner text-sm font-medium hover:border-[#8A1A1A] transition">
            <Calendar className="w-4 h-4 text-amber-600" />
            <input 
              type="date" 
              value={selectedDateStr} 
              onChange={handleDateChange} 
              className="bg-transparent border-none outline-none text-[#5C1A1A] font-bold cursor-pointer font-mono text-xs md:text-sm focus:ring-0"
              min="2026-01-01"
              max="2026-12-31"
              id="datepicker_input"
            />
          </div>

          <button 
            onClick={() => changeDate(1)} 
            className="p-2 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] active:scale-95 transition"
            title="அடுத்த நாள் (Next Day)"
            id="btn_next_day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Sheet Container */}
      <div className="w-full max-w-md mx-auto px-4 mt-4 relative overflow-hidden flex-shrink-0" id="sheet_container" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selectedDateStr}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl shadow-xl overflow-hidden relative flex flex-col min-h-[580px] border-b-8 flex-shrink-0"
            id={`sheet_card_${selectedDateStr}`}
          >
            {/* Traditional Calendar Aesthetic Header / Torn Sheet Pattern */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#8A1A1A] flex justify-around items-end overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-[#FFFDF0] rounded-full -mb-3 shadow-inner"></div>
              ))}
            </div>

            {/* Inner Content Padding */}
            <div className="pt-6 px-4 pb-5 flex-grow flex flex-col justify-start space-y-4">
              
              {/* Year & Month Top Title */}
              <div className="flex justify-between items-center border-b border-dashed border-[#8A1A1A]/30 pb-2 text-center" id="sheet_title_row">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider block text-amber-800 font-mono">Tamil Year</span>
                  <span className="text-sm font-extrabold text-[#8A1A1A]">{calendarInfo.tamilYear} வருடம்</span>
                </div>
                <div className="bg-amber-100 border border-amber-300 rounded-lg px-2 py-0.5 shadow-sm text-xs font-bold text-amber-900 font-display">
                  2026 பராபவ
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider block text-amber-800 font-mono">Day of Week</span>
                  <span className="text-sm font-extrabold text-[#8A1A1A]">{calendarInfo.dayOfWeek}</span>
                </div>
              </div>

              {/* Central Split: Left large number / Right Tamil Month info */}
              <div className="grid grid-cols-5 gap-2 my-4 items-center" id="central_date_grid">
                
                {/* Big English Day Box */}
                <div className="col-span-2 bg-[#F9EAA2] border-2 border-[#8A1A1A] rounded-2xl p-3 text-center shadow-inner relative flex flex-col justify-center items-center h-28" id="english_day_box">
                  <span className="text-5xl font-extrabold font-mono text-[#8A1A1A] tracking-tighter">{engDay}</span>
                  <span className="text-[11px] font-bold block leading-tight mt-1 text-[#8A1A1A]/80">{getEngMonthInTamil(selectedDateStr)} {engYear}</span>
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex justify-center items-center">
                  <div className="w-1.5 h-12 bg-dashed border-l-2 border-amber-500/50"></div>
                </div>

                {/* Tamil Month and Tamil Day */}
                <div className="col-span-2 text-center bg-amber-500/10 border-2 border-amber-600/30 rounded-2xl p-2 h-28 flex flex-col justify-center" id="tamil_day_box">
                  <span className="text-xs font-bold text-amber-800 uppercase block tracking-wider">தமிழ் மாதம்</span>
                  <span className="text-2xl font-extrabold text-[#8A1A1A] leading-tight mt-1">{calendarInfo.tamilMonth}</span>
                  <span className="text-3xl font-black text-amber-600 font-mono leading-none mt-1">{calendarInfo.tamilDay}</span>
                </div>
              </div>

              {/* Auspicious Day Badge */}
              <div className="flex justify-center mb-3">
                {calendarInfo.isAuspicious ? (
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm animate-pulse">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>சுப முகூர்த்த நாள் (Auspicious Day)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <span>சாதாரண நாள் (Standard Day)</span>
                  </div>
                )}
              </div>

              {/* Astrology Row (Thithi & Nakshatram) */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs" id="astrology_row">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-center">
                  <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>திதி (Thithi)</span>
                  </div>
                  <p className="font-extrabold text-[#8A1A1A] text-sm mt-0.5 leading-tight">{calendarInfo.thithi}</p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-center">
                  <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>நட்சத்திரம் (Star)</span>
                  </div>
                  <p className="font-extrabold text-[#8A1A1A] text-sm mt-0.5 leading-tight">{calendarInfo.nakshatram}</p>
                </div>
              </div>

              {/* Special Events & Festivals */}
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3" id="festivals_section">
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-widest block mb-1">இன்றைய சிறப்பு (Today's Festivals)</span>
                {calendarInfo.festivals.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {calendarInfo.festivals.map((fest, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-xs text-amber-950 font-extrabold">
                        <Flame className="w-3 h-3 text-red-600 flex-shrink-0 animate-bounce" />
                        <span>{fest}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-medium italic mt-1">விசேஷங்கள் எதுவும் இல்லை</p>
                )}
              </div>

              {/* Split Timings: Good Hours vs Obstacles */}
              <div className="space-y-2.5 border-t border-dashed border-[#8A1A1A]/30 pt-3" id="timings_container">
                
                {/* 1. Good Timings (Nalla Neram & Gowri) */}
                <div className="bg-emerald-500/5 border border-emerald-600/20 rounded-xl p-2.5 text-xs">
                  <h4 className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider mb-1 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                    <span>நல்ல நேரம் & கௌரி நல்ல நேரம்</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-emerald-950">
                    <div>
                      <span className="text-emerald-700 font-medium block text-[9px]">நல்ல நேரம்:</span>
                      <p>{calendarInfo.nallaNeram.morning || '---'}</p>
                      <p>{calendarInfo.nallaNeram.evening || '---'}</p>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium block text-[9px]">கௌரி நல்ல நேரம்:</span>
                      <p>{calendarInfo.gowriNallaNeram.morning || '---'}</p>
                      <p>{calendarInfo.gowriNallaNeram.evening || '---'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Obstacles / Unfavorable Timings (Raghu, Yama, Kuligai) */}
                <div className="bg-red-500/5 border border-red-600/20 rounded-xl p-2.5 text-xs">
                  <h4 className="font-bold text-red-800 uppercase text-[10px] tracking-wider mb-1 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    <span>ராகு, எமகண்டம், குளிகை</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-red-950">
                    <div>
                      <span className="text-red-700 block font-medium text-[8px]">ராகு காலம்:</span>
                      <p className="leading-tight mt-0.5">{calendarInfo.raghuKalam}</p>
                    </div>
                    <div>
                      <span className="text-red-700 block font-medium text-[8px]">எமகண்டம்:</span>
                      <p className="leading-tight mt-0.5">{calendarInfo.yamagandam}</p>
                    </div>
                    <div>
                      <span className="text-red-700 block font-medium text-[8px]">குளிகை:</span>
                      <p className="leading-tight mt-0.5">{calendarInfo.kuligai}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Soolam & Parigaram & Yogam */}
                <div className="bg-amber-500/5 border border-amber-600/25 rounded-xl p-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                    <div>
                      <span className="text-amber-800 block font-medium text-[8px]">சூலம் (Soolam):</span>
                      <p className="text-red-900 font-extrabold">{calendarInfo.soolam}</p>
                    </div>
                    <div>
                      <span className="text-amber-800 block font-medium text-[8px]">பரிகாரம் (Remedy):</span>
                      <p className="text-red-900 font-extrabold">{calendarInfo.parigaram}</p>
                    </div>
                    <div>
                      <span className="text-amber-800 block font-medium text-[8px]">யோகம் (Yogam):</span>
                      <p className="text-emerald-900 font-extrabold">{calendarInfo.yogam}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Traditional Bottom Footer */}
      <footer className="mt-8 text-center px-4" id="daily_footer_decor">
        <p className="text-xs font-bold text-[#8A1A1A]/70 font-display">
          வாழ்க வளமுடன் • சர்வ மங்கள மாங்கல்யே சிவே சர்வார்த்த சாதிகே
        </p>
      </footer>
      </div> {/* Close daily_scroll_body */}
    </div>
  );
}
