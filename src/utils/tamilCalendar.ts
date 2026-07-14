/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TamilDateInfo, FestivalInfo, FastingDayInfo } from '../types';

// Tamil Months
export const TAMIL_MONTHS = [
  'சித்திரை', // Chithirai (Apr 14 - May 14)
  'வைகாசி',  // Vaikasi (May 15 - Jun 14)
  'ஆனி',      // Aani (Jun 15 - Jul 15)
  'ஆடி',      // Aadi (Jul 16 - Aug 15)
  'ஆவணி',    // Aavani (Aug 16 - Sep 15)
  'புரட்டாசி', // Purattasi (Sep 16 - Oct 16)
  'ஐப்பசி',    // Aippasi (Oct 17 - Nov 15)
  'கார்த்திகை', // Karthigai (Nov 16 - Dec 15)
  'மார்கழி',   // Margazhi (Dec 16 - Jan 13)
  'தை',        // Thai (Jan 14 - Feb 11)
  'மாசி',      // Maasi (Feb 12 - Mar 13)
  'பங்குனி',   // Panguni (Mar 14 - Apr 13)
];

// Tamil Days of the Week
export const TAMIL_WEEKDAYS: Record<number, string> = {
  0: 'ஞாயிறு',    // Sunday
  1: 'திங்கள்',   // Monday
  2: 'செவ்வாய்',  // Tuesday
  3: 'புதன்',     // Wednesday
  4: 'வியாழன்',   // Thursday
  5: 'வெள்ளி',    // Friday
  6: 'சனி',       // Saturday
};

// 30 Thithis
export const THITHIS = [
  'வளர்பிறை பிரதமை', // 1
  'வளர்பிறை துவிதியை', // 2
  'வளர்பிறை திருதியை', // 3
  'வளர்பிறை சதுர்த்தி', // 4
  'வளர்பிறை பஞ்சமி', // 5
  'வளர்பிறை சஷ்டி', // 6
  'வளர்பிறை சப்தமி', // 7
  'வளர்பிறை அஷ்டமி', // 8
  'வளர்பிறை நவமி', // 9
  'வளர்பிறை தசமி', // 10
  'வளர்பிறை ஏகாதசி', // 11
  'வளர்பிறை துவாதசி', // 12
  'வளர்பிறை திரயோதசி', // 13
  'வளர்பிறை சதுர்தசி', // 14
  'பௌர்ணமி (முழு நிலவு)', // 15
  'தேய்பிறை பிரதமை', // 16
  'தேய்பிறை துவிதியை', // 17
  'தேய்பிறை திருதியை', // 18
  'தேய்பிறை சதுர்த்தி', // 19
  'தேய்பிறை பஞ்சமி', // 20
  'தேய்பிறை சஷ்டி', // 21
  'தேய்பிறை சப்தமி', // 22
  'தேய்பிறை அஷ்டமி', // 23
  'தேய்பிறை நவமி', // 24
  'தேய்பிறை தசமி', // 25
  'தேய்பிறை ஏகாதசி', // 26
  'தேய்பிறை துவாதசி', // 27
  'தேய்பிறை திரயோதசி', // 28
  'தேய்பிறை சதுர்தசி', // 29
  'அமாவாசை (புது நிலவு)', // 30
];

// 27 Nakshatrams
export const NAKSHATRAMS = [
  'அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்',
  'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்',
  'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்',
  'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி',
  'உத்திரட்டாதி', 'ரேவதி'
];

