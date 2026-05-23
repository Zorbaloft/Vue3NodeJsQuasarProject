<template>
  <q-card class="auth-form" flat bordered>
    <q-card-section class="auth-form__header">
      <h2 class="auth-form__title">{{ title }}</h2>
      <p class="auth-form__subtitle">{{ subtitle }}</p>
    </q-card-section>

    <q-card-section class="auth-form__body">
      <q-banner
        v-if="authStore.error"
        class="auth-form__error q-mb-md"
        rounded
        dense
      >
        {{ authStore.error }}
      </q-banner>

      <q-form class="auth-form__fields" @submit.prevent="onSubmit">
        <q-input
          v-if="isRegister"
          v-model="name"
          class="auth-form__field"
          outlined
          label="Nome"
          autocomplete="name"
          :disable="authStore.loading"
        />

        <q-input
          v-model="email"
          class="auth-form__field"
          outlined
          type="email"
          label="Email"
          autocomplete="email"
          :disable="authStore.loading"
          :rules="[requiredRule, emailRule]"
          lazy-rules
        />

        <q-input
          v-model="password"
          class="auth-form__field"
          outlined
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          :disable="authStore.loading"
          :rules="[requiredRule, passwordRule]"
          lazy-rules
        >
          <template #append>
            <q-btn
              flat
              dense
              round
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              tabindex="-1"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-input
          v-if="isRegister"
          v-model="confirmPassword"
          class="auth-form__field"
          outlined
          :type="showPassword ? 'text' : 'password'"
          label="Confirmar password"
          autocomplete="new-password"
          :disable="authStore.loading"
          :rules="[requiredRule, confirmPasswordRule]"
          lazy-rules
        />

        <q-btn
          type="submit"
          unelevated
          rounded
          no-caps
          color="primary"
          class="auth-form__submit full-width"
          :label="submitLabel"
          :loading="authStore.loading"
        />
      </q-form>
    </q-card-section>

    <q-card-section class="auth-form__footer text-center">
      <span class="auth-form__switch text-muted">{{ switchText }}</span>
      <RouterLink class="auth-form__link" :to="switchRoute">
        {{ switchLabel }}
      </RouterLink>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from 'stores/storeAuth'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value),
  },
})

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const isRegister = computed(() => props.mode === 'register')

const title = computed(() => (isRegister.value ? 'Create account' : 'Welcome back'))
const subtitle = computed(() =>
  isRegister.value
    ? 'Fill in the data to start publishing.'
    : 'Enter your email and password.'
)
const submitLabel = computed(() => (isRegister.value ? 'Registar' : 'Entrar'))
const switchText = computed(() =>
  isRegister.value ? 'Already have an account?' : 'Don\'t have an account?'
)
const switchLabel = computed(() => (isRegister.value ? 'Login' : 'Register'))
const switchRoute = computed(() => (isRegister.value ? '/login' : '/register'))

const requiredRule = (value) => !!value || 'Required field'
const emailRule = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email'
const passwordRule = (value) =>
  (value && value.length >= 6) || 'Minimum 6 characters'
const confirmPasswordRule = (value) =>
  value === password.value || 'The passwords do not match'

watch(
  () => props.mode,
  () => {
    confirmPassword.value = ''
  }
)

const onSubmit = async () => {
  const credentials = {
      email: email.value.trim(),
      password: password.value,
      ...(isRegister.value && { name: name.value.trim() })
    }

  try {
    if (isRegister.value) {
      await authStore.registerUser(credentials)
    } else {
      await authStore.loginUser(credentials)
    }

  } catch (error) {
    console.error(error)
  }
}

</script>

<style scoped>
.auth-form {
  width: min(420px, 100%);
  border-radius: var(--radius-lg);
  background: var(--card);
  border-color: var(--border) !important;
  box-shadow:
    0 22px 50px rgb(15 23 42 / 0.1),
    0 0 0 1px rgb(15 23 42 / 0.04);
}

.body--dark .auth-form,
html[data-theme='dark'] .auth-form {
  box-shadow:
    0 24px 56px rgb(0 0 0 / 0.45),
    0 0 0 1px rgb(255 255 255 / 0.05);
}

.auth-form__header {
  padding-bottom: 0.25rem;
}

.auth-form__title {
  margin: 0 0 0.35rem;
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.auth-form__subtitle {
  margin: 0;
  color: var(--muted-foreground);
  font-size: calc(var(--font-size-base) * 0.9);
  max-width: none;
}

.auth-form__body {
  padding-top: 1rem;
}

.auth-form__fields {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.auth-form__field :deep(.q-field__control) {
  border-radius: var(--radius-md);
}

.auth-form__submit {
  margin-top: 0.75rem;
  min-height: 48px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.auth-form__footer {
  padding-top: 0.5rem;
  font-size: calc(var(--font-size-base) * 0.9);
}

.auth-form__switch {
  margin-right: 0.35rem;
}

.auth-form__link {
  font-weight: 600;
  text-decoration: none;
  color: var(--foreground);
}

.auth-form__link:hover {
  text-decoration: underline;
}

.auth-form__error {
  background: rgb(185 28 28 / 0.1);
  color: var(--destructive);
  border: 1px solid rgb(185 28 28 / 0.25);
}

.body--dark .auth-form__error,
html[data-theme='dark'] .auth-form__error {
  background: rgb(239 68 68 / 0.12);
  border-color: rgb(239 68 68 / 0.3);
}
</style>
