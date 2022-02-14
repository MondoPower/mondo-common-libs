import {Failure, Success, SuccessVoid, Result, ResultVoid, ResultArray, ErrorType, CustomError} from './types'
export * from './types'

export const raiseSuccess = <T>(data: T): Success<T> => ({isErrored: false, data})
export const raiseSuccessVoid = (): SuccessVoid => ({isErrored: false})
export const raiseFailure = <T extends ErrorType>(e: CustomError<T>): Failure<T> => ({isErrored: true, error: e})

export function flatMapSuccesses<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): Data[] {
  return inputs
    .filter((x) => !x.isErrored)
    .flatMap(x => {
      const success = x as Success<Data>
      return success.data
    })
}

export function splitSuccesses<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): Data[] {
  return inputs
    .filter((x) => !x.isErrored)
    .map(x => {
      const success = x as Success<Data>
      return success.data
    })
}

export function flatMapSuccessVoidFailures<Errors extends ErrorType>(inputs: ResultVoid<Errors>[]): CustomError<Errors>[] {
  return inputs
    .filter((x) => x.isErrored)
    .flatMap(x => {
      const failure = x as Failure<Errors>
      return failure.error
    })
}

export function flatMapFailures<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): CustomError<Errors>[] {
  return inputs
    .filter((x) => x.isErrored)
    .flatMap(x => {
      const failure = x as Failure<Errors>
      return failure.error
    })
}

export function splitFailures<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): CustomError<Errors>[] {
  return inputs
    .filter((x) => x.isErrored)
    .map(x => {
      const failure = x as Failure<Errors>
      return failure.error
    })
}

export function flatMapResults<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): ResultArray<Data, Errors> {
  const failures = flatMapFailures(inputs)
  const successes = flatMapSuccesses(inputs)
  return {
    failures,
    successes,
  }
}

export function splitResults<Data, Errors extends ErrorType>(inputs: Result<Data, Errors>[]): ResultArray<Data, Errors> {
  const failures = splitFailures(inputs)
  const successes = splitSuccesses(inputs)
  return {
    failures,
    successes,
  }
}
