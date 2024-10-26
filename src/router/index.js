// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import WriterDashboard from "@/views/WriterDashboard.vue";
import EditorDashboard from "@/views/EditorDashboard.vue";
import AllMedia from "@/views/AllMedia.vue";
import ManageUsers from "@/views/ManageUsers.vue";
import ManageCompanies from "@/views/ManageCompanies.vue";
import NotAuthorized from "@/views/NotAuthorized.vue";
import CreateArticle from "@/views/CreateArticle.vue";
import EditArticle from "@/views/EditArticle.vue";

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
  {
    path: "/create-article",
    name: "CreateArticle",
    component: CreateArticle,
    meta: { requiresAuth: true, role: "Writer" },
  },
  {
    path: "/edit-article/:id",
    name: "EditArticle",
    component: EditArticle,
    meta: { requiresAuth: true, role: ["Writer", "Editor"] }, // Both roles can edit, with permissions
  },
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
