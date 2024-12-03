import {generateFetchMock, fetchSpy} from './testHelper';
import {ContentTypes, FetchClient, FetchErrorTypes} from '../src/index';

describe('#FetchClient', () => {
  const stubData = {test: 100};
  const url = 'https://stub-url.com.au/';
  const jsonHeaders = new Headers({'Content-Type': ContentTypes.JSON});


  describe('Client', () => {
    const stubToken = 'stub-token';
    const onBehalfOf = 'stub-user';

    it('Should use a bearer token for a request when it is provided to the class constructor', async () => {
      // arrange
      const client = new FetchClient({authorizationToken: stubToken});
      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);
      const expectedHeaders = jsonHeaders;
      expectedHeaders.set('Authorization', `Bearer ${stubToken}`);

      // act
      await client.get(url);

      // assert
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: expectedHeaders, method: 'GET'}));
    });

    it('Should use an on-behalf of header for a request when it is provided to the class constructor', async () => {
      // arrange
      const client = new FetchClient({onBehalfOf});
      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);
      const body = JSON.stringify({data: 'data'});
      const expectedHeaders = jsonHeaders;
      expectedHeaders.set('X-On-Behalf-Of', onBehalfOf);

      // act
      await client.post(url, {body});

      // assert
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: expectedHeaders, method: 'POST', body}));
    });
  });

  describe('getUrl', () => {
    it('Returns a valid url when there is an invalid url due to extra slashes(/)', async () => {
      // arrange
      const client = new FetchClient({baseUrl: url});
      const providedUrl = '/stub/test';

      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);

      const expectedUrl = `${url}stub/test`;

      // act
      await client.get(providedUrl);

      // assert
      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });

    it('Returns a valid url when there is an invalid url due to missing slashes(/)', async () => {
      // arrange
      const client = new FetchClient({baseUrl: url.substring(0, url.length -1)});
      const providedUrl = 'stub/test';

      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);

      const expectedUrl = `${url}stub/test`;

      // act
      await client.get(providedUrl);

      // assert
      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });

    it('Returns a url there is no base url provided', async () => {
      // arrange
      const client = new FetchClient();
      const providedUrl = `${url}/stub/test`;

      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);

      const expectedUrl = `${url}/stub/test`;

      // act
      await client.get(providedUrl);

      // assert
      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });

    it('Returns a url if there is a path in the base url provided', async () => {
      // arrange
      const client = new FetchClient({baseUrl: `${url}path/`});
      const providedUrl = 'stub/test';

      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);

      const expectedUrl = `${url}path/stub/test`;

      // act
      await client.get(providedUrl);

      // assert
      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });

    it('Returns a url if there is a base url provided and a full url', async () => {
      // arrange
      const client = new FetchClient({baseUrl: `${url}/path`});
      const providedUrl = 'https://stub.com/stub/test';

      const mock = generateFetchMock(stubData);
      fetchSpy.mockImplementation(mock);

      const expectedUrl = providedUrl;

      // act
      await client.get(providedUrl);

      // assert
      expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.anything());
    });
  });

  describe('Requests', () => {
    // top level arrange
    const client = new FetchClient();
    const payload = JSON.stringify({
      client_id: 'stub-client-id',
      client_secret: 'stub-secret',
      grant_type: 'client_credentials',
      scope: 'stub-scope',
    });

    describe('Happy Path', () => {
      it('Should make a make a GET fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.get(url);

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: jsonHeaders, method: 'GET'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });

      it('Should prepend the base url when it is provided to the class constructor', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        const clientWithBaseUrl = new FetchClient({baseUrl: 'https://stub-base-url.com'});
        const path = '/stub/test';

        // act
        const result = await clientWithBaseUrl.get(path);

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith('https://stub-base-url.com/stub/test', expect.objectContaining({headers: jsonHeaders, method: 'GET'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });

      it('Should make a make a POST fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.post(url, {body: payload});

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: jsonHeaders, method: 'POST'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });

      it('Should make a make a fetch request with an x-form content type', async () => {
        // arrange
        const mock = generateFetchMock(stubData, true);
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.post(url, {body: payload, contentType: ContentTypes.XFORM});

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: new Headers({'Content-Type': ContentTypes.XFORM}), method: 'POST'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });

      it('Should be setting the timeout for the request to the value provided by us', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);
        const timeout = 99999;

        const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

        // act
        await client.post(url, {body: payload, timeout});

        // assert
        expect(timeoutSpy).toHaveBeenCalledWith(timeout);
      });

      it('Should use the default timeout if none are provided', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

        // act
        await client.post(url, {body: payload});

        // assert
        expect(timeoutSpy).toHaveBeenCalledWith(30000);
      });

      it('Should invoke a timeout signal for any requests', async () => {
        // arrange
        const abortSpy = jest.spyOn(AbortSignal, 'timeout');
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        // act
        await client.post(url, {body: payload, timeout: 0});

        // assert
        expect(abortSpy).toHaveBeenCalledTimes(1);
      });

      it('Should use the token provided in the request', async () => {
        // arrange
        const stubToken = 'stub-token';
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);
        const expectedHeaders = jsonHeaders;
        expectedHeaders.set('Authorization', `Bearer ${stubToken}`);

        // act
        await client.post(url, {body: payload, authorizationToken: stubToken});

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: expectedHeaders, method: 'POST'}));
      });

      it('Should overwrite a client config token with a token provided in the request', async () => {
        // arrange
        const stubToken = 'stub-token';
        const clientWithAuthToken = new FetchClient({authorizationToken: 'stub-client-token'});
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);
        const expectedHeaders = jsonHeaders;
        expectedHeaders.set('Authorization', `Bearer ${stubToken}`);

        // act
        await clientWithAuthToken.post(url, {body: payload, authorizationToken: stubToken});

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: expectedHeaders, method: 'POST'}));
      });

      it('Should make a make a PUT fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.put(url, {body: payload});

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({body: payload, headers: jsonHeaders, method: 'PUT'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });

      it('Should make a make a DELETE fetch request with the parameters we provide', async () => {
        // arrange
        const mock = generateFetchMock(stubData);
        fetchSpy.mockImplementation(mock);


        // act
        const result = await client.delete(url);

        // assert
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(url, expect.objectContaining({headers: new Headers({'Content-Type': ContentTypes.JSON}), method: 'DELETE'}));
        expect(result).toStrictEqual({isErrored: false, data: stubData});
      });
    });

    describe('Unhappy Path', () => {
      it('Should return a timeout error when the request times out', async () => {
        // arrange
        const mock = jest.fn(() =>
          Promise.reject({
            name: 'AbortError',
            message: 'stub-error-message',
          }),
        ) as jest.Mock;
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.post(url, {body: payload});

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.RequestTimedOut, message: 'The request has reached the maximum duration of 30000 milliseconds, stub-error-message'}});
      });

      it('Should return a fetch error when the response is not ok', async () => {
        // arrange
        const mock = generateFetchMock(stubData, false, {status: 401, statusText: 'Unauthorized'});
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.post(url, {body: payload});

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.FetchError, message: 'The request failed due to Unauthorized'}});
      });

      it('Should return an unknown error when it is not a timeout or fetch error', async () => {
        // arrange
        const mock = jest.fn(() =>
          Promise.reject({
            name: 'stubErrorName',
            message: 'stub-error-message',
          }),
        ) as jest.Mock;
        fetchSpy.mockImplementation(mock);

        // act
        const result = await client.get(url);

        // assert
        expect(result).toStrictEqual({isErrored: true, error: {errorType: FetchErrorTypes.UnknownFailure, message: 'stub-error-message'}});
      });
    });
  });
});
