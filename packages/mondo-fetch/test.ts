import { stringify } from "querystring"
console.log(stringify) // TODO: Delete
 
 async function doThing(): Promise<any> {

    // const url = 'https://identity.nonprod.selectlive.selectronic.com.au/connect/token'
    // const method = 'POST'
    // const payload = stringify({
    //         client_id: "selectronicapi.mvc.client",
    //         client_secret: "IweMzEAHlcT22UwfYRXI",
    //         grant_type: "password",
    //         scope: "openid profile selectronicapi",
    //         username: "mondoubidevelopers@mondo.com.au",
    //         password: "a68rc%re9a3t0r",
    // })
    // const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    // const headers = {'Content-Type': 'application/json; charset=utf-8'}
  try {
//  const result = await fetch(url, {method, headers, body: payload})
  const body = JSON.stringify({email: 'sydney@fife'})
  const method = 'POST'
  const request: Request = new Request("https://reqres.in/register", {body, method})
  const response = await fetch(request) // Retrieve its body as ReadableStream
  .then((response) => response.body)
  .then((body) => {
    const reader = body?.getReader();
    // …
    const blah = reader?.read()
    blah?.then(x => {
      console.log('THIS IS A THING')
      
    var string = new TextDecoder().decode(x.value)
      console.log('string:', string) // TODO: Delete
    
    })
  });
 
  console.log('response:', response) // TODO: Delete

  }catch(e){
    console.log('e:', e) // TODO: Delete
    console.log(e) // TODO: Delete
  }

 }

 doThing()


// function isTimeoutError(error: unknown): error is AbortError {
//   console.log('Checking if it is a timeout error') // TODO: Delete
//   console.log('error:', error) // TODO: Delete
//   if (typeof error !== 'object' || !error)
//     return false

//   const typedError = error as AbortError
//   return typedError.name === 'AbortError'
// }
