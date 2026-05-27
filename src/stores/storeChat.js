// Inicialy made with 2 queries but after concideration we passed to 1 query since it was simpler an cheaper

import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";
import { db } from "boot/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  documentId,
  orderBy,
  onSnapshot,
  limit,
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { useAuthStore } from "stores/storeAuth";

export const useChatStore = defineStore("chat", () => {
  const authStore = useAuthStore();
  const users = ref([]);
  const selectedUser = ref(null);
  const messages = ref([]);

  let unsubConversation = null;

  async function getUsers() {
    const usersQuery = query(
      collection(db, "users"),
      where(documentId(), "!=", authStore.user.id),
      orderBy(documentId()),
    );

    const usersSnapshot = await getDocs(usersQuery);

    users.value = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  function selectUser(user) {
    selectedUser.value = user;
  }

  function clearSelectedUser() {
    selectedUser.value = null;
  }

  function openConversation(user) {
    if (!authStore.user?.id || !user?.id) return
  
    closeConversation()
  
    const me = authStore.user.id
    const other = user.id
    const conversationId = [me, other].sort().join('_')
  
    const messagesQuery = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    )
  
    unsubConversation = onSnapshot(
      messagesQuery,
      (snapshot) => {
        messages.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      },
      (error) => {
        console.error('openConversation error:', error)
      }
    )
  }

  function closeConversation() {
    if (unsubConversation) {
      unsubConversation()
      unsubConversation = null
      messages.value = []
    }
  }

  async function sendMessage(message) {
    const trimmed = message.trim();
    if (!trimmed || !authStore.user?.id || !selectedUser.value?.id) return;
    const me = authStore.user.id;
    const other = selectedUser.value.id;
    const conversationId = [me, other].sort().join("_");

    await setDoc(
      doc(db, "conversations", conversationId),
      {
        participants: [me, other],
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      from: me,
      content: trimmed,
      to: other,
      createdAt: serverTimestamp(),
    });
  }

  return {
    users,
    selectedUser,
    messages,
    getUsers,
    selectUser,
    clearSelectedUser,
    openConversation,
    closeConversation,
    sendMessage
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
}
