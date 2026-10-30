<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, saveSession } from '../services/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showPassword = ref(false)

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const session = await login(email.value, password.value)
    saveSession(session)
    successMessage.value = 'Inicio de sesión correcto'

    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push('/')
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No se pudo iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="flex justify-center px-4 py-16">
    <div class="card w-full max-w-sm bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-center text-2xl font-bold">Bienvenido</h1>
        <p class="text-center text-sm text-base-content/60">
          Inicia sesión en tu cuenta
        </p>

        <form class="mt-2" @submit.prevent="handleLogin">
          <fieldset class="fieldset">
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
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input w-full pr-10"
                placeholder="********"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>

            <div class="flex justify-end">
              <a href="#" class="link link-hover text-sm">¿Olvidaste tu contraseña?</a>
            </div>

            <div
              v-if="errorMessage"
              role="alert"
              class="alert alert-error justify-center py-2 text-center text-sm">
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
              {{ isLoading ? 'Ingresando...' : 'Iniciar sesión' }}
            </button>
          </fieldset>
        </form>

        <p class="mt-2 text-center text-sm">
          ¿No tienes cuenta?
          <router-link to="/register" class="link link-primary">Regístrate</router-link>
        </p>
      </div>
    </div>
  </section>
</template>