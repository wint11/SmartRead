import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
        const body = await request.json()
        if (body.action === 'upload' && body.file_type === 'secret') {
            return successResponse()
        }
    } else {
        // Handle form data or raw text (curl -d "upload=secret")
        const text = await request.text()
        if (text.includes('upload=secret')) {
            return successResponse()
        }
    }
    
    return NextResponse.json({
      success: false,
      message: "Invalid upload parameters."
    }, { status: 400 })
    
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Server Error"
    }, { status: 500 })
  }
}

function successResponse() {
    return NextResponse.json({
        success: true,
        message: "Upload successful. File analyzed.",
        flag: "flag{post_requests_are_fun_7788}"
    })
}

export async function GET() {
  return NextResponse.json({
    message: "Method not allowed. Please use POST."
  }, { status: 405 })
}
