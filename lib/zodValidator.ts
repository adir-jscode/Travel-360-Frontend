import { ZodTypeAny } from "zod";

export const zodValidator = <T>(payload: T, schema: ZodTypeAny) => {
  const validatedPayload = schema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      success: false as const,
      errors: validatedPayload.error.issues.map((issue) => ({
        field: String(issue.path[0] ?? ""),
        message: issue.message,
      })),
      data: undefined,
    };
  }

  return {
    success: true as const,
    errors: undefined,
    data: validatedPayload.data as T,
  };
};

export const getInputFieldError = (
  fieldName: string,
  state: {
    success: boolean;
    errors?: { field: string; message: string }[];
  } | null,
) => {
  if (state && state.errors) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  }
  return null;
};
