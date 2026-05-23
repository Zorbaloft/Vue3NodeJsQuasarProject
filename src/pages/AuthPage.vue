<template>
  <AuthFormComponent :mode="mode" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthFormComponent from 'components/AuthFormComponent.vue'

const route = useRoute()

const mode = computed(() => route.meta.mode ?? 'login')
</script>
