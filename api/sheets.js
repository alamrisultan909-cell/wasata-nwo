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
  const key = Buffer.from(b64, "base64").toString("utf8").replace(/\\n/g, "\n").trim();
  if (!key.includes("BEGIN PRIVATE KEY") || !key.includes("END PRIVATE KEY")) {
    throw new Error("Invalid GOOGLE_PRIVATE_KEY_BASE64");
  }
  return key;
}

async function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL");

  const auth = new google.auth.JWT({
    email,
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

function resolveSheet(type = "contracts") {
  return SHEET_NAMES[type] || SHEET_NAMES.contracts;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ ok: false, error: "Missing SPREADSHEET_ID" });
    }

    const type = req.query.type || "contracts";
    const sheet = resolveSheet(type);

    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheet}!A1:Z1000`
    });

    const values = response.data.values || [];
    return res.status(200).json({
      ok: true,
      sheet,
      headers: values[0] || [],
      rows: values.slice(1)
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Internal Server Error"
    });
  }
}
