import { google } from "googleapis";

const SHEET_NAMES = {
  contracts: "العقود",
  customers: "بيانات العملاء",
  financials: "عمولات المكتب"
};

const MOCK = {
  contracts: {
    headers: ["id", "name", "status", "amount"],
    rows: [
      ["C-1001", "عقد وساطة 1", "active", "15000"],
      ["C-1002", "عقد وساطة 2", "pending", "22000"]
    ]
  },
  customers: {
    headers: ["id", "customer", "phone", "city"],
    rows: [
      ["U-101", "أحمد", "0500000001", "الرياض"],
      ["U-102", "سارة", "0500000002", "جدة"]
    ]
  },
  financials: {
    headers: ["id", "month", "income", "expense"],
    rows: [
      ["F-01", "2026-06", "54000", "12000"],
      ["F-02", "2026-07", "61000", "18000"]
    ]
  }
};

function getType(type = "contracts") {
  return SHEET_NAMES[type] ? type : "contracts";
}

function keyFromEnv() {
  const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (!b64) throw new Error("Missing GOOGLE_PRIVATE_KEY_BASE64");
  return Buffer.from(b64, "base64").toString("utf8").replace(/\\n/g, "\n").trim();
}

async function readFromGoogle(type) {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!spreadsheetId) throw new Error("Missing SPREADSHEET_ID");
  if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL");

  const auth = new google.auth.JWT({
    email,
    key: keyFromEnv(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });
  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });
  const sheet = SHEET_NAMES[type];

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheet}!A1:Z1000`
  });

  const values = r.data.values || [];
  return {
    ok: true,
    source: "google",
    sheet,
    headers: values[0] || [],
    rows: values.slice(1)
  };
}

export default async function handler(req, res) {
  const type = getType(req.query?.type || "contracts");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const live = await readFromGoogle(type);
    return res.status(200).json(live);
  } catch (e) {
    // Fallback تشغيل فوري
    const m = MOCK[type];
    return res.status(200).json({
      ok: true,
      source: "mock",
      fallback: true,
      warning: e.message || "Google failed, using mock data",
      sheet: SHEET_NAMES[type],
      headers: m.headers,
      rows: m.rows
    });
  }
}
