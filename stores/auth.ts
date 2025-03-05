import { defineStore } from "pinia";
import type { User, LoginPayload, AuthResponse } from "@/types/data";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = ref(false);

    const isAdmin = computed(() => user.value?.role === "ADMIN");

    function setUser(newUser: User) {
      user.value = newUser;
      isAuthenticated.value = true;
    }

    function setToken(newToken: string) {
      token.value = newToken.startsWith("Bearer ")
        ? newToken
        : `Bearer ${newToken}`;
    }

    function clearAuth() {
      user.value = null;
      token.value = null;
      isAuthenticated.value = false;
    }

    async function login(payload: LoginPayload) {
      try {
        const response = await $fetch<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: payload,
        });

        // Only set auth state if we get a valid response
        if (response?.user && response?.token) {
          setUser(response.user);
          setToken(response.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        clearAuth();
        throw createError({
          statusCode: 401,
          message: "Email/Username atau password salah",
        });
      }
    }

    async function logout() {
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        clearAuth();
      }
    }

    async function checkAuth() {
      // Don't check auth on login page
      if (import.meta.client && window.location.pathname === "/login") {
        return false;
      }

      // If we have a token, verify it
      if (token.value) {
        try {
          const response = await $fetch<{ user: User }>("/api/auth/me", {
            headers: {
              Authorization: token.value,
            },
          });

          if (response.user) {
            setUser(response.user);
            return true;
          }
        } catch (error) {
          console.error("Check auth error:", error);
          clearAuth();
        }
      }

      return false;
    }

    return {
      user,
      token,
      isAuthenticated,
      isAdmin,
      setUser,
      setToken,
      clearAuth,
      login,
      logout,
      checkAuth,
    };
  },
  {
    persist: import.meta.client && {
      storage: localStorage,
    },
  }
);
