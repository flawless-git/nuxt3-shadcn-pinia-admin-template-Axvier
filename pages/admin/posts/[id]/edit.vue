<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { z } from "zod";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuth } from "@/composables/useAuth";
import type { Post } from "@/types/data";

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const { token } = useAuth();
const isLoading = ref(false);

// Add type for published status
type PublishedStatus = "true" | "false";

const validationSchema = toTypedSchema(
  z.object({
    title: z
      .string()
      .min(3, "Title minimal 3 karakter")
      .max(255, "Title maksimal 255 karakter"),
    content: z.string().min(10, "Content minimal 10 karakter"),
    published: z.boolean().default(false),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const {
  value: title,
  errorMessage: titleError,
  setValue: setTitle,
} = useField<string>("title");
const {
  value: content,
  errorMessage: contentError,
  setValue: setContent,
} = useField<string>("content");
const { value: published, setValue: setPublished } =
  useField<boolean>("published");

// Add computed for published status
const publishedStatus = computed({
  get: () => (published.value ? "true" : "false") as PublishedStatus,
  set: (val: PublishedStatus) => {
    published.value = val === "true";
  },
});

// Add status options
const publishedOptions: { label: string; value: PublishedStatus }[] = [
  { label: "Published", value: "true" },
  { label: "Draft", value: "false" },
];

// Fetch post data if editing
const { data: post } = await useFetch<Post>(`/api/posts/${route.params.id}`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

// Set form values if post exists
watchEffect(() => {
  if (post.value) {
    setTitle(post.value.title);
    setContent(post.value.content || "");
    setPublished(post.value.published);
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    // Use $fetch for PUT operation
    await $fetch(`/api/posts/${route.params.id}`, {
      method: "PUT",
      body: {
        title: values.title.trim(),
        content: values.content.trim(),
        published: values.published,
      },
    });

    toast({
      title: "Success",
      description: "Post updated successfully",
      duration: 3000,
    });

    router.push("/admin/posts");
  } catch (error: unknown) {
    console.error("Update post error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to update post",
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Edit Post</h1>
        <p class="text-muted-foreground">Make changes to your post</p>
      </div>
      <NuxtLink to="/admin/posts">
        <Button variant="outline">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
      </NuxtLink>
    </div>

    <form class="space-y-8" @submit.prevent="onSubmit">
      <Card>
        <CardHeader>
          <CardTitle>Post Information</CardTitle>
          <CardDescription>Edit your post details below</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <Label for="title">Title</Label>
            <Input id="title" v-model="title" placeholder="Enter post title" />
            <span v-if="titleError" class="text-sm text-destructive">
              {{ titleError }}
            </span>
          </div>

          <!-- Content -->
          <div class="space-y-2">
            <Label for="content">Content</Label>
            <Textarea
              id="content"
              v-model="content"
              placeholder="Write your post content"
              rows="10"
            />
            <span v-if="contentError" class="text-sm text-destructive">
              {{ contentError }}
            </span>
          </div>

          <!-- Published Status -->
          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select
              v-model="publishedStatus"
              @update:model-value="(val) => publishedStatus = val as PublishedStatus"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select post status">
                  {{
                    publishedOptions.find(
                      (opt) => opt.value === publishedStatus
                    )?.label
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in publishedOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  <Badge
                    :variant="option.value === 'true' ? 'default' : 'secondary'"
                  >
                    {{ option.label }}
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            @click="router.push('/admin/posts')"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? "Saving..." : "Save Changes" }}
          </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>
