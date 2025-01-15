import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AddEditTask from '@/views/AddEditTask.vue';
import LoginPage from '@/views/LoginUser.vue';
import RegisterPage from '@/views/RegistrationUser.vue';
import { auth } from '@/services/firebaseConfig';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  { path: '/register',
     name: 'Register',
      component: RegisterPage
 },
  { path: '/login',
     name: 'Login',
      component: LoginPage },
  {
    path: '/add',
    name: 'AddTask',
    component: AddEditTask
  },
  {
    path: '/edit/:task',
    name: 'EditTask',
    component: AddEditTask,
    beforeEnter: (to, from, next) => {
      if (to.params.task) {
        next();
      } else {
        next('/home');
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;