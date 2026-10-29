<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../services/auth'

const router = useRouter()

async function handleLogout() {
  logout()
  await router.push('/login')
}
</script>

<template>
  <header class="navbar bg-base-100 px-4 shadow-sm lg:px-8">
    <div class="navbar-start">
      <router-link to="/" class="btn btn-ghost px-2 text-lg font-bold sm:text-xl">
        Map
      </router-link>
    </div>

    <!-- <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-1 px-1">
        <li><router-link to="/">Inicio</router-link></li>
        <li><a href="#">Acerca</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </div> -->

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
    </div>
  </header>
</template>
