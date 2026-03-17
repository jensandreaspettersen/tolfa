'use client'

import { CURRENT_MEMBER } from './mock-data'
import type { Member } from './types'

const KEY = 'tolfa_mock_user'

export function login(_email: string, _password: string): Member {
  // In the POC any credentials work — return the mock member
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(CURRENT_MEMBER))
  }
  return CURRENT_MEMBER
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY)
  }
}

export function getSession(): Member | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as Member } catch { return null }
}
