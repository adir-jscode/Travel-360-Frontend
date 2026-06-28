import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth/auth.service";
import { LogOut } from "lucide-react";

export default function Signout() {
  return (
    <form action={signOut} className="w-full">
      <Button
        type="submit"
        variant="destructive"
        className="w-full justify-start gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </Button>
    </form>
  );
}
