import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'ADMIN' | 'CLIENT'
    }
  }

  interface User {
    role: 'ADMIN' | 'CLIENT'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'CLIENT'
    id: string
  }
}



