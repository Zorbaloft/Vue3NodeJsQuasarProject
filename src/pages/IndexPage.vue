<template>
  <div class="column items-end q-my-lg">
    <q-btn
      unelevated
      rounded
      color="primary"
      size="lg"
      label="New Post"
      @click="postsStore.openCreateModal()"
    />
    <ModalComponent />
  </div>
  <div class="feed" v-if="postsStore.posts.length > 0">
   <PostComponent
      v-for="post in postsStore.posts"
      :key="post.id"
      :post="post"
   />

  </div>
  <div class="feed" v-else>
      <h2 class="text-center">No posts found</h2>
  </div>
</template>

<script setup>

import ModalComponent from 'components/ModalComponent.vue'
import PostComponent from 'components/PostComponent.vue'
import { usePostsStore } from 'stores/storePosts'
import { useAuthStore } from 'stores/storeAuth'
import { watch } from 'vue'

const postsStore = usePostsStore()
const authStore = useAuthStore()

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) {
      postsStore.getPosts()
    }else {
      postsStore.clearPosts()
    }
  },
  { immediate: true }
)

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
