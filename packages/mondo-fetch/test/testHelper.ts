
export let fetchSpy: jest.SpyInstance<Promise<Response>>

beforeEach(() => {
  fetchSpy = jest.spyOn(global, 'fetch')
})

afterEach(() => {
  jest.clearAllMocks()
})

export const consoleErrorStub = jest.spyOn(console, 'error')

export function generateFetchMock(response: Record<any, any>, isOk = true, additionalParams?: Record<any, any>) {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(response),
      ok: isOk,
      ...additionalParams,
    }),
  ) as jest.Mock
}
