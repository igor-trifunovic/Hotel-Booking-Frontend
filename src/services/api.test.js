import { apiFetch, ApiError } from './api';
import { getToken, saveToken } from './token';

function mockResponse({ ok = true, status = 200, body = '' }) {
  return { ok, status, text: () => Promise.resolve(body) };
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  delete global.fetch;
});

test('parses a JSON body', async () => {
  global.fetch.mockResolvedValue(mockResponse({ body: '[{"id":1}]' }));

  await expect(apiFetch('/api/hotels')).resolves.toEqual([{ id: 1 }]);
});

test('returns null for an empty 204 body', async () => {
  global.fetch.mockResolvedValue(mockResponse({ status: 204 }));

  await expect(apiFetch('/api/thing')).resolves.toBeNull();
});

test('sends no Authorization header unless auth is requested', async () => {
  saveToken('abc123');
  global.fetch.mockResolvedValue(mockResponse({ body: '[]' }));

  await apiFetch('/api/hotels');

  expect(global.fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
});

test('attaches the bearer token when auth is requested', async () => {
  saveToken('abc123');
  global.fetch.mockResolvedValue(mockResponse({ body: '[]' }));

  await apiFetch('/api/reservations/me', { auth: true });

  expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer abc123');
});

test('serialises a body and defaults to POST', async () => {
  global.fetch.mockResolvedValue(mockResponse({ body: '{}' }));

  await apiFetch('/api/auth/login', { body: { email: 'a@b.c' } });

  const [, options] = global.fetch.mock.calls[0];
  expect(options.method).toBe('POST');
  expect(options.headers['Content-Type']).toBe('application/json');
  expect(options.body).toBe('{"email":"a@b.c"}');
});

test('throws an ApiError carrying the status and the server message', async () => {
  global.fetch.mockResolvedValue(
    mockResponse({ ok: false, status: 409, body: '{"message":"Room already booked"}' })
  );

  await expect(apiFetch('/api/reservations', { body: {} })).rejects.toMatchObject({
    name: 'ApiError',
    status: 409,
    message: 'Room already booked',
  });
});

test('falls back to a generic message when the error body has none', async () => {
  global.fetch.mockResolvedValue(mockResponse({ ok: false, status: 500, body: '' }));

  await expect(apiFetch('/api/hotels')).rejects.toThrow('Request failed (500).');
});

test('clears the token and announces a 401', async () => {
  saveToken('expired-token');
  global.fetch.mockResolvedValue(mockResponse({ ok: false, status: 401, body: '' }));

  const onUnauthorized = jest.fn();
  window.addEventListener('auth:unauthorized', onUnauthorized);

  await expect(apiFetch('/api/reservations/me', { auth: true })).rejects.toBeInstanceOf(ApiError);

  expect(getToken()).toBeNull();
  expect(onUnauthorized).toHaveBeenCalled();

  window.removeEventListener('auth:unauthorized', onUnauthorized);
});
