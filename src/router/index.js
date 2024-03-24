import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '前台頁面',
    component: () => import('@/views/ForwardView.vue'),
    children: [
      // {
      //   path: '',
      //   name: '首頁',
      //   component: () => import('@/views/IndexView.vue')
      // },
      {
        path: '',
        name: '產品列表',
        component: () => import('@/views/forward/ProductsView.vue')
      },
      {
        path: '/product/:id',
        name: '產品詳細',
        component: () => import('@/views/forward/ProductView.vue')
      },
      {
        path: '/cart',
        name: '購物車',
        component: () => import('@/views/forward/CartView.vue')
      },
    ]
  },
  {
    path: '/login',
    name: '登入',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/admin',
    name: '後台',
    component: () => import('@/views/BackstageView.vue'),
    children: [
      {
        path: 'products',
        name: '後台產品列表',
        component: () => import('@/views/admin/AdminProducts.vue')
      },
      {
        path: 'coupon',
        name: '建立優惠卷',
        component: () => import('@/views/admin/AdminCoupon.vue')
      },
      {
        path: 'orders',
        name: '訂單列表',
        component: () => import('@/views/admin/AdminOrders.vue')
      },
      {
        path: 'check/:orderId',
        name: '結帳畫面',
        component: () => import('@/views/admin/AdminCheck.vue')
      },
      {
        path: 'article',
        name: '貼文',
        component: () => import('@/views/admin/AdminArticle.vue')
      },
    ]
  },
  {
    path: '/admin/:pathMatch(.*)*',
    redirect: { name: 'Login' },
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
