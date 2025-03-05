import { ref, watch } from "vue";
import { useDebounce } from "./useDebounce";
import type { Post } from "@/types/data";

interface SearchResponse {
  query: string;
  total: number;
  posts: Post[];
}

export function useSearch() {
  const search = ref("");
  const posts = ref<Post[]>([]);
  const isLoading = ref(false);
  const isOpen = ref(false);

  // Use debounced search value
  const debouncedSearch = useDebounce(search, 300);

  // Watch debounced search value
  watch(debouncedSearch, async (query) => {
    if (!query) {
      posts.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const response = await $fetch<SearchResponse>("/api/posts/search", {
        query: { q: query },
      });
      posts.value = response.posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      posts.value = [];
    } finally {
      isLoading.value = false;
    }
  });

  const toggleSearch = () => {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      search.value = "";
      posts.value = [];
    }
  };

  return {
    search,
    posts,
    isLoading,
    isOpen,
    toggleSearch,
  };
}
