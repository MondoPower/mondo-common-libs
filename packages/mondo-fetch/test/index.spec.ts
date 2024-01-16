import {stringify} from 'querystring'
import {expect} from 'chai'
import {describe, it} from 'mocha'
import {FetchClient} from '../src/index'

enum FailureTest {
  TestFailure = 'TestFailure'
}

interface ResponseType {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  thing: string;
}

describe('blah', () => {
  it('blahtry', async () => {
    // arrange
    const client = new FetchClient()

    const payload = stringify({
      client_id: 'capacityEngine.apiClient',
      client_secret: '0l6csZW63ZslJeEccJJl',
      grant_type: 'client_credentials',
      scope: 'mondoapi',
    })

    // act
    const result = await client.post<ResponseType>('https://identity.dev.mondopower.com.au/connect/token', payload)
    if (result.isErrored)
      throw new Error(result.error.message)

    // assert


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
