import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {AbortError, BaseRequestOptions, ContentTypes, FetchErrorTypes, HttpMethods} from './types'
export * from './types'

export class FetchClient {
  // constructor(options?: FetchClientOptions) {

  // }


  // async get(url: string, requestOptions?: BaseRequestOptions): Promise<Result<Response, FetchErrorTypes>> {
  //   try {
  //     const result = await fetch(url, {method: HttpMethods.GET, headers})
  //     console.log('result:', result) // TODO: Delete
  //     return raiseSuccess(result)
  //   } catch (error) {
  //     console.error(error) // TODO: Want to redact this
  //     return raiseFailure({
  //       errorType: FetchErrorTypes.FailedToGet,
  //       message: 'Failed to get',
  //     })
  //   }

  // }

  public async post<ResponseType>(url: string, body: string, requestOptions?: BaseRequestOptions): Promise<Result<ResponseType, FetchErrorTypes>> {
    const result = await this.createTimedFetchRequest<ResponseType>(url, HttpMethods.POST, body, requestOptions?.timeout, requestOptions?.contentType)
    if (result.isErrored) {
      console.error(result.error.message)
      return raiseFailure(result.error)
    }

    return raiseSuccess(result.data)
  }

  private isTimeoutError(error: unknown): error is AbortError {
    if (typeof error !== 'object' || !error)
      return false

    const typedError = error as AbortError
    return typedError.name === 'AbortError'
  }

  // eslint-disable-next-line max-len
  private async createTimedFetchRequest<ResponseType>(url: string, method: HttpMethods, body: string, timeout = 30000, contentType?: ContentTypes): Promise<Result<ResponseType, FetchErrorTypes>> {
    const headers = {
      'Content-Type': contentType ?? ContentTypes.JSON,
    }

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

      return raiseSuccess(await result.json() as ResponseType)
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
