import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login/LoginPage.vue'
import Logout from '../views/Login/LogoutPage.vue'
import PhasesList from '../views/MasterPages/Phases/PhasesList.vue'
import SectorsList from '../views/MasterPages/Sectors/SectorsList.vue'
import ComplaintTypesList from '../views/MasterPages/ComplaintTypes/ComplaintTypesList.vue'
import ComplaintsList from '../views/Complaints/ComplaintsList.vue'
import CategoriesList from '../views/MasterPages/Categories/CategoriesList.vue'
import PostsList from '../views/MasterPages/UserManagement/Posts/PostsList.vue'
import OfficersList from '../views/MasterPages/UserManagement/Officer/OfficerList.vue'
import UsersList from '../views/MasterPages/UserManagement/Users/UserList.vue'
import ComplaintDetails from '../views/Complaints/ComplaintDetails/ComplaintDetails.vue'
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
    path: '/complaints',
    name: 'Complaints',
    component: ComplaintsList
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
    path: '/complainttypes',
    name: 'ComplaintTypes',
    component: ComplaintTypesList
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
  {
    path: '/complaintDetails/:id?',
    name: 'ComplaintDetails',
    component: ComplaintDetails
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
