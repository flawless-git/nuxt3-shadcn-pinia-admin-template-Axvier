import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/components/ui/toast/use-toast";
import type { LoginPayload } from "@/types/data";

export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const login = async (payload: LoginPayload): Promise<boolean> => {
    try {
      return await store.login(payload);
    } catch (error: unknown) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
      return false;
    }
  };

  const logout = async () => {
    await store.logout();
    await router.push("/login");
    toast.toast({
      variant: "destructive",
      title: "Success",
      description: "Logout berhasil",
    });
  };

  return {
    user: computed(() => store.user),
    token: computed(() => store.token),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    login,
    logout,
    checkAuth: store.checkAuth,
  };
};
