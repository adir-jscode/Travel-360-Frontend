import { signOut } from "@/services/auth/auth.service";

export default function Signout() {
  return (
    <form action={signOut}>
      <button type="submit">Sign out</button>
    </form>
  );
}
