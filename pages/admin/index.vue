<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import type { User } from "@/types/data";
import { useAuthStore } from "@/stores/auth";
import { Users, FileText } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
  validate: async () => {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  },
});

const { toast } = useToast();
const authStore = useAuthStore();

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  navigateTo("/login");
}

const stats = ref({
  users: 0,
  posts: 0,
});

const fetchStats = async () => {
  try {
    const [users, posts] = await Promise.all([
      $fetch<User[]>("/api/users"),
      $fetch("/api/posts"),
    ]);

    stats.value = {
      users: users.length,
      posts: Array.isArray(posts) ? posts.length : 0,
    };
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to fetch stats",
      duration: 3000,
    });
  }
};

// Only fetch data if authenticated
if (authStore.isAuthenticated) {
  onMounted(fetchStats);
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back, {{ authStore.user?.username }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Users</CardTitle>
          <Users class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.users }}</div>
          <p class="text-xs text-muted-foreground">
            Registered users in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Posts</CardTitle>
          <FileText class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.posts }}</div>
          <p class="text-xs text-muted-foreground">
            Published posts in the system
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