// Festivals list for 2026
export const FESTIVALS_2026: Omit<FestivalInfo, 'tamilMonth' | 'tamilDay'>[] = [
  { id: 'f1', name: 'New Year', tamilName: 'ஆங்கில புத்தாண்டு', date: '2026-01-01', type: 'national', description: 'Beginning of the Gregorian calendar year' },
  { id: 'f2', name: 'Bhogi Festival', tamilName: 'போகிப் பண்டிகை', date: '2026-01-14', type: 'hindu', description: 'Discarding of old things and celebrating new beginnings' },
  { id: 'f3', name: 'Thai Pongal', tamilName: 'தைப்பொங்கல்', date: '2026-01-15', type: 'hindu', description: 'Harvest festival of Tamil Nadu dedicated to the Sun God' },
  { id: 'f4', name: 'Mattu Pongal / Thiruvalluvar Day', tamilName: 'மாட்டுப் பொங்கல் / திருவள்ளுவர் தினம்', date: '2026-01-16', type: 'hindu', description: 'Celebrating cattle and honoring the great poet Thiruvalluvar' },
  { id: 'f5', name: 'Kaanum Pongal', tamilName: 'காணும் பொங்கல்', date: '2026-01-17', type: 'hindu', description: 'Sighting of the crop and visiting relatives' },
  { id: 'f6', name: 'Republic Day', tamilName: 'குடியரசு தினம்', date: '2026-01-26', type: 'national', description: 'Honoring the date on which the Constitution of India came into effect' },
  { id: 'f7', name: 'Thaipusam', tamilName: 'தைப்பூசம்', date: '2026-02-01', type: 'hindu', description: 'Festival celebrated by Tamil Hindus on the full moon in Thai' },
  { id: 'f8', name: 'Maha Shivaratri', tamilName: 'மகா சிவராத்திரி', date: '2026-02-15', type: 'hindu', description: 'The great night of Lord Shiva' },
  { id: 'f9', name: 'Good Friday', tamilName: 'புனித வெள்ளி', date: '2026-04-03', type: 'christian', description: 'Commemorating the crucifixion of Jesus Christ' },
  { id: 'f10', name: 'Easter Sunday', tamilName: 'ஈஸ்டர் ஞாயிறு', date: '2026-04-05', type: 'christian', description: 'Resurrection of Jesus Christ' },
  { id: 'f11', name: 'Tamil New Year / Chithirai Kani', tamilName: 'தமிழ்ப் புத்தாண்டு (பராபவ வருடம்)', date: '2026-04-14', type: 'hindu', description: 'Beginning of the Tamil New Year (Parabhava Year)' },
  { id: 'f12', name: 'May Day / Labor Day', tamilName: 'உழைப்பாளர் தினம்', date: '2026-05-01', type: 'national', description: 'Celebrating the achievements of workers' },
  { id: 'f13', name: 'Bakrid / Eid al-Adha', tamilName: 'பக்ரீத்', date: '2026-05-27', type: 'muslim', description: 'Feast of the Sacrifice' },
  { id: 'f14', name: 'Muharram', tamilName: 'மொஹரம்', date: '2026-06-25', type: 'muslim', description: 'Islamic New Year month' },
  { id: 'f15', name: 'Independence Day', tamilName: 'சுதந்திர தினம்', date: '2026-08-15', type: 'national', description: 'Commemorating nation\'s independence from the United Kingdom' },
  { id: 'f16', name: 'Krishna Jayanthi', tamilName: 'கிருஷ்ண ஜெயந்தி', date: '2026-09-04', type: 'hindu', description: 'Birth of Lord Krishna' },
  { id: 'f17', name: 'Vinayagar Chaturthi', tamilName: 'விநாயகர் சதுர்த்தி', date: '2026-09-15', type: 'hindu', description: 'Festival celebrating the birth of Lord Ganesha' },
  { id: 'f18', name: 'Milad-un-Nabi', tamilName: 'மிலாதுன் நபி', date: '2026-09-24', type: 'muslim', description: 'Observance of the birthday of Islamic Prophet Muhammad' },
  { id: 'f19', name: 'Gandhi Jayanthi', tamilName: 'காந்தி ஜெயந்தி', date: '2026-10-02', type: 'national', description: 'Birthday of Mahatma Gandhi' },
  { id: 'f20', name: 'Ayutha Pooja', tamilName: 'ஆயுத பூஜை', date: '2026-10-19', type: 'hindu', description: 'Worship of tools, implements and knowledge' },
  { id: 'f21', name: 'Vijayadhasami', tamilName: 'விஜயதசமி', date: '2026-10-20', type: 'hindu', description: 'Celebrating victory of good over evil' },
  { id: 'f22', name: 'Deepavali', tamilName: 'தீபாவளி', date: '2026-11-08', type: 'hindu', description: 'The Festival of Lights' },
  { id: 'f23', name: 'Karthigai Deepam', tamilName: 'கார்த்திகை தீபம்', date: '2026-11-23', type: 'hindu', description: 'Festival of Lights celebrated on the full moon of Karthigai' },
  { id: 'f24', name: 'Christmas', tamilName: 'கிறிஸ்துமஸ்', date: '2026-12-25', type: 'christian', description: 'Celebrating the birth of Jesus Christ' },
];

// Ephemeris calculation helpers for 2026
// Epoch: 2026-01-18 is Amavasai (lunar index 30 / lunar age ~29.53059)
const LUNAR_EPOCH = new Date('2026-01-18T12:00:00Z').getTime();
const LUNAR_CYCLE = 29.53059 * 24 * 60 * 60 * 1000; // in milliseconds

