
import { getAccessToken } from "@auth0/nextjs-auth0";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/secure-route";

async function proxyRequest(method: string, req: Request) {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  // Copy headers from the incoming request except host and content-length
  req.headers.forEach((value, key) => {
    if (!['host', 'content-length'].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const body = ["GET", "HEAD"].includes(method) ? undefined : await req.text();

  const res = await fetch(BACKEND_URL, {
    method,
    headers,
    body,
  });

  // Forward status and headers
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  const responseBody = await res.arrayBuffer();
  return new Response(responseBody, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: Request) {
  return proxyRequest("GET", req);
}

export async function POST(req: Request) {
  return proxyRequest("POST", req);
}

export async function PUT(req: Request) {
  return proxyRequest("PUT", req);
}

export async function DELETE(req: Request) {
  return proxyRequest("DELETE", req);
}

export async function PATCH(req: Request) {
  return proxyRequest("PATCH", req);
}

export async function OPTIONS(req: Request) {
  return proxyRequest("OPTIONS", req);
}

export async function HEAD(req: Request) {
  return proxyRequest("HEAD", req);
}
