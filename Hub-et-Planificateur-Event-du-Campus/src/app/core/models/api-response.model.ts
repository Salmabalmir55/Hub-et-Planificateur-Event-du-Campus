export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  statusCode: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
