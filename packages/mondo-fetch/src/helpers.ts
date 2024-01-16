import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {HttpMethods, ContentTypes, FetchErrorTypes, AbortError} from './types'

export function isFetchError(error: unknown): error is Response {
  const requiredKeys = ['body', 'bodyUsed', 'headers', 'ok', 'redirected', 'status', 'type', 'url']
  if (typeof error !== 'object' || !error)
    return false

  for (const requiredKey of requiredKeys)
    if (!(requiredKey in error))
      return false

  return true
}

export function isTimeoutError(error: unknown): error is AbortError {
  if (typeof error !== 'object' || !error)
    return false

  const typedError = error as AbortError
  return typedError.name === 'AbortError'
}

// eslint-disable-next-line max-len
export async function createTimedFetchRequest<ResponseType>(url: string, method: HttpMethods, timeout: number, body: string, contentType?: ContentTypes): Promise<Result<ResponseType, FetchErrorTypes>> {
  const headers = {
    'Content-Type': contentType ?? ContentTypes.JSON,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const result = await fetch(url, {signal: controller.signal, method, headers, body})
    clearTimeout(timeoutId)

    if (!result.ok) {
      console.error('The request was not ok due to:', result.statusText)
      return raiseFailure({errorType: FetchErrorTypes.InvalidStatus, message: `The status returned was ${result.status}`})
    }

    clearTimeout(timeoutId)
    return raiseSuccess(await result.json() as ResponseType)
  } catch (error) {
    clearTimeout(timeoutId)

    const isTimeOutErrorType = isTimeoutError(error)
    if (isTimeOutErrorType)
      return raiseFailure({
        errorType: FetchErrorTypes.RequestTimedOut,
        message: `The request has reached the maximum duration of ${timeout} milliseconds`,
      })

    const isFetchErrorType = isFetchError(error)
    if (isFetchErrorType)
      return raiseFailure({
        errorType: FetchErrorTypes.RequestTimedOut,
        message: `The request failed due to ${error.statusText}`,
      })

    console.error('We were not able to determine the type of error for the failed request')
    return raiseFailure({
      errorType: FetchErrorTypes.UnknownFailure,
      message: `${error}`,
    })
  }

}
