"use client"

import type React from "react"
import type { ReactNode } from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session or use mock user
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Use mock user by default
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login logic
    if (email === mockUser.email && password === "password") {
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/sign-in")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

