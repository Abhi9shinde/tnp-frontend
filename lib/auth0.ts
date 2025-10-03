import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
    routes: {
    callback: "api/auth/callback",
    backChannelLogout: "/backchannel-logout"
  }});