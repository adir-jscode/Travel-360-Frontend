"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/services/auth/auth.service";
import { FaGoogle } from "react-icons/fa";

export default function Signin() {
  return (
    <form action={signIn} className="w-full">
      <Button
        type="submit"
        variant="outline"
        className="
          w-full
          h-11
          font-medium
          border-border/60
          bg-background
          hover:bg-accent
          hover:border-primary/30
          transition-all
          duration-300
          shadow-sm
          hover:shadow-md
        "
      >
        <FaGoogle className="mr-3 h-4 w-4 text-[#DB4437]" />
        Continue with Google
      </Button>
    </form>
  );
}
