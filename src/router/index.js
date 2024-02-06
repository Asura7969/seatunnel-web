import * as VueRouter from 'vue-router';

import Dashboard from '../components/Dashboard.vue'
import { HeartRateMonitor, Database } from '@vicons/tabler'
import { DeveloperBoard20Regular } from '@vicons/fluent'
import { DeveloperBoardSharp } from '@vicons/material'


export const routes = [
  { path: '/', name: 'dashboard', icon: HeartRateMonitor, component: Dashboard },
  { path: '/datasource', name: 'datasource', icon: Database, component: () => import('../components/Datasource.vue'), },
  { path: '/task', name: 'task', icon: DeveloperBoard20Regular, component: () => import('../components/Task.vue'), },
  { path: '/develop', name: 'develop', icon: DeveloperBoardSharp, component: () => import('../components/Develop.vue'), },

]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export default router;