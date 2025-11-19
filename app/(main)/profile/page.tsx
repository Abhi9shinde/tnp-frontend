import ProfileClient from "./profileClient";
import { auth0 } from "@/lib/auth0";

export default async function ProfilePage() {
  const { token } = await auth0.getAccessToken();

  return <ProfileClient accessToken={token} />;
}
