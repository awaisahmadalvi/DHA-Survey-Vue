import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login/LoginPage.vue'
import Logout from '../views/Login/LogoutPage.vue'
import PhasesList from '../views/Phases/PhasesList.vue'
import SectorsList from '../views/Sectors/SectorsList.vue'
import CategoriesList from '../views/Categories/CategoriesList.vue'
import PostsList from '../views/UserManagement/Posts/PostsList.vue'
import OfficersList from '../views/UserManagement/Officer/OfficerList.vue'
import UsersList from '../views/UserManagement/Users/UserList.vue'
import loginCheck from '@/middleware/loginCheck'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      hideNavbar: true,
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/phases',
    name: 'Phases',
    component: PhasesList
  },
  {
    path: '/sectors',
    name: 'Sectors',
    component: SectorsList
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesList
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsList
  },
  {
    path: '/officers/:id?',
    name: 'Officers',
    component: OfficersList
  },
  {
    path: '/users/:id?',
    name: 'Users',
    component: UsersList
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log("TO: ", to);
  console.log("FROM: ", from);
  if (to.name === "Login") next();
  else loginCheck(router, next)
});

export default router
