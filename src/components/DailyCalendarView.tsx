/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getTamilCalendarInfo, getCurrentISTDateString, getRasiPalanForDate, DAILY_RASI_PALAN } from '../utils/tamilCalendar';
import { Calendar, ChevronLeft, ChevronRight, Award, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RASI_SYMBOLS: Record<string, string> = {
  'மேஷம்': '♈',
  'ரிஷபம்': '♉',
  'மிதுனம்': '♊',
  'கடகம்': '♋',
  'சிம்மம்': '♌',
  'கன்னி': '♍',
  'துலாம்': '♎',
  'விருச்சிகம்': '♏',
  'தனுசு': '♐',
  'மகரம்': '♑',
  'கும்பம்': '♒',
  'மீனம்': '♓'
};

interface DailyCalendarViewProps {
  initialDate?: string;
  onClose: () => void;
}

export default function DailyCalendarView({ initialDate, onClose }: DailyCalendarViewProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    initialDate || getCurrentISTDateString()
  );
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRasi, setSelectedRasi] = useState<string>('மேஷம் (Aries)');
  const [isRasiExpanded, setIsRasiExpanded] = useState(false);

  // Sync with incoming prop changes (e.g. from Page Router hash changes)
  React.useEffect(() => {
    if (initialDate && initialDate !== selectedDateStr) {
      setSelectedDateStr(initialDate);
    }
  }, [initialDate]);

  const calendarInfo = getTamilCalendarInfo(selectedDateStr);

  const getFormattedNakshatram = () => {
    const nak = calendarInfo.nakshatram || '';
    let timePrefix = '';
    if (!nak.includes('இன்று') && !nak.includes('வரை') && !nak.includes('முழுவதும்') && calendarInfo.nakshatramTime) {
      timePrefix = calendarInfo.nakshatramTime + ' ';
    }
    let suffix = '';
    if (!nak.includes('பின்பு') && calendarInfo.nextNakshatram) {
      suffix = ' பின்பு ' + calendarInfo.nextNakshatram;
    }
    return timePrefix + nak + suffix;
  };

  const getFormattedThithi = () => {
    const th = calendarInfo.thithi || '';
    let timePrefix = '';
    if (!th.includes('இன்று') && !th.includes('வரை') && !th.includes('முழுவதும்') && calendarInfo.thithiTime) {
      timePrefix = calendarInfo.thithiTime + ' ';
    }
    let suffix = '';
    if (!th.includes('பின்பு') && calendarInfo.nextThithi) {
      suffix = ' பின்பு ' + calendarInfo.nextThithi;
    }
    return timePrefix + th + suffix;
  };

  const splitTimeValue = (val: string) => {
    if (!val) return { period: '', time: '' };
    const parts = val.trim().split(' ');
    if (parts.length >= 2) {
      return {
        period: parts[0],
        time: parts.slice(1).join(' ')
      };
    }
    return { period: '', time: val };
  };

  const changeDate = (offset: number) => {
    const currentDate = new Date(selectedDateStr + 'T00:00:00Z');
    currentDate.setUTCDate(currentDate.getUTCDate() + offset);
    setDirection(offset > 0 ? 'right' : 'left');
    const newDateStr = currentDate.toISOString().split('T')[0];
    setSelectedDateStr(newDateStr);
    window.location.hash = `#/daily?date=${newDateStr}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    if (dateVal) {
      const isLater = new Date(dateVal + 'T00:00:00Z').getTime() > new Date(selectedDateStr + 'T00:00:00Z').getTime();
      setDirection(isLater ? 'right' : 'left');
      setSelectedDateStr(dateVal);
      window.location.hash = `#/daily?date=${dateVal}`;
    }
  };

  // Convert English Month to Tamil name for header
  const getEngMonthInTamil = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    const months = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    return months[d.getUTCMonth()];
  };

  const engDay = new Date(selectedDateStr + 'T00:00:00Z').getUTCDate();
  const engYear = new Date(selectedDateStr + 'T00:00:00Z').getUTCFullYear();

  // Animation variants for torn calendar page slide
  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 300 : -300,
      opacity: 0,
      rotateY: dir === 'right' ? 35 : -35,
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
      rotateY: dir === 'right' ? -35 : 35,
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  };

  // Determine the primary sheet title (prioritize festivals, fall back to Thithi)
  const mainSheetTitle = calendarInfo.festivals.length > 0 
    ? calendarInfo.festivals[0].split(' (')[0]
    : calendarInfo.thithi;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="daily_calendar_container">
      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-24 scrollbar-thin flex flex-col" id="daily_scroll_body">

      {/* 1. COMPACT TOP CONTROLS BAR */}
      <div className="max-w-md md:max-w-lg w-full mx-auto px-4 mt-3" id="navigation_controls">
        <div className="flex items-center justify-between bg-amber-100/60 p-1.5 rounded-2xl border border-amber-200/80 shadow-sm">
          <button 
            onClick={() => changeDate(-1)} 
            className="p-1.5 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] active:scale-95 transition cursor-pointer"
            title="முந்தைய நாள்"
            id="btn_prev_day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative flex items-center space-x-1.5 bg-white border border-amber-300 px-3 py-1.5 rounded-xl shadow-inner hover:border-[#8A1A1A] transition">
            <Calendar className="w-4 h-4 text-amber-700" />
            <input 
              type="date" 
              value={selectedDateStr} 
              onChange={handleDateChange} 
              className="bg-transparent border-none outline-none text-[#5C1A1A] font-bold cursor-pointer font-mono text-xs focus:ring-0"
              min="2026-01-01"
              max="2026-12-31"
              id="datepicker_input"
            />
          </div>

          <button 
            onClick={() => changeDate(1)} 
            className="p-1.5 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] active:scale-95 transition cursor-pointer"
            title="அடுத்த நாள்"
            id="btn_next_day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. THE HIGH-FIDELITY TRADITIONAL DAILY SHEET */}
      <div className="w-full max-w-md md:max-w-lg mx-auto px-4 mt-3 relative overflow-hidden flex-shrink-0" id="sheet_container" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selectedDateStr}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_event, info) => {
              const swipeThreshold = 50;
              if (info.offset.x > swipeThreshold) {
                // Swipe right -> Show previous day
                changeDate(-1);
              } else if (info.offset.x < -swipeThreshold) {
                // Swipe left -> Show next day
                changeDate(1);
              }
            }}
            className="w-full bg-[#FFFFFF] border-t-8 border-x-2 border-b-[6px] border-[#8A1A1A] rounded-2xl shadow-xl overflow-hidden relative flex flex-col min-h-[480px] flex-shrink-0 cursor-grab active:cursor-grabbing touch-pan-y selection:bg-transparent"
            id={`sheet_card_${selectedDateStr}`}
          >
            {/* Tear line effect decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#8A1A1A]/20 flex justify-around items-end overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#FFFDF0] rounded-full -mb-2"></div>
              ))}
            </div>

            {/* Top Sheet Header with Special Title centered (Exactly as per image) */}
            <div className="text-center pt-5 pb-3 border-b-2 border-[#8A1A1A] px-4" id="sheet_card_header">
              <h2 className="text-lg md:text-xl font-extrabold text-[#8A1A1A] tracking-normal flex items-center justify-center gap-2" id="main_sheet_title">
                {calendarInfo.specialSymbols && (
                  <span className="text-xl animate-pulse" title="சிறப்புக் குறியீடு">{calendarInfo.specialSymbols}</span>
                )}
                <span>{mainSheetTitle}</span>
                {calendarInfo.specialSymbols && (
                  <span className="text-xl animate-pulse" title="சிறப்புக் குறியீடு">{calendarInfo.specialSymbols}</span>
                )}
              </h2>
            </div>

            {/* Symbolic Indicators Row (Exactly as per image) */}
            <div className="flex justify-between items-center px-5 py-2.5 bg-amber-50/25 border-b border-[#8A1A1A]/10" id="symbolic_indicators_row">
              {/* Left side: Ban / Yoga indicator */}
              <div className="flex items-center" id="ban_indicator_box">
                {calendarInfo.isMaranaYogam ? (
                  <div className="relative group cursor-help text-red-600" title="மரண யோகம் - சுப காரியங்களை தவிர்க்கவும்">
                    <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                  </div>
                ) : (
                  <div className="relative group cursor-help text-emerald-600" title="சுப யோக நன்னாள்">
                    <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="16 9 11 14 8 11" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Right side: Bull, Crescent moon, Arrow */}
              <div className="flex items-center space-x-3.5" id="right_indicators_box">
                {/* Lying Bull / Nandi (Pradosham indicator) */}
                <div 
                  className={`cursor-help transition ${calendarInfo.isPradosham ? 'text-amber-700' : 'text-[#8A1A1A]/40'}`}
                  title={calendarInfo.isPradosham ? "பிரதோஷம் - நந்தி வழிபாடு சிறப்பு" : "சிவ வழிபாடு உகந்தது"}
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M19.5 15.5c-.3 0-.6-.1-.9-.2-.5-.2-.9-.7-.9-1.3v-1.5c0-.8-.7-1.5-1.5-1.5h-1c-.4-1-1.3-1.8-2.4-2.1V7.5c0-.8-.7-1.5-1.5-1.5H10c-.8 0-1.5.7-1.5 1.5v1.4c-1.1.3-2 1.1-2.4 2.1h-1C4.3 11 3.6 11.7 3.6 12.5v1.5c0 .6-.4 1.1-.9 1.3-.3.1-.6.2-.9.2h-.3c-.3 0-.5.2-.5.5v1c0 1.1.9 2 2 2h17c1.1 0 2-.9 2-2v-1c0-.3-.2-.5-.5-.5h-.3z" />
                  </svg>
                </div>

                {/* Crescent Moon with face */}
                <div className="cursor-help text-[#8A1A1A]" title="சந்திர தசை">
                  <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <circle cx="9.5" cy="11.5" r="0.75" fill="currentColor" />
                    <path d="M9 14.5c.3.4.9.4 1.2 0" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Bold Red/Blue thick arrow */}
                <div 
                  className="cursor-help" 
                  title={calendarInfo.phaseArrow === 'up' ? "வளர்பிறை காலம்" : "தேய்பிறை காலம்"}
                >
                  {calendarInfo.phaseArrow === 'up' ? (
                    <svg className="w-5 h-7 text-red-700 fill-current" viewBox="0 0 24 24">
                      <path d="M11 20V8.414l-4.293 4.293-1.414-1.414L12 4.586l6.707 6.707-1.414 1.414L13 8.414V20h-2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-7 text-blue-700 fill-current" viewBox="0 0 24 24">
                      <path d="M13 4v11.586l4.293-4.293 1.414 1.414L12 19.414l-6.707-6.707 1.414-1.414L11 15.586V4h2z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional Date Banner Section (Exactly as per image) */}
            <div className="bg-[#FFFDF5] px-5 py-4 border-b-2 border-[#8A1A1A]/10" id="traditional_date_banner_section">
              {/* Top Meta Details Row */}
              <div className="flex items-center justify-between text-center pb-2.5" id="traditional_header_metadata">
                {/* Left Side: Tamil Year */}
                <div className="flex flex-col items-start leading-none" id="meta_tamil_year">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-amber-800/80">தமிழ் வருடம்</span>
                  <span className="text-xs md:text-sm font-extrabold text-[#8A1A1A] mt-1">{calendarInfo.tamilYear} வருடம்</span>
                </div>

                {/* Center Badge: Gregorian Year + Tamil Year Pill */}
                <div className="bg-amber-100/75 border border-amber-300 px-3.5 py-1 rounded-full text-[11px] font-black text-amber-900 shadow-sm" id="meta_center_pill">
                  {engYear} {calendarInfo.tamilYear}
                </div>

                {/* Right Side: Day Of Week */}
                <div className="flex flex-col items-end leading-none" id="meta_day_of_week">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-amber-800/80">கிழமை</span>
                  <span className="text-xs md:text-sm font-extrabold text-[#8A1A1A] mt-1">{calendarInfo.dayOfWeek}</span>
                </div>
              </div>

              {/* Dotted Divider */}
              <div className="border-t-2 border-dashed border-[#8A1A1A]/20 w-full my-2.5"></div>

              {/* Gregorian and Tamil Dates side-by-side with Vertical Divider */}
              <div className="flex items-center justify-center space-x-3.5 md:space-x-5 py-2" id="traditional_date_cards_container">
                {/* Left Card: Gregorian Day */}
                <div className="w-[145px] md:w-[175px] h-[110px] md:h-[130px] bg-[#FFFCE8] border-2 border-[#8A1A1A] rounded-2xl flex flex-col items-center justify-center shadow-sm" id="card_gregorian">
                  <span className="text-4xl md:text-5xl font-black text-[#8A1A1A] tracking-tight leading-none">{engDay}</span>
                  <span className="text-[10px] md:text-xs font-bold text-amber-950 mt-2.5 uppercase text-center tracking-wide">
                    {getEngMonthInTamil(selectedDateStr)} {engYear}
                  </span>
                </div>

                {/* Vertical Divider Line */}
                <div className="w-[1.5px] bg-amber-500/20 h-20 self-center" id="card_vertical_divider"></div>

                {/* Right Card: Tamil Month & Tamil Day */}
                <div className="w-[145px] md:w-[175px] h-[110px] md:h-[130px] bg-[#FFFCE8] border-2 border-amber-400 rounded-2xl flex flex-col items-center justify-center shadow-sm" id="card_tamil">
                  <span className="text-[9px] md:text-[10px] font-bold text-amber-800 uppercase tracking-wider">தமிழ் மாதம்</span>
                  <span className="text-2xl md:text-3xl font-black text-[#8A1A1A] tracking-tight mt-1 leading-none">
                    {calendarInfo.tamilMonth}
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-[#D97706] tracking-tight mt-1.5 leading-none">
                    {calendarInfo.tamilDay}
                  </span>
                </div>
              </div>
            </div>

            {/* 1. பஞ்சாங்கம் SECTION */}
            <div className="bg-[#FFFDF6] border-t-2 border-[#8A1A1A]/20" id="section_panchangam_container">
              <div className="bg-amber-100/55 border-b border-[#8A1A1A]/10 px-4 py-2 flex items-center space-x-2">
                <span className="text-[#8A1A1A] font-extrabold text-sm">🕉️</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#8A1A1A]">பஞ்சாங்கம்</h3>
              </div>
              
              {/* Detailed Rows with Dividers matching the user-uploaded image layout */}
              <div className="divide-y divide-[#8A1A1A]/10" id="panchangam_detailed_rows">
                
                {/* Row 1: நட்சத்திரம் */}
                <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition duration-150" id="row_nakshatram">
                  <div className="flex-shrink-0 mt-0.5 text-[#8A1A1A] w-7 h-7 flex items-center justify-center">
                    <svg className="w-6 h-6 stroke-[#8A1A1A] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="leading-relaxed">
                    <h3 className="text-base md:text-lg font-black text-[#8A1A1A]">நட்சத்திரம்</h3>
                    <p className="text-xs md:text-sm text-amber-950 font-bold mt-1 leading-relaxed">
                      {getFormattedNakshatram()}
                    </p>
                  </div>
                </div>

                {/* Row 2: திதி */}
                <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition duration-150" id="row_thithi">
                  <div className="flex-shrink-0 mt-0.5 text-[#8A1A1A] w-7 h-7 flex items-center justify-center">
                    <svg className="w-6 h-6 stroke-[#8A1A1A] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="7.02" />
                    </svg>
                  </div>
                  <div className="leading-relaxed">
                    <h3 className="text-base md:text-lg font-black text-[#8A1A1A]">திதி</h3>
                    <p className="text-xs md:text-sm text-amber-950 font-bold mt-1 leading-relaxed">
                      {getFormattedThithi()}
                    </p>
                  </div>
                </div>

                {/* Row 3: யோகம் */}
                <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition duration-150" id="row_yogam">
                  <div className="flex-shrink-0 mt-0.5 text-[#8A1A1A] w-7 h-7 flex items-center justify-center">
                    <svg className="w-6 h-6 stroke-[#8A1A1A] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 3a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                      <path d="M12 21a3 3 0 0 0 3-3v-3a3 3 0 0 0-6 0v3a3 3 0 0 0 3 3z" />
                      <path d="M3 12a3 3 0 0 0 3 3h3a3 3 0 0 0 0-6H6a3 3 0 0 0-3 3z" />
                      <path d="M21 12a3 3 0 0 0-3-3h-3a3 3 0 0 0 0 6h3a3 3 0 0 0 3-3z" />
                    </svg>
                  </div>
                  <div className="leading-relaxed">
                    <h3 className="text-base md:text-lg font-black text-[#8A1A1A]">யோகம்</h3>
                    <p className="text-xs md:text-sm text-amber-950 font-bold mt-1 leading-relaxed">
                      {calendarInfo.yogam}
                    </p>
                  </div>
                </div>

                {/* Row 4: சந்திராஷ்டமம் */}
                <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition duration-150" id="row_chandrashtamam">
                  <div className="flex-shrink-0 mt-0.5 text-[#8A1A1A] w-7 h-7 flex items-center justify-center">
                    <svg className="w-6 h-6 stroke-[#8A1A1A] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5 5 0 0 1-7.54-7.54C12.92 3.04 12.46 3 12 3Z" />
                    </svg>
                  </div>
                  <div className="leading-relaxed">
                    <h3 className="text-base md:text-lg font-black text-[#8A1A1A]">சந்திராஷ்டமம்</h3>
                    <p className="text-xs md:text-sm text-amber-950 font-bold mt-1 leading-relaxed">
                      {calendarInfo.chandrashtamam}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* 2 & 3. நல்ல நேரம் & கௌரி நல்ல நேரம் SECTION */}
            <div className="bg-[#FFFDF9] border-t-2 border-dashed border-[#8A1A1A]/15" id="section_nalla_neram_container">
              <div className="bg-[#E6F4EA] border-b border-[#8A1A1A]/10 px-4 py-2 flex items-center space-x-2">
                <span className="text-[#137333] font-black text-sm">•</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#137333]">நல்ல நேரம் & கௌரி நல்ல நேரம்</h3>
              </div>
              
              {(() => {
                const nm = splitTimeValue(calendarInfo.nallaNeram.morning || 'காலை 07:30 - 09:00');
                const ne = splitTimeValue(calendarInfo.nallaNeram.evening || 'மாலை 04:30 - 06:00');
                const gnm = splitTimeValue(calendarInfo.gowriNallaNeram.morning || 'காலை 10:30 - 12:00');
                const gne = splitTimeValue(calendarInfo.gowriNallaNeram.evening || 'மாலை 07:30 - 09:00');

                return (
                  <div className="p-4 grid grid-cols-1 gap-3" id="timing_grids">
                    {/* நல்ல நேரம் */}
                    <div className="bg-white border border-[#A3E635]/30 rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col" id="box_nalla_neram">
                      <div className="text-center mb-2 pb-1.5 border-b border-[#E2E8F0]">
                        <span className="text-[#0D9488] font-black text-xs md:text-sm">நல்ல நேரம்</span>
                      </div>
                      <div className="space-y-2 text-xs flex-grow flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                          <span className="text-[#475569] font-bold">காலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-[11px] block">{nm.period}</span>
                            <span className="text-[#8A1A1A] font-black text-xs">{nm.time}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-2">
                          <span className="text-[#475569] font-bold">மாலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-[11px] block">{ne.period}</span>
                            <span className="text-[#8A1A1A] font-black text-xs">{ne.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* கௌரி நல்ல நேரம் */}
                    <div className="bg-white border border-[#A3E635]/30 rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col" id="box_gowri_nalla_neram">
                      <div className="text-center mb-2 pb-1.5 border-b border-[#E2E8F0]">
                        <span className="text-[#0D9488] font-black text-xs md:text-sm">கௌரி நல்ல நேரம்</span>
                      </div>
                      <div className="space-y-2 text-xs flex-grow flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                          <span className="text-[#475569] font-bold">காலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-[11px] block">{gnm.period}</span>
                            <span className="text-[#8A1A1A] font-black text-xs">{gnm.time}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-2">
                          <span className="text-[#475569] font-bold">மாலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-[11px] block">{gne.period}</span>
                            <span className="text-[#8A1A1A] font-black text-xs">{gne.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 4. ராகுகாலம் , எமகண்டம் , குளிகை & சூலம் SECTION */}
            <div className="bg-[#FFFDF9] border-t-2 border-dashed border-[#8A1A1A]/15" id="section_obstacles_container">
              <div className="bg-[#FCE8E6] border-b border-[#8A1A1A]/10 px-4 py-2 flex items-center space-x-2">
                <span className="text-[#C5221F] font-black text-sm">•</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C5221F]">ராகுகாலம் , எமகண்டம் , குளிகை</h3>
              </div>
              
              {(() => {
                const rk = splitTimeValue(calendarInfo.raghuKalam || 'மாலை 03:00 - 04:30');
                const yg = splitTimeValue(calendarInfo.yamagandam || 'காலை 09:00 - 10:30');
                const kg = splitTimeValue(calendarInfo.kuligai || 'பகல் 12:00 - 01:30');

                return (
                  <div className="p-4 space-y-4" id="obstacles_details">
                    <div className="grid grid-cols-1 gap-3" id="bad_timings_grid">
                      
                      {/* ராகுகாலம் */}
                      <div className="bg-[#FDF2F2] border border-[#FEE2E2] rounded-2xl p-3 flex justify-between items-center" id="box_raghu_kalam">
                        <span className="text-[#991B1B] font-black text-xs md:text-sm">ராகுகாலம்:</span>
                        <div className="text-right leading-tight">
                          <span className="text-[#991B1B] font-black text-[11px] block">{rk.period}</span>
                          <span className="text-slate-800 font-black text-xs md:text-sm">{rk.time}</span>
                        </div>
                      </div>

                      {/* எமகண்டம் */}
                      <div className="bg-[#FDF2F2] border border-[#FEE2E2] rounded-2xl p-3 flex justify-between items-center" id="box_yamagandam">
                        <span className="text-[#991B1B] font-black text-xs md:text-sm">எமகண்டம்:</span>
                        <div className="text-right leading-tight">
                          <span className="text-[#991B1B] font-black text-[11px] block">{yg.period}</span>
                          <span className="text-slate-800 font-black text-xs md:text-sm">{yg.time}</span>
                        </div>
                      </div>

                      {/* குளிகை */}
                      <div className="bg-[#FDF2F2] border border-[#FEE2E2] rounded-2xl p-3 flex justify-between items-center" id="box_kuligai">
                        <span className="text-[#991B1B] font-black text-xs md:text-sm">குளிகை:</span>
                        <div className="text-right leading-tight">
                          <span className="text-[#991B1B] font-black text-[11px] block">{kg.period}</span>
                          <span className="text-slate-800 font-black text-xs md:text-sm">{kg.time}</span>
                        </div>
                      </div>

                    </div>

                    {/* சூலம் & பரிகாரம் */}
                    <div className="bg-[#FEFCE8] border border-[#FEF08A]/50 rounded-2xl p-3" id="soolam_box">
                      <div className="grid grid-cols-1 gap-2.5 text-xs font-bold">
                        <div className="flex justify-between items-center bg-white border border-[#FDE047] px-3 py-2 rounded-xl">
                          <span className="text-[#D97706] font-black text-xs md:text-sm">சூலம்:</span>
                          <strong className="text-[#1E3A8A] font-black text-sm">{calendarInfo.soolam || 'வடக்கு'}</strong>
                        </div>
                        <div className="flex justify-between items-center bg-white border border-[#FDE047] px-3 py-2 rounded-xl">
                          <span className="text-[#D97706] font-black text-xs md:text-sm">பரிகாரம்:</span>
                          <strong className="text-[#1E3A8A] font-black text-sm">{calendarInfo.parigaram || 'பால்'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 5. இன்றைய ராசிபலன் SECTION */}
            <div className="bg-[#FFFDF9] border-t-2 border-dashed border-[#8A1A1A]/15 pb-4" id="section_rasi_palan_container">
              <div className="bg-amber-50/55 border-b border-[#8A1A1A]/10 px-4 py-2 flex items-center space-x-2">
                <span className="text-amber-800 font-extrabold text-sm">☸️</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">இன்றைய ராசிபலன்</h3>
              </div>

              <div className="p-4 grid grid-cols-1 gap-3" id="rasi_predictions_grid">
                {Object.keys(DAILY_RASI_PALAN).map((r) => {
                  const rasiData = getRasiPalanForDate(selectedDateStr, r);
                  const rasiName = rasiData.rasi;
                  const emojiSymbol = RASI_SYMBOLS[rasiName] || '☸️';

                  const getStatusBadge = (status: string) => {
                    if (status === 'Excellent') {
                      return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">மிகச் சிறப்பு</span>;
                    } else if (status === 'Good') {
                      return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">நன்று</span>;
                    }
                    return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">சாதாரண நாள்</span>;
                  };

                  const getRatingStars = (rating: number) => {
                    return [...Array(5)].map((_, i) => (
                      <span key={i} className={`text-[10px] ${i < rating ? 'text-amber-500' : 'text-gray-200'}`}>★</span>
                    ));
                  };

                  return (
                    <div key={r} className="bg-white border border-amber-100/80 rounded-xl p-3 shadow-sm hover:shadow-md transition duration-200 space-y-1.5 flex flex-col justify-between" id={`rasi_card_${rasiName}`}>
                      <div className="flex items-center justify-between border-b border-amber-50/50 pb-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm">{emojiSymbol}</span>
                          <span className="font-extrabold text-xs text-[#8A1A1A]">{rasiName}</span>
                        </div>
                        {getStatusBadge(rasiData.status)}
                      </div>
                      <p className="text-[11px] text-[#5C1A1A] font-medium leading-relaxed flex-grow">
                        {rasiData.prediction}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-amber-50">
                        <span className="text-[9px] text-amber-800/80 font-bold">இன்றைய பலன்:</span>
                        <div className="flex">{getRatingStars(rasiData.rating)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle calendar info footer of the sheet */}
            <div className="bg-[#8A1A1A]/5 p-2 flex justify-between items-center text-[10px] font-bold text-[#8A1A1A] border-t border-[#8A1A1A]/10 px-4">
              <span>{calendarInfo.tamilYear} வருடம் • {calendarInfo.tamilMonth} {calendarInfo.tamilDay}</span>
              <span className="font-mono">{engDay} {getEngMonthInTamil(selectedDateStr)} {engYear} • {calendarInfo.dayOfWeek}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Footer */}
      <footer className="mt-6 text-center px-4" id="daily_footer_decor">
        <p className="text-xs font-bold text-[#8A1A1A]/70 font-display">
          வாழ்க வளமுடன் • சர்வ மங்கள மாங்கல்யே சிவே சர்வார்த்த சாதிகே
        </p>
      </footer>

      </div> {/* Close daily_scroll_body */}
    </div>
  );
}
