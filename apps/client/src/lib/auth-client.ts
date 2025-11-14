import { createAuthClient } from 'better-auth/react'
import { getAuthBaseUrl } from './api-client'

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  fetchOptions: {
    credentials: 'include',
  },
})
