/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TamilDateInfo {
  englishDate: string; // YYYY-MM-DD
  tamilYear: string;
  tamilMonth: string;
  tamilDay: number;
  dayOfWeek: string;
  thithi: string;
  nakshatram: string;
  yogam: 'Siddha' | 'Amrita' | 'Marana' | 'சித்த யோகம்' | 'அமிர்த யோகம்' | 'மரண யோகம்';
  nallaNeram: { morning: string; evening: string };
  gowriNallaNeram: { morning: string; evening: string };
  raghuKalam: string;
  yamagandam: string;
  kuligai: string;
  soolam: string;
  parigaram: string;
  isAuspicious: boolean;
  festivals: string[];
  nextNakshatram?: string;
  nextThithi?: string;
  chandrashtamam?: string;
  nakshatramTime?: string;
  thithiTime?: string;
  phaseArrow?: 'up' | 'down';
  isPradosham?: boolean;
  isMaranaYogam?: boolean;
  specialSymbols?: string;
}

export interface FestivalInfo {
  id: string;
  name: string;
  tamilName: string;
  date: string; // YYYY-MM-DD
  tamilMonth: string;
  tamilDay: number;
  type: 'hindu' | 'christian' | 'muslim' | 'national' | 'holiday';
  description: string;
}

export interface FastingDayInfo {
  id: string;
  name: string;
  tamilName: string;
  date: string; // YYYY-MM-DD
  type: 'amavasai' | 'pournami' | 'pradhosham' | 'sasti' | 'ekadasi' | 'chaturthi' | 'karthigai';
  description: string;
}

export interface PoojaItem {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tamilDescription: string;
}

export interface JathagamInput {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  gender: 'male' | 'female' | 'other';
}

export interface JathagamResult {
  input: JathagamInput;
  rasi: string;
  nakshatram: string;
  lagna: string;
  starLord: string;
  directionLord: string;
  chart: string[][]; // 4x4 Grid representation of Rasi Chart
  predictions: string[];
}
