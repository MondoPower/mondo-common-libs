import {expect} from '../../testing/test_helper'
import {flatMapResults, flatMapSuccessVoidFailures, raiseFailure, raiseSuccess, Result, ResultVoid} from '..'

enum FailureTest {
    TestFailure = 'TestFailure'
}

describe('#ResultHandling', () => {
  describe('Flatten Results', () => {
    it('Multiple success and failures', () => {
      //setup
      const successOneString = 'one'
      const successTwoString = 'two'
      const successOne = raiseSuccess(successOneString)
      const successTwo = raiseSuccess(successTwoString)
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure
      })
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure
      })

      const payload: Result<string, FailureTest>[] = [successOne, successTwo, failureOne, failureTwo]

      //act
      const {successes, failures} = flatMapResults(payload)

      //assert
      expect(successes).to.deep.equal([successOneString, successTwoString])
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
    })

    it('No success and multiple failures', () => {
    //setup
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure
      })
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure
      })

      const payload: Result<string, FailureTest>[] = [failureOne, failureTwo]

      //act
      const {successes, failures} = flatMapResults(payload)

      //assert
      expect(successes.length).to.eql(0)
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
    })

    it('Multiple success and no failures', () => {
      //setup
      const successOneString = 'one'
      const successTwoString = 'two'
      const successOne = raiseSuccess(successOneString)
      const successTwo = raiseSuccess(successTwoString)

      const payload: Result<string, FailureTest>[] = [successOne, successTwo]

      //act
      const {successes, failures} = flatMapResults(payload)

      //assert
      expect(successes).to.deep.equal([successOneString, successTwoString])
      expect(failures.length).to.eql(0)
    })
  })

  describe('Flatten SuccessVoid', () => {
    it('Flatten Errors', () => {
      //setup
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure
      })
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure
      })

      const payload: ResultVoid<FailureTest>[] = [failureOne, failureTwo]

      //act
      const failures = flatMapSuccessVoidFailures(payload)

      //assert
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error])
    })
  })
})
