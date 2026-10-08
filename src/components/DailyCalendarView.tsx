/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getCurrentISTDateString, getRasiPalanForDate, DAILY_RASI_PALAN, TAMIL_WEEKDAYS } from '../utils/tamilCalendar';
import { Calendar, ChevronLeft, ChevronRight, Award, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigateToRoute } from '../router';
import { apiFetchJson } from '../utils/apiFetch';
import { getPhaseArrowIcon, getSpecialSymbolIcon, getMoonDetailsIcon, getSymbolIcon } from '../utils/assetIcons';

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

  const [apiRecord, setApiRecord] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch ONLY from the production API for the selected date
  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setApiRecord(null);

    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    // De-duplicated with App.tsx ensureDateInCache for the same date —
    // only one network request is made even with both frames mounted.
    apiFetchJson(`${apiBase}/calendar?date=${encodeURIComponent(selectedDateStr)}`, {
      decodeTamilEscapes: true,
    })
      .then((result) => {
        if (!cancelled) {
          if (result.success && result.data && result.data[selectedDateStr]) {
            setApiRecord(result.data[selectedDateStr]);
          } else {
            setApiRecord(null);
            setLoadError('No calendar data available from API for this date.');
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Error fetching daily calendar from API:', err);
          setLoadError('Unable to load calendar data from server.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDateStr]);

  // Map all data directly from API
  const calendarInfo = apiRecord || {
    englishDate: selectedDateStr,
    tamilYear: '',
    tamilMonth: '',
    tamilDay: 0,
    dayOfWeek: '',
    thithi: '',
    nakshatram: '',
    yogam: '',
    nallaNeram: { morning: '', evening: '' },
    gowriNallaNeram: { morning: '', evening: '' },
    raghuKalam: '',
    yamagandam: '',
    kuligai: '',
    soolam: '',
    parigaram: '',
    isAuspicious: false,
    festivals: [],
    nextNakshatram: '',
    nextThithi: '',
    chandrashtamam: '',
    nakshatramTime: '',
    thithiTime: '',
    phaseArrow: 'up',
    isPradosham: false,
    isMaranaYogam: false,
    specialSymbols: '',
    moonDetails: '',
    symbols: '',
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🕉</div>
          </div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-sm font-black text-[#8A1A1A] tracking-wide"
          >
            காலண்டர் ஏற்றப்படுகிறது...
          </motion.p>
          <p className="text-[11px] text-[#8A1A1A]/70 mt-1 font-medium">Loading calendar from server...</p>
        </motion.div>
      </div>
    );
  }

  if (loadError || !apiRecord) {
    return (
      <div className="p-6">
        <div className="text-center py-10 text-gray-500">
          {loadError || 'No calendar data available.'}
        </div>
      </div>
    );
  }

  const getFormattedNakshatram = () => {
    const nak = calendarInfo.nakshatram || '';
    let suffix = '';
    if (!nak.includes('பின்பு') && calendarInfo.nextNakshatram) {
      suffix = ' பின்பு ' + calendarInfo.nextNakshatram;
    }
    return nak + suffix;
  };

  const getFormattedThithi = () => {
    const th = calendarInfo.thithi || '';
    let suffix = '';
    if (!th.includes('பின்பு') && calendarInfo.nextThithi) {
      suffix = ' பின்பு ' + calendarInfo.nextThithi;
    }
    return th + suffix;
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
    const currentDate = new Date(selectedDateStr + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + offset);
    setDirection(offset > 0 ? 'right' : 'left');
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const newDateStr = `${year}-${month}-${day}`;
    setSelectedDateStr(newDateStr);
    navigateToRoute('daily', newDateStr);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    if (dateVal) {
      const isLater = new Date(dateVal + 'T00:00:00').getTime() > new Date(selectedDateStr + 'T00:00:00').getTime();
      setDirection(isLater ? 'right' : 'left');
      setSelectedDateStr(dateVal);
      navigateToRoute('daily', dateVal);
    }
  };

  // Convert English Month to Tamil name for header
  const getEngMonthInTamil = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const months = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    return months[d.getMonth()];
  };

  // Get Tamil day of week
  const getTamilDayOfWeek = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    const weekdayIndex = d.getDay();
    return TAMIL_WEEKDAYS[weekdayIndex];
  };

  const engDay = new Date(selectedDateStr + 'T00:00:00').getDate();
  const engYear = new Date(selectedDateStr + 'T00:00:00').getFullYear();

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
      transition: { duration: 0.3, ease: 'easeOut' as const }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -300 : 300,
      opacity: 0,
      rotateY: dir === 'right' ? -35 : 35,
      transition: { duration: 0.3, ease: 'easeIn' as const }
    })
  };

  // Determine the primary sheet title only from specialToday
  const specialTodayRaw = apiRecord?.specialToday || '';
  const mainSheetTitle = specialTodayRaw.trim() ? specialTodayRaw.split(/[,;\n]+/)[0].trim() : '';

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="daily_calendar_container">
      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-24 scrollbar-thin flex flex-col" id="daily_scroll_body">

      {/* 1. THE MODERN REDESIGNED DATE HEADER CARD WITH BUILT-IN CONTROLS */}
      <div className="w-full max-w-md md:max-w-lg mx-auto px-4 mt-3 relative overflow-hidden flex-shrink-0" id="sheet_container" style={{ perspective: 1200 }}>
        {/* Date Picker + Navigation integrated into header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#8A1A1A]/5 to-amber-50/80 p-1.5 rounded-2xl border border-amber-200/80 shadow-sm mb-2" id="navigation_controls">
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
              style={{ 
                colorScheme: 'light', 
                fontSize: '11px',
                width: '0px',
                position: 'absolute',
                opacity: '0'
              }}
            />
            <span 
              className="cursor-pointer text-xs font-bold text-[#5C1A1A] font-mono"
              onClick={(e) => {
                const dateInput = document.getElementById('datepicker_input') as HTMLInputElement;
                if (dateInput) {
                  dateInput.showPicker?.();
                }
              }}
            >
              {(() => {
                const [year, month, day] = selectedDateStr.split('-');
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const monthName = monthNames[parseInt(month) - 1];
                return `${monthName}-${parseInt(day)}-${year}`;
              })()}
            </span>
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
                changeDate(-1);
              } else if (info.offset.x < -swipeThreshold) {
                changeDate(1);
              }
            }}
            className="w-full bg-[#FFFFFF] border-t-8 border-x-2 border-b-[6px] border-[#8A1A1A] rounded-2xl shadow-xl overflow-hidden relative flex flex-col min-h-[480px] flex-shrink-0 cursor-grab active:cursor-grabbing touch-pan-y selection:bg-transparent"
            id={`sheet_card_${selectedDateStr}`}
          >
              <div className='px-4 py-3'>
            <div className="flex items-stretch gap-2">
                {/* Left: Gregorian */}
                <div className="flex-1 bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                  <div className="bg-[#8A1A1A] px-2 py-1">
                    <span className="text-[9px] font-bold text-amber-200 uppercase tracking-wider text-center block">ஆங்கிலம்</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3">
                    <span className="text-3xl font-black text-[#8A1A1A] leading-none">{engDay}</span>
                    <span className="text-[10px] font-bold text-amber-800 mt-1 text-center">{getEngMonthInTamil(selectedDateStr)}</span>
                    <span className="text-[10px] font-bold text-gray-500 text-center">{engYear}</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#8A1A1A] to-[#D97706] px-2 py-1.5">
                    <span className="text-[10px] font-black text-white text-center block">{getTamilDayOfWeek(selectedDateStr)}</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="flex items-center">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-amber-400 to-transparent rounded-full"></div>
                </div>

                {/* Right: Tamil */}
                <div className="flex-1 bg-white rounded-xl border border-amber-300 overflow-hidden shadow-sm">
                  <div className="bg-amber-700 px-2 py-1">
                    <span className="text-[9px] font-bold text-amber-100 uppercase tracking-wider text-center block">தமிழ்</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3">
                    <span className="text-sm font-black text-amber-900 leading-none text-center">{calendarInfo.tamilMonth}</span>
                    <span className="text-3xl font-black text-[#D97706] leading-none mt-1 text-center">{calendarInfo.tamilDay}</span>
                    <span className="text-[9px] font-bold text-amber-700 mt-0.5 text-center">{calendarInfo.tamilYear}</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#7C2D12] to-[#D97706] px-2 py-1.5">
                    <span className="text-[10px] font-black text-white text-center block">{getTamilDayOfWeek(selectedDateStr)}</span>
                  </div>
                </div>
              </div>
              </div>
            {/* Tear line effect decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#8A1A1A]/20 flex justify-around items-end overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#FFFDF0] rounded-full -mb-2"></div>
              ))}
            </div>

            {/* Top Sheet Header */}
            <div className="text-center pt-5 pb-3 border-b-2 border-[#8A1A1A] px-4" id="sheet_card_header">
              <h2 className="text-lg md:text-xl font-extrabold text-[#8A1A1A] tracking-normal flex items-center justify-center gap-2" id="main_sheet_title">
                <span>{mainSheetTitle}</span>                
              </h2>
            </div>
            
            {/* Symbolic Indicators Row */}
            <div className="flex justify-between items-center px-5 py-2.5 bg-amber-50/25 border-b border-[#8A1A1A]/10" id="symbolic_indicators_row">
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

              <div className="flex items-center space-x-4" id="right_indicators_box">
                {/* Special Symbols Icon - Multiple icons if pipe-separated */}
                {calendarInfo.specialSymbols && getSpecialSymbolIcon(calendarInfo.specialSymbols).length > 0 && (
                  <div className="flex items-center space-x-2">
                    {getSpecialSymbolIcon(calendarInfo.specialSymbols).map((iconPath, index) => (
                      <div 
                        key={index}
                        className="cursor-help" 
                        title={calendarInfo.specialSymbols}
                      >
                        <img 
                          src={iconPath} 
                          alt={calendarInfo.specialSymbols}
                          className="w-11 h-11 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {/* Moon Details Icon */}
                {calendarInfo.moonDetails && (
                  <div 
                    className="cursor-help" 
                    title={calendarInfo.moonDetails}
                  >
                    <img 
                      src={getMoonDetailsIcon(calendarInfo.moonDetails)} 
                      alt={calendarInfo.moonDetails}
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                )}
                {/* Symbols Icon */}
                {calendarInfo.symbols && (
                  <div 
                    className="cursor-help" 
                    title={calendarInfo.symbols}
                  >
                    <img 
                      src={getSymbolIcon(calendarInfo.symbols)} 
                      alt={calendarInfo.symbols}
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                )}
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
                const nmTime = (calendarInfo.nallaNeramMorning || calendarInfo.nallaNeram?.morning || '').trim();
                const neTime = (calendarInfo.nallaNeramEvening || calendarInfo.nallaNeram?.evening || '').trim();
                const gnmTime = (calendarInfo.gowriMorning || calendarInfo.gowriNallaNeram?.morning || '').trim();
                const gneTime = (calendarInfo.gowriEvening || calendarInfo.gowriNallaNeram?.evening || '').trim();

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
                            <span className="text-[#8A1A1A] font-black text-xs">{nmTime || '−'}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-2">
                          <span className="text-[#475569] font-bold">மாலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-xs">{neTime || '−'}</span>
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
                            <span className="text-[#8A1A1A] font-black text-xs">{gnmTime || '−'}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-2">
                          <span className="text-[#475569] font-bold">மாலை:</span>
                          <div className="text-right leading-tight">
                            <span className="text-[#8A1A1A] font-black text-xs">{gneTime || '−'}</span>
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
                          <span className="text-[#991B1B] font-black text-xs md:text-sm mr-1">{rk.period}</span>
                          <span className="text-slate-800 font-black text-xs md:text-sm">{rk.time}</span>
                        </div>
                      </div>

                      {/* எமகண்டம் */}
                      <div className="bg-[#FDF2F2] border border-[#FEE2E2] rounded-2xl p-3 flex justify-between items-center" id="box_yamagandam">
                        <span className="text-[#991B1B] font-black text-xs md:text-sm">எமகண்டம்:</span>
                        <div className="text-right leading-tight">
                          <span className="text-[#991B1B] font-black text-xs md:text-sm mr-1">{yg.period}</span>
                          <span className="text-slate-800 font-black text-xs md:text-sm">{yg.time}</span>
                        </div>
                      </div>

                      {/* குளிகை */}
                      <div className="bg-[#FDF2F2] border border-[#FEE2E2] rounded-2xl p-3 flex justify-between items-center" id="box_kuligai">
                        <span className="text-[#991B1B] font-black text-xs md:text-sm">குளிகை:</span>
                        <div className="text-right leading-tight">
                          <span className="text-[#991B1B] font-black text-xs md:text-sm mr-1">{kg.period}</span>
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
                {[
                  { key: 'மேஷம்', label: 'மேஷம்', symbol: '♈' },
                  { key: 'ரிஷபம்', label: 'ரிஷபம்', symbol: '♉' },
                  { key: 'மிதுனம்', label: 'மிதுனம்', symbol: '♊' },
                  { key: 'கடகம்', label: 'கடகம்', symbol: '♋' },
                  { key: 'சிம்மம்', label: 'சிம்மம்', symbol: '♌' },
                  { key: 'கன்னி', label: 'கன்னி', symbol: '♍' },
                  { key: 'துலாம்', label: 'துலாம்', symbol: '♎' },
                  // { key: 'விர்சிகம்', label: 'விருச்சிகம்', symbol: '♏' },
                  { key: 'தனுசு', label: 'தனுசு', symbol: '♐' },
                  { key: 'மகரம்', label: 'மகரம்', symbol: '♑' },
                  { key: 'கும்பம்', label: 'கும்பம்', symbol: '♒' },
                  { key: 'மீனம்', label: 'மீனம்', symbol: '♓' },
                ].map((rasi) => {
                  const prediction = calendarInfo[rasi.key] || '';
                  const emojiSymbol = RASI_SYMBOLS[rasi.label] || '☸️';

                  const getStatusBadge = (pred: string) => {
                    if (pred.includes('சிறப்பு') || pred.includes('அதிர்ஷ்டம்') || pred.includes('வெற்றி') || pred.includes('லாபம்')) {
                      return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">மிகச் சிறப்பு</span>;
                    } else if (pred.includes('கவனம்') || pred.includes('நிதானம்') || pred.includes('தவிர்க்கவும்') || pred.includes('அலைச்சல்')) {
                      return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">சாதாரண நாள்</span>;
                    }
                    return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">நன்று</span>;
                  };

                  return (
                    <div key={rasi.key} className="bg-white border border-amber-100/80 rounded-xl p-3 shadow-sm hover:shadow-md transition duration-200 space-y-1.5 flex flex-col justify-between" id={`rasi_card_${rasi.label}`}>
                      <div className="flex items-center justify-between border-b border-amber-50/50 pb-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm">{emojiSymbol}</span>
                          <span className="font-extrabold text-xs text-[#8A1A1A]">{rasi.label}</span>
                          <span className="text-xs text-[#8A1A1A]">: {prediction || '-'}</span>
                        </div>                        
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