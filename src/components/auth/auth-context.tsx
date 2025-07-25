"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  isEmailVerified: boolean
  createdAt: Date
}

interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshTokens: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved tokens on initial load
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (accessToken) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else if (response.status === 401) {
            // Try to refresh tokens
            const refreshed = await refreshTokens()
            if (!refreshed) {
              // Clear invalid tokens
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
            }
          }
        } catch (error) {
          console.error("Auth initialization error:", error)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("accessToken", data.tokens.accessToken)
        localStorage.setItem("refreshToken", data.tokens.refreshToken)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("accessToken", data.tokens.accessToken)
        localStorage.setItem("refreshToken", data.tokens.refreshToken)
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: data.error || "Registration failed" }
      }
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const refreshTokens = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) return false

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("accessToken", data.tokens.accessToken)
        localStorage.setItem("refreshToken", data.tokens.refreshToken)
        return true
      } else {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    // Call logout endpoint (optional, for server-side cleanup)
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshTokens }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
