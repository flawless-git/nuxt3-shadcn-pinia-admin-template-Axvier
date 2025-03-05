import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Skip middleware for public routes
  // if (to.path === "/" || to.path === "/login") {
  //   return;
  // }

  // Try to restore session if we have a token
  if (!authStore.isAuthenticated && authStore.token) {
    const success = await authStore.checkAuth();
    if (!success && to.path.startsWith("/admin")) {
      return navigateTo("/login");
    }
  }

  // Protect admin routes
  if (to.path.startsWith("/admin") && !authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  // Redirect logged in users from login page
  if (to.path === "/login" && authStore.isAuthenticated) {
    return navigateTo("/admin");
  }
});
