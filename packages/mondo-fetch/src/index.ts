import {Result, raiseFailure, raiseSuccess} from '@mondopower/result-types'
import {createTimedFetchRequest} from './helpers'
import {BaseRequestOptions, ContentTypes, FetchClientOptions, FetchErrorTypes, HttpMethods, PostRequestOptions} from './types'
export * from './types'

export class FetchClient {

  private readonly defaultContentType: ContentTypes
  private readonly timeoutInMilliseconds: number

  constructor(options?: FetchClientOptions) {
    const tenSecondsInMilliseconds = 10 * 1000

    this.defaultContentType = ContentTypes.JSON
    this.timeoutInMilliseconds = options?.timeoutInMilliseconds ?? tenSecondsInMilliseconds

  }


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

  async post<ResponseType>(url: string, requestOptions?: PostRequestOptions): Promise<Result<ResponseType, FetchErrorTypes>> {
    const result = await createTimedFetchRequest<ResponseType>(url, HttpMethods.POST, this.timeoutInMilliseconds, requestOptions?.contentType)

    if (result.isErrored)
      throw (result.error.message)

    console.log('result:', result) // TODO: Delete
    return raiseSuccess(result.data)
  }
}
