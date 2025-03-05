<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { useRoute } from "vue-router";
import {
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LineChart,
} from "lucide-vue-next";

const route = useRoute();
const { user, logout, isAdmin } = useAuth();
const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const userLinks = [{ to: "/admin/users", label: "All Users", icon: Users }];

const postLinks = [{ to: "/admin/posts", label: "All Posts", icon: FileText }];
</script>

<template>
  <div class="bg-background border-r" :class="[isCollapsed ? 'w-16' : 'w-64']">
    <!-- Sidebar Header -->
    <div class="p-4 border-b flex items-center justify-between">
      <div v-if="!isCollapsed">
        <h2 class="text-lg font-semibold">Admin Panel</h2>
        <p class="text-sm text-muted-foreground">Manage your content</p>
      </div>
      <Button
        class="shrink-0"
        variant="ghost"
        size="icon"
        @click="toggleCollapse"
      >
        <ChevronLeft v-if="!isCollapsed" class="h-5 w-5" />
        <ChevronRight v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto">
      <div class="p-2 space-y-4">
        <!-- Dashboard Section -->
        <div>
          <div class="flex items-center gap-2 px-2 py-1.5">
            <LayoutDashboard class="w-4 h-4 text-muted-foreground" />
            <h3
              v-if="!isCollapsed"
              class="text-sm font-medium text-muted-foreground"
            >
              Dashboard
            </h3>
          </div>
          <div class="mt-1 space-y-1">
            <NuxtLink
              to="/admin"
              class="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
              :class="[
                { 'bg-accent': route.path === '/admin' },
                isCollapsed ? 'justify-center' : '',
              ]"
              :title="isCollapsed ? 'Overview' : ''"
            >
              <LineChart class="w-4 h-4" />
              <span v-if="!isCollapsed" class="text-sm">Overview</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Users Section - Only for Admin -->
        <div v-if="isAdmin">
          <div class="flex items-center gap-2 px-2 py-1.5">
            <Users class="w-4 h-4 text-muted-foreground" />
            <h3
              v-if="!isCollapsed"
              class="text-sm font-medium text-muted-foreground"
            >
              Users
            </h3>
          </div>
          <div class="mt-1 space-y-1">
            <NuxtLink
              v-for="item in userLinks"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
              :class="[
                { 'bg-accent': route.path === item.to },
                isCollapsed ? 'justify-center' : '',
              ]"
              :title="isCollapsed ? item.label : ''"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Posts Section -->
        <div>
          <div class="flex items-center gap-2 px-2 py-1.5">
            <FileText class="w-4 h-4 text-muted-foreground" />
            <h3
              v-if="!isCollapsed"
              class="text-sm font-medium text-muted-foreground"
            >
              Posts
            </h3>
          </div>
          <div class="mt-1 space-y-1">
            <NuxtLink
              v-for="item in postLinks"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
              :class="[
                { 'bg-accent': route.path === item.to },
                isCollapsed ? 'justify-center' : '',
              ]"
              :title="isCollapsed ? item.label : ''"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- User Info & Logout -->
    <div class="p-4 border-t">
      <div v-if="!isCollapsed" class="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage
            :src="user?.avatar ? `/${user.avatar.replace(/^\//, '')}` : ''"
            :alt="user?.username || 'User avatar'"
          />
          <AvatarFallback>
            {{ user?.username?.charAt(0).toUpperCase() }}
          </AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium">{{ user?.username }}</p>
          <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
        </div>
      </div>
      <Button
        variant="outline"
        :class="[isCollapsed ? 'w-8 h-8 p-0' : 'w-full']"
        :title="isCollapsed ? 'Logout' : ''"
        @click="logout"
      >
        <LogOut class="w-4 h-4" :class="{ 'mr-2': !isCollapsed }" />
        <span v-if="!isCollapsed">Logout</span>
      </Button>
    </div>
  </div>
</template>
