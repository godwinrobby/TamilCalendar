/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { getFestivalsList } from '../utils/tamilCalendar';
import { ChevronLeft, Search, Flame, Calendar, ArrowRight, Sun, Heart, Sparkles } from 'lucide-react';
import { FestivalInfo } from '../types';

interface FestivalsViewProps {
  onSelectDay: (dateStr: string) => void;
  onClose: () => void;
}

export default function FestivalsView({ onSelectDay, onClose }: FestivalsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'hindu' | 'holiday'>('all');

  const festivals = useMemo(() => getFestivalsList(), []);

  // Filter list based on search and tab
  const filteredFestivals = useMemo(() => {
    return festivals.filter((fest) => {
      // Search matches English name or Tamil name
      const matchesSearch = 
        fest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.tamilName.includes(searchTerm);

      if (!matchesSearch) return false;

      // Tab matching
      if (selectedTab === 'all') return true;
      if (selectedTab === 'holiday') {
        return fest.type === 'national' || fest.type === 'holiday';
      }
      return fest.type === selectedTab;
    });
  }, [festivals, searchTerm, selectedTab]);

  // Convert English date (YYYY-MM-DD) to friendly format (DD Month YYYY)
  const formatFriendlyDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    const months = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} 2026`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hindu':
        return <Flame className="w-5 h-5 text-[#8A1A1A]" />;
      case 'christian':
        return <Heart className="w-5 h-5 text-indigo-600" />;
      case 'muslim':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'national':
      case 'holiday':
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="festivals_view_container">
      {/* Scrollable Body */}
      <div className="flex-grow overflow-y-auto pb-20 scrollbar-thin flex flex-col" id="festivals_scroll_body">

      {/* Search Input */}
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl w-full mx-auto px-2 mt-2" id="festivals_search">
        <div className="relative flex items-center bg-white border-2 border-[#8A1A1A] rounded-2xl shadow-sm overflow-hidden px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-500/30 transition">
          <Search className="w-5 h-5 text-amber-800 mr-2" />
          <input 
            type="text" 
            placeholder="தேடவும் (e.g., பொங்கல், தீபாவளி, New Year)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#5C1A1A] font-bold text-xs md:text-sm placeholder-amber-800/40"
            id="search_festivals_input"
          />
        </div>
      </div>

       {/* Categories Tabs */}
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl w-full mx-auto px-2 mt-2" id="festivals_tabs">
        <div className="flex space-x-1 bg-amber-100 p-1 rounded-xl border border-amber-200 overflow-x-auto scrollbar-none" id="tabs_scrollable">
          <button 
            onClick={() => setSelectedTab('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedTab === 'all' ? 'bg-[#8A1A1A] text-white shadow-md' : 'text-[#8A1A1A] hover:bg-amber-200/50'}`}
          >
            அனைத்தும்
          </button>
          <button 
            onClick={() => setSelectedTab('hindu')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedTab === 'hindu' ? 'bg-[#8A1A1A] text-white shadow-md' : 'text-[#8A1A1A] hover:bg-amber-200/50'}`}
          >
            இந்து
          </button>
          <button 
            onClick={() => setSelectedTab('holiday')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedTab === 'holiday' ? 'bg-[#8A1A1A] text-white shadow-md' : 'text-[#8A1A1A] hover:bg-amber-200/50'}`}
          >
            அரசு விடுமுறை
          </button>
        </div>
      </div>

      {/* Festivals List */}
      <div className="flex-grow max-w-md md:max-w-2xl lg:max-w-3xl w-full mx-auto px-2 mt-2 space-y-3" id="festivals_list_container">
        {filteredFestivals.length > 0 ? (
          filteredFestivals.map((fest) => (
            <div 
              key={fest.id} 
              className="bg-[#FCF8E3] border-2 border-[#8A1A1A]/80 rounded-2xl shadow-md p-4 flex items-start justify-between space-x-3 hover:border-[#8A1A1A] transition"
              id={`fest_card_${fest.id}`}
            >
              {/* Icon Container */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex-shrink-0 shadow-sm">
                {getIconForType(fest.type)}
              </div>

              {/* Text Info */}
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-black text-[#8A1A1A] leading-tight flex items-center space-x-1">
                  <span>{fest.tamilName}</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                  {fest.name}
                </span>

                {/* Date labels */}
                <div className="flex flex-wrap items-center mt-2 text-[10px] gap-x-2 gap-y-0.5">
                  <span className="font-mono bg-amber-500/10 text-amber-900 border border-amber-500/25 rounded px-1.5 py-0.5 font-bold">
                    {formatFriendlyDate(fest.date)}
                  </span>
                  <span className="bg-red-50 text-red-950 border border-red-200 rounded px-1.5 py-0.5 font-bold">
                    {fest.tamilMonth} {fest.tamilDay}
                  </span>
                </div>

                <p className="text-xs text-amber-900/80 font-medium leading-relaxed mt-2 line-clamp-2">
                  {fest.description}
                </p>
              </div>

              {/* Action Button: Go To Day Sheet */}
              <button 
                onClick={() => onSelectDay(fest.date)}
                className="p-2 bg-[#8A1A1A] hover:bg-[#A32222] text-[#FDF6E2] rounded-xl self-center shadow-md active:scale-95 transition cursor-pointer flex-shrink-0"
                title="நாள்காட்டியில் பார்க்கவும் (View on Calendar Sheet)"
                id={`btn_view_fest_${fest.id}`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-amber-500/15 border-2 border-dashed border-amber-600/20 rounded-2xl p-8 text-center text-xs font-semibold text-amber-900">
            தேடலுக்குத் தகுந்த பண்டிகைகள் எதுவும் இல்லை.
          </div>
        )}
      </div>
      </div> {/* Close festivals_scroll_body */}
    </div>
  );
}
