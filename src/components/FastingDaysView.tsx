/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { getFastingDaysForYear, getTamilCalendarInfo } from '../utils/tamilCalendar';
import { ChevronLeft, Bell, Calendar, ArrowRight, ShieldAlert, Award, Clock, Star } from 'lucide-react';
import { FastingDayInfo } from '../types';

interface FastingDaysViewProps {
  onSelectDay: (dateStr: string) => void;
  onClose: () => void;
}

export default function FastingDaysView({ onSelectDay, onClose }: FastingDaysViewProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Default to July (Index 6)

  const monthNamesTamil = [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ];

  // Get full fasting schedule
  const allFastingDays = useMemo(() => getFastingDaysForYear(2026), []);

  // Filter list based on selected Month & Type
  const filteredFastingDays = useMemo(() => {
    return allFastingDays.filter((fast) => {
      const d = new Date(fast.date);
      const matchesMonth = d.getMonth() === selectedMonth;
      const matchesType = selectedType === 'all' || fast.type === selectedType;
      return matchesMonth && matchesType;
    });
  }, [allFastingDays, selectedMonth, selectedType]);

  // Find the nearest upcoming fasting day relative to "2026-07-13" (provided by current local time metadata)
  const currentLocalTimeStr = '2026-07-13';
  const upcomingFastingDay = useMemo(() => {
    return allFastingDays.find((fast) => {
      return fast.date >= currentLocalTimeStr;
    });
  }, [allFastingDays]);

  // Compute countdown to the upcoming fasting day
  const countdownText = useMemo(() => {
    if (!upcomingFastingDay) return 'இந்த வருட விரத நாட்கள் அனைத்தும் முடிவடைந்தன.';
    
    const currDate = new Date(currentLocalTimeStr);
    const fastDate = new Date(upcomingFastingDay.date);
    const diffTime = fastDate.getTime() - currDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'இன்று (Today!)';
    } else if (diffDays === 1) {
      return 'நாளை (Tomorrow!)';
    } else {
      return `${diffDays} நாட்களில் (${diffDays} Days)`;
    }
  }, [upcomingFastingDay]);

  const formatFriendlyDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${monthNamesTamil[d.getMonth()]} 2026`;
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'amavasai':
        return 'bg-slate-800 text-[#FFFDF0]';
      case 'pournami':
        return 'bg-amber-500 text-amber-950';
      case 'pradhosham':
        return 'bg-red-700 text-[#FFFDF0]';
      case 'sasti':
        return 'bg-orange-600 text-[#FFFDF0]';
      case 'ekadasi':
        return 'bg-emerald-600 text-[#FFFDF0]';
      case 'chaturthi':
        return 'bg-pink-600 text-[#FFFDF0]';
      case 'karthigai':
        return 'bg-yellow-600 text-yellow-950';
      default:
        return 'bg-amber-800 text-[#FFFDF0]';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="fasting_view_container">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706]" id="fasting_header">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-1 px-3 py-1 bg-[#FDF6E2] text-[#8A1A1A] rounded-lg font-medium text-xs hover:bg-amber-100 transition shadow-inner"
          id="btn_back_dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>முகப்பு (Home)</span>
        </button>
        <h1 className="text-base md:text-lg font-bold font-display flex items-center space-x-2 animate-pulse" id="fasting_title">
          <ShieldAlert className="w-5 h-5 text-amber-300" />
          <span>விரத நாட்கள் (Fasting Schedule)</span>
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-20 scrollbar-thin flex flex-col" id="fasting_scroll_body">

      {/* Dynamic Nearest Fasting Countdown Banner */}
      {upcomingFastingDay && (
        <div className="max-w-md w-full mx-auto px-4 mt-4" id="countdown_banner">
          <div className="bg-gradient-to-br from-[#8A1A1A] to-[#A32222] text-[#FDF6E2] p-4 rounded-2xl shadow-xl relative overflow-hidden border-2 border-amber-400">
            {/* Background design */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <Star className="w-40 h-40 rotate-12" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3 animate-spin-slow mr-1" />
                  <span>அடுத்த முக்கிய விரத நாள்</span>
                </span>
                <h2 className="text-lg font-black mt-1 leading-tight">{upcomingFastingDay.tamilName}</h2>
                <p className="text-xs text-amber-100/90 font-medium mt-1">
                  தேதி: {formatFriendlyDate(upcomingFastingDay.date)}
                </p>
              </div>

              <div className="bg-amber-400 text-[#8A1A1A] rounded-2xl px-3 py-2 text-center shadow-md flex-shrink-0 border border-amber-300">
                <span className="text-[9px] uppercase font-black tracking-wider block">COUNTDOWN</span>
                <span className="text-xs md:text-sm font-black block leading-none mt-1">{countdownText}</span>
              </div>
            </div>

            {/* Quick-Action Link */}
            <button 
              onClick={() => onSelectDay(upcomingFastingDay.date)}
              className="mt-3 inline-flex items-center space-x-1.5 text-xs text-amber-200 hover:text-white font-bold transition cursor-pointer"
            >
              <span>நாள்காட்டியில் விரிவாக பார்க்க</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="max-w-md w-full mx-auto px-4 mt-4 space-y-2" id="fasting_filters">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest block">மாதம் மற்றும் விரத வகை தேர்வு</h3>
        
        {/* Month Scroll */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none pb-1" id="month_scroll">
          {monthNamesTamil.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMonth(idx)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${selectedMonth === idx ? 'bg-[#8A1A1A] border-[#8A1A1A] text-white shadow-md' : 'bg-white border-amber-200 text-[#8A1A1A] hover:bg-amber-100/40'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Fast Type Tabs */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none pb-1" id="type_scroll">
          {[
            { id: 'all', name: 'அனைத்தும்' },
            { id: 'amavasai', name: 'அமாவாசை' },
            { id: 'pournami', name: 'பௌர்ணமி' },
            { id: 'pradhosham', name: 'பிரதோஷம்' },
            { id: 'ekadasi', name: 'ஏகாதசி' },
            { id: 'sasti', name: 'சஷ்டி' },
            { id: 'chaturthi', name: 'சதுர்த்தி' },
            { id: 'karthigai', name: 'கார்த்திகை' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${selectedType === type.id ? 'bg-[#5C1A1A] text-white shadow' : 'bg-amber-100/60 text-[#8A1A1A] hover:bg-amber-200/50'}`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fasting Days list */}
      <div className="flex-grow max-w-md w-full mx-auto px-4 mt-4 space-y-3" id="fasting_list_container">
        {filteredFastingDays.length > 0 ? (
          filteredFastingDays.map((fast) => {
            const dateInfo = getTamilCalendarInfo(fast.date);
            return (
              <div 
                key={fast.id} 
                className="bg-[#FCF8E3] border-2 border-[#8A1A1A]/80 rounded-2xl shadow-md p-4 flex items-start justify-between space-x-3 hover:border-[#8A1A1A] transition"
                id={`fast_card_${fast.id}`}
              >
                {/* Visual Icon Badge */}
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex-shrink-0 shadow-sm self-start">
                  <Award className="w-5 h-5 text-amber-600 animate-spin-slow" />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-sm font-black text-[#8A1A1A] leading-tight">{fast.tamilName}</h3>
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${getTypeBadgeColor(fast.type)}`}>
                      {fast.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 block mt-0.5">
                    {fast.name}
                  </span>

                  {/* Dates */}
                  <div className="flex flex-wrap items-center mt-2 text-[9px] gap-x-2 gap-y-0.5">
                    <span className="font-mono bg-amber-500/10 text-amber-900 border border-amber-500/25 rounded px-1.5 py-0.5 font-bold">
                      {formatFriendlyDate(fast.date)}
                    </span>
                    <span className="bg-red-50 text-red-950 border border-red-200 rounded px-1.5 py-0.5 font-bold">
                      {dateInfo.tamilMonth} {dateInfo.tamilDay} ({dateInfo.dayOfWeek})
                    </span>
                  </div>

                  <p className="text-xs text-amber-900/80 font-medium leading-relaxed mt-2">
                    {fast.description}
                  </p>
                </div>

                {/* Action */}
                <button 
                  onClick={() => onSelectDay(fast.date)}
                  className="p-1.5 bg-[#8A1A1A] hover:bg-[#A32222] text-[#FDF6E2] rounded-xl self-center shadow-md active:scale-95 transition cursor-pointer flex-shrink-0"
                  title="நாள்காட்டியில் பார்க்கவும்"
                  id={`btn_view_fast_${fast.id}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="bg-amber-500/10 border-2 border-dashed border-amber-600/20 rounded-2xl p-8 text-center text-xs font-semibold text-amber-900">
            {monthNamesTamil[selectedMonth]} மாதத்தில் இந்த வகையான விரதங்கள் எதுவும் இல்லை.
          </div>
        )}
      </div>
      </div> {/* Close fasting_scroll_body */}
    </div>
  );
}
