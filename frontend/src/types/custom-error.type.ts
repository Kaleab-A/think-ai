export interface CustomError extends Error {
  message: string;
  errorCode?: string;
}
