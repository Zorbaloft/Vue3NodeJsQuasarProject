import { defineStore, acceptHMRUpdate } from "pinia";
import { auth } from "boot/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    error: null,
    loading: false,
    UserAuthenticated: false,
    FbResponse: false, // this way we can prevent more than 1 listener on our onAuthStateChanged everytime the user changes his route
  }),
  getters: {
    currentUser(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.UserAuthenticated;
    },
  },
  actions: {
    initAuthListener() {
      if (this.FbResponse) return;
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.UserAuthenticated = true;
            this.user = { id: user.uid, email: user.email };
            this.user.email = user.email;
            this.FbResponse = true;
            resolve();
          } else {
            this.user = {};
            this.FbResponse = true;
            this.UserAuthenticated = false;
            resolve();
          }
        });
      });
    },
    async registerUser(credentials) {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
    },
    async loginUser(credentials) {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
    },
    async logoutUser() {
      await signOut(auth);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
