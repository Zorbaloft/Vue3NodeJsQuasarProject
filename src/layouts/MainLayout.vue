<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Vue3QuasarNodeApp
        </q-toolbar-title>

        <q-btn flat round dense icon="notifications" aria-label="Notifications">
          <q-badge
            v-if="unreadCount > 0"
            color="red"
            floating
            rounded
            :label="unreadCount > 99 ? '99+' : unreadCount"
          />

          <q-menu
            v-model="notificationsMenuOpen"
            anchor="bottom right"
            self="top right"
          >
            <NotificationsComponent @notification-opened="notificationsMenuOpen = false" />
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="main-drawer"
    >
      <div class="drawer-inner column fit q-pa-md">
        <div class="drawer-top">
          <div class="user-info">
            <q-avatar size="40px" class="user-info__avatar">
              <img src="https://picsum.photos/seed/user/300/300" alt="" />
            </q-avatar>
            <div class="user-info__text">
              <div class="user-info__name">{{ authStore.user.email }}</div>
            </div>
          </div>

          <nav class="drawer-nav" aria-label="Navegação principal">
            <RouterLink class="drawer-nav__link" to="/"> Feed </RouterLink>
            <q-separator />
            <RouterLink class="drawer-nav__link" to="/stats">
              Stats
            </RouterLink>
          </nav>
        </div>

        <q-space />

        <q-separator class="drawer-footer-sep" />
        <q-btn
          icon="logout"
          label="Logout"
          class="drawer-logout full-width"
          @click="logout"
        />
      </div>
    </q-drawer>

    <q-page-container class="layout-page-container">
      <q-page class="layout-main-page" :padding="false">
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-primary text-white"></q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/storeAuth";
import { useNotificationsStore } from "stores/storeNotifications";
import { useRouter } from "vue-router";
import NotificationsComponent from "components/NotificationsComponent.vue";

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();

const { unreadCount } = storeToRefs(notificationsStore);

const leftDrawerOpen = ref(false);
const notificationsMenuOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logout() {
  await authStore.logoutUser()
}

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) {
      notificationsStore.listenNotifications();
      return;
    }

    notificationsStore.clearNotifications();
  },
  { immediate: true },
);

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth) router.push({ name: 'login' })
  }
)
</script>

<style scoped>
.main-drawer :deep(.q-drawer__content) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.drawer-inner {
  flex: 1 1 auto;
  min-height: 0;
}

.drawer-top {
  flex-shrink: 0;
}

.drawer-footer-sep {
  background: var(--border);
  margin-bottom: 8px;
}

.drawer-logout {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 4px;
  color: var(--muted-foreground);
}

/* Shadcn-style sidebar user: muted rounded rectangle */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--user-info-border);
  background: var(--user-info-bg);
}

.user-info__avatar {
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.user-info__text {
  min-width: 0;
  flex: 1;
}

.user-info__name {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--user-info-name);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-info__meta {
  margin-top: 2px;
  font-size: 0.9rem;
  line-height: 1.25;
  color: var(--user-info-meta);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-nav__link {
  display: block;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--foreground);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.drawer-nav__link:hover {
  background-color: var(--muted);
}

.drawer-nav__link.router-link-exact-active {
  background-color: var(--muted);
  font-weight: 600;
}
</style>
