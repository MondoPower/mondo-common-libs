import {expect} from 'chai';
import {describe, it} from 'mocha';
import {raiseFailure, raiseSuccess, Result, ResultVoid, mapResults, flatMapSuccessVoidFailures} from '../src';

enum FailureTest {
  TestFailure = 'TestFailure'
}

describe('#ResultHandling', () => {

  describe('Map Results', () => {
    it('Multiple success and failures', () => {
      //setup
      const successOneData = ['one'];
      const successTwoData = ['two', '2'];
      const successOne = raiseSuccess(successOneData);
      const successTwo = raiseSuccess(successTwoData);
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure,
      });
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure,
      });

      const payload: Result<string[], FailureTest>[] = [successOne, successTwo, failureOne, failureTwo];

      //act
      const {successes, failures} = mapResults(payload);

      //assert
      expect(successes).to.deep.equal([successOneData, successTwoData]);
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error]);
    });

    it('No success and multiple failures', () => {
    //setup
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure,
      });
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure,
      });

      const payload: Result<string, FailureTest>[] = [failureOne, failureTwo];

      //act
      const {successes, failures} = mapResults(payload);

      //assert
      expect(successes.length).to.eql(0);
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error]);
    });

    it('Multiple success and no failures', () => {
      //setup
      const successOneData = ['one'];
      const successTwoData = ['two', '2'];
      const successOne = raiseSuccess(successOneData);
      const successTwo = raiseSuccess(successTwoData);

      const payload: Result<string[], FailureTest>[] = [successOne, successTwo];

      //act
      const {successes, failures} = mapResults(payload);

      //assert
      expect(successes).to.deep.equal([successOneData, successTwoData]);
      expect(failures.length).to.eql(0);
    });
  });

  describe('Flatten SuccessVoid', () => {
    it('Flatten Errors', () => {
      //setup
      const failureOne = raiseFailure({
        message: 'FailureOne',
        errorType: FailureTest.TestFailure,
      });
      const failureTwo = raiseFailure({
        message: 'FailureTwo',
        errorType: FailureTest.TestFailure,
      });

      const payload: ResultVoid<FailureTest>[] = [failureOne, failureTwo];

      //act
      const failures = flatMapSuccessVoidFailures(payload);

      //assert
      expect(failures).to.deep.equal([failureOne.error, failureTwo.error]);
    });
  });
});
