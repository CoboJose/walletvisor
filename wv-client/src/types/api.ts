export type ApiError = {
  code: string,
  debug: string
  message: string,
}

export type LoginResponse = {
  tokenExpiresInMinutes: number,
  refreshToken: string,
  role: string,
  token: string
}
