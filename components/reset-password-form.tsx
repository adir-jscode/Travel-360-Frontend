"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/ui/InputFieldError";
import { resetPassword } from "@/services/auth/auth.service";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  id: string;
  token: string;
}

export default function ResetPasswordForm({
  id,
  token,
}: ResetPasswordFormProps) {
  console.log({ token });
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      const timeout = setTimeout(() => router.push("/login"), 1500);
      return () => clearTimeout(timeout);
    }
    if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  if (!id || !token) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-sm text-destructive font-medium">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline underline-offset-4 font-semibold"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="token" value={token} />
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="newPassword"
            className="text-sm font-semibold text-foreground"
          >
            New password
          </FieldLabel>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a new password"
              className="pl-9 pr-9"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <InputFieldError field="newPassword" state={state} />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-foreground"
          >
            Confirm new password
          </FieldLabel>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              className="pl-9 pr-9"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <InputFieldError field="confirmPassword" state={state} />
        </Field>

        <Field>
          <Button
            type="submit"
            className="w-full h-11 font-semibold text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
