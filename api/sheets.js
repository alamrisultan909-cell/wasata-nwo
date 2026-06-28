
import { google } from "googleapis";

const SHEET_NAMES = {
  contracts: "العقود",
  financials: "عمولات المكتب",
  customers: "بيانات العملاء",
  payments: "سداد العملاء",
  users: "إدارة المستخدمين",
};

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  const auth = getAuth();
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

function resolveSheet(type = "contracts") {
  return SHEET_NAMES[type] || SHEET_NAMES.contracts;
}

export default async function handler(req, res) {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: "Missing SPREADSHEET_ID" });
    }

    const sheets = await getSheets();

    if (req.method === "GET") {
      const type = req.query.type || "contracts";
      const sheet = resolveSheet(type);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheet}!A1:Z1000`,
      });

      const values = response.data.values || [];
      const headers = values[0] || [];
      const rows = values.slice(1);

      return res.status(200).json({ ok: true, sheet, headers, rows });
    }

    if (req.method === "POST") {
      const { type = "contracts", values = [] } = req.body || {};
      if (!Array.isArray(values)) {
        return res.status(400).json({ error: "values must be an array" });
      }

      const sheet = resolveSheet(type);

      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheet}!A:Z`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [values] },
      });

      return res.status(200).json({
        ok: true,
        sheet,
        updates: appendResponse.data.updates || null,
      });
    }

    if (req.method === "DELETE") {
      const type = req.query.type || "contracts";
      const rowNumber = Number(req.query.rowNumber);
      if (!rowNumber || rowNumber < 2) {
        return res.status(400).json({ error: "rowNumber must be >= 2" });
      }

      const sheet = resolveSheet(type);

      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const targetSheet = (meta.data.sheets || []).find(
        (s) => s.properties?.title === sheet
      );

      if (!targetSheet) {
        return res.status(404).json({ error: `Sheet not found: ${sheet}` });
      }

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: targetSheet.properties.sheetId,
                  dimension: "ROWS",
                  startIndex: rowNumber - 1,
                  endIndex: rowNumber,
                },
              },
            },
          ],
        },
      });

      return res.status(200).json({ ok: true, sheet, deletedRow: rowNumber });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Sheets API error:", error);
    return res.status(500).json({
      ok: false,
      error: error?.message || "Internal Server Error",
    });
  }
}
