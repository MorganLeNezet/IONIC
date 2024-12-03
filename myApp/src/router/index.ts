import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AddEditTask from '../views/AddEditTask.vue';
import TaskDetail from '../views/TaskDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
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
  {
    path: '/detail/:task',
    name: 'TaskDetail',
    component: TaskDetail,
    beforeEnter: (to, from, next) => {
      if (to.params.task) {
        next();
      } else {
        next('/home');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;