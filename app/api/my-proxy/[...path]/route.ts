import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>
  }
) {
  const path = (await params).path;

  const accessToken = await auth0.getAccessToken();
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return new NextResponse(await res.text(), { status: res.status });
}
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>
  }
) {
  const path = (await params).path;

  const accessToken = await auth0.getAccessToken();
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  const parsedBody = await req.json().catch(() => undefined);

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
  });

  return new NextResponse(await res.text(), { status: res.status });
}
