
export enum ContentTypes {
  XFORM = 'application/x-www-form-urlencoded',
  JSON = 'application/json; charset=utf-8'
}

export enum HttpMethods {
  POST = 'POST',
  GET = 'GET',
}


export interface FetchClientOptions {
  timeoutInMilliseconds?: number;
  baseUrl: string;
}

export enum FetchErrorTypes {
  FailedToGet = 'FailedToGet',
  FailedToPost = 'FailedToPost',
  RequestTimedOut = 'RequestTimedOut',
  InvalidStatus = 'InvalidStatus',
  FetchError = 'FetchError',
  UnknownFailure = 'UnknownFailure'
}

export interface PostRequestOptions extends BaseRequestOptions {
}

export interface BaseRequestOptions {
  contentType?: ContentTypes;
}

export interface AbortError {
  name: string;
}
