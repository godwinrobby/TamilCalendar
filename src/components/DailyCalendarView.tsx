/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getTamilCalendarInfo, getCurrentISTDateString } from '../utils/tamilCalendar';
import { Calendar, ChevronLeft, ChevronRight, Award, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Sync with incoming prop changes (e.g. from Page Router hash changes)
  React.useEffect(() => {
    if (initialDate && initialDate !== selectedDateStr) {
      setSelectedDateStr(initialDate);
    }
  }, [initialDate]);

  const calendarInfo = getTamilCalendarInfo(selectedDateStr);

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
            className="w-full bg-[#FFFFFF] border-t-8 border-x-2 border-b-[6px] border-[#8A1A1A] rounded-2xl shadow-xl overflow-hidden relative flex flex-col min-h-[480px] flex-shrink-0"
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
              <h2 className="text-lg md:text-xl font-extrabold text-[#8A1A1A] tracking-normal" id="main_sheet_title">
                {mainSheetTitle}
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

            {/* 4 Detailed Rows with Dividers */}
            <div className="flex-grow divide-y divide-[#8A1A1A]/10" id="astrology_rows_container">
              
              {/* Row 1: நட்சத்திரம் */}
              <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition" id="row_nakshatram">
                <div className="mt-0.5 text-[#8A1A1A]" id="icon_nakshatram">
                  <svg className="w-7 h-7 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.49.887-.49 1.08 0l2 4.992a1 1 0 00.751.585l5.4.542c.528.053.74.7.358 1.058l-4.1 3.823a1 1 0 00-.287.885l1.1 5.3c.108.52-.444.921-.903.655l-4.75-2.784a1 1 0 00-.916 0l-4.75 2.784c-.459.266-1.011-.135-.903-.655l1.1-5.3a1 1 0 00-.287-.885L2.378 10.12c-.382-.358-.17-.1-.358-1.058l5.4-.542a1 1 0 00.751-.585l2-4.992z" />
                  </svg>
                </div>
                <div className="leading-relaxed">
                  <h3 className="text-base font-extrabold text-[#5C1A1A]">நட்சத்திரம்</h3>
                  <p className="text-xs text-amber-950 font-medium mt-1">
                    {calendarInfo.nakshatramTime} <span className="font-extrabold text-[#8A1A1A]">{calendarInfo.nakshatram}</span> பின்பு <span className="font-semibold">{calendarInfo.nextNakshatram}</span>
                  </p>
                </div>
              </div>

              {/* Row 2: திதி */}
              <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition" id="row_thithi">
                <div className="mt-0.5 text-[#8A1A1A]" id="icon_thithi">
                  <svg className="w-7 h-7 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    <circle cx="9" cy="12" r="4" strokeWidth="1" strokeDasharray="1,1" />
                  </svg>
                </div>
                <div className="leading-relaxed">
                  <h3 className="text-base font-extrabold text-[#5C1A1A]">திதி</h3>
                  <p className="text-xs text-amber-950 font-medium mt-1">
                    {calendarInfo.thithiTime} <span className="font-extrabold text-[#8A1A1A]">{calendarInfo.thithi.split(' ')[1] || calendarInfo.thithi}</span> பின்பு <span className="font-semibold">{calendarInfo.nextThithi}</span>
                  </p>
                </div>
              </div>

              {/* Row 3: யோகம் */}
              <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition" id="row_yogam">
                <div className="mt-0.5 text-[#8A1A1A]" id="icon_yogam">
                  <svg className="w-7 h-7 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <circle cx="8" cy="12" r="3" />
                    <circle cx="16" cy="12" r="3" />
                    <circle cx="12" cy="8" r="3" />
                    <circle cx="12" cy="16" r="3" />
                  </svg>
                </div>
                <div className="leading-relaxed">
                  <h3 className="text-base font-extrabold text-[#5C1A1A]">யோகம்</h3>
                  <p className="text-xs text-amber-950 font-bold mt-1 text-[#8A1A1A]">
                    {calendarInfo.yogam.split(' ')[0]}
                  </p>
                </div>
              </div>

              {/* Row 4: சந்திராஷ்டமம் */}
              <div className="p-4 flex items-start space-x-4 hover:bg-amber-50/10 transition" id="row_chandrashtamam">
                <div className="mt-0.5 text-[#8A1A1A]" id="icon_chandrashtamam">
                  <svg className="w-7 h-7 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5 5 0 0 1-7.54-7.54C12.92 3.04 12.46 3 12 3Z" />
                    <path d="M16 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </div>
                <div className="leading-relaxed">
                  <h3 className="text-base font-extrabold text-[#5C1A1A]">சந்திராஷ்டமம்</h3>
                  <p className="text-xs text-amber-950 font-bold mt-1">
                    {calendarInfo.chandrashtamam}
                  </p>
                </div>
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

      {/* 3. COLLAPSIBLE ADDITIONAL DETAILS (Good times, Obstacles, Soolam) */}
      <div className="max-w-md md:max-w-lg w-full mx-auto px-4 mt-3" id="more_details_accordion">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between bg-amber-100/40 hover:bg-amber-100/60 transition p-3 rounded-xl border border-amber-200 text-xs font-extrabold text-[#8A1A1A] cursor-pointer shadow-sm"
          id="btn_toggle_details"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm">📅</span>
            <span>கூடுதல் பஞ்சாங்க விவரங்கள் (Panchangam Details)</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight className="w-4 h-4 text-[#8A1A1A]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2 bg-white border border-amber-200/80 rounded-xl p-3 space-y-3 shadow-sm text-xs"
              id="expanded_panchangam_details"
            >
              {/* Auspicious Day Badge */}
              <div className="flex justify-center">
                {calendarInfo.isAuspicious ? (
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>சுப முகூர்த்த நாள் (Auspicious Day)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <span>சாதாரண நாள் (Standard Day)</span>
                  </div>
                )}
              </div>

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

              {/* 3. Soolam & Parigaram */}
              <div className="bg-amber-500/5 border border-amber-600/25 rounded-xl p-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <div>
                    <span className="text-amber-800 block font-medium text-[8px]">சூலம் (Soolam):</span>
                    <p className="text-red-900 font-extrabold">{calendarInfo.soolam}</p>
                  </div>
                  <div>
                    <span className="text-amber-800 block font-medium text-[8px]">பரிகாரம் (Remedy):</span>
                    <p className="text-red-900 font-extrabold">{calendarInfo.parigaram}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
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
