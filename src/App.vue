<script setup lang="ts">
import Navbar from './components/navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <Navbar />
    <router-view />
  </div>
</template>
