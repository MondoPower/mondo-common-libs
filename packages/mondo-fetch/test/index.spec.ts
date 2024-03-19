import {generateFetchMock, fetchSpy} from './testHelper'
import {ContentTypes, FetchClient, FetchErrorTypes} from '../src/index'

describe('#FetchClient', () => {
  const stubData = {test: 100}
  const url = 'https://stub-url.com.au'

  describe('Client', () => {
    const stubToken = 'stub-token'
    const onBehalfOf = 'stub-user'

    it('Should use a bearer token for a request when it is provided to the class constructor', async () => {
      // arrange
      const client = new FetchClient({authorizationToken: stubToken})
      const mock = generateFetchMock(stubData)
      fetchSpy.mockImplementation(mock)

      // act
      await client.get(url)

      // assert
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: {'Authorization': `Bearer ${stubToken}`, 'Content-Type': ContentTypes.JSON}, method: 'GET'}))
    })


    it('Should use an on-behalf of header for a request when it is provided to the class constructor', async () => {
      // arrange
      const client = new FetchClient({onBehalfOf})
      const mock = generateFetchMock(stubData)
      fetchSpy.mockImplementation(mock)
      const body = JSON.stringify({data: 'data'})

      // act
      await client.post(url, {body})

      // assert
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: {'X-On-Behalf-Of': onBehalfOf, 'Content-Type': ContentTypes.JSON}, method: 'POST', body}))
    })
  })


  describe('Requests', () => {
    // top level arrange
    const client = new FetchClient()
    const payload = JSON.stringify({
      client_id: 'stub-client-id',
      client_secret: 'stub-secret',
      grant_type: 'client_credentials',
      scope: 'stub-scope',
    })

    describe('Happy Path', () => {
      it('Should make a make a GET fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.get(url)

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: {'Content-Type': ContentTypes.JSON}, method: 'GET'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })

      it('Should prepend the base url when it is provided to the class constructor', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        const clientWithBaseUrl = new FetchClient({baseUrl: 'https://stub-base-url.com'})
        const path = '/stub/test'

        // act
        const result = await clientWithBaseUrl.get(path)

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith('https://stub-base-url.com/stub/test', expect.objectContaining({headers: {'Content-Type': ContentTypes.JSON}, method: 'GET'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })

      it('Should make a make a POST fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.post(url, {body: payload})

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.JSON}, method: 'POST'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })

      it('Should make a make a fetch request with an x-form content type', async () => {
        // arrange
        const mock = generateFetchMock(stubData, true)
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.post(url, {body: payload, contentType: ContentTypes.XFORM})

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.XFORM}, method: 'POST'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })

      it('Should be setting the timeout for the request to the value provided by us', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)
        const timeout = 99999

        const timeoutSpy = jest.spyOn(global, 'setTimeout')

        // act
        await client.post(url, {body: payload, timeout})

        // assert
        expect(timeoutSpy).toHaveBeenCalledWith(expect.anything(), timeout)
      })

      it('Should use the default timeout if none are provided', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        const timeoutSpy = jest.spyOn(global, 'setTimeout')

        // act
        await client.post(url, {body: payload})

        // assert
        expect(timeoutSpy).toHaveBeenCalledWith(expect.anything(), 30000)
      })

      it('Should invoke an abort request for all post requests', async () => {
        // arrange
        const abortSpy = jest.spyOn(AbortController.prototype, 'abort')
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        await client.post(url, {body: payload})

        // assert
        expect(abortSpy).toHaveBeenCalledTimes(1)
      })

      it('Should use the token provided in the request', async () => {
        // arrange
        const stubToken = 'stub-token'
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        await client.post(url, {body: payload, authorizationToken: stubToken})

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.JSON, 'Authorization': `Bearer ${stubToken}`}, method: 'POST'}))
      })

      it('Should overwrite a client config token with a token provided in the request', async () => {
        // arrange
        const stubToken = 'stub-token'
        const clientWithAuthToken = new FetchClient({authorizationToken: 'stub-client-token'})
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        await clientWithAuthToken.post(url, {body: payload, authorizationToken: stubToken})

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.JSON, 'Authorization': `Bearer ${stubToken}`}, method: 'POST'}))
      })

      it('Should make a make a PUT fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.put(url, {body: payload})

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.JSON}, method: 'PUT'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })

      it('Should make a make a DELETE fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData)
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.delete(url)

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: {'Content-Type': ContentTypes.JSON}, method: 'DELETE'}))
        expect(result).toStrictEqual({isErrored: false, data: stubData})
      })
    })

    describe('Unhappy Path', () => {
      it('Should return a timeout error when the request times out', async () => {
        // arrange
        const mock = jest.fn(() =>
          Promise.reject({
            name: 'AbortError',
          }),
        ) as jest.Mock
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.post(url, {body: payload})

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.RequestTimedOut, message: 'The request has reached the maximum duration of 30000 milliseconds'}})
      })

      it('Should return a fetch error when the response is not ok', async () => {
        // arrange
        const mock = generateFetchMock(stubData, false, {status: 401, statusText: 'Unauthorized'})
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.post(url, {body: payload})

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.FetchError, message: 'The request failed due to Unauthorized'}})
      })

      it('Should return an unknown error when it is not a timeout or fetch error', async () => {
        // arrange
        const mock = jest.fn(() =>
          Promise.reject({
            'stub-unknown-error': 'unknown-error-message',
          }),
        ) as jest.Mock
        fetchSpy.mockImplementation(mock)

        // act
        const result = await client.get(url)

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.UnknownFailure, message: 'We were not able to determine the type of error for the failed request'}})
      })
    })
  })
})


