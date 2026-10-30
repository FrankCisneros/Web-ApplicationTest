<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MapView from '../components/mapview.vue'
import type { MapMarker } from '../types/marker'
import { createMarker, loadMarkers, updateMarker, deleteMarker } from '../services/marker' 
import { getUser } from '../services/auth'
import MapModal from '../components/mapmodal.vue'

const markers = ref<MapMarker[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const editingMarkerId = ref<string | null>(null)
const isModalOpen = ref(false)

const currentUser = getUser()

function describeError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

async function fetchMarkers() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    markers.value = await loadMarkers()
  } catch (error) {
    errorMessage.value = describeError(
      error,
      'No se pudieron cargar los marcadores',
    )
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMarkers)

async function handleMarkerMoved(payload: {
  id: string
  latitude: number
  longitude: number
}) {
  const marker = markers.value.find(
    item => item.id === payload.id,
  )

  if (!marker) return

  try{
    await updateMarker(marker.id, {
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
  } catch (error) {
    errorMessage.value = describeError(
      error,
      'No se pudo actualizar el marcador',
    )
  }
}

async function addMarker() {
  if (isSaving.value) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    const marker = await createMarker({
      title: `Nuevo marcador ${markers.value.length + 1}`,
      description: 'Puedes editar esta ubicación más adelante.',
      latitude: 13.6929,
      longitude: -89.2182,
      color: '#22c55e',
    })

    markers.value = [...markers.value, marker]
  } catch (error) {
    errorMessage.value = describeError(
      error,
      'No se pudo crear el marcador',
    )
  } finally {
    isSaving.value = false
  }
}

async function removeMarker(id: string) {
  try {
    await deleteMarker(id)
    markers.value = markers.value.filter(
      marker => marker.id !== id,
    )
  } catch (error) {
    errorMessage.value = describeError(
      error,
      'No se pudo eliminar el marcador',
    )
  }
}

async function openEditModal(id: string) {
  editingMarkerId.value = id
  isModalOpen.value = true
}

async function handleSaveTitle(newTitle: string) {
  if (!editingMarkerId.value) return

  try {
    await updateMarker(editingMarkerId.value, {
      title: newTitle,
    })

    const markerIndex = markers.value.findIndex(
      m => m.id === editingMarkerId.value,
    )
    if (markerIndex !== -1) {
      markers.value[markerIndex].title = newTitle
    }

    isModalOpen.value = false
    editingMarkerId.value = null
  } catch (error) {
    errorMessage.value = describeError(
      error,
      'No se pudo actualizar el título',
    )
  }
}

function handleCloseModal() {
  isModalOpen.value = false
  editingMarkerId.value = null
}

</script>

<template>
  <main class="flex h-screen flex-col bg-base-200">
    <header class="navbar bg-base-100 px-6 shadow-sm">
      <div class="flex-1">
        <div class="avatar placeholder">
          <div class="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
            <span class="text-xl font-bold leading-none">
              {{ currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U' }}
            </span>
          </div>
        </div>

        {{ currentUser ? currentUser.name : 'Usuario' }}
      </div>

      <div class="badge badge-primary">
        {{ markers.length }} ubicaciones
      </div>
    </header>

    <div
      v-if="errorMessage"
      class="alert alert-error mx-4 mt-4"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-4 p-4 md:flex-row">
      <!-- Panel lateral -->
      <aside class="w-full shrink-0 rounded-box bg-base-100 p-4 md:w-80">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Mis ubicaciones
          </h2>

          <button
            class="btn btn-primary btn-sm"
            :disabled="isSaving"
            @click="addMarker"
          >
            + Añadir
          </button>
        </div>

        <div
          v-if="isLoading"
          class="flex justify-center py-6"
        >
          <span class="loading loading-spinner loading-md" />
        </div>

        <div
          v-else
          class="flex flex-col gap-2"
        >
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
                class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                aria-label="Editar marcador"
                title="Editar"
                @click="openEditModal(marker.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
              </button>

              <!-- Eliminar -->
              <button
                class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Eliminar marcador"
                title="Eliminar"
                @click="removeMarker(marker.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="m19 6-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
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

    <!-- Modal de edición -->
    <MapModal
      v-if="editingMarkerId"
      :marker-title="markers.find(m => m.id === editingMarkerId)?.title || ''"
      :is-open="isModalOpen"
      @save="handleSaveTitle"
      @close="handleCloseModal"
    />
  </main>
</template>