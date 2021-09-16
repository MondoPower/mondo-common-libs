export interface Success<ResponseType> {
  isErrored: false;
  data: ResponseType;
}

export interface SuccessVoid {
  isErrored: false;
}

export type ErrorType = string

export interface CustomError<T extends ErrorType> {
  message: string;
  errorType: T;
}

export interface Failure<T extends ErrorType> {
  isErrored: true;
  error: CustomError<T>;
}

export type Result<ResponseType, T extends ErrorType> = Success<ResponseType> | Failure<T>
export type ResultVoid<T extends ErrorType> = SuccessVoid | Failure<T>

export interface ResultArray<Data, Errors extends ErrorType> {
  successes: Data[];
  failures: CustomError<Errors>[];
}

