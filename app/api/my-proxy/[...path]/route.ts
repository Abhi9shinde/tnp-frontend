import { NextRequest } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { auth0 } from "@/lib/auth0";

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const accessToken = await auth0.getAccessToken();
  const { path } = context.params;
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.join("/")}`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return new Response(await res.text(), { status: res.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const accessToken = await getAccessToken();
  console.log(accessToken);
  const backendUrl = `${process.env.BACKEND_URL}/${params.path.join("/")}`;

  const res = await fetch(backendUrl, {
    method: "POST",
    body: req.body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": req.headers.get("content-type") ?? "application/json",
    },
  });

  return new Response(await res.text(), { status: res.status });
}
