import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check for specific payload
    if (body.action === 'upload' && body.file_type === 'secret') {
      return NextResponse.json({
        success: true,
        message: "Upload successful. File analyzed.",
        flag: "flag{post_requests_are_fun_7788}"
      })
    }
    
    return NextResponse.json({
      success: false,
      message: "Invalid upload parameters. Expected { action: 'upload', file_type: 'secret' }"
    }, { status: 400 })
    
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Invalid JSON body"
    }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Method not allowed. Please use POST."
  }, { status: 405 })
}
