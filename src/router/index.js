// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import WriterDashboard from "@/views/WriterDashboard.vue";
import EditorDashboard from "@/views/EditorDashboard.vue";
import AllMedia from "@/views/AllMedia.vue";
import ManageUsers from "@/views/ManageUsers.vue";
import ManageCompanies from "@/views/ManageCompanies.vue";
import NotAuthorized from "@/views/NotAuthorized.vue"; // Optional

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/writer-dashboard",
    name: "WriterDashboard",
    component: WriterDashboard,
    meta: { requiresAuth: true, role: "Writer" },
  },
  {
    path: "/editor-dashboard",
    name: "EditorDashboard",
    component: EditorDashboard,
    meta: { requiresAuth: true, role: "Editor" },
  },
  {
    path: "/all-media",
    name: "AllMedia",
    component: AllMedia,
    meta: { requiresAuth: true },
  },
  {
    path: "/manage-users",
    name: "ManageUsers",
    component: ManageUsers,
    meta: { requiresAuth: true, role: "Editor" },
  },
  {
    path: "/manage-companies",
    name: "ManageCompanies",
    component: ManageCompanies,
    meta: { requiresAuth: true, role: "Editor" },
  },
  {
    path: "/not-authorized",
    name: "NotAuthorized",
    component: NotAuthorized,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const userType = localStorage.getItem("userType"); // Adjust based on your auth logic

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" });
    } else {
      if (to.meta.role && to.meta.role !== userType) {
        next({ name: "NotAuthorized" }); // Redirect to a "Not Authorized" page
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
