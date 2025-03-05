<script setup lang="ts">
import { AppToaster } from "@/components/ui/toast";
import { PanelLeftClose, PanelLeftOpen } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const isSidebarOpen = ref(true);
const isCollapsed = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Check auth on layout mount
onMounted(async () => {
  if (!authStore.isAuthenticated && authStore.token) {
    const success = await authStore.checkAuth();
    if (!success) {
      router.push("/login");
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppHeader>
      <template #prefix>
        <Button
          class="shrink-0"
          variant="ghost"
          size="icon"
          @click="toggleSidebar"
        >
          <PanelLeftClose v-if="isSidebarOpen" class="h-5 w-5" />
          <PanelLeftOpen v-else class="h-5 w-5" />
        </Button>
      </template>
    </AppHeader>

    <div class="flex flex-1 h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <Transition name="slide">
        <AdminSidebar v-if="isSidebarOpen" v-model:is-collapsed="isCollapsed" />
      </Transition>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>

    <AppFooter class="border-t" />
    <AppToaster />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
