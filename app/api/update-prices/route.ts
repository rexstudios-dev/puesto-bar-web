import { NextResponse } from "next/server"
import { google } from "googleapis"
import { JWT } from "google-auth-library"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { spreadsheetId, range, values } = body

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create a JWT client using environment variables for authentication
    const auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Create Sheets client
    const sheets = google.sheets({ version: "v4", auth })

    // Update the spreadsheet
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({
      success: true,
      updatedCells: response.data.updatedCells,
    })
  } catch (error) {
    console.error("Error updating prices:", error)
    return NextResponse.json({ error: "Failed to update prices" }, { status: 500 })
  }
}

