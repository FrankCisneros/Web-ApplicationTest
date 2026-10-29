<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, saveSession } from '../services/auth';

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const repassword = ref('')

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const terms = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!terms.value) {
    errorMessage.value = 'No se pudo registrar la cuenta: debes aceptar los términos y condiciones'
    return
  }

  isLoading.value = true

  try {
    const session = await register(name.value, email.value, password.value, repassword.value);
    saveSession(session)
    successMessage.value = 'Registro completado con éxito'

    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "No se pudo registrar la cuenta"
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <section class="flex justify-center px-4 py-16">
    <div class="card w-full max-w-sm bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-center text-2xl font-bold">Crear cuenta</h1>
        <p class="text-center text-sm text-base-content/60">
          Regístrate para comenzar
        </p>

        <form class="mt-2" @submit.prevent="handleRegister">
          <fieldset class="fieldset">
            <label class="label" for="name">Nombre completo</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="input w-full"
              placeholder="Juan Pérez"
              autocomplete="name"
              required
            />

            <label class="label" for="email">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input w-full"
              placeholder="tu@email.com"
              autocomplete="email"
              required
            />

            <label class="label" for="password">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input w-full"
              placeholder="********"
              autocomplete="new-password"
              required
            />

            <label class="label" for="confirm-password">Confirmar contraseña</label>
            <input
              id="confirm-password"
              v-model="repassword"
              type="password"
              class="input w-full"
              placeholder="********"
              autocomplete="new-password"
              required
            />

            <label class="label mt-2 cursor-pointer justify-start gap-2">
              <input v-model="terms" type="checkbox" class="checkbox checkbox-sm" />
              <span class="text-sm">Acepto los términos y condiciones</span>
            </label>

            <div
              v-if="errorMessage"
              role="alert"
              class="alert alert-error justify-center py-2 text-center text-sm"
            >
              {{ errorMessage }}
            </div>

            <div
              v-if="successMessage"
              role="status"
              class="alert alert-success justify-center py-2 text-center text-sm"
            >
              {{ successMessage }}
            </div>

            <button type="submit" class="btn btn-primary mt-4 w-full" :disabled="isLoading">
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>
          </fieldset>
        </form>

        <p class="mt-2 text-center text-sm">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="link link-primary">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </section>
</template>
