<script setup lang="ts">
import { ref, watch } from 'vue'
import MapView from '../components/mapview.vue'
import type { MapMarker } from '../types/marker'

const STORAGE_KEY = 'geotrack-markers'

const defaultMarkers: MapMarker[] = [
  {
    id: '1',
    title: 'Mi casa',
    description: 'Punto de referencia',
    latitude: 13.6929,
    longitude: -89.2182,
    color: '#ef4444',
  },
  {
    id: '2',
    title: 'Lugar de interés',
    description: 'Otro punto en el mapa',
    latitude: 13.7012,
    longitude: -89.2245,
    color: '#3b82f6',
  },
]

function loadMarkers(): MapMarker[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return defaultMarkers

    const parsed: unknown = JSON.parse(stored)

    if (!Array.isArray(parsed)) return defaultMarkers

    // Validación básica de los datos recuperados.
    return parsed.filter((item): item is MapMarker => {
      return (
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.latitude === 'number' &&
        Number.isFinite(item.latitude) &&
        item.latitude >= -90 &&
        item.latitude <= 90 &&
        typeof item.longitude === 'number' &&
        Number.isFinite(item.longitude) &&
        item.longitude >= -180 &&
        item.longitude <= 180 &&
        typeof item.color === 'string'
      )
    })
  } catch {
    return defaultMarkers
  }
}

const markers = ref<MapMarker[]>(loadMarkers())

watch(
  markers,
  (newMarkers) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(newMarkers),
    )
  },
  { deep: true },
)

function handleMarkerMoved(payload: {
  id: string
  latitude: number
  longitude: number
}) {
  const marker = markers.value.find(
    item => item.id === payload.id,
  )

  if (!marker) return

  marker.latitude = payload.latitude
  marker.longitude = payload.longitude
}

function addMarker() {
  markers.value.push({
    id: crypto.randomUUID(),
    title: `Nuevo marcador ${markers.value.length + 1}`,
    description: 'Puedes editar esta ubicación más adelante.',
    latitude: 13.6929,
    longitude: -89.2182,
    color: '#22c55e',
  })
}

function removeMarker(id: string) {
  markers.value = markers.value.filter(
    marker => marker.id !== id,
  )
}
</script>

<template>
  <main class="flex h-screen flex-col bg-base-200">
    <header class="navbar bg-base-100 px-6 shadow-sm">
      <div class="flex-1">
        <h1 class="text-xl font-bold">GeoTrack</h1>
      </div>

      <div class="badge badge-primary">
        {{ markers.length }} ubicaciones
      </div>
    </header>

    <div class="flex min-h-0 flex-1 flex-col gap-4 p-4 md:flex-row">
      <!-- Panel lateral -->
      <aside class="w-full shrink-0 rounded-box bg-base-100 p-4 md:w-80">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Mis ubicaciones
          </h2>

          <button
            class="btn btn-primary btn-sm"
            @click="addMarker"
          >
            + Añadir
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <article
            v-for="marker in markers"
            :key="marker.id"
            class="card border border-base-300 bg-base-100"
          >
            <div class="card-body flex-row items-center justify-between p-3">
              <div class="min-w-0">
                <h3 class="truncate font-semibold">
                  {{ marker.title }}
                </h3>

                <p class="text-xs text-base-content/60">
                  {{ marker.latitude.toFixed(5) }},
                  {{ marker.longitude.toFixed(5) }}
                </p>
              </div>

              <button
                class="btn btn-ghost btn-sm text-error"
                aria-label="Eliminar marcador"
                @click="removeMarker(marker.id)"
              >
                Eliminar
              </button>
            </div>
          </article>
        </div>
      </aside>

      <!-- Mapa -->
      <section class="min-h-0 min-w-0 flex-1 overflow-hidden rounded-box bg-base-100">
        <MapView
          :markers="markers"
          @marker-moved="handleMarkerMoved"
        />
      </section>
    </div>
  </main>
</template>