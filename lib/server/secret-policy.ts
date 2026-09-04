const minimumSecretLength = 32

export function hasMinimumSecretLength(value: string | undefined) {
  return Boolean(value?.trim() && value.trim().length >= minimumSecretLength)
}
