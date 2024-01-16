import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {HttpMethods, ContentTypes, FetchErrorTypes} from './types'


export function isFetchError(error: unknown): error is Response {
  const requiredKeys = ['body', 'bodyUsed', 'headers', 'ok', 'redirected', 'status', 'type', 'url']
  if (typeof error !== 'object' || !error)
    return false

  for (const requiredKey of requiredKeys)
    if (!(requiredKey in error))
      return false

  return true
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

// eslint-disable-next-line max-len
export async function createTimedFetchRequest<ResponseType>(url: string, method: HttpMethods, timeout: number, contentType?: ContentTypes): Promise<Result<ResponseType, FetchErrorTypes>> {
  const headers = {
    'Content-Type': contentType ?? ContentTypes.JSON,
  }
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 1)

  try {
    const result = await fetch(url, {method: method, headers, signal: controller.signal})
    clearTimeout(timeoutId)

    if (!result.ok)
      throw new Error('The received status code was not 200')

    return raiseSuccess(await result.json() as ResponseType)

  } catch (error) {
    const isFetchErrorType = isFetchError(error)

    if (!isFetchErrorType)
      throw new Error('Idk what this error is')

    clearTimeout(timeoutId)
    if (error.statusText === 'AbortError')
      return raiseFailure({
        errorType: FetchErrorTypes.RequestTimedOut,
        message: `The request has reached the maximum duration of ${timeout} milliseconds`,
      })
  }

}
