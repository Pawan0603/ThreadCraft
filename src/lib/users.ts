import axios from "axios"
import type { User } from "./types"

// Mock users database
const users: User[] = [
  {
    _id: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    _id: "user2",
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
    _id: `user${users.length + 1}`,
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

export async function getAllUsers(accessToken: string): Promise<User[]> {
  // return users
  try {
    const res = await axios.get<{ users: User[] }>("/api/users",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    console.log("Fetched all users:", res.data)
    return res.data.users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}
