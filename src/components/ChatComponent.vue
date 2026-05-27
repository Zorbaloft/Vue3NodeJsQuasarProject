<template>
  <div class="chat-panel column no-wrap">
    <template v-if="!selectedUser">
      <header class="chat-panel__header">
        <div class="chat-panel__title">Messages</div>
        <div class="chat-panel__subtitle">Select a contact to start chatting</div>
      </header>

      <div class="chat-panel__contacts col scroll">
        <q-list v-if="users.length > 0" class="chat-panel__list">
          <q-item
            v-for="user in users"
            :key="user.id"
            clickable
            v-ripple
            class="chat-panel__contact"
            @click="selectUser(user)"
          >
            <q-item-section avatar>
              <q-avatar size="40px">
                <img :src="getUserAvatar(user)" :alt="getUserLabel(user)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="chat-panel__contact-name">
                {{ getUserLabel(user) }}
              </q-item-label>
              <q-item-label v-if="user.email" caption class="chat-panel__contact-meta">
                {{ user.email }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" color="grey-6" />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="chat-panel__empty">
          <q-icon name="forum" size="2rem" color="grey-6" />
          <p>No contacts available</p>
        </div>
      </div>
    </template>

    <template v-else>
      <header class="chat-panel__header chat-panel__header--conversation">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          class="chat-panel__back"
          aria-label="Back to contacts"
          @click="clearSelectedUser"
        />

        <div class="chat-panel__header-text">
          <div class="chat-panel__title">{{ getUserLabel(selectedUser) }}</div>
          <div class="chat-panel__subtitle">
            {{ selectedUser.email || 'Conversation preview' }}
          </div>
        </div>

        <q-avatar size="36px" class="chat-panel__header-avatar">
          <img :src="getUserAvatar(selectedUser)" :alt="getUserLabel(selectedUser)" />
        </q-avatar>
      </header>

      <div class="chat-panel__messages col scroll">
        <div v-if="messages.length === 0" class="chat-panel__empty chat-panel__empty--inline">
          <q-icon name="chat_bubble_outline" size="2rem" color="grey-6" />
          <p>No messages yet. Start the conversation!</p>
        </div>

        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          :name="isSentByMe(message) ? 'me' : getUserLabel(selectedUser)"
          :avatar="isSentByMe(message) ? getMyAvatar() : getUserAvatar(selectedUser)"
          :stamp="formatMessageStamp(message)"
          :sent="isSentByMe(message)"
          :text-color="isSentByMe(message) ? 'white' : undefined"
          :bg-color="isSentByMe(message) ? 'primary' : 'amber'"
        >
          <div>{{ getMessageText(message) }}</div>
        </q-chat-message>
      </div>

      <footer class="chat-panel__composer">
        <q-input
          dense
          outlined
          readonly
          placeholder="Type a message..."
          class="chat-panel__input"
        >
          <template #append>
            <q-btn flat round dense icon="send" color="primary" disable />
          </template>
        </q-input>
      </footer>
    </template>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from 'stores/storeChat'
import { useAuthStore } from 'stores/storeAuth'

const chatStore = useChatStore()
const authStore = useAuthStore()
const { users, selectedUser, messages } = storeToRefs(chatStore)

onMounted(() => {
  chatStore.getUsers()
})

watch(selectedUser, (user, previousUser) => {
  if (user) {
    chatStore.openConversation(user)
    return
  }

  if (previousUser) {
    chatStore.closeConversation()
  }
})

function getUserLabel(user) {
  return user.Name || user.email || 'Unknown user'
}

function getUserAvatar(user) {
  return `https://picsum.photos/seed/${user.id}/300/300`
}

function getMyAvatar() {
  return `https://picsum.photos/seed/${authStore.user.id}/300/300`
}

function isSentByMe(message) {
  return message.from === authStore.user.id
}

function getMessageText(message) {
  return message.text ?? message.Content ?? ''
}

function formatMessageStamp(message) {
  const raw = message.Time ?? message.createdAt
  const date = raw?.toDate?.() ?? new Date(Number(raw))
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function selectUser(user) {
  chatStore.selectUser(user)
}

function clearSelectedUser() {
  chatStore.clearSelectedUser()
}
</script>

<style scoped>
.chat-panel {
  height: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--card);
  overflow: hidden;
}

.chat-panel__header {
  flex-shrink: 0;
  padding: 1rem 1.125rem;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
}

.chat-panel__header--conversation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-panel__header-text {
  flex: 1;
  min-width: 0;
}

.chat-panel__header-avatar {
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.chat-panel__back {
  flex-shrink: 0;
  color: var(--foreground);
}

.chat-panel__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: var(--line-height-tight);
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-panel__subtitle {
  margin-top: 0.125rem;
  font-size: calc(var(--font-size-base) * 0.85);
  line-height: var(--line-height-normal);
  color: var(--muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-panel__contacts {
  flex: 1 1 auto;
  min-height: 0;
}

.chat-panel__list {
  padding: 0.5rem 0;
}

.chat-panel__contact {
  padding: 0.75rem 1rem;
  transition: background-color 0.15s ease;
}

.chat-panel__contact:hover {
  background: var(--muted);
}

.chat-panel__contact-name {
  font-weight: 600;
  color: var(--foreground);
}

.chat-panel__contact-meta {
  color: var(--muted-foreground);
}

.chat-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--muted-foreground);
}

.chat-panel__empty p {
  margin: 0;
  max-width: none;
}

.chat-panel__empty--inline {
  height: auto;
  min-height: 12rem;
  padding: 2rem 1rem;
}

.chat-panel__messages {
  flex: 1 1 auto;
  min-height: 0;
  padding: 1rem 0.75rem;
}

.chat-panel__composer {
  flex-shrink: 0;
  padding: 0.875rem 1rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--card);
}

.chat-panel__input :deep(.q-field__control) {
  border-radius: var(--radius-md);
}
</style>
