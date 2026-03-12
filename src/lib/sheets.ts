import { google } from "googleapis";

// ============================================
// Google Sheets integration for transparent record-keeping
// All donation and distribution records are synced here
// Setup: Create a service account, share the sheet with its email
// ============================================

/**
 * Get an authenticated Google Sheets client using service account credentials.
 */
function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // The private key comes from env with escaped newlines
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "";

/**
 * Append a row to a specific sheet tab.
 * @param sheetName — Tab name, e.g. "Donors", "Donations", "Distributions"
 * @param values — Array of cell values for one row
 */
export async function appendRow(
  sheetName: string,
  values: (string | number | boolean)[]
): Promise<void> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

/**
 * Read all rows from a sheet tab.
 * Useful for admin dashboards or generating reports.
 */
export async function readSheet(
  sheetName: string
): Promise<(string | number)[][]> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  return (response.data.values as (string | number)[][]) ?? [];
}

/**
 * Initialize sheet headers if they don't exist.
 * Call once during setup.
 */
export async function initSheetHeaders(): Promise<void> {
  const headers: Record<string, string[]> = {
    Donors: ["ID", "Name", "Email", "Phone", "City", "Created At"],
    Donations: [
      "ID", "Donor ID", "Type", "Amount (PKR)", "Items", "Message", "Created At",
    ],
    Beneficiaries: [
      "ID", "Name", "CNIC", "Phone", "Address", "Family Size", "Verified", "Added By", "Created At",
    ],
    Distributions: [
      "ID", "Donation ID", "Beneficiary ID", "Beneficiary Name", "Items",
      "Status", "Image Proof", "Voice Proof", "Distributed At", "Notes",
    ],
  };

  for (const [sheetName, headerRow] of Object.entries(headers)) {
    try {
      const existing = await readSheet(sheetName);
      if (existing.length === 0) {
        await appendRow(sheetName, headerRow);
      }
    } catch {
      // Sheet tab might not exist — admin should create it manually
      console.warn(`Sheet tab "${sheetName}" not found. Please create it in your Google Sheet.`);
    }
  }
}
