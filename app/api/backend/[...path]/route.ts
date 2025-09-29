import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tnp-portal-backend-kbw7.onrender.com";

async function handleRequest(request: NextRequest) {
  try {
    // Build the backend URL
    const path = request.nextUrl.pathname.replace("/api/backend/", "");
    const backendUrl = `${BACKEND_URL}/${path}`;

    console.log(`Forwarding ${request.method} to: ${backendUrl}`);

    // Get the request body if it exists
    let body = null;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.json();
      console.log("Body:", body);
    }

    // Get cookies from browser
    const cookies = request.headers.get("cookie") || "";

    // Forward request to backend
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies, // This is the magic - forwards auth cookies
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      redirect: "manual",
    });

    // Check if user needs to login
    if (response.status === 302 || response.redirected) {
      console.log("User not authenticated");
      return NextResponse.json(
        {
          error: "Please login first",
          needsAuth: true,
          loginUrl: `${BACKEND_URL}/login`,
        },
        { status: 401 }
      );
    }

    // Get response from backend
    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { error: data.error || "Request failed" },
        { status: response.status }
      );
    }

    console.log("Success!");
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Handle POST requests (like your registration)
export async function POST(request: NextRequest) {
  return handleRequest(request);
}

// Handle GET requests
export async function GET(request: NextRequest) {
  return handleRequest(request);
}

// Handle PUT requests
export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

// Handle DELETE requests
export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}
