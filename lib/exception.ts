type HttpStatus = 401 | 422 | 500 | 403 | 404 | 409;

const getMessage = (status: HttpStatus): string => {
    const messages: { [key in HttpStatus]: string } = {
        401: "Session Expired",
        422: "Validation Error",
        403: "Forbidden Access",
        404: "Not Found",
        409: "Conflict",
        500: "Internal Server Error",
    };

    return messages[status];
};

interface HttpErrorInfo {
    [key: string]: string | string[] | undefined;
}

export class HttpError extends Error {
    public info: HttpErrorInfo;
    public status: HttpStatus;
    public message: string;

    constructor({
        info = {},
        status,
    }: {
        info?: HttpErrorInfo;
        status: HttpStatus;
        message?: string;
    }) {
        super(getMessage(status));
        this.info = info;
        this.status = status;
        this.message = getMessage(status);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }

    toString() {
        return `HttpError { status: ${this.status}, message: "${this.message}", info: ${JSON.stringify(this.info)} }`;
    }
}
