import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { token } = await auth0.getAccessToken();
  const path = (await params).path;

  const search = req.nextUrl.search;

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}${search}`;

  console.log("Backend URL:", backendUrl);

  const res = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: res.status,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": res.headers.get("content-disposition") || "",
    },
  });
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { token } = await auth0.getAccessToken();
  const path = (await params).path;
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  console.log("Backend URL:", backendUrl);

  const parsedBody = await req.json().catch(() => undefined);

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });

}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const path = (await params).path;

  const { token } = await auth0.getAccessToken();
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  console.log("Backend URL:", backendUrl);

  const parsedBody = await req.json().catch(() => undefined);

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
  });

  return new NextResponse(await res.text(), { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { token } = await auth0.getAccessToken();
  const path = (await params).path;

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  console.log("Backend URL:", backendUrl);

  const parsedBody = await req.json().catch(() => undefined);

  const res = await fetch(backendUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
  });

  const data = await res.json();
return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { token } = await auth0.getAccessToken();
  const path = (await params).path;

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  const res = await fetch(backendUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return new NextResponse(await res.text(), { status: res.status });
}
