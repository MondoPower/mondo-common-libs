import {stringify} from 'querystring'
import {generateFetchMock, jestSpy} from './testHelper'
import {ContentTypes, FetchClient} from '../src/index'

describe('Post', () => {
  describe('Happy Path', () => {
    it('When we call the post method on our client, it should make a fetch post request with our input parameters', async () => {
    // arrange
      const stubData = {test: 100}
      const mock = generateFetchMock(stubData)
      jestSpy.mockImplementation(mock)

      const client = new FetchClient()
      const payload = stringify({
        client_id: 'stub-client-id',
        client_secret: 'stub-secret',
        grant_type: 'client_credentials',
        scope: 'stub-scope',
      })

      const url = 'https://stub-url.com.au'

      // act
      const result = await client.post(url, payload, {contentType: ContentTypes.XFORM})


      // assert
      expect(jestSpy).toHaveBeenCalledTimes(1)
      expect(jestSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: {'Content-Type': ContentTypes.XFORM}, method: 'POST'}))
      expect(result).toStrictEqual({isErrored: false, data: stubData})
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
