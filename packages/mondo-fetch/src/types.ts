
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


export type RequestOptionsWithoutBody = Omit<RequestOptions, 'body'>

/**
   * RequestOptions that are optional parameters used for requests
   * @param contentType The type of content @default 'application/json; charset=utf-8'
   * @param timeout Optional parameter that dictates how long a request takes in milliseconds before timing out @default 30000
   * @param authorizationToken An optional token that will be provided to each request @default undefined
   * @param body Optional parameter that contains a payload to send with the request @default undefined
   * @param onBehalfOf An optional user identifier that will be provided to each request @default undefined
   */
export interface RequestOptions {
  contentType?: ContentTypes;
  timeout?: number;
  authorizationToken?: string;
  body?: string;
  onBehalfOf?: string;
}

export interface AbortError {
  name: string;
}
