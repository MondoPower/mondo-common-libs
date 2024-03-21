
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
  /**
   * An optional parameter that if provided will be prepended to each request
   */
  baseUrl?: string;
  /**
   * An optional token that will be provided to each request
   */
  authorizationToken?: string;
  /**
   * An optional user identifier that will be provided to each request
   */
  onBehalfOf?: string;
}

export type RequestOptionsWithoutBody = Omit<RequestOptions, 'body'>
export interface RequestOptions {
  /**
   * The type of content @default 'application/json; charset=utf-8'
   */
  contentType?: ContentTypes;
  /**
   *  Optional parameter that dictates how long a request takes in milliseconds before timing out @default 30000
   */
  timeout?: number;
  /**
   * An optional token that will be provided to each request @default undefined
   */
  authorizationToken?: string;
  /**
   * Optional parameter that contains a payload to send with the request @default undefined
   */
  body?: string;
  /**
   * An optional user identifier that will be provided to each request @default undefined
   */
  onBehalfOf?: string;
}

export interface AbortError {
  name: string;
}
