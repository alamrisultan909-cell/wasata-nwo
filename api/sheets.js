import { google } from "googleapis";

const SHEET_NAMES = {
  contracts: "العقود",
  customers: "بيانات العملاء",
  financials: "عمولات المكتب"
};

function getPrivateKey() {
  const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (!b64) throw new Error("Missing GOOGLE_PRIVATE_KEY_BASE64");
  return Buffer.from(b64, "base64").toString("utf8").replace(/\\n/g, "\n").trim();
}

function getSheetName(type = "contracts") {
  return SHEET_NAMES[type] || SHEET_NAMES.contracts;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = getPrivateKey();

    if (!spreadsheetId) throw new Error("Missing SPREADSHEET_ID");
    if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL");

    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    });

    await auth.authorize();

    const sheets = google.sheets({ version: "v4", auth });
    const type = req.query.type || "contracts";
    const sheet = getSheetName(type);

    const r = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheet}!A1:Z1000`
    });

    const values = r.data.values || [];
    return res.status(200).json({
      ok: true,
      sheet,
      headers: values[0] || [],
      rows: values.slice(1)
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message || "Internal Server Error"
    });
  }
}
