// Querystring shim for web
function stringify(obj) {
  if (!obj) return "";
  const params = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

function parse(str) {
  const params = new URLSearchParams(str || "");
  const result = {};
  for (const [key, value] of params.entries()) {
    if (result[key] === undefined) {
      result[key] = value;
    } else if (Array.isArray(result[key])) {
      result[key].push(value);
    } else {
      result[key] = [result[key], value];
    }
  }
  return result;
}

module.exports = {
  stringify,
  parse,
};
