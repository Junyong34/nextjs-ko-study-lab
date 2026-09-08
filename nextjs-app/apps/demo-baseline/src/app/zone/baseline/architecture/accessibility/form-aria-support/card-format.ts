export function inspectCardFormat(value: string) {
  const digits = value.replace(/[ -]/g, '')
  return { digitCount: value.replace(/[^0-9]/g, '').length, valid: /^[0-9]{16}$/.test(digits) }
}
