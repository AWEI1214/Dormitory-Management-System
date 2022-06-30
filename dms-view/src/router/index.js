import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/a_stinfo',
    name: 'a_stinfo',
    component: () => import('../pages/a_stinfo.vue')
  },{
    path: '/a_sinfo',
    name: 'a_sinfo',
    component: () => import('../pages/a_sinfo.vue')
  },{
    path: '/a_cinfo',
    name: 'a_cinfo',
    component: () => import('../pages/a_cinfo.vue')
  },{
    path: '/a_pinfo',
    name: 'a_pinfo',
    component: () => import('../pages/a_pinfo.vue')
  },{
    path: '/a_finfo',
    name: 'a_finfo',
    component: () => import('../pages/a_finfo.vue')
  },{
    path: '/s_self',
    name: 's_self',
    component: () => import('../pages/s_self.vue')
  },{
    path: '/s_cinfo',
    name: 's_cinfo',
    component: () => import('../pages/s_cinfo.vue')
  },{
    path: '/s_info',
    name: 's_info',
    component: () => import('../pages/s_info.vue')
  },{
    path: '/s_pinfo',
    name: 's_pinfo',
    component: () => import('../pages/s_pinfo.vue')
  },{
    path: '/s_finfo',
    name: 's_finfo',
    component: () => import('../pages/s_finfo.vue')
  },{
    path: '/a_basic',
    name: 'a_basic',
    component: () => import('../pages/a_basic.vue')
  },{
    path: '/test',
    name: 'test',
    component: () => import('../pages/test.vue')
  },
  {
    path:'/:catchAll(.*)',
    component: () => import('../pages/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router