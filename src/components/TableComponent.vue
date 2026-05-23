<template>
    <div class="q-pa-md">
      <q-table title="Treats" :rows="postsByUser" :columns="columns" row-key="name" />
    </div>
</template>
  
  <script setup>
  import { usePostsStore } from 'stores/storePosts'
  import { storeToRefs } from 'pinia'

  const postsStore = usePostsStore()

  const { postsByUser } = storeToRefs(postsStore)
  

</script>