const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ],
  },
  {
    path: '/stats',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'stats', path: '', component: () => import('pages/StatsPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('pages/AuthPage.vue'),
        meta: { mode: 'login' },
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        name: 'register',
        path: '',
        component: () => import('pages/AuthPage.vue'),
        meta: { mode: 'register' },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
