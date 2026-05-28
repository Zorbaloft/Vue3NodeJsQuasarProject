import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { db } from 'boot/firebase'
import { collection, onSnapshot, setDoc, doc, updateDoc, deleteDoc, query, limit } from 'firebase/firestore'
import { useAuthStore } from 'stores/storeAuth'

export const usePostsStore = defineStore('posts', () => {
  const authStore = useAuthStore()  

  const posts = ref([])
  const isModalOpen = ref(false)
  const editingPostId = ref(null)

  let unsubGetPosts = null

  const editingPost = computed(() => {
    if (editingPostId.value == null) return null
    return posts.value.find((post) => post.id == editingPostId.value) ?? null
  })

  const isEditing = computed(() => editingPostId.value != null)

  const postsByUser = computed(() => {
    const counts = {}
    posts.value.forEach(post => {
      if (!counts[post.user]) {
        counts[post.user] = { quantity: 0, totalCharacters: 0 }
      }
      counts[post.user].quantity += 1
      counts[post.user].totalCharacters += post.content.length
    })
    return Object.entries(counts).map(([user, data]) => ({
      name: user,
      quantityOfPosts: data.quantity,
      totalCharacters: data.totalCharacters
    }))
  })

  async function getPosts() {
    console.log('getPosts called, user id:', authStore.user?.id)

    if (!authStore.user?.id) return
    if (unsubGetPosts) unsubGetPosts()

    const postsCollection = query(
      collection(db, 'users', authStore.user.id, 'posts'),
      limit(10)
    )
    unsubGetPosts = onSnapshot(postsCollection, (querySnapshot) => {
        posts.value = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      })
  }

  async function clearPosts() {
    if (unsubGetPosts === null) return
    unsubGetPosts();
    posts.value = [];

  }

  async function addPost(content) {
    const trimmed = content.trim()
    if (!trimmed || !authStore.user?.id) return

    const id = Date.now().toString()
    await setDoc(doc(db, 'users', authStore.user.id, 'posts', id), {
      content: trimmed,
      user: authStore.user.email,
      time: new Date().toISOString(),
      usertag: authStore.user.email.split('@')[0],
    })
  }

  async function deletePost(id) {
    if (!authStore.user?.id) return
    await deleteDoc(doc(db, 'users', authStore.user.id, 'posts', String(id)))
  }

  async function editPost(id, content) {
    const trimmed = content.trim()
    if (!trimmed || !authStore.user?.id) return
    await updateDoc(doc(db, 'users', authStore.user.id, 'posts', String(id)), { content: trimmed })
  }

  function openCreateModal() { editingPostId.value = null; isModalOpen.value = true }
  function openEditModal(id) { editingPostId.value = id; isModalOpen.value = true }
  function closeModal() { isModalOpen.value = false; editingPostId.value = null }

  return {
    posts, isModalOpen, editingPostId,
    editingPost, isEditing, postsByUser,
    getPosts, addPost, deletePost, editPost,
    openCreateModal, openEditModal, closeModal, clearPosts
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}