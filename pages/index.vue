<script setup lang="ts">
import { Eye, Loader2 } from "lucide-vue-next";
import type { Post } from "@/types/data";

definePageMeta({
  layout: "default",
});

const currentPage = ref(1);
const postsPerPage = 8;
const isLoading = ref(true);
const error = ref<string | null>(null);

interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Public endpoint - only published posts
const { data: postsData, error: fetchError } = await useFetch<PostsResponse>(
  "/api/posts/published",
  {
    query: {
      page: currentPage,
      limit: postsPerPage,
    },
    watch: [currentPage],
  }
);

// Handle fetch error
watchEffect(() => {
  if (fetchError.value) {
    error.value = fetchError.value?.message || "Failed to fetch posts";
  } else {
    error.value = null;
  }
});

const posts = computed(() => postsData.value?.posts || []);
const totalPages = computed(() => postsData.value?.pagination?.totalPages || 0);

// Watch for page changes
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

onMounted(() => {
  isLoading.value = false;
});

const router = useRouter();

const handleView = (postId: number) => {
  router.push(`/posts/${postId}`);
};
</script>

<template>
  <div class="container mx-auto py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Latest Posts</h1>
        <p class="text-muted-foreground">
          Discover the latest updates and articles
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <Loader2 class="h-8 w-8 animate-spin mb-4" />
      <p class="text-lg text-muted-foreground">Loading posts...</p>
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive" class="mb-8">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Posts Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <Card v-for="post in posts" :key="post.id" class="flex flex-col">
        <CardHeader>
          <CardTitle class="line-clamp-1">{{ post.title }}</CardTitle>
          <CardDescription class="line-clamp-2">{{
            post.content
          }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <div class="flex items-center gap-2 mb-4">
            <p class="text-sm text-muted-foreground">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </p>
            <p class="text-sm text-muted-foreground">
              by {{ post.author?.username }}
            </p>
          </div>
          <Badge v-if="post.published" variant="default">Published</Badge>
          <Badge v-else variant="secondary">Draft</Badge>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="ghost" size="sm" @click="handleView(post.id)">
            <Eye class="w-4 h-4 mr-2" />
            View
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Empty State -->
    <Alert v-if="!isLoading && !error && posts.length === 0" class="mb-8">
      <AlertTitle>No Posts Found</AlertTitle>
      <AlertDescription>
        There are no posts available at the moment.
      </AlertDescription>
    </Alert>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1 || isLoading"
        @click="currentPage--"
      >
        Previous
      </Button>
      <Button
        v-for="page in totalPages"
        :key="page"
        :variant="currentPage === page ? 'default' : 'outline'"
        size="sm"
        :disabled="isLoading"
        @click="currentPage = page"
      >
        {{ page }}
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages || isLoading"
        @click="currentPage++"
      >
        Next
      </Button>
    </div>
  </div>
</template>
