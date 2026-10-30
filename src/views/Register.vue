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

const showPassword = ref(false)
const showRepassword = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!terms.value) {
    errorMessage.value = 'No se pudo registrar la cuenta: debes aceptar los términos y condiciones'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido'
    return
  }

  if (password.value !== repassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (!/[A-Z]/.test(password.value)) {
    errorMessage.value = 'La contraseña debe contener al menos una mayúscula'
    return
  }

  if (!/[a-z]/.test(password.value)) {
    errorMessage.value = 'La contraseña debe contener al menos una minúscula'
    return
  }

  if (!/[0-9]/.test(password.value)) {
    errorMessage.value = 'La contraseña debe contener al menos un número'
    return
  }

  if (!/[!@#$%^&*(),.?&quot;:{}|<>]/.test(password.value)) {
    errorMessage.value = 'La contraseña debe contener al menos un carácter especial'
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
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input w-full pr-10"
                placeholder="********"
                autocomplete="new-password"
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
            <ul class="mt-1 text-xs text-base-content/60">
              <li :class="{ 'text-success': password.length >= 8 }">• Mínimo 8 caracteres</li>
              <li :class="{ 'text-success': /[A-Z]/.test(password) }">• Al menos una mayúscula</li>
              <li :class="{ 'text-success': /[a-z]/.test(password) }">• Al menos una minúscula</li>
              <li :class="{ 'text-success': /[0-9]/.test(password) }">• Al menos un número</li>
              <li :class="{ 'text-success': /[!@#$%^&*(),.?&quot;:{}|<>]/.test(password) }">• Al menos un carácter especial</li>
            </ul>

            <label class="label" for="confirm-password">Confirmar contraseña</label>
            <div class="relative">
              <input
                id="confirm-password"
                v-model="repassword"
                :type="showRepassword ? 'text' : 'password'"
                class="input w-full pr-10"
                placeholder="********"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2"
                @click="showRepassword = !showRepassword"
              >
                <svg v-if="showRepassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>

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
