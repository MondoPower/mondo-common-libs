export const jestSpy = jest.spyOn(global, 'fetch')

afterEach(() => {
  jestSpy.mockRestore()
})

export function generateFetchMock(response: Record<any, any>, isOk = true) {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(response),
      ok: isOk,
    }),
  ) as jest.Mock
}