// Epoch: 2026-01-01 starts with Moon in Rohini Nakshatram (index 3)
const SIDEREAL_EPOCH = new Date('2026-01-01T00:00:00Z').getTime();
const SIDEREAL_CYCLE = 27.32166 * 24 * 60 * 60 * 1000; // in milliseconds

/**
 * Calculates Thithi for a given date
 */
export function getThithiForDate(date: Date): { name: string; index: number } {
  const timeDiff = date.getTime() - LUNAR_EPOCH;
  const rawAge = ((timeDiff % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const thithiFloat = (rawAge / LUNAR_CYCLE) * 30;
  let index = Math.floor(thithiFloat) + 1;
  if (index > 30) index = 30;
  return { name: THITHIS[index - 1], index };
}

/**
 * Calculates Nakshatram for a given date
 */
export function getNakshatramForDate(date: Date): { name: string; index: number } {
  const timeDiff = date.getTime() - SIDEREAL_EPOCH;
  const rawAge = ((timeDiff % SIDEREAL_CYCLE) + SIDEREAL_CYCLE) % SIDEREAL_CYCLE;
  const starFloat = (rawAge / SIDEREAL_CYCLE) * 27;
  // Rohini is index 3 in our NAKSHATRAMS array. Offset by 3.
  let index = (Math.floor(starFloat) + 3) % 27;
  return { name: NAKSHATRAMS[index], index };
}

/**
 * Helper to get Tamil Month, Tamil Day and Tamil Year for a given English Date in 2026
 */
export function getTamilMonthAndDay(date: Date): { month: string; day: number; year: string } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Tamil year transitions on April 14 (Tamil New Year)
  // Before April 14 2026: Visvavasu (விஸ்வாவசு)
  // On & after April 14 2026: Parabhava (பராபவ)
  let tamilYear = 'பராபவ';
  if (year < 2026 || (year === 2026 && (month < 3 || (month === 3 && day < 14)))) {
    tamilYear = 'விஸ்வாவசு';
  }

  // Monthly transition boundary maps for 2026
  // Format: [EnglishMonthIndex, TransitionDay, MonthNameBeforeTransition, MonthNameAfterTransition]
  // e.g. January 1-13 is Margazhi (8), Jan 14 onwards is Thai (9)
  const transitions = [
    { engMonth: 0, day: 14, prevMonth: 'மார்கழி', nextMonth: 'தை', prevStart: new Date(year - 1, 11, 16), nextStart: new Date(year, 0, 14) },
    { engMonth: 1, day: 12, prevMonth: 'தை', nextMonth: 'மாசி', prevStart: new Date(year, 0, 14), nextStart: new Date(year, 1, 12) },
    { engMonth: 2, day: 14, prevMonth: 'மாசி', nextMonth: 'பங்குனி', prevStart: new Date(year, 1, 12), nextStart: new Date(year, 2, 14) },
    { engMonth: 3, day: 14, prevMonth: 'பங்குனி', nextMonth: 'சித்திரை', prevStart: new Date(year, 2, 14), nextStart: new Date(year, 3, 14) },
    { engMonth: 4, day: 15, prevMonth: 'சித்திரை', nextMonth: 'வைகாசி', prevStart: new Date(year, 3, 14), nextStart: new Date(year, 4, 15) },
    { engMonth: 5, day: 15, prevMonth: 'வைகாசி', nextMonth: 'ஆனி', prevStart: new Date(year, 4, 15), nextStart: new Date(year, 5, 15) },
    { engMonth: 6, day: 16, prevMonth: 'ஆனி', nextMonth: 'ஆடி', prevStart: new Date(year, 5, 15), nextStart: new Date(year, 6, 16) },
    { engMonth: 7, day: 16, prevMonth: 'ஆடி', nextMonth: 'ஆவணி', prevStart: new Date(year, 6, 16), nextStart: new Date(year, 7, 16) },
    { engMonth: 8, day: 16, prevMonth: 'ஆவணி', nextMonth: 'புரட்டாசி', prevStart: new Date(year, 7, 16), nextStart: new Date(year, 8, 16) },
    { engMonth: 9, day: 17, prevMonth: 'புரட்டாசி', nextMonth: 'ஐப்பசி', prevStart: new Date(year, 8, 16), nextStart: new Date(year, 9, 17) },
    { engMonth: 10, day: 16, prevMonth: 'ஐப்பசி', nextMonth: 'கார்த்திகை', prevStart: new Date(year, 9, 17), nextStart: new Date(year, 10, 16) },
    { engMonth: 11, day: 16, prevMonth: 'கார்த்திகை', nextMonth: 'மார்கழி', prevStart: new Date(year, 10, 16), nextStart: new Date(year, 11, 16) }
  ];

  const trans = transitions[month];
  let tMonth = '';
  let startCal: Date;

  if (day < trans.day) {
    tMonth = trans.prevMonth;
    startCal = trans.prevStart;
  } else {
    tMonth = trans.nextMonth;
    startCal = trans.nextStart;
  }

  // Calculate day number in Tamil month (difference in days + 1)
  const diffTime = date.getTime() - startCal.getTime();
  const tDay = Math.floor(diffTime / (24 * 60 * 60 * 1000)) + 1;

  return { month: tMonth, day: tDay > 0 ? tDay : 1, year: tamilYear };
}

/**
 * Retrieves astrologically complete info for any day
 */
export function getTamilCalendarInfo(dateInput: Date | string): TamilDateInfo {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const engStr = date.toISOString().split('T')[0];
  
  const weekdayIndex = date.getDay();
  const dayOfWeek = TAMIL_WEEKDAYS[weekdayIndex];

  const { month: tamilMonth, day: tamilDay, year: tamilYear } = getTamilMonthAndDay(date);
  const { name: thithi, index: thithiIdx } = getThithiForDate(date);
  const { name: nakshatram, index: nakIdx } = getNakshatramForDate(date);

  // Traditional yogam based on Day + Nakshatram index
  const yogamIdx = (weekdayIndex + nakIdx) % 3;
  const yogams: Array<'சித்த யோகம்' | 'அமிர்த யோகம்' | 'மரண யோகம்'> = ['சித்த யோகம்', 'அமிர்த யோகம்', 'மரண யோகம்'];
  const yogam = yogams[yogamIdx];

  // Nalla Neram
  const nallaNeramMap: Record<number, { morning: string; evening: string }> = {
    0: { morning: 'காலை 07:30 - 09:00', evening: 'மாலை 04:30 - 06:00' }, // Sun
    1: { morning: 'காலை 06:00 - 07:30', evening: 'மாலை 04:30 - 06:00' }, // Mon
    2: { morning: 'காலை 07:30 - 09:00', evening: 'மாலை 04:30 - 06:00' }, // Tue
    3: { morning: 'காலை 09:00 - 10:30', evening: 'மாலை 04:30 - 06:00' }, // Wed
    4: { morning: 'காலை 09:00 - 10:30', evening: 'மாலை 06:00 - 07:30' }, // Thu
    5: { morning: 'காலை 09:00 - 10:30', evening: 'மாலை 04:30 - 06:00' }, // Fri
    6: { morning: 'காலை 07:30 - 09:00', evening: 'மாலை 04:30 - 06:00' }, // Sat
  };

  // Gowri Nalla Neram
  const gowriNallaNeramMap: Record<number, { morning: string; evening: string }> = {
    0: { morning: 'காலை 10:30 - 12:00', evening: 'மாலை 01:30 - 03:00' },
    1: { morning: 'காலை 12:00 - 01:30', evening: 'மாலை 06:00 - 07:30' },
    2: { morning: 'காலை 10:30 - 12:00', evening: 'மாலை 07:30 - 09:00' },
    3: { morning: 'காலை 01:30 - 03:00', evening: 'மாலை 09:00 - 10:30' },
    4: { morning: 'காலை 12:00 - 01:30', evening: 'மாலை 07:30 - 09:00' },
    5: { morning: 'காலை 12:00 - 01:30', evening: 'மாலை 06:00 - 07:30' },
    6: { morning: 'காலை 09:00 - 10:30', evening: 'மாலை 09:00 - 10:30' },
  };

  // Raghu, Yamagandam, Kuligai
  const raghuMap: Record<number, string> = {
    0: 'மாலை 04:30 - 06:00',
    1: 'காலை 07:30 - 09:00',
    2: 'மாலை 03:00 - 04:30',
    3: 'பகல் 12:00 - 01:30',
    4: 'பகல் 01:30 - 03:00',
    5: 'காலை 10:30 - 12:00',
    6: 'காலை 09:00 - 10:30',
  };

  const yamaMap: Record<number, string> = {
    0: 'பகல் 12:00 - 01:30',
    1: 'காலை 10:30 - 12:00',
    2: 'காலை 09:00 - 10:30',
    3: 'காலை 07:30 - 09:00',
    4: 'காலை 06:00 - 07:30',
    5: 'மாலை 03:00 - 04:30',
    6: 'பகல் 01:30 - 03:00',
  };

  const kuligaiMap: Record<number, string> = {
    0: 'மாலை 03:00 - 04:30',
    1: 'பகல் 01:30 - 03:00',
    2: 'பகல் 12:00 - 01:30',
    3: 'காலை 10:30 - 12:00',
    4: 'காலை 09:00 - 10:30',
    5: 'காலை 07:30 - 09:00',
    6: 'காலை 06:00 - 07:30',
  };

  const soolamMap: Record<number, { direction: string; remedy: string }> = {
    0: { direction: 'மேற்கு', remedy: 'வெல்லம்' },
    1: { direction: 'கிழக்கு', remedy: 'தயிர்' },
    2: { direction: 'வடக்கு', remedy: 'பால்' },
    3: { direction: 'வடக்கு', remedy: 'பால்' },
    4: { direction: 'தெற்கு', remedy: 'எண்ணெய்' },
    5: { direction: 'மேற்கு', remedy: 'வெல்லம்' },
    6: { direction: 'கிழக்கு', remedy: 'தயிர்' },
  };

  // Find static festivals for this date
  const festivalsFound = FESTIVALS_2026.filter((f) => f.date === engStr).map((f) => f.tamilName);

  // Dynamic additions to festivals (e.g. if it is Amavasai, Pournami, Pradhosham, Shasti, etc.)
  if (thithiIdx === 15) festivalsFound.push('பௌர்ணமி விரதம் (Pournami)');
  if (thithiIdx === 30) festivalsFound.push('அமாவாசை விரதம் (Amavasai)');
  if (thithiIdx === 13 || thithiIdx === 28) festivalsFound.push('பிரதோஷம் (Pradhosham)');
  if (thithiIdx === 6 || thithiIdx === 21) festivalsFound.push('சஷ்டி விரதம் (Sasti)');
  if (thithiIdx === 11 || thithiIdx === 26) festivalsFound.push('ஏகாதசி விரதம் (Ekadasi)');
  if (thithiIdx === 19) festivalsFound.push('சங்கடஹர சதுர்த்தி (Sankatahara Chaturthi)');
  if (nakIdx === 2) festivalsFound.push('கார்த்திகை தீபம் / விரதம்');

  // Auspicious day logic: general rule of thumb: days with Siddha/Amrita and not Marana Yogam, and not certain unfavorable Thithis
  const isAuspicious = yogam !== 'மரண யோகம்' && ![8, 9, 23, 24].includes(thithiIdx); // Avoid Ashtami, Navami

  return {
    englishDate: engStr,
    tamilYear,
    tamilMonth,
    tamilDay,
    dayOfWeek,
    thithi,
    nakshatram,
    yogam,
    nallaNeram: nallaNeramMap[weekdayIndex],
    gowriNallaNeram: gowriNallaNeramMap[weekdayIndex],
    raghuKalam: raghuMap[weekdayIndex],
    yamagandam: yamaMap[weekdayIndex],
    kuligai: kuligaiMap[weekdayIndex],
    soolam: soolamMap[weekdayIndex].direction,
    parigaram: soolamMap[weekdayIndex].remedy,
    isAuspicious,
    festivals: festivalsFound,
  };
}

/**
 * Returns list of festivals for the entire year 2026
 */
export function getFestivalsList(): FestivalInfo[] {
  return FESTIVALS_2026.map((fest) => {
    const { month, day } = getTamilMonthAndDay(new Date(fest.date));
    return {
      ...fest,
      tamilMonth: month,
      tamilDay: day,
    };
  });
}

/**
 * Returns dynamic fasting days list for a specified month
 */
export function getFastingDaysForYear(year: number = 2026): FastingDayInfo[] {
  const fastingDays: FastingDayInfo[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  let idCounter = 1;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const tInfo = getTamilCalendarInfo(new Date(d));
    const dateStr = tInfo.englishDate;

    // Detect Amavasai (index 30)
    const thithiObj = getThithiForDate(d);
    if (thithiObj.index === 30) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Amavasai Fasting',
        tamilName: 'அமாவாசை விரதம்',
        date: dateStr,
        type: 'amavasai',
        description: 'New moon ancestral prayers and fasting',
      });
    }

    // Detect Pournami (index 15)
    if (thithiObj.index === 15) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Pournami Fasting',
        tamilName: 'பௌர்ணமி விரதம்',
        date: dateStr,
        type: 'pournami',
        description: 'Full moon sacred worship and fasting',
      });
    }

    // Detect Pradhosham (index 13 or 28)
    if (thithiObj.index === 13 || thithiObj.index === 28) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Pradhosham Fasting',
        tamilName: 'பிரதோஷ விரதம்',
        date: dateStr,
        type: 'pradhosham',
        description: 'Twilight worship of Lord Shiva to remove karma',
      });
    }

    // Detect Sasti (index 6 - Waxing)
    if (thithiObj.index === 6) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Sasti Fasting',
        tamilName: 'சஷ்டி விரதம்',
        date: dateStr,
        type: 'sasti',
        description: 'Dedicated to Lord Murugan for victory and health',
      });
    }

    // Detect Ekadasi (index 11 or 26)
    if (thithiObj.index === 11 || thithiObj.index === 26) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Ekadasi Fasting',
        tamilName: 'ஏகாதசி விரதம்',
        date: dateStr,
        type: 'ekadasi',
        description: 'Sacred fasting dedicated to Lord Vishnu',
      });
    }

    // Detect Sankatahara Chaturthi (index 19 - Waning)
    if (thithiObj.index === 19) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Sankatahara Chaturthi Fasting',
        tamilName: 'சங்கடஹர சதுர்த்தி விரதம்',
        date: dateStr,
        type: 'chaturthi',
        description: 'Obstacle-removal fasting dedicated to Lord Ganesha',
      });
    }

    // Detect Karthigai Nakshatram (index 2)
    const nakObj = getNakshatramForDate(d);
    if (nakObj.index === 2) {
      fastingDays.push({
        id: `fast-${idCounter++}`,
        name: 'Karthigai Fasting',
        tamilName: 'கார்த்திகை விரதம்',
        date: dateStr,
        type: 'karthigai',
        description: 'Star-dedicated fasting for Lord Murugan',
      });
    }
  }

  // Sort by date chronologically
  return fastingDays.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generates an interactive Computer Jathagam (Horoscope) based on birth details
 */
