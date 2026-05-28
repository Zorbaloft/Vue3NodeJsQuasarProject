<template>
  <div class="notifications-panel column no-wrap">
    <header class="notifications-panel__header">
      <div class="notifications-panel__header-text">
        <div class="notifications-panel__title">Notifications</div>
        <div class="notifications-panel__subtitle">
          {{ unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up' }}
        </div>
      </div>

      <div class="notifications-panel__header-actions">
        <q-btn
          v-if="unreadCount > 0"
          flat
          dense
          no-caps
          label="Mark all read"
          class="notifications-panel__mark-all"
          @click="markAllAsSeen"
        />

        <button
          v-if="notifications.length > 0"
          type="button"
          class="notifications-panel__clear-all"
          aria-label="Clear all notifications"
          @click="clearNotifications"
        >
          <q-icon name="delete_sweep" size="18px" />
          <span>Clear all</span>
        </button>
      </div>
    </header>

    <div class="notifications-panel__list col scroll">
      <q-list v-if="notifications.length > 0" class="notifications-panel__items">
        <q-item
          v-for="notification in notifications"
          :key="notification.id"
          clickable
          v-ripple
          class="notifications-panel__item"
          :class="{ 'notifications-panel__item--unread': !notification.seen }"
          @click="openNotification(notification)"
        >
          <q-item-section avatar>
            <q-avatar size="40px">
              <img
                :src="getUserAvatar(notification.from)"
                :alt="getUserLabel(notification.from)"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="notifications-panel__item-title">
              New message from {{ getUserLabel(notification.from) }}
            </q-item-label>
            <q-item-label caption class="notifications-panel__item-meta">
              {{ formatNotificationTime(notification) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="notifications-panel__item-actions">
            <q-badge v-if="!notification.seen" color="primary" rounded />

            <button
              type="button"
              class="notifications-panel__delete"
              aria-label="Delete notification"
              @click.stop
            >
              <q-icon name="close" size="16px" />
            </button>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="notifications-panel__empty">
        <q-icon name="notifications_none" size="2rem" color="grey-6" />
        <p>No notifications yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from 'stores/storeNotifications'
import { useChatStore } from 'stores/storeChat'
import { useAuthStore } from 'stores/storeAuth'

const emit = defineEmits(['notification-opened'])

const router = useRouter()
const notificationsStore = useNotificationsStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const { notifications, unreadCount } = storeToRefs(notificationsStore)

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) chatStore.getUsers()
  },
  { immediate: true },
)

function getUserById(userId) {
  return chatStore.users.find((user) => user.id === userId)
}

function getUserLabel(userId) {
  const user = getUserById(userId)
  return user?.Name || user?.email || 'Unknown user'
}

function getUserAvatar(userId) {
  return `https://picsum.photos/seed/${userId}/300/300`
}

function formatNotificationTime(notification) {
  const raw = notification.createdAt
  const date = raw?.toDate?.() ?? new Date(Number(raw))
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function markAllAsSeen() {
  await notificationsStore.markAllAsSeen()
}

async function openNotification(notification) {
  if (!notification.seen) {
    await notificationsStore.markAsSeen(notification.id)
  }

  const sender = getUserById(notification.from)
  if (sender) {
    chatStore.selectUser(sender)
    chatStore.openConversation(sender)
  }

  emit('notification-opened')
  router.push({ path: '/' })
}

async function clearNotifications() {
  await notificationsStore.clearNotifications()
}

</script>

<style scoped>
.notifications-panel {
  width: min(360px, 92vw);
  max-height: min(480px, 70dvh);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--card);
  overflow: hidden;
}

.notifications-panel__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
}

.notifications-panel__header-text {
  min-width: 0;
}

.notifications-panel__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: var(--line-height-tight);
  color: var(--foreground);
}

.notifications-panel__subtitle {
  margin-top: 0.125rem;
  font-size: calc(var(--font-size-base) * 0.85);
  line-height: var(--line-height-normal);
  color: var(--muted-foreground);
}

.notifications-panel__mark-all {
  flex-shrink: 0;
  color: var(--primary);
}

.notifications-panel__header-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.notifications-panel__clear-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid color-mix(in srgb, #ef4444 35%, var(--border));
  border-radius: var(--radius-md);
  background: color-mix(in srgb, #ef4444 6%, var(--card));
  color: #dc2626;
  font-size: calc(var(--font-size-base) * 0.82);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.12s ease;
}

.notifications-panel__clear-all:hover {
  background: color-mix(in srgb, #ef4444 14%, var(--card));
  border-color: color-mix(in srgb, #ef4444 55%, var(--border));
}

.notifications-panel__clear-all:active {
  transform: scale(0.97);
}

.notifications-panel__list {
  flex: 1 1 auto;
  min-height: 0;
}

.notifications-panel__items {
  padding: 0.5rem 0;
}

.notifications-panel__item {
  padding: 0.75rem 1rem;
  transition: background-color 0.15s ease;
}

.notifications-panel__item:hover {
  background: var(--muted);
}

.notifications-panel__item:hover .notifications-panel__delete {
  opacity: 1;
  transform: scale(1);
}

.notifications-panel__item--unread {
  background: color-mix(in srgb, var(--primary) 8%, transparent);
}

.notifications-panel__item-title {
  font-weight: 600;
  color: var(--foreground);
}

.notifications-panel__item-meta {
  color: var(--muted-foreground);
}

.notifications-panel__item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notifications-panel__delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.notifications-panel__delete:hover {
  background: color-mix(in srgb, #ef4444 12%, transparent);
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
  color: #dc2626;
}

.notifications-panel__delete:active {
  transform: scale(0.92);
  background: color-mix(in srgb, #ef4444 18%, transparent);
}

@media (hover: none) {
  .notifications-panel__delete {
    opacity: 0.75;
    transform: scale(1);
  }
}

.notifications-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
  min-height: 12rem;
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--muted-foreground);
}

.notifications-panel__empty p {
  margin: 0;
}
</style>
