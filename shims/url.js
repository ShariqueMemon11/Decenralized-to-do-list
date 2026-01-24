// URL shim for web - uses browser URL API
const URL = globalThis.URL;
const URLSearchParams = globalThis.URLSearchParams;

function parse(urlString, parseQueryString, slashesDenoteHost) {
  try {
    const url = new URL(urlString);
    return {
      protocol: url.protocol,
      slashes: true,
      auth: url.username || url.password ? `${url.username}:${url.password}` : null,
      host: url.host,
      hostname: url.hostname,
      hash: url.hash,
      search: url.search,
      query: parseQueryString ? Object.fromEntries(url.searchParams) : url.searchParams.toString(),
      pathname: url.pathname,
      path: url.pathname + url.search,
      href: url.href,
    };
  } catch (e) {
    return {
      protocol: null,
      slashes: null,
      auth: null,
      host: null,
      hostname: null,
      hash: null,
      search: null,
      query: null,
      pathname: null,
      path: null,
      href: urlString,
    };
  }
}

function format(urlObject) {
  if (typeof urlObject === 'string') {
    return urlObject;
  }
  const parts = [];
  if (urlObject.protocol) parts.push(urlObject.protocol);
  if (urlObject.slashes || urlObject.protocol) parts.push('//');
  if (urlObject.auth) parts.push(urlObject.auth + '@');
  if (urlObject.host) parts.push(urlObject.host);
  if (urlObject.pathname) parts.push(urlObject.pathname);
  if (urlObject.search) parts.push(urlObject.search);
  if (urlObject.hash) parts.push(urlObject.hash);
  return parts.join('');
}

function resolve(from, to) {
  try {
    return new URL(to, from).href;
  } catch (e) {
    return to;
  }
}

module.exports = {
  URL,
  URLSearchParams,
  parse,
  format,
  resolve,
  default: { URL, URLSearchParams, parse, format, resolve },
};

