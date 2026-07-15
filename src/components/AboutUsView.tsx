/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  Award, 
  Heart, 
  Compass, 
  Globe, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

interface AboutUsViewProps {
  onClose: () => void;
}

export default function AboutUsView({ onClose }: AboutUsViewProps) {
  const tamilMonths = [
    { name: 'சித்திரை', eng: 'Chithirai', season: 'இளவேனில் (Spring)' },
    { name: 'வைகாசி', eng: 'Vaikasi', season: 'இளவேனில் (Spring)' },
    { name: 'ஆனி', eng: 'Aani', season: 'முதுவேனில் (Summer)' },
    { name: 'ஆடி', eng: 'Aadi', season: 'முதுவேனில் (Summer)' },
    { name: 'ஆவணி', eng: 'Aavani', season: 'கார் (Rainy)' },
    { name: 'புரட்டாசி', eng: 'Purattasi', season: 'கார் (Rainy)' },
    { name: 'ஐப்பசி', eng: 'Aippasi', season: 'கூதிர் (Autumn)' },
    { name: 'கார்த்திகை', eng: 'Karthigai', season: 'கூதிர் (Autumn)' },
    { name: 'மார்கழி', eng: 'Margazhi', season: 'முன்பனி (Winter)' },
    { name: 'தை', eng: 'Thai', season: 'முன்பனி (Winter)' },
    { name: 'மாசி', eng: 'Masi', season: 'பின்பனி (Late Winter)' },
    { name: 'பங்குனி', eng: 'Panguni', season: 'பின்பனி (Late Winter)' }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="about_view_container">
      {/* Top Header consistent with other sub-views */}
      <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-3.5 flex items-center shrink-0 border-b-2 border-amber-400/30" id="about_header">
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition mr-2 cursor-pointer flex items-center justify-center"
          title="முகப்புக்குச் செல்லவும்"
          id="btn_back_from_about"
        >
          <ChevronLeft className="w-5 h-5 text-amber-300" />
        </button>
        <div className="leading-tight">
          <h2 className="text-sm font-black tracking-wide">எங்களைப் பற்றி (About Us)</h2>
          <span className="text-[10px] text-amber-300/90 font-bold block">பாரம்பரிய தமிழ் நாட்காட்டி குழுமம்</span>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto pb-20 scrollbar-thin flex flex-col" id="about_scroll_body">
        
        {/* Banner with Traditional Motif */}
        <div className="bg-gradient-to-br from-[#8A1A1A] to-[#A32222] text-[#FDF6E2] p-6 text-center border-b border-amber-400 relative overflow-hidden shrink-0" id="about_banner">
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
            <span className="text-[140px] font-black">🕉</span>
          </div>
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>பாரம்பரிய கணக்கீடு</span>
            </span>
            <h1 className="text-xl md:text-2xl font-black mt-3 text-amber-300 leading-tight">தமிழ் நாள்காட்டி & பஞ்சாங்கம்</h1>
            <p className="text-xs md:text-sm text-amber-100 font-bold max-w-md mx-auto mt-2 leading-relaxed">
              தலைமுறை தலைமுறையாக பின்பற்றி வரும் பாரம்பரிய தமிழ் சோதிட கணித முறைகளின் அடிப்படையில் துல்லியமாக வடிவமைக்கப்பட்ட இணைய நாள்காட்டி செயலி.
            </p>
          </div>
        </div>

        {/* Structured Grid Information */}
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl w-full mx-auto px-3.5 py-4 space-y-6 flex-grow" id="about_content_layout">
          
          {/* Section 1: Our Mission */}
          <div className="bg-white border border-[#8A1A1A]/10 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]" id="about_mission_box">
            <div className="flex items-center space-x-2 border-b border-[#8A1A1A]/10 pb-2 mb-3">
              <Heart className="w-5 h-5 text-[#8A1A1A]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#8A1A1A]">எம்முடைய நோக்கம் (Our Mission)</h3>
            </div>
            <div className="space-y-3 text-xs text-amber-950 font-semibold leading-relaxed">
              <p className="text-justify">
                புலம்பெயர்ந்து வாழும் தமிழர்கள் மற்றும் உலகெங்கும் வாழும் தமிழ் நெஞ்சங்கள் யாவரும் எளிய முறையில் தங்களது அன்றாட சுப காரியங்களை திட்டமிடவும், நல்ல நேரம், ராகுகாலம் போன்றவற்றை அறிந்து கொள்ளவும் இந்தத் தளம் உருவாக்கப்பட்டுள்ளது.
              </p>
              <p className="text-justify">
                காகித நாள்காட்டிகளை தேடாமல், உங்கள் கைப்பேசியிலேயே துல்லியமான வாக்கிய மற்றும் திருக்கணித பஞ்சாங்கத் தரவுகளை ஒரே இடத்தில் முழுமையாகத் தமிழ் மொழியில் வழங்குவதே எங்கள் முதன்மை இலக்காகும்.
              </p>
            </div>
          </div>

          {/* Section 2: Key Capabilities */}
          <div className="space-y-3" id="about_capabilities_section">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest block pl-1">முக்கிய சிறப்பம்சங்கள் (Key Features)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="capabilities_grid">
              
              <div className="bg-[#FCF8E3] border border-[#8A1A1A]/20 p-3.5 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-sm flex-shrink-0">
                  <Compass className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#8A1A1A]">துல்லிய ஜோதிடக் கணிப்பு</h4>
                  <p className="text-[10px] text-amber-900 font-bold mt-1 leading-normal">
                    தினசரி திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் சுப நேரங்கள் துல்லியமான சூரிய உதய நேரத்தை அடிப்படையாகக் கொண்டு கணிக்கப்படுகின்றன.
                  </p>
                </div>
              </div>

              <div className="bg-[#FCF8E3] border border-[#8A1A1A]/20 p-3.5 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-sm flex-shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#8A1A1A]">விரத நாட்களின் பட்டியல்</h4>
                  <p className="text-[10px] text-amber-900 font-bold mt-1 leading-normal">
                    பிரதோஷம், அமாவாசை, கிருத்திகை, ஏகாதசி, சஷ்டி போன்ற அனைத்து முக்கிய விரத நாட்களும் தானியங்கி முறையில் முன்கூட்டியே பட்டியலிடப்படுகின்றன.
                  </p>
                </div>
              </div>

              <div className="bg-[#FCF8E3] border border-[#8A1A1A]/20 p-3.5 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-sm flex-shrink-0">
                  <Globe className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#8A1A1A]">உலகளாவிய நேர மண்டலங்கள்</h4>
                  <p className="text-[10px] text-amber-900 font-bold mt-1 leading-normal">
                    உலகத்தில் எங்கு இருந்தாலும் இந்திய நிலையான நேரத்தை (IST) அடிப்படையாகக் கொண்டு பண்டிகைகளைக் கணக்கிட உதவும் உன்னத தளம்.
                  </p>
                </div>
              </div>

              <div className="bg-[#FCF8E3] border border-[#8A1A1A]/20 p-3.5 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-white rounded-xl border border-amber-200 shadow-sm flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#8A1A1A]">நிர்வாக மேலாண்மை தளம்</h4>
                  <p className="text-[10px] text-amber-900 font-bold mt-1 leading-normal">
                    நாள்காட்டித் தரவுகளில் உள்ள மாற்றங்களை அவ்வப்போது எளிதாகப் புதுப்பிக்க ஏதுவாக பிரத்யேக நிர்வாகி கட்டுப்பாட்டுப் பகுதி (Admin Console).
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Educational - Tamil Months & Seasons */}
          <div className="bg-white border border-[#8A1A1A]/10 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]" id="about_seasons_box">
            <div className="flex items-center space-x-2 border-b border-[#8A1A1A]/10 pb-2 mb-3">
              <BookOpen className="w-5 h-5 text-[#8A1A1A]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#8A1A1A]">தமிழ் மாதங்கள் & பருவங்கள் (Months & Seasons)</h3>
            </div>
            
            <p className="text-[11px] font-bold text-amber-800 leading-relaxed mb-3">
              சூரியன் மேஷ ராசியில் பிரவேசிப்பதிலிருந்து தொடங்கும் தமிழ் வருடத்தின் 12 மாதங்கள் மற்றும் அவற்றிற்கான பருவ காலங்களின் தொகுப்பு:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="tamil_months_grid">
              {tamilMonths.map((month, idx) => (
                <div key={idx} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-amber-600 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="text-xs font-black text-[#8A1A1A] block mt-0.5">{month.name}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{month.eng}</span>
                  <span className="text-[8px] bg-amber-200/40 text-amber-950 font-black px-1.5 py-0.5 rounded-full mt-1.5 block mx-auto leading-none">
                    {month.season}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Technology & Integrity */}
          <div className="bg-[#FCF8E3]/50 border border-dashed border-[#8A1A1A]/30 rounded-2xl p-4 text-center" id="about_tech_box">
            <HelpCircle className="w-8 h-8 text-[#8A1A1A] mx-auto opacity-70 mb-2" />
            <h4 className="text-xs font-black text-[#8A1A1A]">பாதுகாப்பு & நம்பகத்தன்மை</h4>
            <p className="text-[11px] text-amber-950 font-bold leading-relaxed max-w-lg mx-auto mt-1.5">
              இந்த இணையப் பயன்பாடு முழுவதுமாக உங்களது உலவியின் உள்ளூர் சேமிப்பகம் (localStorage) மற்றும் பாதுகாப்பான தரவுத்தளம் மூலம் நிர்வகிக்கப்படுகிறது. விளம்பரங்கள் அற்ற, அமைதியான, பாரம்பரிய சூழலை உங்கள் கைப்பேசிக்கு கொண்டு சேர்க்கிறது.
            </p>
            
            {/* Version and Build */}
            <div className="mt-4 pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between text-[9px] font-bold text-amber-800 gap-y-1.5">
              <span>பதிப்பு: 1.0.1 (பராபவ வருடம்)</span>
              <span>© 2026 தமிழ் பாரம்பரிய நாட்காட்டி சங்கம்</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
