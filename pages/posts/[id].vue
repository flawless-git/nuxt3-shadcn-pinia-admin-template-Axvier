<script setup lang="ts">
import type { Post } from "@/types/data";

const route = useRoute();
const router = useRouter();

// Fetch single post with proper typing
const { data: post } = await useFetch<Post>(`/api/posts/${route.params.id}`, {
  transform: (response: Post) => ({
    ...response,
    createdAt: new Date(response.createdAt).toLocaleDateString(),
  }),
});

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="post" class="max-w-2xl mx-auto">
      <div class="mb-6">
        <Button variant="outline" size="sm" @click="goBack">Back</Button>
      </div>

      <article class="prose dark:prose-invert max-w-none">
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>

        <div class="flex items-center gap-4 text-muted-foreground mb-8">
          <p>By {{ post.author?.username }}</p>
          <p>{{ post.createdAt }}</p>
          <Badge :variant="post.published ? 'default' : 'secondary'">
            {{ post.published ? "Published" : "Draft" }}
          </Badge>
        </div>

        <div class="whitespace-pre-wrap">
          {{ post.content }}
        </div>
      </article>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-xl text-muted-foreground">Post not found</p>
    </div>
  </div>
</template>
