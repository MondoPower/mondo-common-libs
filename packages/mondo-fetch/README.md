This package represents an http client library to perform http requests with interceptors, redaction etc.

# Usage #
const client = new FetchClient({authorizationToken, baseUrl})
const result = await client.get('urlpath')

If an error occurred the result will contain an isErrored = true and an error property including a type and a message
if (result.isErrored)
  console.log(result.error.errorType, result.error.message)

otherwise the result will contain the data property

console.log(result.data)