// describe('#ResultHandling', () => {
//   describe('Map Results', () => {
//     it('Multiple success and failures', () => {
//       //setup
//       const successOneData = ['one']
//       const successTwoData = ['two', '2']
//       const successOne = raiseSuccess(successOneData)
//       const successTwo = raiseSuccess(successTwoData)
//       const failureOne = raiseFailure({
//         message: 'FailureOne',
//         errorType: FailureTest.TestFailure,
//       })
//       const failureTwo = raiseFailure({
//         message: 'FailureTwo',
//         errorType: FailureTest.TestFailure,
//       })

//       const payload: Result<string[], FailureTest>[] = [successOne, successTwo, failureOne, failureTwo]

//       //act
//       const {successes, failures} = mapResults(payload)

//       //assert
//       expect(successes).to.deep.equal([successOneData, successTwoData])
//       expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
//     })

//     it('No success and multiple failures', () => {
//     //setup
//       const failureOne = raiseFailure({
//         message: 'FailureOne',
//         errorType: FailureTest.TestFailure,
//       })
//       const failureTwo = raiseFailure({
//         message: 'FailureTwo',
//         errorType: FailureTest.TestFailure,
//       })

//       const payload: Result<string, FailureTest>[] = [failureOne, failureTwo]

//       //act
//       const {successes, failures} = mapResults(payload)

//       //assert
//       expect(successes.length).to.eql(0)
//       expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
//     })

//     it('Multiple success and no failures', () => {
//       //setup
//       const successOneData = ['one']
//       const successTwoData = ['two', '2']
//       const successOne = raiseSuccess(successOneData)
//       const successTwo = raiseSuccess(successTwoData)

//       const payload: Result<string[], FailureTest>[] = [successOne, successTwo]

//       //act
//       const {successes, failures} = mapResults(payload)

//       //assert
//       expect(successes).to.deep.equal([successOneData, successTwoData])
//       expect(failures.length).to.eql(0)
//     })
//   })

//   describe('Flatten SuccessVoid', () => {
//     it('Flatten Errors', () => {
//       //setup
//       const failureOne = raiseFailure({
//         message: 'FailureOne',
//         errorType: FailureTest.TestFailure,
//       })
//       const failureTwo = raiseFailure({
//         message: 'FailureTwo',
//         errorType: FailureTest.TestFailure,
//       })

//       const payload: ResultVoid<FailureTest>[] = [failureOne, failureTwo]

//       //act
//       const failures = flatMapSuccessVoidFailures(payload)

//       //assert
//       expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
//     })
//   })
// })
