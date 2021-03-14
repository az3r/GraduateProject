import cookie from 'cookie';

export function parseCookies(req) {
  const cookies = req.headers.cookie;
  return cookie.parse(cookies || '');
}
