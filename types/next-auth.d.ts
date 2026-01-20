import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'ADMIN' | 'CLIENT' | 'CONDUCTEUR'
    }
  }

  interface User {
    role: 'ADMIN' | 'CLIENT' | 'CONDUCTEUR'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'CLIENT' | 'CONDUCTEUR'
    id: string
  }
}



