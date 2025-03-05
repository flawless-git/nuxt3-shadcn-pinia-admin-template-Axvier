<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { SearchIcon, Loader2 } from "lucide-vue-next";
import type { Post } from "@/types/data";
import { useSearch } from "@/composables/useSearch";

// Get search functionality from composable
const { search, posts, isLoading, isOpen, toggleSearch } = useSearch();

// Handle item selection
const onSelect = (post: Post) => {
  navigateTo(`/posts/${post.id}`);
  isOpen.value = false;
};

// Keyboard shortcut
onMounted(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toggleSearch();
    }
  };

  document.addEventListener("keydown", down);
  onUnmounted(() => document.removeEventListener("keydown", down));
});
</script>

<template>
  <div>
    <!-- Search Trigger Button -->
    <Button
      variant="outline"
      class="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
      @click="toggleSearch"
    >
      <SearchIcon class="h-4 w-4 xl:mr-2" aria-hidden="true" />
      <span class="hidden xl:inline-flex">Search posts...</span>
      <kbd
        class="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </Button>

    <!-- Search Dialog -->
    <CommandDialog :open="isOpen" @update:open="isOpen = $event">
      <DialogTitle class="sr-only">Search Posts</DialogTitle>
      <DialogDescription class="sr-only">
        Search through blog posts. Use arrow keys to navigate results.
      </DialogDescription>

      <Command class="rounded-lg border shadow-md">
        <CommandInput
          v-model="search"
          placeholder="Search posts..."
          @input="search = $event.target.value"
        />
        <CommandList>
          <CommandEmpty v-if="!isLoading && !posts.length">
            No posts found.
          </CommandEmpty>
          <div v-if="isLoading" class="py-6 text-center text-sm">
            <Loader2 class="mx-auto h-4 w-4 animate-spin" />
            <p class="mt-2 text-muted-foreground">Searching...</p>
          </div>
          <CommandGroup v-if="posts.length" heading="Posts">
            <CommandItem
              v-for="post in posts"
              :key="post.id"
              :value="post.title"
              @select="onSelect(post)"
            >
              <SearchIcon class="mr-2 h-4 w-4" />
              <span>{{ post.title }}</span>
              <Badge
                class="ml-2"
                :variant="post.published ? 'default' : 'secondary'"
              >
                {{ post.published ? "Published" : "Draft" }}
              </Badge>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  </div>
</template>

<style></style>
