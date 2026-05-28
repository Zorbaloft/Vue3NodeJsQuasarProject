import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, computed } from "vue";
import { db } from "boot/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { useAuthStore } from "stores/storeAuth";

export const useNotificationsStore = defineStore("notifications", () => {
  const authStore = useAuthStore();
  const notifications = ref([]);

  let unsubNotifications = null;

  const unreadCount = computed(
    () => notifications.value.filter((notification) => !notification.seen).length,
  );

  function listenNotifications() {
    if (!authStore.user?.id) return;
    if (unsubNotifications) unsubNotifications();

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("to", "==", authStore.user.id),
      where("seen", "==", false),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    unsubNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        notifications.value = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
      },
      (error) => {
        console.error("listenNotifications error:", error);
      },
    );
  }

  function clearNotifications() {
    if (unsubNotifications) {
      unsubNotifications();
      unsubNotifications = null;
    }
    notifications.value = [];
  }

  async function markAsSeen(notificationId) {
    if (!notificationId) return;

    await updateDoc(doc(db, "notifications", notificationId), {
      seen: true,
    });
  }

  async function markAllAsSeen() {
    const unread = notifications.value.filter((notification) => !notification.seen);
    await Promise.all(unread.map((notification) => markAsSeen(notification.id)));
  }

  return {
    notifications,
    unreadCount,
    listenNotifications,
    clearNotifications,
    markAsSeen,
    markAllAsSeen,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}
