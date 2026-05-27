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
} from "firebase/firestore";
import { useAuthStore } from 'stores/storeAuth'

export const useChatStore = defineStore("chat", () => {
  const authStore = useAuthStore()
  const users = ref([]);
  const selectedUser = ref(null);
  const messages = ref([]);

  let unsubConversation = null;

  async function getUsers() {
    const usersQuery = query(
      collection(db, "users"),
      where(documentId(), "!=", authStore.user.id),
      orderBy(documentId())
    )

    const usersSnapshot = await getDocs(usersQuery);

    users.value = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  function selectUser(user) {
    selectedUser.value = user
  }

  function clearSelectedUser() {
    selectedUser.value = null
  }

  function getMessageTime(message) {
    const raw = message.Time ?? message.createdAt
    if (raw?.toMillis) return raw.toMillis()
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  function mergeConversationMessages(sent, received) {
    messages.value = [...sent, ...received].sort(
      (a, b) => getMessageTime(a) - getMessageTime(b)
    )
  }

  function openConversation(user) {
    if (!authStore.user?.id || !user?.id) return

    closeConversation()

    const me = authStore.user.id
    const other = user.id

    const sentQuery = query(
      collection(db, 'messages'),
      where('from', '==', me),
      where('to', '==', other),
      limit(50)
    )

    const receivedQuery = query(
      collection(db, 'messages'),
      where('from', '==', other),
      where('to', '==', me),
      limit(50)
    )

    let sentMessages = []
    let receivedMessages = []

    const unsubSent = onSnapshot(
      sentQuery,
      (querySnapshot) => {
        sentMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        mergeConversationMessages(sentMessages, receivedMessages)
      },
      (error) => {
        console.error('sentQuery error:', error)
      }
    )

    const unsubReceived = onSnapshot(
      receivedQuery,
      (querySnapshot) => {
        receivedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        mergeConversationMessages(sentMessages, receivedMessages)
      },
      (error) => {
        console.error('receivedQuery error:', error)
      }
    )

    unsubConversation = () => {
      unsubSent()
      unsubReceived()
      messages.value = []
    }
  }

  function closeConversation() {
    if (unsubConversation) {
      unsubConversation()
      unsubConversation = null
    }
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
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
}
