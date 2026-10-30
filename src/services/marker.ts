import { getToken } from './auth'
import type { MapMarker } from '../types/marker'

export interface MarkerInput {
  title: string
  description: string
  latitude: number
  longitude: number
  color: string
}

export type MarkerChanges = Partial<MarkerInput>

const BASE_PATH = '/api/markers'

function authHeaders(json: boolean): Record<string, string> {
  const token = getToken()

  if (!token) {
    throw new Error('Necesitás iniciar sesión para administrar tus marcadores')
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` }

  if (json) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

async function throwRequestError(response: Response): Promise<never> {
  let message = 'No se pudo completar la operación'

  try {
    const data = (await response.json()) as { message?: unknown }

    if (typeof data?.message === 'string') {
      message = data.message
    }
  } catch {
    // La respuesta no traía JSON, se usa el mensaje por defecto
  }

  throw new Error(message)
}

export async function loadMarkers(): Promise<MapMarker[]> {
  const response = await fetch(BASE_PATH, { headers: authHeaders(false) })

  if (!response.ok) {
    return throwRequestError(response)
  }

  const data = (await response.json()) as { markers: MapMarker[] }

  return data.markers
}

export async function getMarker(id: string): Promise<MapMarker> {
  const response = await fetch(`${BASE_PATH}/${encodeURIComponent(id)}`, {
    headers: authHeaders(false),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  const data = (await response.json()) as { marker: MapMarker }

  return data.marker
}

export async function createMarker(marker: MarkerInput): Promise<MapMarker> {
  const response = await fetch(BASE_PATH, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(marker),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  const data = (await response.json()) as { marker: MapMarker }

  return data.marker
}

export async function updateMarker(id: string, changes: MarkerChanges): Promise<MapMarker> {
  const response = await fetch(`${BASE_PATH}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: authHeaders(true),
    body: JSON.stringify(changes),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  const data = (await response.json()) as { marker: MapMarker }

  return data.marker
}

export async function deleteMarker(id: string): Promise<void> {
  const response = await fetch(`${BASE_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }
}
