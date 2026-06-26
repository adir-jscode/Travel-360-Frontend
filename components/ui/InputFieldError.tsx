"use client";

import { getInputFieldError } from "@/lib/zodValidator";

interface Props {
  field: string;
  state: {
    success: boolean;
    errors?: { field: string; message: string }[];
  } | null;
}

export default function InputFieldError({ field, state }: Props) {
  const error = getInputFieldError(field, state);
  if (!error) return null;

  return <p className="text-sm font-medium text-destructive mt-1">{error}</p>;
}
