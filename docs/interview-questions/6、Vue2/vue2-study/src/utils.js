export function isFunction(value) {
  return typeof value === 'function'
}

export function isObject(value) {
  return typeof value === 'object' && typeof value !== null
}