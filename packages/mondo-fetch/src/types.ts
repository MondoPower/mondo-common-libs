
export enum ContentTypes {
  XFORM = 'application/x-www-form-urlencoded',
  JSON = 'application/json; charset=utf-8'
}

export enum HttpMethods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum FetchErrorTypes {
  FailedToGet = 'FailedToGet',
  FailedToPost = 'FailedToPost',
  RequestTimedOut = 'RequestTimedOut',
  FetchError = 'FetchError',
  UnknownFailure = 'UnknownFailure'
}

export interface FetchClientConfig {
  baseUrl?: string;
  authorizationToken?: string;
  onBehalfOf?: string;
}

export interface PostRequestOptions extends BaseRequestOptions {
  body?: string;
  onBehalfOf?: string;
}

export interface PutRequestOptions extends BaseRequestOptions {
  body?: string;
  onBehalfOf?: string;
}

export interface BaseRequestOptions {
  contentType?: ContentTypes;
  timeout?: number;
  authorizationToken?: string;
}

export interface AbortError {
  name: string;
}
