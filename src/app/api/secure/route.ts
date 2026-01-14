import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader && authHeader.includes('Bearer') && authHeader.includes('admin')) {
    return NextResponse.json({
        data: "sensitive",
        flag: "flag{jwt_token_spoofing_master_7744}"
    })
  }

  return NextResponse.json({
    error: "Unauthorized",
    message: "Missing or invalid Authorization header."
  }, { status: 401 })
}
