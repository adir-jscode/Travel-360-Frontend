"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/auth/registerUser";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import InputFieldError from "./ui/InputFieldError";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name" className="text-sm font-semibold">
            Full name
          </FieldLabel>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              className="pl-9"
              autoComplete="name"
            />
          </div>
          <InputFieldError field="name" state={state} />
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email" className="text-sm font-semibold">
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
            />
          </div>
          <InputFieldError field="email" state={state} />
        </Field>

        {/* Phone (optional) */}
        <Field>
          <FieldLabel htmlFor="phone" className="text-sm font-semibold">
            Phone{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </FieldLabel>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              className="pl-9"
            />
          </div>
          <InputFieldError field="phone" state={state} />
        </Field>

        {/* Location (optional) */}
        <Field>
          <FieldLabel
            htmlFor="currentLocation"
            className="text-sm font-semibold"
          >
            Location{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </FieldLabel>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="currentLocation"
              name="currentLocation"
              placeholder="Dhaka, Bangladesh"
              className="pl-9"
            />
          </div>
          <InputFieldError field="currentLocation" state={state} />
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password" className="text-sm font-semibold">
            Password
          </FieldLabel>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
              className="pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

        {/* Confirm Password */}
        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-sm font-semibold"
          >
            Confirm password
          </FieldLabel>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              className="pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            className="w-full h-11 font-semibold text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <FieldDescription className="text-center text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline underline-offset-4 font-semibold"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
