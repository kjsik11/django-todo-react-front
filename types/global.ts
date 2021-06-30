export interface CustomError extends Error {
  code?: number;
  additionalInfo?: unknown;
}
