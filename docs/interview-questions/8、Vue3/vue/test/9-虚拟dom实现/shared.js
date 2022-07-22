function isObject(value) {
  return typeof value === "object" && value !== null;
}

function isFunction(value) {
  return typeof value === "function";
}

function isString(value) {
  return typeof value === "string";
}

function isArray(value) {
  return Array.isArray(value);
}

function isNumber(value) {
  return typeof value === "number";
}
