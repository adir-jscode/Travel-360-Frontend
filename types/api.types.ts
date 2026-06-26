export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface IActionState {
  success: boolean;
  message?: string;
  errors?: { field: string; message: string }[];
  data?: unknown;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: IMeta;
}
