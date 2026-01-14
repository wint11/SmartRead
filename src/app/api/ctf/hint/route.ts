import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.json({ 
    message: "Nothing to see here in the body...",
    hint: "Check the headers!"
  })
  
  // Flag 2: Custom Header
  response.headers.set('X-SmartRead-Flag', 'flag{header_is_key_7733}')
  
  return response
}
