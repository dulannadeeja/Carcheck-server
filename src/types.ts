export interface ErrorResponse extends Error {
    statusCode: number;
    message: string;
    fieldErrors?: FieldError[];
}

export type FieldError = {
    field: string;
    message: string;
}