<template>
  <dialog id="map-modal" class="modal" :open="isOpen">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Editar marcador</h3>
      <div class="py-4">
        <label class="label">
          <span class="label-text">Título</span>
        </label>
        <input
          v-model="newTitle"
          type="text"
          placeholder="Nuevo título"
          class="input input-bordered w-full"
        />
      </div>
      <div class="modal-action">
        <button class="btn" @click="handleCancel" :disabled="isLoading">Cancelar</button>
        <button class="btn btn-primary" @click="handleSave" :disabled="isLoading">Guardar</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleCancel">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const isLoading = ref(false)

const props = defineProps<{
  markerTitle: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  save: [newTitle: string]
  close: []
}>()

const newTitle = ref(props.markerTitle)

watch(
  () => props.markerTitle,
  (value) => {
    newTitle.value = value
  },
)

function handleSave() {
  isLoading.value = true
  emit('save', newTitle.value)
}

function handleCancel() {
  isLoading.value = false
  newTitle.value = props.markerTitle
  emit('close')
}
</script>