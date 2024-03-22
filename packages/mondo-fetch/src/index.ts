import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {ContentTypes, FetchClientConfig, FetchErrorTypes, RequestOptionsWithoutBody, HttpMethods, RequestOptions} from './types'
export * from './types'

export class FetchClient {
  private readonly authorizationToken?: string | undefined
  private readonly onBehalfOf?: string | undefined
  private readonly baseUrl?: string | undefined

  constructor(config?: FetchClientConfig) {
    this.baseUrl = config?.baseUrl
    this.authorizationToken = config?.authorizationToken
    this.onBehalfOf = config?.onBehalfOf
  }

  /**
   * If a baseUrl is provided it will combine it with the provider url, otherwise returns the provided url
   * @param providedUrl the url or path that you are targeting for your request
   * @param baseUrl optional parameter that can be set when the client is created
   * @returns A url
   */
  private getUrl(providedUrl: string): string {
    return new URL(providedUrl, this.baseUrl).href

  }

  /**
   * Makes a timed fetch GET request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  async get<T>(url: string, requestOptions?: RequestOptionsWithoutBody): Promise<Result<T, FetchErrorTypes>> {
    return this.createTimedFetchRequest<T>(this.getUrl(url), HttpMethods.GET, requestOptions)
  }

  /**
   * Makes a timed fetch POST request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async post<T>(url: string, requestOptions?: RequestOptions): Promise<Result<T, FetchErrorTypes>> {
    return this.createTimedFetchRequest<T>(this.getUrl(url), HttpMethods.POST, requestOptions)
  }

  /**
   * Makes a timed fetch PUT request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async put<T>(url: string, requestOptions?: RequestOptions): Promise<Result<T, FetchErrorTypes>> {
    return this.createTimedFetchRequest<T>(this.getUrl(url), HttpMethods.PUT, requestOptions)
  }

  /**
   * Makes a timed fetch DELETE request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async delete<T>(url: string, requestOptions?: RequestOptionsWithoutBody): Promise<Result<T, FetchErrorTypes>> {
    return this.createTimedFetchRequest<T>(this.getUrl(url), HttpMethods.DELETE, requestOptions)
  }

  /**
   * Checks if the error is a request timeout error
   * @param error the error we want to check
   * @returns true or false
   */
  private isAbortError(error: unknown): error is Error {
    if (typeof error !== 'object' || !error)
      return false

    const typedError = error as Error
    return typedError.name === 'AbortError'
  }

  private hasBody(requestOptions: RequestOptions | RequestOptionsWithoutBody | undefined): requestOptions is RequestOptions {
    return !!requestOptions && ('body' in requestOptions)
  }

  /**
   * Creates a timed fetch request using an Abort Controller
   * @param url The url we are targeting for our request
   * @param method The method was are invoking
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  private async createTimedFetchRequest<T>(url: string, method: HttpMethods, requestOptions?: RequestOptions | RequestOptionsWithoutBody)
    : Promise<Result<T, FetchErrorTypes>> {

    const {contentType = ContentTypes.JSON, timeout = 30000} = requestOptions ?? {}

    const headers = new Headers()
    headers.set('Content-Type', contentType)

    const authorizationToken = requestOptions?.authorizationToken ?? this.authorizationToken
    if (authorizationToken)
      headers.set('Authorization', `Bearer ${authorizationToken}`)

    const onBehalfOf = requestOptions?.onBehalfOf ?? this.onBehalfOf
    if (onBehalfOf)
      headers.set('X-On-Behalf-Of', onBehalfOf)

    const requestInfo: RequestInit = {
      signal: AbortSignal.timeout(timeout),
      method,
      headers,
    }

    if (this.hasBody(requestOptions))
      requestInfo.body = requestOptions.body

    try {
      const result = await fetch(url, requestInfo)
      if (!result.ok)
        return raiseFailure({
          errorType: FetchErrorTypes.FetchError,
          message: `The request failed due to ${result.statusText}`,
        })

      return raiseSuccess(await result.json() as T)
    } catch (error) {
      const isAbortError = this.isAbortError(error)
      if (isAbortError)
        return raiseFailure({
          errorType: FetchErrorTypes.RequestTimedOut,
          message: `The request has reached the maximum duration of ${timeout} milliseconds, ${error.message}`,
        })

      const typeError = error as TypeError
      return raiseFailure({
        errorType: FetchErrorTypes.UnknownFailure,
        message: typeError.message,
      })
    }

  }

}
