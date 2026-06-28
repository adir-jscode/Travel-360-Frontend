import { ZodTypeAny } from "zod";

export const zodValidator = <T>(payload: T, schema: ZodTypeAny) => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      })),
      data: undefined,
    };
  }

  return {
    success: true as const,
    errors: [],
    data: result.data,
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
    const error = state.errors.find(
      (err) => err.field === fieldName || err.field.startsWith(fieldName),
    );
    return error ? error.message : null;
  }
  return null;
};
