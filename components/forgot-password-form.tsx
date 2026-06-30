"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/ui/InputFieldError";
import { forgotPassword } from "@/services/auth/auth.service";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            {state.message} The link will expire in 10 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="email"
            className="text-sm font-semibold text-foreground"
          >
            Email address
          </FieldLabel>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <InputFieldError field="email" state={state} />
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
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