export function calculateJathagam(input: {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  gender: 'male' | 'female' | 'other';
}): {
  input: typeof input;
  rasi: string;
  nakshatram: string;
  lagna: string;
  starLord: string;
  directionLord: string;
  chart: string[][];
  predictions: string[];
} {
  const date = new Date(input.dob);
  const nakObj = getNakshatramForDate(date);
  const thithiObj = getThithiForDate(date);

  // Deterministic calculation based on birthday & birth time to create a personalized feel!
  const dobNum = date.getDate() + date.getMonth() + date.getFullYear();
  const timeHours = parseInt(input.tob.split(':')[0]) || 12;

  // Rasis
  const RASIS = [
    'மேஷம் (Aries)', 'ரிஷபம் (Taurus)', 'மிதுனம் (Gemini)', 'கடகம் (Cancer)',
    'சிம்மம் (Leo)', 'கன்னி (Virgo)', 'துலாம் (Libra)', 'விருச்சிகம் (Scorpio)',
    'தனுசு (Sagittarius)', 'மகரம் (Capricorn)', 'கும்பம் (Aquarius)', 'மீனம் (Pisces)'
  ];

  const Lagnas = [
    'மேஷ லக்னம்', 'ரிஷப லக்னம்', 'மிதுன லக்னம்', 'கடக லக்னம்',
    'சிம்ம லக்னம்', 'கன்னி லக்னம்', 'துலா லக்னம்', 'விருச்சிக லக்னம்',
    'தனுசு லக்னம்', 'மகர லக்னம்', 'கும்ப லக்னம்', 'மீன லக்னம்'
  ];

  const STAR_LORDS = ['சூரியன் (Sun)', 'சந்திரன் (Moon)', 'செவ்வாய் (Mars)', 'ராகு (Rahu)', 'குரு (Jupiter)', 'சனி (Saturn)', 'புதன் (Mercury)', 'கேது (Ketu)', 'சுக்கிரன் (Venus)'];

  const rasiIndex = (nakObj.index + Math.floor(timeHours / 6)) % 12;
  const lagnaIndex = (Math.floor(timeHours / 2) + dobNum) % 12;
  const starLordIndex = nakObj.index % 9;
  const directionLordIndex = (nakObj.index + 4) % 9;

  const rasi = RASIS[rasiIndex];
  const lagna = Lagnas[lagnaIndex];
  const starLord = STAR_LORDS[starLordIndex];
  const directionLord = STAR_LORDS[directionLordIndex];

  // Fill standard south indian style rasi chart (4x4 Grid with center empty)
  // Standard positions in south indian chart:
  // [0,0]=Meenam, [0,1]=Mesham, [0,2]=Rishabam, [0,3]=Midhunam
  // [1,0]=Kumbam, [1,1]="", [1,2]="", [1,3]=Kadhagam
  // [2,0]=Magaram, [2,1]="", [2,2]="", [2,3]=Simmam
  // [3,0]=Dhanusu, [3,1]=Viruchigam, [3,2]=Thulaam, [3,3]=Kanni
  const chart = [
    ['மீனம்\n(சுக்)', 'மேஷம்\n(செவ்)', 'ரிஷபம்\n(சந்)', 'மிதுனம்\n(புத)'],
    ['கும்பம்\n(சனி)', 'லக்னம்\nராசி', 'ஓம்\nஆஸ்ட்ரோ', 'கடகம்\n(சந்)'],
    ['மகரம்\n(சனி)', 'ஜாதகம்\nகணிதம்', '2026\nவருடம்', 'சிம்மம்\n(சூரி)'],
    ['தனுசு\n(குரு)', 'விருச்சிகம்\n(கேது)', 'துலாம்\n(சுக்கிரன்)', 'கன்னி\n(ராகு)']
  ];

  // Update chart positions based on Lagna and Moon (Rasi) positions
  // Let's place "லக்னம்" (Lagna/Ascendant) and "சந்திரன்" (Moon/Rasi) in their computed houses
  const coordMap = [
    [0, 1], // Mesham
    [0, 2], // Rishabam
    [0, 3], // Midhunam
    [1, 3], // Kadhagam
    [2, 3], // Simmam
    [3, 3], // Kanni
    [3, 2], // Thulaam
    [3, 1], // Viruchigam
    [3, 0], // Dhanusu
    [2, 0], // Magaram
    [1, 0], // Kumbam
    [0, 0]  // Meenam
  ];

  const lagnaCoord = coordMap[lagnaIndex];
  const rasiCoord = coordMap[rasiIndex];

  // Append L or C to the existing box
  chart[lagnaCoord[0]][lagnaCoord[1]] += ' \n[லக்னம்]';
  chart[rasiCoord[0]][rasiCoord[1]] += ' \n[சந்திரன்]';

  // Customize predictions based on Rasi and Birthdetails
  const rasiNameOnly = rasi.split(' ')[0];
  const predictions = [
    `உங்களின் ஜென்ம ராசி ${rasiNameOnly} மற்றும் லக்னம் ${lagna} ஆகும்.`,
    `ஜென்ம நட்சத்திரம்: ${nakObj.name} (நட்சத்திர அதிபதி: ${starLord}).`,
    `தற்போது உங்களுக்கு சாதகமான திசை அதிபதியாக ${directionLord} விளங்குகிறார். இதனால் தொட்ட காரியங்கள் துலங்கும், பொருளாதார முன்னேற்றம் உண்டாகும்.`,
    `குடும்ப உறவுகளில் மகிழ்ச்சியும், புதிய சொத்துக்கள் மற்றும் வாகனங்கள் வாங்குவதற்கான அதிர்ஷ்ட வாய்ப்புகளும் இந்த 2026 பராபவ வருடத்தில் கைகூடும்.`,
    `உத்தியோகத்தில் சக ஊழியர்களின் முழு ஆதரவும், மேலதிகாரிகளின் பாராட்டுகளும் பெற்று பதவி உயர்வு அடைய வழிவகுக்கும்.`,
    `ஆரோக்கியத்தில் கவனம் தேவை; சீரான உணவுப் பழக்கம் மற்றும் உடற்பயிற்சிகளை மேற்கொள்வது நல்லது. குலதெய்வ வழிபாடு மற்றும் சனிக்கிழமைகளில் எள்தீபம் ஏற்றுவது வாழ்வில் மேலும் மேன்மை தரும்.`
  ];

  return {
    input,
    rasi,
    nakshatram: nakObj.name,
    lagna,
    starLord,
    directionLord,
    chart,
    predictions,
  };
}

