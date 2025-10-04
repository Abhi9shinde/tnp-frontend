import { NextRequest } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

// Forward function
async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  // Get token from Auth0 session
  const  accessToken  = await getAccessToken();

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Construct backend URL
  const backendUrl = `${process.env.BACKEND_URL}/${params.path.join("/")}`;

  // Forward request to backend
  const response = await fetch(backendUrl, {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers), // forward headers
      Authorization: `Bearer ${accessToken}`, // inject Auth0 token
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  });

  // Return backend response
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

// Export handlers for all HTTP verbs
export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxyRequest(req, ctx.params);
}

export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxyRequest(req, ctx.params);
}

export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxyRequest(req, ctx.params);
}

export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxyRequest(req, ctx.params);
}

export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxyRequest(req, ctx.params);
}
