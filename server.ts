import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_FILE = path.join(process.cwd(), "mysql_db_records.json");

// Helper to load/initialize db data
function loadDBRecords(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading db file, falling back to seed", err);
  }

  // Default seed data
  const seedData: Record<string, any> = {
    '2026-07-14': {
      englishDate: '2026-07-14',
      englishDay: 'Tuesday',
      dateEng: '14',
      dayOfWeekTamil: 'செவ்வாய்',
      monthTamilLetter: 'ஜூலை',
      tamilDay: '30',
      tamilMonth: 'ஆனி',
      tamilYear: 'பராபவ',
      specialToday: 'அமாவாசை விரதம், மங்களகரமான நாள்',
      specialSymbols: '🕉',
      nakshatram: 'புனர்பூசம்',
      thithi: 'அமாவாசை',
      yogam: 'சித்த யோகம்',
      chandrashtamam: 'கேட்டை',
      nallaNeramMorning: 'காலை 07:30 - 09:00',
      nallaNeramEvening: 'மாலை 04:30 - 06:00',
      gowriMorning: 'காலை 10:30 - 12:00',
      gowriEvening: 'மாலை 01:30 - 03:00',
      raghuKalam: 'மாலை 03:00 - 04:30',
      yamagandam: 'காலை 09:00 - 10:30',
      kuligai: 'பகல் 12:00 - 01:30',
      soolam: 'வடக்கு (வெல்லம்)',
      'மேஷம்': 'இன்று தொட்ட காரியங்கள் துலங்கும்.',
      'ரிஷபம்': 'பணிச்சுமை குறையும்.',
      'மிதுனம்': 'நீண்ட நாள் கனவு நனவாகும்.',
      'கடகம்': 'வார்த்தைகளில் நிதானம் தேவை.',
      'சிம்மம்': 'தொழிலில் அபரிமிதமான வளர்ச்சி.',
      'கன்னி': 'மாணவர்கள் கல்வியில் சாதனை படைப்பீர்கள்.',
      'துலாம்': 'புதிய முயற்சிகள் நல்ல வெற்றியைத் தரும்.',
      'விருச்சிகம்': 'முக்கிய முடிவுகளை தள்ளிப்போடவும்.',
      'தனுசு': 'உங்களின் தன்னம்பிக்கை அதிகரிக்கும்.',
      'மகரம்': 'பொருளாதார வளம் சிறக்கும்.',
      'கும்பம்': 'தடைபட்ட காரியங்கள் அனைத்தும் சுமுகமாக முடியும்.',
      'மீனம்': 'உணவு விஷயத்தில் கவனம் தேவை.'
    }
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing seed data file", e);
  }

  return seedData;
}

function saveDBRecords(data: Record<string, any>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db file", err);
  }
}

// API Routes
app.get("/api/calendar", (req, res) => {
  const records = loadDBRecords();
  res.json({ success: true, data: records });
});

app.post("/api/calendar", (req, res) => {
  const { records } = req.body;
  if (!records || typeof records !== "object") {
    return res.status(400).json({ success: false, message: "Invalid records object" });
  }
  saveDBRecords(records);
  res.json({ success: true, message: "Records saved successfully", data: records });
});

app.delete("/api/calendar/:date", (req, res) => {
  const { date } = req.params;
  const records = loadDBRecords();
  if (records[date]) {
    delete records[date];
    saveDBRecords(records);
    res.json({ success: true, message: `Record for ${date} deleted`, data: records });
  } else {
    res.status(404).json({ success: false, message: `Record for ${date} not found` });
  }
});

// Vite Integration
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
});
