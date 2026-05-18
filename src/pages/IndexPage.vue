<template>
  <div class="column items-end q-my-lg">
    <q-btn
      unelevated
      rounded
      color="primary"
      size="lg"
      label="New Post"
      @click="showCreateModal = true"
    />
    <ModalComponent v-model="showCreateModal" />
  </div>
  <div class="feed">
   <PostComponent
      v-for="post in postsStore.posts"
      :key="post.id"
      :post="post"
   />
  </div>
</template>

<script setup>

import ModalComponent from 'components/ModalComponent.vue'
import PostComponent from 'components/PostComponent.vue'
import { ref } from 'vue'
import { usePostsStore } from 'stores/storePosts'

const showCreateModal = ref(false)

const postsStore = usePostsStore()
</script>

<style scoped>
.feed {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feed-card {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--card);
  border-color: var(--border) !important;
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.feed-card:hover {
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
}

.body--dark .feed-card:hover,
html[data-theme='dark'] .feed-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
}

.feed-card__media {
  border-radius: 0;
}

.feed-card__media--tall {
  max-height: 440px;
}

.feed-card__body {
  line-height: var(--line-height-relaxed);
}

.feed-card__meta {
  color: var(--muted-foreground);
}

.feed-card__toolbar {
  min-height: 48px;
}

.text-muted {
  color: var(--muted-foreground);
}
</style>
