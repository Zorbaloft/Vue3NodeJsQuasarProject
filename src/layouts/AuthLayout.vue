<template>
  <q-layout view="hHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="auth-page">
        <aside class="auth-brand">
          <div class="auth-brand__glow auth-brand__glow--one" />
          <div class="auth-brand__glow auth-brand__glow--two" />

          <div class="auth-brand__content">
            <div class="auth-brand__logo">
              <q-avatar size="52px" class="auth-brand__avatar">
                <img
                  src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
                  alt=""
                />
              </q-avatar>
              <span class="auth-brand__name">Postballs</span>
            </div>

            <h1 class="auth-brand__title">
              Share ideas.<br />
              Follow the conversation.
            </h1>
            <p class="auth-brand__lead">
              Enter in your account to publish, edit and see statistics of your posts in real time.
            </p>
          </div>
        </aside>

        <main class="auth-main">
          <router-view />
        </main>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-layout :deep(.q-page-container) {
  padding: 0;
  min-height: 100vh;
  overflow: auto;
}

.auth-page {
  display: grid;
  grid-template-columns: minmax(280px, 1.05fr) minmax(320px, 0.95fr);
  min-height: 100vh;
  background: var(--background);
}

.auth-brand {
  position: relative;
  overflow: hidden;
  padding: clamp(2rem, 5vw, 4rem);
  background:
    radial-gradient(
      120% 80% at 0% 0%,
      rgb(25 118 210 / 0.14),
      transparent 55%
    ),
    linear-gradient(165deg, var(--muted) 0%, var(--background) 72%);
  border-right: 1px solid var(--border);
}

.body--dark .auth-brand,
html[data-theme='dark'] .auth-brand {
  background:
    radial-gradient(
      120% 80% at 0% 0%,
      rgb(59 130 246 / 0.12),
      transparent 55%
    ),
    linear-gradient(165deg, var(--muted) 0%, var(--background) 78%);
}

.auth-brand__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  pointer-events: none;
}

.auth-brand__glow--one {
  width: 280px;
  height: 280px;
  top: -60px;
  right: -40px;
  background: rgb(25 118 210 / 0.22);
}

.auth-brand__glow--two {
  width: 220px;
  height: 220px;
  bottom: 10%;
  left: -40px;
  background: rgb(38 166 154 / 0.18);
}

.auth-brand__content {
  position: relative;
  z-index: 1;
  max-width: 28rem;
}

.auth-brand__logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: clamp(2rem, 6vh, 3.5rem);
}

.auth-brand__avatar {
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: 0 8px 24px rgb(15 23 42 / 0.08);
}

.auth-brand__name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.auth-brand__title {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  line-height: var(--line-height-tight);
  letter-spacing: -0.03em;
  color: var(--foreground);
}

.auth-brand__lead {
  margin: 0;
  font-size: calc(var(--font-size-base) * 0.95);
  line-height: var(--line-height-relaxed);
  color: var(--muted-foreground);
  max-width: 36ch;
}

.auth-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--background);
}

@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .auth-brand {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 1.75rem 1.5rem 1.5rem;
  }

  .auth-brand__title {
    font-size: 1.5rem;
  }

  .auth-brand__lead {
    display: none;
  }

  .auth-brand__logo {
    margin-bottom: 1rem;
  }
}
</style>
