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
            <input
              id="password"
              v-model="password"
              type="password"
              class="input w-full"
              placeholder="********"
              autocomplete="current-password"
              required
            />

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