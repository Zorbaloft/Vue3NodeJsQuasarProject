<template>
  <q-dialog
    v-model="isOpen"
    transition-show="jump-up"
    transition-hide="jump-down"
  >
    <q-card class="compose-modal">
      <q-card-section
        class="compose-modal__header row items-start no-wrap q-pb-sm"
      >
        <div class="row items-center">
          <q-avatar size="48px" class="compose-modal__avatar q-mx-md">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="" />
          </q-avatar>
          <div class="column q-mt-xs compose-modal__title-block">
            <div class="text-h6 text-weight-semibold compose-modal__title">
              New Post
            </div>
            <div class="text-caption compose-modal__subtitle">
              {{ userName }} · {{ userTag }}
            </div>
          </div>
        </div>
        <q-space />
        <q-btn
          flat
          round
          icon="close"
          class="compose-modal__close text-muted"
          aria-label="Close"
          v-close-popup
        />
      </q-card-section>

      <q-separator class="compose-modal__separator" />

      <q-card-section class="compose-modal__body q-pt-md q-pb-sm">
        <q-input
          v-model="text"
          type="textarea"
          autogrow
          outlined
          :rows="5"
          :borderless="false"
          class="compose-modal__textarea"
          color="primary"
          label="Write something"
          hide-bottom-space
        />
      </q-card-section>

      <q-separator />

      <q-card-actions
        class="compose-modal__actions row justify-end items-center"
      >
        <q-btn
          flat
          no-caps
          rounded
          class="compose-modal__btn-cancel"
          label="Cancel"
          v-close-popup
        />
        <q-btn
          @click="addNote"
          unelevated
          rounded
          no-caps
          color="primary"
          class="q-ml-sm"
          label="Publish"
          :disable="!text.trim()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";

const isOpen = defineModel({ type: Boolean, default: false });

const text = ref("");
const emit = defineEmits(['add-post'])

const userName = ref("Alex");
const userTag = ref("@alex");

const addNote = () => {
  let currentDate = new Date().getTime(),
      id = currentDate.toString()

  let post = {
    id,
    content: text.value,
    user:userName.value,
    time:'2h',
    usertag:userTag.value
  }

  emit('add-post', post)
  isOpen.value = false
  text.value = ''
}





</script>















<style scoped>
.compose-modal {
  width: min(560px, calc(100vw - 48px));
  max-width: 560px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  box-shadow:
    0 22px 50px rgb(15 23 42 / 0.12),
    0 0 0 1px rgb(15 23 42 / 0.04);
}

.body--dark .compose-modal,
html[data-theme="dark"] .compose-modal {
  border-color: var(--border);
  box-shadow:
    0 24px 56px rgb(0 0 0 / 0.45),
    0 0 0 1px rgb(255 255 255 / 0.05);
}

.compose-modal__avatar {
  box-shadow: 0 4px 12px rgb(15 23 42 / 0.08);
  flex-shrink: 0;
}

.body--dark .compose-modal__avatar {
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.35);
}

.compose-modal__title {
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.compose-modal__subtitle {
  margin-top: 2px;
  color: var(--muted-foreground);
}

.compose-modal__close {
  margin-top: 2px;
  margin-right: -4px;
}

.compose-modal__separator {
  background-color: var(--border);
}

.compose-modal__body :deep(.q-field--outlined .q-field__control) {
  border-radius: var(--radius-md);
  background: var(--background);
}

.compose-modal__textarea :deep(.q-field__label) {
  color: var(--muted-foreground);
}

.compose-modal__actions {
  padding: 14px 16px 18px;
  gap: 4px;
  background: var(--muted);
}

.body--dark .compose-modal__actions,
html[data-theme="dark"] .compose-modal__actions {
  background: rgb(0 0 0 / 0.2);
}

.compose-modal__btn-cancel {
  color: var(--muted-foreground);
}

.compose-modal__btn-cancel:hover {
  color: var(--foreground);
  background: transparent;
}

.text-muted {
  color: var(--muted-foreground);
}
</style>
