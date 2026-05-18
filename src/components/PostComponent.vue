<template>
  <q-card class="feed-card" flat bordered>
    <q-item class="q-py-md">
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-medium">{{ post.user }}</q-item-label>
        <q-item-label caption class="feed-card__meta">
          {{ post.usertag }} · {{ post.time }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section class="feed-card__body text-body1">
      {{ post.content }}
      <div class="column items-end">
        <small>{{ characterLength }} characters</small>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions class="feed-card__toolbar">
      <q-btn flat dense round icon="favorite_border" color="grey-7" />
      <q-btn flat dense round icon="bookmark_border" color="grey-7" />
      <q-btn flat dense round icon="share" color="grey-7" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const characterLength = computed(() => {
  return props.post.content.length;
});
</script>
