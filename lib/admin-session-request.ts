export function getAdminSessionMutationRequestError(
  request: Request,
  isAllowedOrigin: (request: Request) => boolean,
) {
  return isAllowedOrigin(request) ? null : 403
}
