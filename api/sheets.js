import { google } from "googleapis";

const SHEET_NAMES = {
  contracts: "العقود",
  customers: "بيانات العملاء",
  financials: "عمولات المكتب",
  payments: "سداد العملاء",
  users: "إدارة المستخدمين"
};

function getPrivateKey() {
  const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (!b64) throw new Error("Missing GOOGLE_PRIVATE_KEY_BASE64");
  const key = Buffer.from(b64, "base64").toString("utf8").trim();
  if (!key.includes("BEGIN PRIVATE KEY") || !key.includes("END PRIVATE KEY")) {
    throw new Error("Invalid GOOGLE_PRIVATE_KEY_BASE64");
  }
  return key;
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL");
  return new google.auth.JWT({
    email,
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
}

function sheetByType(type = "contracts") {
  return SHEET_NAMES[type] || SHEET_NAMES.contracts;
}

export default async function handler(req, res) {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ ok: false, error: "Missing SPREADSHEET_ID" });
    }

    const auth = getAuth();
    await auth.authorize();
    const sheets = google.sheets({ version: "v4", auth });

    if (req.method === "GET") {
      const type = req.query.type || "contracts";
      const sheet = sheetByType(type);

      const out = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheet}!A1:Z1000`
      });

      const values = out.data.values || [];
      return res.status(200).json({
        ok: true,
        sheet,
        headers: values[0] || [],
        rows: values.slice(1)
      });
    }

    if (req.method === "POST") {
      const { type = "contracts", values = [] } = req.body || {};
      if (!Array.isArray(values)) {
        return res.status(400).json({ ok: false, error: "values must be array" });
      }

      const sheet = sheetByType(type);
      const out = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheet}!A:Z`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [values] }
      });

      return res.status(200).json({ ok: true, sheet, updates: out.data.updates || null });
    }

    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || "Internal Server Error" });
  }
}
