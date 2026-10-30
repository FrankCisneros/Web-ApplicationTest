<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../services/auth'

const router = useRouter()
const currentTheme = ref('light')

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
})

async function handleLogout() {
  logout()
  await router.push('/login')
}

const setTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  currentTheme.value = theme
}
</script>

<template>
  <header class="navbar bg-base-100 px-4 shadow-sm lg:px-8">
    <div class="navbar-start">
      <router-link to="/" class="px-2 text-lg font-bold sm:text-xl">
        <!-- No requerido -->
      </router-link>
    </div>

    <div class="navbar-end gap-2">
      <template v-if="isAuthenticated">
        <button type="button" class="btn btn-error btn-sm" @click="handleLogout">
          Cerrar sesión
        </button>
      </template>

      <template v-else>
        <router-link to="/login" class="btn btn-ghost btn-sm hidden sm:inline-flex">
          Iniciar sesión
        </router-link>
        <router-link to="/register" class="btn btn-primary btn-sm">
          Registrarse
        </router-link>
      </template>
    
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn m-1">
          Tema
          <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://w3.org" viewBox="0 0 2048 2048">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul tabindex="0" class="dropdown-content bg-base-300 rounded-box z-[1000] w-52 p-2 shadow-2xl">
          <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Default" value="light" :checked="currentTheme === 'light'" @change="setTheme('light')" /></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Dark" value="dark" :checked="currentTheme === 'dark'" @change="setTheme('dark')" /></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Cupcake" value="cupcake" :checked="currentTheme === 'cupcake'" @change="setTheme('cupcake')" /></li>
          <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Forest" value="forest" :checked="currentTheme === 'forest'" @change="setTheme('forest')" /></li>
        </ul>
      </div>
    </div>
  </header>
</template>
