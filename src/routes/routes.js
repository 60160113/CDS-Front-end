import Vue from "vue";
import VueRouter from "vue-router";

import AuthLayout from "../layouts/AuthLayout.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";

import LoginPage from "../pages/Auth/LoginPage.vue";
import HomePage from "../pages/User/HomePage.vue";

import store from "../store";

const ifAuthenticate = (to, from, next) => {
  console.log(to);
}

let authPages = {
  path: "/",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/login",
      name: "Login",
      component: LoginPage
    }
  ]
};

let dashboardPages = {
  path: "/pages",
  component: DashboardLayout,
  name: "Pages",
  redirect: "/pages/home",
  children: [
    {
      path: "home",
      name: "Home",
      component: HomePage,
      beforeRouteEnter: ifAuthenticate
    },
    {
      path: "/configuration",
      name: "configuration",
      component: () => import('@/pages/configuration')
    },
    {
      path: "/configuration/add",
      name: "add configuration",
      component: () => import('@/pages/configuration/add.vue')
    },
    {
      path: "/cds",
      name: "common data set",
      component: () => import('@/pages/cds')
    },
  ]
};

const routes = [
  {
    path: "/",
    redirect: "/login",
    name: "Login"
  },
  dashboardPages,
  authPages
];

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkExactActiveClass: "nav-item active"
});

export default router;
