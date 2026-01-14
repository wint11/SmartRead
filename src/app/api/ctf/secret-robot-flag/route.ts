import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    flag: "flag{robots_keep_secrets_safe_4455}",
    message: "You followed the robots.txt! Good job."
  })
}
