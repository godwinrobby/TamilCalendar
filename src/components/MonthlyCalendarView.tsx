/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getTamilCalendarInfo, TAMIL_MONTHS, getTamilMonthAndDay, getThithiForDate } from '../utils/tamilCalendar';
import { ChevronLeft, ChevronRight, Calendar, ArrowUpRight, Flame, Moon, Sun, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TamilDateInfo } from '../types';

interface MonthlyCalendarViewProps {
  onSelectDay: (dateStr: string) => void;
  onClose: () => void;
}

export default function MonthlyCalendarView({ onSelectDay, onClose }: MonthlyCalendarViewProps) {
  // Default to current month of 2026 (or July 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed, so 6 is July)
  const [selectedDayInfo, setSelectedDayInfo] = useState<TamilDateInfo | null>(null);

  const monthNamesEnglish = [
    'January (ஜனவரி)', 'February (பிப்ரவரி)', 'March (மார்ச்)', 'April (ஏப்ரல்)',
    'May (மே)', 'June (ஜூன்)', 'July (ஜூலை)', 'August (ஆகஸ்ட்)',
    'September (செப்டம்பர்)', 'October (அக்டோபர்)', 'November (நவம்பர்)', 'December (டிசம்பர்)'
  ];

  const weekdaysShortTamil = ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'];
  const weekdaysShortEnglish = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day of selected month (to pad the grid)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDayInfo(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDayInfo(null);
  };

  // Create grid cells
  const cells: Array<{ date: Date | null; info: TamilDateInfo | null }> = [];

  // Padding for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ date: null, info: null });
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const tempDate = new Date(currentYear, currentMonth, d, 12, 0, 0); // At noon to avoid timezone issues
    const info = getTamilCalendarInfo(tempDate);
    cells.push({ date: tempDate, info });
  }

  const handleCellClick = (info: TamilDateInfo) => {
    setSelectedDayInfo(info);
  };

  // Check Thithi categories for small visual dots in the cell
  const getDotDetails = (info: TamilDateInfo | null) => {
    if (!info) return null;
    const isHoliday = info.festivals.some(f => !f.includes('விரதம்') && !f.includes('பிரதோஷம்'));
    const isAmavasai = info.thithi.includes('அமாவாசை');
    const isPournami = info.thithi.includes('பௌர்ணமி');
    const isAuspicious = info.isAuspicious;

    return {
      isHoliday,
      isAmavasai,
      isPournami,
      isAuspicious
    };
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="monthly_calendar_container">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706]" id="monthly_header">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-1 px-3 py-1 bg-[#FDF6E2] text-[#8A1A1A] rounded-lg font-medium text-xs hover:bg-amber-100 transition shadow-inner"
          id="btn_back_dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>முகப்பு (Home)</span>
        </button>
        <h1 className="text-lg md:text-xl font-bold font-display flex items-center space-x-2 animate-fade-in" id="monthly_title">
          <Calendar className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>மாதகாட்டி (Monthly Calendar)</span>
        </h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-20 scrollbar-thin flex flex-col" id="monthly_scroll_body">

      {/* Month Switching Controls */}
      <div className="max-w-md w-full mx-auto px-4 mt-4" id="month_navigation">
        <div className="flex items-center justify-between bg-[#FCE5A2] p-3 rounded-2xl border-2 border-[#8A1A1A] shadow-md">
          <button 
            onClick={prevMonth} 
            className="p-1.5 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] transition"
            id="btn_prev_month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-sm font-extrabold text-[#8A1A1A] tracking-tight block">
              {monthNamesEnglish[currentMonth]} {currentYear}
            </h2>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/50 px-2 py-0.5 rounded-full mt-0.5 inline-block">
              வருடம்: {currentYear === 2026 ? 'பராபவ / விஸ்வாவசு' : 'தமிழ் ஆண்டு'}
            </span>
          </div>

          <button 
            onClick={nextMonth} 
            className="p-1.5 bg-[#8A1A1A] text-[#FDF6E2] rounded-full hover:bg-[#A32222] transition"
            id="btn_next_month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-grow max-w-md w-full mx-auto px-4 mt-4" id="calendar_grid_wrapper">
        <div className="bg-white border-2 border-[#8A1A1A] rounded-2xl shadow-lg p-2.5 overflow-hidden">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs border-b border-[#8A1A1A]/20 pb-2 mb-1">
            {weekdaysShortTamil.map((w, idx) => (
              <div 
                key={idx} 
                className={`py-1 rounded-md ${idx === 0 ? 'text-red-600 bg-red-50' : 'text-amber-900 bg-amber-50/50'}`}
              >
                <span className="block font-extrabold">{w}</span>
                <span className="text-[9px] block opacity-60 font-mono font-medium">{weekdaysShortEnglish[idx]}</span>
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1" id="monthly_days_grid">
            {cells.map((cell, idx) => {
              if (!cell.date || !cell.info) {
                return (
                  <div 
                    key={`empty-${idx}`} 
                    className="aspect-square bg-amber-50/10 rounded-xl"
                  />
                );
              }

              const d = cell.date.getDate();
              const dots = getDotDetails(cell.info);
              const isSelected = selectedDayInfo?.englishDate === cell.info.englishDate;
              
              // Highlight style
              let cellBg = 'bg-[#FFFDF0]/50 hover:bg-amber-100/40 border-amber-100';
              if (isSelected) {
                cellBg = 'bg-amber-500/20 border-amber-600 ring-2 ring-amber-500/40';
              } else if (dots?.isHoliday) {
                cellBg = 'bg-red-50 hover:bg-red-100/50 border-red-200';
              } else if (dots?.isPournami) {
                cellBg = 'bg-amber-50 hover:bg-amber-100/70 border-amber-200';
              }

              return (
                <button
                  key={`day-${d}`}
                  onClick={() => handleCellClick(cell.info!)}
                  className={`aspect-square border rounded-xl flex flex-col justify-between p-1.5 transition duration-150 relative cursor-pointer group ${cellBg}`}
                  id={`cell_${cell.info.englishDate}`}
                >
                  {/* Top Row: English Date & Astrological markers */}
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-sm font-extrabold font-mono ${cell.date.getDay() === 0 ? 'text-red-600' : 'text-amber-950'}`}>
                      {d}
                    </span>
                    
                    {/* Tiny Moon phase or Holiday dot */}
                    {dots?.isPournami && <Sun className="w-2.5 h-2.5 text-amber-500 fill-amber-300 flex-shrink-0 animate-spin-slow" />}
                    {dots?.isAmavasai && <Moon className="w-2.5 h-2.5 text-slate-800 fill-slate-800 flex-shrink-0" />}
                    {!dots?.isPournami && !dots?.isAmavasai && dots?.isHoliday && <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />}
                  </div>

                  {/* Bottom Row: Tamil Date */}
                  <div className="flex items-end justify-between w-full">
                    {/* Visual dot indicators */}
                    <div className="flex space-x-0.5">
                      {dots?.isAuspicious && <div className="w-1 h-1 bg-emerald-500 rounded-full" title="Auspicious Day" />}
                    </div>
                    {/* Tamil day number */}
                    <span className="text-[10px] font-mono font-bold text-amber-700/80 leading-none">
                      {cell.info.tamilDay}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Grid Indicators Key */}
          <div className="flex flex-wrap items-center justify-around mt-4 pt-3 border-t border-[#8A1A1A]/10 text-[10px] font-bold text-amber-900 gap-y-1">
            <div className="flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
              <span>பௌர்ணமி (Full Moon)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Moon className="w-3.5 h-3.5 text-slate-800 fill-slate-800" />
              <span>அமாவாசை (New Moon)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>விடுமுறை/பண்டிகை (Holiday)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>சுப நாள் (Auspicious)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Quick-Look Drawer (Interactive drawer appearing when a day is clicked) */}
      <div className="max-w-md w-full mx-auto px-4 mt-4" id="drawer_area">
        <AnimatePresence>
          {selectedDayInfo ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-[#FCF8E3] border-2 border-[#8A1A1A] rounded-2xl shadow-xl overflow-hidden"
              id="selected_day_drawer"
            >
              {/* Drawer Top Header Banner */}
              <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-2 flex justify-between items-center text-xs font-bold">
                <span>தேதி: {selectedDayInfo.englishDate} • {selectedDayInfo.dayOfWeek}</span>
                <span className="bg-[#F9EAA2] text-[#8A1A1A] px-2 py-0.5 rounded-full text-[10px]">
                  {selectedDayInfo.tamilMonth} {selectedDayInfo.tamilDay}
                </span>
              </div>

              {/* Drawer Info Content */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#8A1A1A] flex items-center space-x-1">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>நாள் விபரம் (Day Details)</span>
                    </h3>
                    <div className="text-xs font-bold text-amber-900 mt-1 space-y-0.5">
                      <p>திதி: <span className="text-[#8A1A1A] font-black">{selectedDayInfo.thithi}</span></p>
                      <p>நட்சத்திரம்: <span className="text-[#8A1A1A] font-black">{selectedDayInfo.nakshatram}</span></p>
                      <p>யோகம்: <span className="text-[#8A1A1A] font-black">{selectedDayInfo.yogam}</span></p>
                    </div>
                  </div>
                  
                  {/* Jump To Sheet Button */}
                  <button
                    onClick={() => onSelectDay(selectedDayInfo.englishDate)}
                    className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
                    id="btn_view_sheet"
                  >
                    <span>விரிவாக</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Festivals indicator on drawer */}
                {selectedDayInfo.festivals.length > 0 && (
                  <div className="border-t border-amber-300/60 pt-2">
                    <span className="text-[10px] font-bold text-red-800 uppercase block tracking-wider mb-1">சிறப்பு விசேஷங்கள் (Festivals):</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDayInfo.festivals.map((fest, fidx) => (
                        <span 
                          key={fidx} 
                          className="bg-red-100 border border-red-200 text-red-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-0.5"
                        >
                          <Flame className="w-2.5 h-2.5 text-red-600" />
                          <span>{fest}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-amber-500/10 border-2 border-dashed border-amber-600/20 rounded-2xl p-6 text-center text-xs font-medium text-amber-800">
              <p>ஏதேனும் ஒரு தேதியை அழுத்தவும், அன்றைய விபரங்களை இங்கு காணலாம்.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      </div> {/* Close monthly_scroll_body */}
    </div>
  );
}
