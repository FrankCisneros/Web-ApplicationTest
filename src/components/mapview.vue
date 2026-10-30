<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import L from 'leaflet'
import type { MapMarker } from '../types/marker'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  markers: MapMarker[]
}>()

const emit = defineEmits<{
  markerMoved: [
    payload: {
      id: string
      latitude: number
      longitude: number
    }
  ]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)

let map: L.Map | null = null

const leafletMarkers = new Map<string, L.Marker>()

function createPopup(marker: MapMarker): HTMLElement {
  const container = document.createElement('div')
  const title = document.createElement('strong')
  const description = document.createElement('p')

  // textContent evita interpretar los datos como HTML.
  title.textContent = marker.title
  description.textContent = marker.description

  container.append(title, description)

  return container
}

function createMarker(marker: MapMarker) {
  if (!map) return

  const leafletMarker = L.marker(
    [marker.latitude, marker.longitude],
    { draggable: true },
  )

  leafletMarker.bindPopup(createPopup(marker))

  leafletMarker.on('dragend', () => {
    const position = leafletMarker.getLatLng()

    emit('markerMoved', {
      id: marker.id,
      latitude: position.lat,
      longitude: position.lng,
    })
  })

  leafletMarker.addTo(map)

  leafletMarkers.set(marker.id, leafletMarker)
}

function syncMarkers() {
  if (!map) return

  const currentIds = new Set(props.markers.map(marker => marker.id))

  // Eliminar marcadores que ya no existen.
  for (const [id, leafletMarker] of leafletMarkers) {
    if (!currentIds.has(id)) {
      leafletMarker.remove()
      leafletMarkers.delete(id)
    }
  }

  // Crear o actualizar marcadores.
  for (const marker of props.markers) {
    const existingMarker = leafletMarkers.get(marker.id)

    if (existingMarker) {
      existingMarker.setLatLng([
        marker.latitude,
        marker.longitude,
      ])

      existingMarker.setPopupContent(createPopup(marker))
    } else {
      createMarker(marker)
    }
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  // Cargar posición y zoom guardados
  const savedCenter = localStorage.getItem('mapCenter')
  const savedZoom = localStorage.getItem('mapZoom')

  const initialCenter: [number, number] = savedCenter
    ? JSON.parse(savedCenter)
    : [13.6929, -89.2182]
  const initialZoom = savedZoom ? parseInt(savedZoom, 10) : 13

  map = L.map(mapContainer.value).setView(initialCenter, initialZoom)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  map.on('moveend', () => {
    if (!map) return
    const center = map.getCenter()
    localStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]))
  })

  map.on('zoomend', () => {
    if (!map) return
    localStorage.setItem('mapZoom', map.getZoom().toString())
  })

  syncMarkers()
})

watch(
  () => props.markers,
  syncMarkers,
  { deep: true },
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
  leafletMarkers.clear()
})

function getMapCenter(): { lat: number; lng: number } | null {
  if (!map) return null
  const center = map.getCenter()
  return { lat: center.lat, lng: center.lng }
}

defineExpose({
  getMapCenter,
})
</script>

<template>
  <div
    ref="mapContainer"
    class="h-full w-full rounded-box"
  />
</template>