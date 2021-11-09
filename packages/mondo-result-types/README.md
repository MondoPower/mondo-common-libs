# Mondo Result Types

Library to use for result type of typescript functions and helper functions.

## Install

```bash
npm i @mondopower/result-types
```

## Usage

This library consists of two major result types.

### 1) ResultVoid

Used whenever the function will return void in the case of success or failure

```ts
import {raiseFailure, raiseSuccessVoid, ResultVoid} from '@mondopower/result-types'

enum FooErrorType {
  someError= 'someError'
  ...
}

function foo(flag: boolean): ResultVoid<FooErrorType> {
  if (flag)
    return raiseFailure({
      errorType: FooErrorType.someError,
      message: '<my error message>'
    })

  return raiseSuccessVoid()
}

const fooResponse = foo(flag)

if (fooResponse.isErrored)
  // Failure Handling
else
  // success handling
```

### 2) Result


Used whenever the function will return a value/object in the case of success or failure

```ts
import {raiseFailure, raiseSuccess, Result} from '@mondopower/result-types'

enum FooErrorType {
  someError= 'someError'
  ...
}

function foo(flag: boolean): Result<string, FooErrorType> {
  if (flag)
    return raiseFailure({
      errorType: FooErrorType.someError,
      message: '<my error message>'
    })

  return raiseSuccess('success-result')
}

const fooResponse = foo(flag)

if (fooResponse.isErrored)
  // Failure Handling
else {
  // success handling
  const result = fooResponse.data
}
```

## Helpers

This library also includes some helper functions to manage success and failures which all can be found in the [API documentation](https://github.com/MondoPower/mondo-common-libs/docs/packages/mondo-result-types).