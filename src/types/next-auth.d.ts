import NextAuth from "next-auth"
import { UserRole, Persona } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      persona?: Persona
    }
  }

  interface User {
    id: string
    role: UserRole
    persona?: Persona
  }
}
