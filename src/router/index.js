import * as VueRouter from 'vue-router';

import Dashboard from '../components/Dashboard.vue'
import { HeartRateMonitor, Database } from '@vicons/tabler'
import { DeveloperBoard20Regular } from '@vicons/fluent'
import { DeveloperBoardSharp } from '@vicons/material'


export const routes = [
  { path: '/', name: 'dashboard', icon: HeartRateMonitor, component: Dashboard, lable: 'integration' },
  { path: '/datasource', name: 'datasource', icon: Database, component: () => import('../components/Datasource.vue'), lable: 'integration'},
  { path: '/task', name: 'task', icon: DeveloperBoard20Regular, component: () => import('../components/Task.vue'), lable: 'integration'},
  { path: '/antv/x6/demo', name: 'antv-x6-demo', icon: DeveloperBoard20Regular, component: () => import('../components/Test.vue'), lable: 'integration'},
  { path: '/antv/x6/dag', name: 'antv-x6-dag', icon: DeveloperBoard20Regular, component: () => import('../components/dag/index.vue'), lable: 'integration'},
  { path: '/develop', name: 'develop', icon: DeveloperBoardSharp, component: () => import('../components/develop/Sql.vue'), lable: 'development'},
  { path: '/drag', name: 'drag', icon: DeveloperBoardSharp, component: () => import('../components/drag/drag.vue'), lable: 'integration'},
  { path: '/sqlEditor', name: 'sql-editor', icon: DeveloperBoardSharp, component: () => import('../components/sql/sqlEditor.vue'), lable: 'integration'},

]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

export default router;