import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tnp-portal-backend-kbw7.onrender.com";

async function handleRequest(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace("/api/backend/", "");
    const backendUrl = `${BACKEND_URL}/${path}`;

    console.log(`Forwarding ${request.method} to: ${backendUrl}`);

    let body = null;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.json();
      console.log("Body:", body);
    }

    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      redirect: "manual",
    });

    // 🟢 Forward Set-Cookie headers from backend to client
    const res = NextResponse.json(
      response.ok ? await response.json() : { error: "Request failed" },
      { status: response.status }
    );

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      res.headers.set("set-cookie", setCookieHeader);
    }

    return res;
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}
export async function GET(request: NextRequest) {
  return handleRequest(request);
}
export async function PUT(request: NextRequest) {
  return handleRequest(request);
}
export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}
