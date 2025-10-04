import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
  const  accessToken  = await getAccessToken();
  console.log(accessToken);
}