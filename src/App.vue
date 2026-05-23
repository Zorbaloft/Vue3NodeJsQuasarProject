<template>
  <router-view />
</template>


<script setup>
import { useAuthStore } from 'stores/storeAuth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuthListener()
})
</script>