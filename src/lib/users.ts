import type { User } from "./types"

// Mock users database
const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-02-20T14:45:00Z",
  },
]

// Mock user credentials (in a real app, passwords would be hashed)
const userCredentials: Record<string, string> = {
  "john@example.com": "password123",
  "jane@example.com": "password123",
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function validateCredentials(email: string, password: string): boolean {
  return userCredentials[email] === password
}

export function createUser(name: string, email: string, password: string): User {
  // Check if user already exists
  if (getUserByEmail(email)) {
    throw new Error("User with this email already exists")
  }

  // Create new user
  const newUser: User = {
    id: `user${users.length + 1}`,
    name,
    email,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date().toISOString(),
  }

  // In a real app, we would hash the password and store in a database
  userCredentials[email] = password
  users.push(newUser)

  return newUser
}

export function getAllUsers(): User[] {
  return users
}
