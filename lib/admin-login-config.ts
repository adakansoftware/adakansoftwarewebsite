const minimumSessionSecretLength = 32

export function hasAdminLoginConfiguration(input: {
  email: string | undefined
  password: string | undefined
  sessionSecret: string | undefined
}) {
  const sessionSecret = input.sessionSecret?.trim() ?? ""

  return Boolean(
    input.email?.trim()
    && input.password?.trim()
    && sessionSecret.length >= minimumSessionSecretLength,
  )
}
