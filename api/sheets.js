function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const keyB64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;

  if (!clientEmail || !keyB64) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY_BASE64");
  }

  const privateKey = Buffer.from(keyB64, "base64").toString("utf8").trim();

  if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    throw new Error("Decoded private key is invalid");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}
