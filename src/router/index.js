import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import FormPengaduan from '../views/FormPengaduan.vue'
import MasyarakatPengaduan from '../views/MasyarakatPengaduan.vue'
import Pengaduan from '../views/Pengaduan.vue'
import Petugas from '../views/Petugas.vue'
import Masyarakat from '../views/Masyarakat.vue'
import Kategori from '../views/Kategori.vue'

import Sidebar from '../views/layouts/Sidebar.vue'
import SidebarMasyarakat from '../views/layouts/SidebarMasyarakat.vue'
import Navbar from '../views/layouts/Navbar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/pengaduan',
    name: 'Pengaduan',
    components: {default:Pengaduan, header:Navbar, sidebar:Sidebar},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/masyarakat',
    name: 'Masyarakat',
    components: {default:Masyarakat, header:Navbar, sidebar:Sidebar},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kategori',
    name: 'Kategori',
    components: {default:Kategori, header:Navbar, sidebar:Sidebar},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/form',
    name: 'FormPengaduan',
    components: {default:FormPengaduan, header:Navbar, sidebar:SidebarMasyarakat},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/masyarakatpengaduan',
    name: 'MasyarakatPengaduan',
    components: {default:MasyarakatPengaduan, header:Navbar, sidebar:SidebarMasyarakat},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/petugas',
    name: 'Petugas',
    components: {default:Petugas, header:Navbar, sidebar:Sidebar},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})
export default router
