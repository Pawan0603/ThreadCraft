"use client"

import { useAuth } from "@/components/auth/auth-context"
import { useCallback } from "react"

interface ApiOptions extends RequestInit {
  requireAuth?: boolean
}

export function useApi() {
  const { refreshTokens, logout } = useAuth()

  const apiCall = useCallback(
    async (url: string, options: ApiOptions = {}) => {
      const { requireAuth = false, ...fetchOptions } = options

      // Add authorization header if required
      if (requireAuth) {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No access token available")
        }

        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }

      // Add default headers
      fetchOptions.headers = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      }

      let response = await fetch(url, fetchOptions)

      // Handle token refresh on 401
      if (response.status === 401 && requireAuth) {
        const refreshed = await refreshTokens()
        if (refreshed) {
          // Retry with new token
          const newAccessToken = localStorage.getItem("accessToken")
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${newAccessToken}`,
          }
          response = await fetch(url, fetchOptions)
        } else {
          // Refresh failed, logout user
          logout()
          throw new Error("Authentication failed")
        }
      }

      return response
    },
    [refreshTokens, logout],
  )

  return { apiCall }
}
