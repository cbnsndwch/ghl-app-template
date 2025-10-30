/**
 * Custom error class for GHL API errors
 */
export class GHLError extends Error {
    public statusCode?: number;
    public response?: any;
    public request?: any;

    constructor(
        message: string,
        statusCode?: number,
        response?: any,
        request?: any
    ) {
        super(message);
        this.name = 'GHLError';
        this.statusCode = statusCode;
        this.response = response;
        this.request = request;
    }
}
