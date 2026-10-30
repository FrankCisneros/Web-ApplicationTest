<script setup lang="ts">
import Navbar from './components/navbar.vue'

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})

</script>

<template>
  <div class="min-h-screen bg-base-200">
    <Navbar />
    <router-view />
  </div>
</template>
