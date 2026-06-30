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

const CONFIG = {
    SPREADSHEET_ID: '1N-E6G5-SULTAN-WASATA-SHEET-ID', 
    PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1cXrbv5r+2fRy
WuerYM+kaFvosyo7xoGqe2SfrYZu/KA2tTx6dusVSts9XPkEAx2CQ+UeB4Mpc2+3
bneBFZkBDYEQANFFo1sotksbW61cLGdcdqB2ouXN/MkG7o9iV7UwQirx5oT5LKMh
VlBwHnA8GwJn5HzlO0L3hZF21zGwbqLxciNp7Z/xXVEGhoPAI7m/lDIwHhMV6iH1
9aF/Jfhi9DOdoCt57y0YfSTEWqx7Y6IC2P+iZraLzteomIcm4bG5wN02zNR469+o
YpyaqEskknjkZourGf+mGh9005OL1yUZZ2ZkpIUPhE9qBlMxs71fQhwL093ap3an
FgBnq0IDAgMBAAECggEAJK+sOrBUI4FoNpMA0psBgOmE49kOCgYKA7FtWAfa7afw
sP8WGmDfCXAYQiEBTHlgxwz5T4gPUhtAFGOmkBgQ1rCnTtgLeDweW234Y7C2rbNg
tsZZjYNEWdDpyJgFr8myHe7TBhQpAMSwuzXbj7/ny49efikpw6Om16tPDStXpadx
5SQdBFe8kKThffb8yzEq+PYdS9SfKquCGuZeprRa5pphsbbXoXvclCo0f8Pja/Il
Q2S6bhZp4r9qiC4VgfHN2KSIlE4IvsLCQJChlD/bZPCplHMiSOElOpwEvnBqsKRF
1ooozgKq91LuuDDl5oTcivyI6+wMRKAyvIw7xa0gsQKBgQDdaaVipZDxGLHOTQgT
Rbm+Ba3Jhrh4+NvtmlugS5fzI1tugJDTXGXXPzfqMFxrZC/7XRNznQy39kCPNeq+
9QE/H+bX28OHKkacuQ6k8YPApV1x8c/Rz+HGFbe9PL39g83WeDnXfzXX9kKZlMfm
aIyC5wBX6rtgNKdiEbA/orjVSwKBgQDRyXJV7CogTR452u0kwyvUd4RqmD4w0VSD
BKLhhCyP8UVX8DWg3ZSALUFt7erB6jcpvOWjxJOzpDuNaAWiBPQPj8dpgo1Adr4g
Cbhsy8EmbUcZlqxPj7EzQFb1igiezRz790i72VROR5sKuDbejI2eldVPMze+6lLb
SZbRXcirKQKBgEbnPQIhGRBMIyx4eJyLWJbkhKmjjdGXh/5Hzw2/B3LiILZ7T2WQ
EkDiysohIId3dvIc9Uyxv0/t+PCjiIAMP5Dya182zh+rxx8LGAh0GwgHLKx/jliX
JKrla4ibOhBENBd5OrSq1RhKkTtTbMx5MH3+8Zo13jlJw0xhc7p9JomPAoGASZa9
ebBvEoeau7a1Cvk/jbcjBvVCk4NKfu8IZ80iiJecuH01gqlXZyL42aPkfoM3OHff
ofPZz+EjVrYPi8brCe5oh/VYsS02Ai0GuXs71MvubeZxqTMBeLXwCw+ReIsAyM30
gJh6vz7U/wyhiq2JHAD5I2AXBOxThkKpGeYo9wkCgYAzlb0QEiYMzRp3cGN4FCYS
JssVUiphP2dd7LCM/NZ1AR9h7Q1RNSQ9xhUpuYkFpJhmvhKfK6QqO7SGPr+kjNWy
9RngpJ+gMqnwDZen7jnmcI4nXLfo3XFI6EYR1yTX1C66Twy7eT4OWuIRraegVCo5
u+1Q8yEMC6lOgquUjMTVtw==
-----END PRIVATE KEY-----`,
    CLIENT_EMAIL: 'wasata-service-account@wasata-nwo.iam.gserviceaccount.com',
    SHEETS: {
        CUSTOMERS: 'بيانات العملاء',
        FINANCIALS: 'عمولات المكتب',
        PAYMENTS: 'سداد العملاء',
        USERS: 'إدارة المستخدمين'
    },
    DEPLOYMENT_URL: 'https://wasata.sa/app',
    PUBLIC_SITE_URL: 'https://wasata.sa'
};

function keyFromEnv() {
  const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  if (b64) {
    return Buffer.from(b64, "base64").toString("utf8").replace(/\\n/g, "\n").trim();
  }
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (rawKey) {
    return rawKey.replace(/\\n/g, "\n").trim();
  }
  return CONFIG.PRIVATE_KEY;
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
