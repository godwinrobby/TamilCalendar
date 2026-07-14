/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, Compass, Send, User, Calendar, Clock, MapPin, Award, Star, RefreshCw, FileText } from 'lucide-react';
import { calculateJathagam, DAILY_RASI_PALAN } from '../utils/tamilCalendar';
import { JathagamInput, JathagamResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AstrologyViewProps {
  onClose: () => void;
}

export default function AstrologyView({ onClose }: AstrologyViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'rasiPalan' | 'jathagam'>('rasiPalan');
  
  // Daily Rasi Palan State
  const [selectedRasi, setSelectedRasi] = useState<string>('மேஷம் (Aries)');

  // Jathagam Calculator State
  const [jathagamInput, setJathagamInput] = useState<JathagamInput>({
    name: '',
    dob: '1998-05-15',
    tob: '08:30',
    pob: 'Chennai',
    gender: 'male'
  });
  const [jathagamResult, setJathagamResult] = useState<JathagamResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const rasiList = Object.keys(DAILY_RASI_PALAN);

  const handleJathagamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jathagamInput.name.trim()) return;

    setIsCalculating(true);
    setTimeout(() => {
      const result = calculateJathagam(jathagamInput);
      setJathagamResult(result);
      setIsCalculating(false);
    }, 1200); // Simulated calculations delay
  };

  const handleResetJathagam = () => {
    setJathagamResult(null);
    setJathagamInput({
      name: '',
      dob: '1998-05-15',
      tob: '08:30',
      pob: 'Chennai',
      gender: 'male'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Average':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getStatusTamil = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'மிகச் சிறப்பு (Excellent)';
      case 'Good':
        return 'நன்று (Good)';
      case 'Average':
      default:
        return 'சாதாரண நாள் (Average)';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF0] text-[#5C1A1A] font-sans pb-10" id="astrology_view_container">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#8A1A1A] text-[#FDF6E2] shadow-md border-b-4 border-[#D97706]" id="astrology_header">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-1 px-3 py-1 bg-[#FDF6E2] text-[#8A1A1A] rounded-lg font-medium text-xs hover:bg-amber-100 transition shadow-inner"
          id="btn_back_dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>முகப்பு (Home)</span>
        </button>
        <h1 className="text-base md:text-lg font-bold font-display flex items-center space-x-2" id="astrology_title">
          <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>ஜோதிடம் & ஜாதகம் (Astrology)</span>
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Sub-tabs Selector (Rasi Palan vs Jathagam Calculator) */}
      <div className="max-w-md w-full mx-auto px-4 mt-4" id="astrology_tabs">
        <div className="grid grid-cols-2 gap-2 bg-[#FCE5A2]/60 p-1.5 rounded-2xl border-2 border-[#8A1A1A]">
          <button
            onClick={() => setActiveSubTab('rasiPalan')}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${activeSubTab === 'rasiPalan' ? 'bg-[#8A1A1A] text-white shadow' : 'text-[#8A1A1A] hover:bg-amber-200/50'}`}
          >
            <Compass className="w-4 h-4" />
            <span>ராசி பலன் (Daily Horoscope)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('jathagam')}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${activeSubTab === 'jathagam' ? 'bg-[#8A1A1A] text-white shadow' : 'text-[#8A1A1A] hover:bg-amber-200/50'}`}
          >
            <FileText className="w-4 h-4" />
            <span>ஜாதகம் கணிக்க (Horoscope Calculator)</span>
          </button>
        </div>
      </div>

      {/* Rasi Palan Sub-view */}
      {activeSubTab === 'rasiPalan' && (
        <div className="max-w-md w-full mx-auto px-4 mt-4 space-y-4" id="rasipalan_subview">
          
          {/* Scrollable Horizontal Zodiac Signs Selector */}
          <div className="bg-white border border-amber-200 rounded-2xl p-2.5 shadow-sm" id="rasi_scroller_box">
            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1.5 tracking-wider px-1">ராசியை தேர்வு செய்யவும் (Select Rasi)</span>
            <div className="flex space-x-1.5 overflow-x-auto scrollbar-none pb-1" id="rasi_scroller">
              {rasiList.map((r) => {
                const isSelected = selectedRasi === r;
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRasi(r)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold transition border cursor-pointer ${isSelected ? 'bg-[#8A1A1A] border-[#8A1A1A] text-white shadow-md scale-95' : 'bg-[#FFFDF0] border-amber-200 text-[#8A1A1A] hover:bg-amber-100/50'}`}
                  >
                    {DAILY_RASI_PALAN[r].rasi}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zodiac Details Card */}
          <div className="bg-[#FCF8E3] border-2 border-[#8A1A1A] rounded-2xl p-5 shadow-lg relative overflow-hidden" id="rasi_details_card">
            
            {/* Compass design icon overlay */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <Compass className="w-56 h-56 rotate-45" />
            </div>

            {/* Title & Badge */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-[#8A1A1A]">{DAILY_RASI_PALAN[selectedRasi].rasi}</h3>
                <span className="text-[10px] font-bold text-amber-800 block mt-0.5">{selectedRasi}</span>
              </div>

              <span className={`text-[10px] font-bold border rounded-full px-3 py-1 shadow-sm flex items-center ${getStatusBadgeColor(DAILY_RASI_PALAN[selectedRasi].status)}`}>
                {getStatusTamil(DAILY_RASI_PALAN[selectedRasi].status)}
              </span>
            </div>

            {/* Stars Rating Visualizer */}
            <div className="my-4 flex items-center space-x-1 bg-amber-500/10 rounded-xl px-3 py-1.5 border border-amber-500/20 w-fit" id="rasi_rating">
              <span className="text-xs font-bold text-amber-900 mr-2">இன்றைய பலன்:</span>
              {[...Array(5)].map((_, idx) => (
                <Star 
                  key={idx} 
                  className={`w-4 h-4 ${idx < DAILY_RASI_PALAN[selectedRasi].rating ? 'text-amber-500 fill-amber-400' : 'text-amber-200/50'}`} 
                />
              ))}
            </div>

            {/* Prediction text */}
            <div className="border-t border-dashed border-[#8A1A1A]/20 pt-3" id="prediction_text_area">
              <span className="text-[10px] font-extrabold text-amber-900 block mb-1 uppercase tracking-wider">இன்றைய பலன்கள் (Prediction)</span>
              <p className="text-xs md:text-sm text-amber-950 font-medium leading-relaxed">
                {DAILY_RASI_PALAN[selectedRasi].prediction}
              </p>
            </div>

            {/* Reminders / Remedies */}
            <div className="mt-4 bg-[#F9EAA2]/50 p-3 rounded-xl border border-amber-300 flex items-start space-x-2 text-xs text-amber-900 font-medium">
              <span className="text-base">☸</span>
              <p>இன்று குலதெய்வம் மற்றும் தியானம் மேற்கொள்வது மன அமைதியை அதிகரித்து, நற்பலன்களை மேலும் வலுப்படுத்தும்.</p>
            </div>
          </div>
        </div>
      )}

      {/* Jathagam Calculator Sub-view */}
      {activeSubTab === 'jathagam' && (
        <div className="max-w-md w-full mx-auto px-4 mt-4" id="jathagam_subview">
          
          <AnimatePresence mode="wait">
            {!jathagamResult ? (
              // 1. Calculator Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border-2 border-[#8A1A1A] rounded-2xl shadow-lg p-5"
                id="jathagam_form_box"
              >
                <div className="text-center mb-5">
                  <FileText className="w-10 h-10 text-amber-600 mx-auto animate-pulse" />
                  <h3 className="text-[#8A1A1A] font-extrabold text-base mt-2">கணினி ஜாதகம் கணித்தல்</h3>
                  <p className="text-xs text-amber-800 mt-1 font-medium">
                    உங்கள் பிறந்த விபரங்களை உள்ளிட்டு, துல்லியமான ரசி கட்டம் மற்றும் ஜோதிட பலன்களைப் பெறுக.
                  </p>
                </div>

                <form onSubmit={handleJathagamSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="text-xs font-bold text-amber-950 block mb-1">பெயர் (Name)</label>
                    <div className="relative flex items-center bg-[#FFFDF0] border border-amber-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amber-500/25 transition">
                      <User className="w-4 h-4 text-amber-700 mr-2" />
                      <input 
                        type="text" 
                        required
                        placeholder="உங்கள் பெயர்"
                        value={jathagamInput.name}
                        onChange={(e) => setJathagamInput({ ...jathagamInput, name: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-[#5C1A1A] text-xs font-bold placeholder-amber-700/30"
                      />
                    </div>
                  </div>

                  {/* Two columns: DOB & TOB */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-amber-950 block mb-1">பிறந்த தேதி (DOB)</label>
                      <div className="relative flex items-center bg-[#FFFDF0] border border-amber-200 rounded-xl px-2 py-2">
                        <Calendar className="w-4 h-4 text-amber-700 mr-1.5 flex-shrink-0" />
                        <input 
                          type="date" 
                          required
                          value={jathagamInput.dob}
                          onChange={(e) => setJathagamInput({ ...jathagamInput, dob: e.target.value })}
                          className="w-full bg-transparent border-none outline-none text-[#5C1A1A] text-xs font-bold font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amber-950 block mb-1">பிறந்த நேரம் (TOB)</label>
                      <div className="relative flex items-center bg-[#FFFDF0] border border-amber-200 rounded-xl px-2 py-2">
                        <Clock className="w-4 h-4 text-amber-700 mr-1.5 flex-shrink-0" />
                        <input 
                          type="time" 
                          required
                          value={jathagamInput.tob}
                          onChange={(e) => setJathagamInput({ ...jathagamInput, tob: e.target.value })}
                          className="w-full bg-transparent border-none outline-none text-[#5C1A1A] text-xs font-bold font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two columns: POB & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-amber-950 block mb-1">பிறந்த ஊர் (POB)</label>
                      <div className="relative flex items-center bg-[#FFFDF0] border border-amber-200 rounded-xl px-2 py-2">
                        <MapPin className="w-4 h-4 text-amber-700 mr-1.5 flex-shrink-0" />
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Madurai"
                          value={jathagamInput.pob}
                          onChange={(e) => setJathagamInput({ ...jathagamInput, pob: e.target.value })}
                          className="w-full bg-transparent border-none outline-none text-[#5C1A1A] text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amber-950 block mb-1">பாலினம் (Gender)</label>
                      <select
                        value={jathagamInput.gender}
                        onChange={(e) => setJathagamInput({ ...jathagamInput, gender: e.target.value as any })}
                        className="w-full bg-[#FFFDF0] border border-amber-200 rounded-xl px-2 py-2 text-[#5C1A1A] text-xs font-bold focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="male">ஆண் (Male)</option>
                        <option value="female">பெண் (Female)</option>
                        <option value="other">இதர (Other)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="w-full bg-[#8A1A1A] hover:bg-[#A32222] text-[#FDF6E2] py-3 rounded-xl text-xs font-bold shadow-md transition duration-150 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ஜாதகம் கணிக்கப்படுகிறது...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ஜாதகம் கணிக்கவும் (Free Calculator)</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              // 2. Calculator Result View
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
                id="jathagam_result_box"
              >
                {/* Result Card Container */}
                <div className="bg-[#FCF8E3] border-4 border-[#8A1A1A] rounded-2xl p-5 shadow-xl border-b-8 relative overflow-hidden">
                  
                  {/* Decorative corner borders */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#8A1A1A]/30" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#8A1A1A]/30" />

                  {/* Title Info */}
                  <div className="text-center border-b border-dashed border-[#8A1A1A]/30 pb-3 mb-4">
                    <span className="text-emerald-800 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      <span>கணினி ஜாதக கணிதம் சித்தித்தது</span>
                    </span>
                    <h4 className="text-xl font-extrabold text-[#8A1A1A] mt-1">{jathagamResult.input.name} ஜாதகம்</h4>
                    <p className="text-[10px] font-semibold text-amber-900 mt-1">
                      பிறந்தது: {jathagamResult.input.dob} | நேரம்: {jathagamResult.input.tob} | ஊர்: {jathagamResult.input.pob}
                    </p>
                  </div>

                  {/* Calculations Details Badge Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold text-[#8A1A1A]">
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[9px] text-amber-800 font-bold block">ஜென்ம ராசி (Rasi):</span>
                      <p className="text-sm font-black mt-0.5 leading-none">{jathagamResult.rasi}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[9px] text-amber-800 font-bold block">ஜென்ம நட்சத்திரம் (Star):</span>
                      <p className="text-sm font-black mt-0.5 leading-none">{jathagamResult.nakshatram}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[9px] text-amber-800 font-bold block">ஜென்ம லக்னம் (Lagna):</span>
                      <p className="text-sm font-black mt-0.5 leading-none">{jathagamResult.lagna}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[9px] text-amber-800 font-bold block">நட்சத்திர அதிபதி (Star Lord):</span>
                      <p className="text-sm font-black mt-0.5 leading-none">{jathagamResult.starLord}</p>
                    </div>
                  </div>

                  {/* Traditional South Indian Astrology 4x4 Grid Chart */}
                  <div className="my-5" id="rasi_chart_grid">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block mb-2 text-center tracking-wider">இராசி சக்கரம் (Astrology Rasi Chart)</span>
                    <div className="grid grid-cols-4 border-2 border-[#8A1A1A] bg-white text-[10px] font-bold">
                      {jathagamResult.chart.map((row, rIdx) => 
                        row.map((cell, cIdx) => {
                          const isCenter = (rIdx === 1 || rIdx === 2) && (cIdx === 1 || cIdx === 2);
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={`aspect-square border border-[#8A1A1A]/40 flex flex-col justify-center items-center text-center p-1 whitespace-pre-line leading-tight text-[9px] ${isCenter ? 'bg-amber-100 text-[#8A1A1A] font-extrabold font-display border-dashed' : 'text-slate-800'}`}
                            >
                              {cell}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Jathagam Predictions list */}
                  <div className="border-t border-dashed border-[#8A1A1A]/30 pt-4" id="predictions_list">
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase block mb-2 tracking-widest">ஜாதக பலாபலன்கள் (Predictions)</span>
                    <div className="space-y-2.5">
                      {jathagamResult.predictions.map((p, idx) => (
                        <p key={idx} className="text-xs text-amber-950 font-medium leading-relaxed pl-3 border-l-2 border-[#8A1A1A]/50">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Reset Buttons */}
                <button
                  onClick={handleResetJathagam}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-[#FFFDF0] py-3 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>புதிய ஜாதகம் கணிக்க</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}
