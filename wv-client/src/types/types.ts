export type ApiError = {
  code: string,
  debug: string
  message: string,
}

export type AuthResponse = {
  tokenExpiresInMinutes: number,
  refreshToken: string,
  role: string,
  token: string
}
