export function getBaseUrl(isClientSide = true, req) {
  if (isClientSide) {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/`;
  }
  if (req) {
    const schema = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const { host } = req.headers;
    return `${schema}://${host}/`;
  }
  return undefined;
}
export function getApiUrl(isClientSide = true, req) {
  const base = getBaseUrl(req, isClientSide);
  return `${base}api/`;
}
