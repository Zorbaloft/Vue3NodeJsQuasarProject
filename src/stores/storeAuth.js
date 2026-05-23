import { defineStore, acceptHMRUpdate } from 'pinia'
import { auth } from 'boot/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    error: null,
    loading: false,
    router: useRouter(), // this is composition api mixin, but its only to save time, dont do this! this is not a good practice.
  }),
  getters: {
    currentUser(state) {
      return state.user
    }
  },
  actions: {
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          this.router.push('/')
        } else {
          this.user = {}
          this.router.push('/login')
        }
      });
    },
    async registerUser(credentials) {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      this.user = userCredential.user
    },
    async loginUser(credentials) {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      this.user = userCredential.user
    },
    async logoutUser() {
      await signOut(auth);
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}