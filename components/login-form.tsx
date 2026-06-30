"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/loginUser";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import InputFieldError from "./ui/InputFieldError";

interface LoginFormProps {
  redirect?: string;
}

export default function LoginForm({ redirect }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fillCredentials = (type: "USER" | "ADMIN") => {
    if (type === "USER") {
      setEmail("user@gmail.com");
      setPassword("SecurePass123@");
    } else {
      setEmail("super@gmail.com");
      setPassword("Admin.itravel@2026");
    }
  };

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="mb-6 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Demo Accounts</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Click a button to auto-fill the login form.
            </p>
          </div>

          <Badge variant="secondary">Demo</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fillCredentials("USER")}
            className="h-auto flex-col items-start py-3"
          >
            <span className="font-semibold">👤 User</span>

            <span className="text-xs text-muted-foreground">
              user@gmail.com
            </span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fillCredentials("ADMIN")}
            className="h-auto flex-col items-start py-3"
          >
            <span className="font-semibold">🛡 Admin</span>

            <span className="text-xs text-muted-foreground">
              super@gmail.com
            </span>
          </Button>
        </div>
      </div>
      <FieldGroup>
        {/* Email */}
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

        {/* Password */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel
              htmlFor="password"
              className="text-sm font-semibold text-foreground"
            >
              Password
            </FieldLabel>
            <Link
              href="/forget-password"
              className="text-xs text-primary hover:underline underline-offset-4 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-9 pr-9"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <InputFieldError field="password" state={state} />
        </Field>

        {/* Submit */}
        <Field>
          <Button
            type="submit"
            className="w-full h-11 font-semibold text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
