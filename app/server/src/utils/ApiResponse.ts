export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: Record<string, unknown>;
}

export const ok = <T>(data: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message
});

export const fail = (message: string, meta?: Record<string, unknown>): ApiResponse => ({
    success: false,
    message,
    meta
});
