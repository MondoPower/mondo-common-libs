import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {AbortError, BaseRequestOptions, ContentTypes, FetchClientConfig, FetchErrorTypes, HttpMethods, PostRequestOptions, PutRequestOptions} from './types'
export * from './types'

export class FetchClient {
  /**
   * @param baseUrl An optional parameter that if provided will be prepended to each request
   * @param authorizationToken An optional token that will be provided to each request
   */

  private readonly authorizationToken?: string | undefined
  private readonly baseUrl?: string | undefined

  constructor(config?: FetchClientConfig) {
    this.baseUrl = config?.baseUrl
    this.authorizationToken = config?.authorizationToken
  }

  /**
   * If a baseUrl is provided it will combine it with the provider url, otherwise returns the provided url
   * @param providedUrl the url or path that you are targeting for your request
   * @param baseUrl optional parameter that can be set when the client is created
   * @returns A url
   */
  private getUrl(providedUrl: string, baseUrl?: string): string {
    if (!baseUrl)
      return providedUrl

    return `${baseUrl}${providedUrl}`
  }

  /**
   * Makes a timed fetch GET request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  async get<T>(url: string, requestOptions?: BaseRequestOptions): Promise<Result<T, FetchErrorTypes>> {
    const result = await this.createTimedFetchRequest<T>(this.getUrl(url, this.baseUrl), HttpMethods.GET, requestOptions)
    if (result.isErrored) {
      console.error(result.error.message)
      return raiseFailure(result.error)
    }

    return raiseSuccess(result.data)
  }

  /**
   * Makes a timed fetch POST request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async post<T>(url: string, requestOptions?: PostRequestOptions): Promise<Result<T, FetchErrorTypes>> {
    const result = await this.createTimedFetchRequest<T>(this.getUrl(url, this.baseUrl), HttpMethods.POST, requestOptions)
    if (result.isErrored) {
      console.error(result.error.message)
      return raiseFailure(result.error)
    }

    return raiseSuccess(result.data)
  }

  /**
   * Makes a timed fetch PUT request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async put<T>(url: string, requestOptions?: PutRequestOptions): Promise<Result<T, FetchErrorTypes>> {
    const result = await this.createTimedFetchRequest<T>(this.getUrl(url, this.baseUrl), HttpMethods.PUT, requestOptions)
    if (result.isErrored) {
      console.error(result.error.message)
      return raiseFailure(result.error)
    }

    return raiseSuccess(result.data)
  }

  /**
   * Makes a timed fetch DELETE request to the provided url
   * @param url target for the request, this can either be a path built on the base url or a full url
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  public async delete<T>(url: string, requestOptions?: BaseRequestOptions): Promise<Result<T, FetchErrorTypes>> {
    const result = await this.createTimedFetchRequest<T>(this.getUrl(url, this.baseUrl), HttpMethods.DELETE, requestOptions)
    if (result.isErrored) {
      console.error(result.error.message)
      return raiseFailure(result.error)
    }

    return raiseSuccess(result.data)
  }
  /**
   * Checks if the error is a request timeout error
   * @param error the error we want to check
   * @returns true or false
   */
  private isTimeoutError(error: unknown): error is AbortError {
    if (typeof error !== 'object' || !error)
      return false

    const typedError = error as AbortError
    return typedError.name === 'AbortError'
  }

  /**
   * Creates a timed fetch request using an Abort Controller
   * @param url The url we are targeting for our request
   * @param method The method was are invoking
   * @param requestOptions optional parameters that can be provided
   * @returns Promise<Result<T, FetchErrorTypes>>
   */
  private async createTimedFetchRequest<T>(url: string, method: HttpMethods, requestOptions?: PostRequestOptions)
    : Promise<Result<T, FetchErrorTypes>> {

    const {body, contentType = ContentTypes.JSON, timeout = 30000} = requestOptions ?? {}

    const headers = {
      'Content-Type': contentType,
    }

    const authorizationToken = requestOptions?.authorizationToken || this.authorizationToken
    if (authorizationToken)
      Object.assign(headers, {Authorization: `Bearer ${authorizationToken}`})

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      controller.abort()
      const result = await fetch(url, {signal: controller.signal, method, headers, body})
      clearTimeout(timeoutId)

      if (!result.ok)
        return raiseFailure({
          errorType: FetchErrorTypes.FetchError,
          message: `The request failed due to ${result.statusText}`,
        })

      return raiseSuccess(await result.json() as T)
    } catch (error) {
      clearTimeout(timeoutId)

      const isTimeOutErrorType = this.isTimeoutError(error)
      if (isTimeOutErrorType)
        return raiseFailure({
          errorType: FetchErrorTypes.RequestTimedOut,
          message: `The request has reached the maximum duration of ${timeout} milliseconds`,
        })

      const message = 'We were not able to determine the type of error for the failed request'
      console.error(message)
      console.error('Error', error)
      return raiseFailure({
        errorType: FetchErrorTypes.UnknownFailure,
        message: message,
      })
    }

  }

}