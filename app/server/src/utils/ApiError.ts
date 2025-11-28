import httpStatus from 'http-status';

class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }

    static badRequest(message = 'Bad request') {
        return new ApiError(httpStatus.BAD_REQUEST, message);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(httpStatus.UNAUTHORIZED, message);
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(httpStatus.FORBIDDEN, message);
    }

    static notFound(message = 'Not found') {
        return new ApiError(httpStatus.NOT_FOUND, message);
    }
}

export default ApiError;
