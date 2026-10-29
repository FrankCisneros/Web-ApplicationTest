import { computed, ref } from 'vue'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export async function register(name: string, email: string, password: string, repassword: string): Promise<AuthSession> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, repassword })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? 'No se puede registrar')
  }

  return data as AuthSession
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? 'No se pudo iniciar sesión')
  }

  return data as AuthSession
}

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user')

  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

const currentUser = ref<AuthUser | null>(readStoredUser())

export const isAuthenticated = computed(
  () => currentUser.value !== null && hasValidSession()
)

export function saveSession(session: AuthSession): void {
  localStorage.setItem('token', session.token)
  localStorage.setItem('user', JSON.stringify(session.user))
  currentUser.value = session.user
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.exp !== 'number') return false
    return payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

export function hasValidSession(): boolean {
  const token = getToken()

  if (!token || token === 'undefined' || token === 'null') return false

  if (isTokenExpired(token)) {
    logout()
    return false
  }

  return true
}

export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentUser.value = null
}
