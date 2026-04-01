import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/test-example', () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];

