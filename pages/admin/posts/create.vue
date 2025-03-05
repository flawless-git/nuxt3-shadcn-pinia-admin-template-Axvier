<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { z } from "zod";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);
const authStore = useAuthStore();

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
    authorId: z.string().min(1, "Author is required"),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const { value: title, errorMessage: titleError } = useField<string>("title");

const { value: content, errorMessage: contentError } =
  useField<string>("content");

const { value: published } = useField<boolean>("published", undefined, {
  initialValue: false,
});

const { value: authorId, errorMessage: authorError } =
  useField<string>("authorId");

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

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    const postData = {
      title: values.title.trim(),
      content: values.content.trim(),
      published: Boolean(values.published), // Handle boolean conversion here
      authorId: values.authorId,
    };

    console.log("Submitting post:", postData);

    const response = await $fetch("/api/posts", {
      method: "POST",
      body: postData,
    });

    console.log("Response:", response);

    toast({
      title: "Success",
      description: "Post created successfully",
      duration: 3000,
    });

    router.push("/admin/posts");
  } catch (error: unknown) {
    console.error("Create post error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to create post",
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
        <h1 class="text-3xl font-bold">Create Post</h1>
        <p class="text-muted-foreground">Create a new blog post</p>
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
          <CardDescription>Enter your post details below</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Author Selection -->
          <div class="space-y-2">
            <Label for="author">Author</Label>
            <Select v-model="authorId">
              <SelectTrigger>
                <SelectValue :placeholder="authStore.user?.username" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="authStore.user?.id as string">
                  {{ authStore.user?.username }}
                </SelectItem>
              </SelectContent>
            </Select>
            <span v-if="authorError" class="text-sm text-destructive">
              {{ authorError }}
            </span>
          </div>

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
            {{ isLoading ? "Creating..." : "Create Post" }}
          </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>
