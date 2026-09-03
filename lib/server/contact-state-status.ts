export function getSafeContactStateError(input: { available: boolean }) {
  return input.available ? null : "Contact state is unavailable"
}