// 12 Rasi Daily predictions
export const DAILY_RASI_PALAN: Record<string, { rasi: string; status: 'Excellent' | 'Good' | 'Average'; prediction: string; rating: number }> = {
  'மேஷம் (Aries)': {
    rasi: 'மேஷம்',
    status: 'Excellent',
    rating: 5,
    prediction: 'இன்று தொட்ட காரியங்கள் அனைத்தும் துலங்கும். பொருளாதார ரீதியாக மிகவும் சிறப்பான நாள். புதிய நண்பர்கள் அறிமுகமாவார்கள்.'
  },
  'ரிஷபம் (Taurus)': {
    rasi: 'ரிஷபம்',
    status: 'Good',
    rating: 4,
    prediction: 'பணிச்சுமை குறையும். குடும்பத்தில் மகிழ்ச்சியான சூழல் நிலவும். புதிய முதலீடுகளுக்கு ஏற்ற நாள்.'
  },
  'மிதுனம் (Gemini)': {
    rasi: 'மிதுனம்',
    status: 'Good',
    rating: 4,
    prediction: 'உங்களின் நீண்ட நாள் கனவு நனவாகும். வியாபாரத்தில் நல்ல லாபம் கிடைக்கும். நண்பர்களின் உதவி கிட்டும்.'
  },
  'கடகம் (Cancer)': {
    rasi: 'கடகம்',
    status: 'Average',
    rating: 3,
    prediction: 'வார்த்தைகளில் நிதானம் தேவை. தேவையற்ற அலைச்சல்களை தவிர்க்கவும். மாலைக்குள் நல்ல செய்தி வந்து சேரும்.'
  },
  'சிம்மம் (Leo)': {
    rasi: 'சிம்மம்',
    status: 'Excellent',
    rating: 5,
    prediction: 'தொழிலில் அபரிமிதமான வளர்ச்சி காண்பீர்கள். குடும்ப உறவுகள் பலப்படும். ஆன்மீக காரியங்களில் ஈடுபாடு கூடும்.'
  },
  'கன்னி (Virgo)': {
    rasi: 'கன்னி',
    status: 'Good',
    rating: 4,
    prediction: 'மாணவர்கள் கல்வியில் சாதனை படைப்பார்கள். உத்தியோகத்தில் பாராட்டுக்கள் குவியும். ஆரோக்கியம் மேம்படும்.'
  },
  'துலாம் (Libra)': {
    rasi: 'துலாம்',
    status: 'Good',
    rating: 4,
    prediction: 'புதிய முயற்சிகள் நல்ல வெற்றியைத் தரும். பூர்வீக சொத்துக்கள் மூலம் தனலாபம் கிடைக்கும். மகிழ்ச்சியான நாள்.'
  },
  'விருச்சிகம் (Scorpio)': {
    rasi: 'விருச்சிகம்',
    status: 'Average',
    rating: 3,
    prediction: 'முக்கிய முடிவுகளை தள்ளிப்போடவும். கடன் கொடுப்பதை தவிர்க்கவும். குலதெய்வ வழிபாடு மன அமைதி தரும்.'
  },
  'தனுசு (Sagittarius)': {
    rasi: 'தனுசு',
    status: 'Good',
    rating: 4,
    prediction: 'உங்களின் தன்னம்பிக்கை அதிகரிக்கும். குடும்பத்தில் சுப காரியங்கள் கைகூடும். புதிய வாகனம் வாங்கும் யோகம் உண்டு.'
  },
  'மகரம் (Capricorn)': {
    rasi: 'மகரம்',
    status: 'Excellent',
    rating: 5,
    prediction: 'பொருளாதார வளம் சிறக்கும். வழக்கு விவகாரங்களில் சாதகமான தீர்ப்பு வரும். உத்தியோக உயர்வு நிச்சயம்.'
  },
  'கும்பம் (Aquarius)': {
    rasi: 'கும்பம்',
    status: 'Good',
    rating: 4,
    prediction: 'தடைபட்ட காரியங்கள் அனைத்தும் சுமுகமாக முடியும். கணவன்-மனைவி இடையே அன்யோன்யம் கூடும். பயணம் இனிதாகும்.'
  },
  'மீனம் (Pisces)': {
    rasi: 'மீனம்',
    status: 'Average',
    rating: 3,
    prediction: 'உணவு விஷயத்தில் கவனம் தேவை. பிறருடன் வீண் விவாதங்களை தவிர்க்கவும். பொறுமை காப்பது நன்மையளிக்கும்.'
  }
};
