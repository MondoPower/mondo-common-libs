const timeout = 1

async function doThing() {
  // const baseFetchRequest = {signal: AbortSignal.timeout(timeout)}

  const result = await fetch('https://blah.com.au')
  console.log('result:', result) // TODO: Delete
}

doThing()
.then((thing) => console.log(thing))
.catch((e) => {console.log(e)})
