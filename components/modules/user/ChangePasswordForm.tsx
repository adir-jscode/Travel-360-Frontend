"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/ui/InputFieldError";
import { changePassword } from "@/services/auth/auth.service";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5 max-w-md">
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="oldPassword"
            className="text-sm font-semibold text-foreground"
          >
            Current password
          </FieldLabel>
          <div className="relative mt-1.5">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="oldPassword"
              name="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="Enter your current password"
              className="pl-9 pr-9"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showOld ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <InputFieldError field="oldPassword" state={state} />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="newPassword"
            className="text-sm font-semibold text-foreground"
          >
            New password
          </FieldLabel>
          <div className="relative mt-1.5">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Enter a new password"
              className="pl-9 pr-9"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNew ? (
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
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your new password"
              className="pl-9 pr-9"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? (
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
            className="h-11 font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
