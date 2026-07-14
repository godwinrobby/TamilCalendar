/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Lock, 
  Database, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Terminal, 
  Check, 
  AlertCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  getImportedRecordsMap, 
  saveImportedRecordsMap, 
  getCurrentISTDateString 
} from '../utils/tamilCalendar';

interface AdminViewProps {
  onClose: () => void;
}

// Custom parser to support CSV parsing with commas inside quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentValue.trim());
      if (row.length > 0 && row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

// Normalizes various date inputs like MM/DD/YYYY or YYYY-MM-DD
function normalizeDate(rawDateStr: string): string {
  const cleaned = rawDateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }
  
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      let month = parts[0].padStart(2, '0');
      let day = parts[1].padStart(2, '0');
      let year = parts[2];
      if (year.length === 2) {
        year = '20' + year;
      }
      return `${year}-${month}-${day}`;
    }
  }
  
  try {
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // skip
  }
  
  return cleaned;
}

export default function AdminView({ onClose }: AdminViewProps) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'import' | 'viewer' | 'sql'>('import');
  
  // CSV Import States
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // Data State
  const [records, setRecords] = useState<Record<string, any>>(getImportedRecordsMap());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Raw SQL Query State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM tamil_calendar WHERE date = \'2026-07-14\'');
  const [sqlResult, setSqlResult] = useState<{ headers: string[]; rows: any[]; error?: string; count: number; time: string } | null>(null);

  // Default correct headers defined by the user
  const REQUIRED_HEADERS = [
    'English Date and (m/d/y)', 'English Day', 'date (eng)', 'கிழமை (ஆ )', 'மாதம் (ஆ )',
    'தமிழ் தேதி', 'தமிழ் மாதம்', 'தமிழ் ஆண்டின் பெயர்', 'what\' special today', 'Special symbols',
    'நட்சத்திரம்', 'திதி', 'யோகம்', 'சந்திராஷ்டமம்', 'காலை', 'மாலை', 'காலை', 'மாலை',
    'ராகுகாலம்', 'எமகண்டம்', 'குளிகை', 'சூலம்', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
    'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('தவறான கடவுச்சொல்! (Invalid Password. Use "admin")');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processCSVText = (csvText: string) => {
    try {
      const lines = parseCSV(csvText);
      if (lines.length < 2) {
        setImportStatus({ success: false, message: 'கோப்பில் போதுமான தரவுகள் இல்லை. (File is empty or contains no records.)' });
        return;
      }

      const fileHeaders = lines[0];
      
      // Let's print headers or do a simple check to verify length or key headers
      const dateHeaderPresent = fileHeaders.some(h => h.toLowerCase().includes('date') || h.includes('தேதி'));
      if (!dateHeaderPresent) {
        setImportStatus({ success: false, message: 'ஆங்கிலத் தேதி நெடுவரிசை இல்லை! (Required Date column not found.)' });
        return;
      }

      const parsedRecordsMap = { ...getImportedRecordsMap() };
      let importCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row.length === 0 || !row[0]) continue;

        const dateKey = normalizeDate(row[0]);
        if (!dateKey) continue;

        const record = {
          englishDate: dateKey,
          englishDay: row[1] || '',
          dateEng: row[2] || '',
          dayOfWeekTamil: row[3] || '',
          monthTamilLetter: row[4] || '',
          tamilDay: row[5] || '',
          tamilMonth: row[6] || '',
          tamilYear: row[7] || '',
          specialToday: row[8] || '',
          specialSymbols: row[9] || '',
          nakshatram: row[10] || '',
          thithi: row[11] || '',
          yogam: row[12] || '',
          chandrashtamam: row[13] || '',
          nallaNeramMorning: row[14] || '',
          nallaNeramEvening: row[15] || '',
          gowriMorning: row[16] || '',
          gowriEvening: row[17] || '',
          raghuKalam: row[18] || '',
          yamagandam: row[19] || '',
          kuligai: row[20] || '',
          soolam: row[21] || '',
          மேஷம்: row[22] || '',
          ரிஷபம்: row[23] || '',
          மிதுனம்: row[24] || '',
          கடகம்: row[25] || '',
          சிம்மம்: row[26] || '',
          கன்னி: row[27] || '',
          துலாம்: row[28] || '',
          விருச்சிகம்: row[29] || '',
          தனுசு: row[30] || '',
          மகரம்: row[31] || '',
          கும்பம்: row[32] || '',
          மீனம்: row[33] || '',
        };

        parsedRecordsMap[dateKey] = record;
        importCount++;
      }

      saveImportedRecordsMap(parsedRecordsMap);
      setRecords(parsedRecordsMap);
      setImportStatus({ 
        success: true, 
        message: `${importCount} நாட்கள் வெற்றிகரமாக MySQL அட்டவணையில் பதிவேற்றப்பட்டு புதுப்பிக்கப்பட்டது! (${importCount} rows successfully updated in MySQL table!)` 
      });
    } catch (err: any) {
      setImportStatus({ success: false, message: `பிழை ஏற்பட்டது: ${err.message}` });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processCSVText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processCSVText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    // Generate a CSV download with correct headers
    const row1 = [
      '2026-07-14', 'Tuesday', '14', 'செவ்வாய்', 'ஜூலை', '30', 'ஆனி', 'பராபவ',
      'அமாவாசை விரதம், மங்களகரமான நாள்', '🕉', 'புனர்பூசம்', 'அமாவாசை', 'சித்த யோகம்', 'கேட்டை',
      'காலை 07:30 - 09:00', 'மாலை 04:30 - 06:00', 'காலை 10:30 - 12:00', 'மாலை 01:30 - 03:00',
      'மாலை 03:00 - 04:30', 'காலை 09:00 - 10:30', 'பகல் 12:00 - 01:30', 'வடக்கு (வெல்லம்)',
      'இன்று தொட்ட காரியங்கள் துலங்கும்.', 'பணிச்சுமை குறையும்.', 'দীর্ঘநாள் கனவு நனவாகும்.', 'வார்த்தைகளில் நிதானம் தேவை.',
      'தொழிலில் அபரிமிதமான வளர்ச்சி.', 'கல்வியில் சாதனை படைப்பீர்கள்.', 'புதிய முயற்சிகள் வெற்றி தரும்.', 'முக்கிய முடிவுகளை தள்ளிப்போடவும்.',
      'தன்னம்பிக்கை அதிகரிக்கும்.', 'பொருளாதார வளம் சிறக்கும்.', 'தடைகள் அனைத்தும் விலகும்.', 'ஆரோக்கியத்தில் கவனம் தேவை.'
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + REQUIRED_HEADERS.map(h => `"${h}"`).join(',') + '\n'
      + row1.map(val => `"${val.replace(/"/g, '""')}"`).join(',');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tamil_calendar_mysql_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteRecord = (dateKey: string) => {
    const updated = { ...records };
    delete updated[dateKey];
    saveImportedRecordsMap(updated);
    setRecords(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('அனைத்து தரவுகளையும் அழிக்க வேண்டுமா? (Are you sure you want to delete all overridden records?)')) {
      saveImportedRecordsMap({});
      setRecords({});
    }
  };

  // Run mock query simulator
  const runSQLQuery = () => {
    const startTime = performance.now();
    const query = sqlQuery.trim().replace(/;$/, '');
    const recordsList = Object.values(records) as any[];
    const queryLower = query.toLowerCase();
    
    try {
      if (
        queryLower === 'describe tamil_calendar' || 
        queryLower === 'desc tamil_calendar' || 
        queryLower === 'show columns from tamil_calendar' ||
        queryLower === 'describe table tamil_calendar'
      ) {
        const columns = [
          { Field: 'englishDate', Type: 'DATE', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'Primary Key' },
          { Field: 'englishDay', Type: 'VARCHAR(15)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'dateEng', Type: 'INT', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'dayOfWeekTamil', Type: 'VARCHAR(20)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'monthTamilLetter', Type: 'VARCHAR(20)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'tamilDay', Type: 'INT', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'tamilMonth', Type: 'VARCHAR(20)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'tamilYear', Type: 'VARCHAR(30)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'specialToday', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'specialSymbols', Type: 'VARCHAR(20)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'nakshatram', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'thithi', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'yogam', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'chandrashtamam', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'nallaNeramMorning', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'nallaNeramEvening', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'gowriMorning', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'gowriEvening', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'raghuKalam', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'yamagandam', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'kuligai', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'soolam', Type: 'VARCHAR(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
          { Field: 'மேஷம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'ரிஷபம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'மிதுனம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'கடகம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'சிம்மம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'கன்னி', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'துலாம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'விருச்சிகம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'தனுசு', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'மகரம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'கும்பம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' },
          { Field: 'மீனம்', Type: 'TEXT', Null: 'YES', Key: '', Default: 'NULL', Extra: 'Zodiac Prediction' }
        ];

        const endTime = performance.now();
        setSqlResult({
          headers: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
          rows: columns,
          count: columns.length,
          time: (endTime - startTime).toFixed(2)
        });
        return;
      }

      if (queryLower === 'show create table tamil_calendar') {
        const createTableSql = `CREATE TABLE tamil_calendar (
  englishDate DATE PRIMARY KEY COMMENT 'format: YYYY-MM-DD',
  englishDay VARCHAR(15),
  dateEng INT,
  dayOfWeekTamil VARCHAR(20),
  monthTamilLetter VARCHAR(20),
  tamilDay INT,
  tamilMonth VARCHAR(20),
  tamilYear VARCHAR(30),
  specialToday TEXT,
  specialSymbols VARCHAR(20),
  nakshatram VARCHAR(50),
  thithi VARCHAR(50),
  yogam VARCHAR(50),
  chandrashtamam VARCHAR(50),
  nallaNeramMorning VARCHAR(50),
  nallaNeramEvening VARCHAR(50),
  gowriMorning VARCHAR(50),
  gowriEvening VARCHAR(50),
  raghuKalam VARCHAR(50),
  yamagandam VARCHAR(50),
  kuligai VARCHAR(50),
  soolam VARCHAR(50),
  மேஷம் TEXT,
  ரிஷபம் TEXT,
  மிதுனம் TEXT,
  கடகம் TEXT,
  சிம்மம் TEXT,
  கன்னி TEXT,
  துலாம் TEXT,
  விருச்சிகம் TEXT,
  தனுசு TEXT,
  மகரம் TEXT,
  கும்பம் TEXT,
  மீனம் TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        const endTime = performance.now();
        setSqlResult({
          headers: ['Table', 'Create Table'],
          rows: [{ 'Table': 'tamil_calendar', 'Create Table': createTableSql }],
          count: 1,
          time: (endTime - startTime).toFixed(2)
        });
        return;
      }

      if (!queryLower.startsWith('select')) {
        throw new Error('This simulated console supports read statements: SELECT, DESCRIBE tamil_calendar, or SHOW CREATE TABLE tamil_calendar.');
      }

      // Basic SELECT parser
      // SELECT * FROM tamil_calendar
      // SELECT * FROM tamil_calendar WHERE date = '2026-07-14'
      const selectMatches = query.match(/select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+))?/i);
      if (!selectMatches) {
        throw new Error('Syntax Error: Could not parse SQL statement. Use format like: SELECT * FROM tamil_calendar WHERE date = \'2026-07-14\'');
      }

      const fields = selectMatches[1].trim();
      const table = selectMatches[2].trim().toLowerCase();
      const whereClause = selectMatches[3] ? selectMatches[3].trim() : '';

      if (table !== 'tamil_calendar') {
        throw new Error(`Table not found: "${table}" does not exist in MySQL database.`);
      }

      let filteredRows = [...recordsList];

      if (whereClause) {
        // e.g., date = '2026-07-14' or tamilMonth = 'ஆனி'
        const filterMatch = whereClause.match(/(\w+)\s*=\s*'(.+?)'/i);
        if (filterMatch) {
          const colName = filterMatch[1].trim();
          const colValue = filterMatch[2].trim();
          
          filteredRows = filteredRows.filter(row => {
            if (colName.toLowerCase() === 'date' || colName.toLowerCase() === 'englishdate') {
              return row.englishDate === colValue;
            }
            if (colName.toLowerCase() === 'tamilmonth') {
              return row.tamilMonth === colValue;
            }
            if (colName.toLowerCase() === 'tamilday') {
              return String(row.tamilDay) === colValue;
            }
            return String(row[colName]) === colValue;
          });
        } else {
          throw new Error('This mock parser supports basic filter syntax: column = \'value\'');
        }
      }

      const headersToDisplay = fields === '*' 
        ? ['englishDate', 'tamilMonth', 'tamilDay', 'thithi', 'nakshatram', 'yogam', 'specialToday'] 
        : fields.split(',').map(f => f.trim());

      const endTime = performance.now();
      const elapsedTime = (endTime - startTime).toFixed(2);

      setSqlResult({
        headers: headersToDisplay,
        rows: filteredRows,
        count: filteredRows.length,
        time: elapsedTime
      });

    } catch (err: any) {
      setSqlResult({
        headers: [],
        rows: [],
        error: err.message,
        count: 0,
        time: '0.00'
      });
    }
  };

  const filteredRecordsList = useMemo(() => {
    const list = Object.values(records) as any[];
    if (!searchTerm) return list;
    return list.filter(r => 
      r.englishDate.includes(searchTerm) || 
      r.tamilMonth.includes(searchTerm) || 
      r.specialToday.includes(searchTerm)
    );
  }, [records, searchTerm]);

  return (
    <div className="h-full flex flex-col bg-[#FFFDF0] text-[#5C1A1A] font-sans" id="admin_module_container">
      {/* Header Bar */}
      <header className="h-14 bg-[#8A1A1A] flex items-center px-4 shrink-0 shadow-md border-b-4 border-[#D97706] text-white">
        <button 
          onClick={onClose}
          className="mr-3 w-8 h-8 flex items-center justify-center bg-[#FFFDF0] text-[#8A1A1A] rounded-full hover:bg-amber-100 transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-sm font-black tracking-wide flex items-center space-x-1">
            <Database className="w-4 h-4 text-amber-300" />
            <span>நிர்வாகி மேலாண்மை (Admin Panel)</span>
          </h1>
          <p className="text-[9px] text-amber-200">MySQL Database Overrides & CSV Importer</p>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-grow overflow-y-auto pb-10" id="admin_scroll_body">
        {!isLoggedIn ? (
          // LOGIN FORM
          <div className="max-w-md mx-auto p-5 mt-12" id="admin_login_box">
            <div className="bg-white border-2 border-[#8A1A1A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-[#8A1A1A] mx-auto animate-bounce mb-2" />
                <h2 className="text-[#8A1A1A] font-black text-base">பாதுகாக்கப்பட்ட பகுதி (Secure Access)</h2>
                <p className="text-xs text-amber-800 mt-1">தமிழ் நாட்காட்டி தரவுத்தளத்தை மேலாண்மை செய்ய லாகின் செய்யவும்.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">கடவுச்சொல் (Password):</label>
                  <input 
                    type="password" 
                    placeholder="கடவுச்சொல்லை உள்ளிடவும்..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FFFDF0] border-2 border-amber-200 rounded-xl px-3 py-2 text-sm outline-none font-bold text-[#8A1A1A] focus:border-[#8A1A1A] transition"
                  />
                  <span className="text-[10px] text-amber-700/80 block mt-1">குறிப்பு: லாகின் செய்ய <b>admin</b> என டைப் செய்யவும்.</span>
                </div>

                {loginError && (
                  <div className="bg-rose-50 text-rose-800 border border-rose-200 text-xs p-2.5 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="font-semibold">{loginError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#8A1A1A] hover:bg-[#9E2323] text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 shadow-md flex items-center justify-center space-x-1"
                >
                  <Lock className="w-4 h-4" />
                  <span>நுழையவும் (Login)</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          // ADMIN DASHBOARD CONTENT
          <div className="max-w-4xl mx-auto px-4 mt-4 space-y-4" id="admin_dashboard">
            
            {/* Database Summary Widget */}
            <div className="bg-amber-100 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#8A1A1A]/10 rounded-xl border border-amber-300 flex items-center justify-center text-[#8A1A1A] font-black">
                  💾
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#8A1A1A]">simulated_mysql_db_2026</h3>
                  <p className="text-xs text-amber-900 font-semibold">
                    MySQL அட்டவணை: <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-amber-950">tamil_calendar</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-center">
                  <span className="block font-black text-[#8A1A1A]">{Object.keys(records).length}</span>
                  <span className="text-[9px] text-amber-800">திருத்தப்பட்ட நாட்கள் (Overrides)</span>
                </div>
                <button 
                  onClick={handleClearAll}
                  disabled={Object.keys(records).length === 0}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 px-3 py-2 rounded-xl transition cursor-pointer disabled:opacity-50 text-[10px] font-bold"
                >
                  தரவுகளை அழி (Clear DB)
                </button>
              </div>
            </div>

            {/* View Tab Selector */}
            <div className="flex bg-amber-100/50 p-1 rounded-xl border border-amber-200 max-w-sm">
              <button 
                onClick={() => setActiveTab('import')}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg cursor-pointer transition ${activeTab === 'import' ? 'bg-[#8A1A1A] text-white shadow' : 'text-[#8A1A1A] hover:bg-amber-100'}`}
              >
                CSV இறக்குமதி
              </button>
              <button 
                onClick={() => setActiveTab('viewer')}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg cursor-pointer transition ${activeTab === 'viewer' ? 'bg-[#8A1A1A] text-white shadow' : 'text-[#8A1A1A] hover:bg-amber-100'}`}
              >
                தரவு பட்டியல்
              </button>
              <button 
                onClick={() => setActiveTab('sql')}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg cursor-pointer transition ${activeTab === 'sql' ? 'bg-[#8A1A1A] text-white shadow' : 'text-[#8A1A1A] hover:bg-amber-100'}`}
              >
                SQL வினவல்
              </button>
            </div>

            {/* TAB CONTENT: IMPORT */}
            {activeTab === 'import' && (
              <div className="space-y-4" id="import_tab_content">
                <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#8A1A1A] flex items-center space-x-1">
                        <FileSpreadsheet className="w-4 h-4 text-[#8A1A1A]" />
                        <span>CSV கோப்பு பதிவேற்றம் (Upload CSV File)</span>
                      </h3>
                      <p className="text-xs text-amber-800">பஞ்சாங்கம் & ராசிபலன் தரவுகளைக் கொண்ட கோப்பினை பதிவேற்றி தரவுத்தளத்தை புதுப்பிக்கவும்.</p>
                    </div>

                    <button 
                      onClick={handleDownloadSample}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>மாதிரி CSV (Template)</span>
                    </button>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer min-h-[150px] ${dragActive ? 'bg-amber-100 border-[#8A1A1A]' : 'bg-[#FFFDF0] border-amber-300 hover:border-amber-500'}`}
                    onClick={() => document.getElementById('csv-file-input')?.click()}
                  >
                    <Upload className="w-8 h-8 text-amber-600 mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-[#8A1A1A]">கோப்பை இங்கு இழுத்து விடவும் அல்லது கிளிக் செய்யவும்</span>
                    <span className="text-[10px] text-amber-700 mt-1">ஆதரிக்கப்படும் வடிவம்: .csv</span>
                    <input 
                      type="file" 
                      id="csv-file-input" 
                      accept=".csv"
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>

                  {importStatus && (
                    <div className={`p-3 rounded-xl border flex items-start space-x-2 text-xs ${importStatus.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                      {importStatus.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      <span className="font-semibold leading-normal">{importStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* CSV Format Schema Guide */}
                <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-extrabold text-[#8A1A1A] flex items-center space-x-1">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>தரவு வடிவமைப்பு வழிகாட்டி (Expected CSV Columns)</span>
                  </h4>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    அட்டவணைப் புதுப்பித்தல் சரியாக இயங்க உங்கள் CSV கோப்பின் முதல் வரியில் கீழ்க்கண்ட நெடுவரிசைகள் வரிசை மாறாமல் இருக்க வேண்டும்:
                  </p>
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-mono text-[9px] text-amber-950 overflow-x-auto whitespace-nowrap scrollbar-thin">
                    English Date and (m/d/y), English Day, date (eng), கிழமை (ஆ ), மாதம் (ஆ ), தமிழ் தேதி, தமிழ் மாதம், தமிழ் ஆண்டின் பெயர், what' special today, Special symbols, நட்சத்திரம், திதி, யோகம், சந்திராஷ்டமம், காலை, மாலை, காலை, மாலை, ராகுகாலம், எமகண்டம், குளிகை, சூலம், மேஷம், ரிஷபம், மிதுனம், கடகம், சிம்மம், கன்னி, துலாம், விருச்சிகம், தனுசு, மகரம், கும்பம், மீனம்
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: VIEWER */}
            {activeTab === 'viewer' && (
              <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-3" id="viewer_tab_content">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-[#8A1A1A]">MySQL அட்டவணை பதிவுகள் (Simulated MySQL Table Rows)</h3>
                  
                  {/* Search bar */}
                  <div className="relative max-w-xs w-full flex items-center bg-[#FFFDF0] border border-amber-200 rounded-xl px-2.5 py-1.5">
                    <Search className="w-4 h-4 text-amber-800 mr-1.5 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="தேதி அல்லது மாதத்தை தேடவும்..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-xs text-[#8A1A1A] placeholder-amber-800/40 font-bold"
                    />
                  </div>
                </div>

                {filteredRecordsList.length === 0 ? (
                  <div className="text-center py-10 bg-amber-50/50 rounded-xl border border-dashed border-amber-200">
                    <FileSpreadsheet className="w-8 h-8 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xs text-amber-800 font-semibold">பதிவுகள் எதுவும் இல்லை! (No overridden records found.)</p>
                    <p className="text-[10px] text-amber-700 mt-1">CSV கோப்பை இறக்குமதி செய்வதன் மூலம் தரவுகளை இங்கே சேர்க்கலாம்.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-amber-200 rounded-xl scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-amber-100/80 border-b border-amber-200 font-extrabold text-[#8A1A1A]">
                          <th className="p-2 border-r border-amber-200">ஆங்கில தேதி (Date)</th>
                          <th className="p-2 border-r border-amber-200">தமிழ் மாதம்</th>
                          <th className="p-2 border-r border-amber-200">தேதி</th>
                          <th className="p-2 border-r border-amber-200">திதி</th>
                          <th className="p-2 border-r border-amber-200">நட்சத்திரம்</th>
                          <th className="p-2 border-r border-amber-200">சிறப்பு தினங்கள்</th>
                          <th className="p-2 text-center">செயல்</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecordsList.map((row) => (
                          <tr key={row.englishDate} className="border-b border-amber-100 hover:bg-amber-50/50 font-medium text-amber-950">
                            <td className="p-2 border-r border-amber-100 font-mono font-bold text-[#8A1A1A]">{row.englishDate}</td>
                            <td className="p-2 border-r border-amber-100 font-bold">{row.tamilMonth}</td>
                            <td className="p-2 border-r border-amber-100 font-mono font-bold">{row.tamilDay}</td>
                            <td className="p-2 border-r border-amber-100 font-bold">{row.thithi}</td>
                            <td className="p-2 border-r border-amber-100 font-bold">{row.nakshatram}</td>
                            <td className="p-2 border-r border-amber-100 truncate max-w-[150px]" title={row.specialToday}>{row.specialToday || '-'}</td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => handleDeleteRecord(row.englishDate)}
                                className="p-1 hover:bg-rose-100 rounded text-rose-700 transition cursor-pointer"
                                title="நீக்கு"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: RAW SQL CONSOLE */}
            {activeTab === 'sql' && (
              <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-4" id="sql_tab_content">
                <div>
                  <h3 className="text-sm font-black text-[#8A1A1A] flex items-center space-x-1">
                    <Terminal className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Raw SQL Query Console (சிமுலேட்டர்)</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    MySQL தரவுத்தளத்தில் நேரடியாக வினவல்களை இயக்கவும். (Practice SQL SELECT commands on the simulated table).
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-900 rounded-xl p-3 shadow-inner relative font-mono">
                    <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Connection</span>
                    <div className="flex items-center text-emerald-400 text-[10px] space-x-1.5 mb-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>mysql_agent@localhost:3306/tamil_calendar</span>
                    </div>
                    <textarea 
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-white font-mono text-xs md:text-sm resize-none h-16 pt-1 leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        onClick={() => setSqlQuery('SELECT * FROM tamil_calendar')}
                        className="bg-amber-100 hover:bg-amber-200 text-[#8A1A1A] border border-amber-200 rounded-lg px-2 py-1 text-[9px] font-extrabold transition cursor-pointer"
                      >
                        SELECT ALL
                      </button>
                      <button 
                        onClick={() => setSqlQuery(`SELECT * FROM tamil_calendar WHERE date = '${getCurrentISTDateString()}'`)}
                        className="bg-amber-100 hover:bg-amber-200 text-[#8A1A1A] border border-amber-200 rounded-lg px-2 py-1 text-[9px] font-extrabold transition cursor-pointer"
                      >
                        SELECT TODAY
                      </button>
                      <button 
                        onClick={() => { setSqlQuery('DESCRIBE tamil_calendar'); setTimeout(runSQLQuery, 100); }}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-200 rounded-lg px-2 py-1 text-[9px] font-extrabold transition cursor-pointer"
                      >
                        DESCRIBE TABLE
                      </button>
                      <button 
                        onClick={() => { setSqlQuery('SHOW CREATE TABLE tamil_calendar'); setTimeout(runSQLQuery, 100); }}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 rounded-lg px-2 py-1 text-[9px] font-extrabold transition cursor-pointer"
                      >
                        SHOW CREATE TABLE
                      </button>
                    </div>

                    <button 
                      onClick={runSQLQuery}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1 shadow shrink-0"
                    >
                      <span>வினவலை இயக்கு (EXECUTE)</span>
                    </button>
                  </div>
                </div>

                {sqlResult && (
                  <div className="border-t border-amber-100 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>வினவல் முடிவு (Query Result)</span>
                      <span className="font-mono text-emerald-600">
                        {sqlResult.error ? 'ERROR' : `${sqlResult.count} rows returned in ${sqlResult.time} ms`}
                      </span>
                    </div>

                    {sqlResult.error ? (
                      <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-3 text-xs font-mono font-bold flex items-start space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{sqlResult.error}</span>
                      </div>
                    ) : sqlResult.rows.length === 0 ? (
                      <div className="text-center py-5 bg-amber-50/45 rounded-xl border border-dashed border-amber-200 text-xs text-amber-800 font-bold">
                        பொருந்தும் வரிசைகள் எதுவும் இல்லை. (Empty set. 0 rows returned.)
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[350px] scrollbar-thin">
                        <table className="w-full text-left border-collapse text-[10px] font-mono">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                              {sqlResult.headers.map((h) => (
                                <th key={h} className="p-2 border-r border-slate-200">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResult.rows.map((row, idx) => (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 font-medium text-slate-800">
                                {sqlResult.headers.map((h) => (
                                  <td key={h} className={`p-2 border-r border-slate-100 ${h === 'Create Table' ? 'whitespace-pre font-mono text-[9px] leading-relaxed text-blue-900 bg-slate-50 max-w-none' : 'truncate max-w-[200px]'}`}>
                                    {row[h] !== undefined ? String(row[h]) : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
