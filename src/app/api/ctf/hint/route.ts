import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { hint: "Check the headers!" },
    {
      status: 200,
      headers: {
        'X-CTF-Flag': 'flag{header_is_key_7733}',
        'Access-Control-Expose-Headers': 'X-CTF-Flag'
      }
    }
  )
}
