<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Pencil,
  Trash2,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-vue-next";
import type { Post } from "@/types/data";
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);
const authStore = useAuthStore();

// Update ref with type
const posts = ref<Post[]>([]);

// Fetch posts
const fetchPosts = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch("/api/posts");
    if (authStore.user?.role === "ADMIN") {
      posts.value = data;
    } else {
      posts.value = data.filter((post) => post.authorId === authStore.user?.id);
    }
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to fetch posts",
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

// Delete post
const handleDelete = async (id: number) => {
  try {
    await $fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    toast({
      title: "Success",
      description: "Post berhasil dihapus",
      duration: 3000,
    });
    await fetchPosts();
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to delete post",
      duration: 3000,
    });
  }
};

// Edit post
const handleEdit = (id: number) => {
  router.push(`/admin/posts/${id}/edit`);
};

// Sort posts
const sortField = ref<keyof Post | null>(null);
const sortDirection = ref<"asc" | "desc" | null>(null);

const sortedData = computed(() => {
  const sorted = [...posts.value];
  const currentSortField = sortField.value;
  const currentSortDirection = sortDirection.value;

  if (currentSortField && currentSortDirection) {
    sorted.sort((a, b) => {
      const aValue = a[currentSortField];
      const bValue = b[currentSortField];

      // Perbaikan typo pada kondisi
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle perbandingan tanggal
      if (currentSortField === "createdAt") {
        // Tambahkan type assertion untuk Date
        const dateA = new Date(aValue as string);
        const dateB = new Date(bValue as string);
        return currentSortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Handle boolean untuk status published
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return currentSortDirection === "asc"
          ? aValue === bValue
            ? 0
            : aValue
            ? -1
            : 1
          : aValue === bValue
          ? 0
          : aValue
          ? 1
          : -1;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return currentSortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return currentSortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }
  return sorted;
});

const handleSort = (field: keyof Post) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

onMounted(fetchPosts);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Posts</h1>
        <p class="text-muted-foreground">Manage blog posts</p>
      </div>
      <NuxtLink to="/admin/posts/create">
        <Button>
          <Plus class="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </NuxtLink>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Posts</CardTitle>
        <CardDescription>List of all blog posts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  :class="sortField === 'title' ? 'bg-muted' : ''"
                  variant="ghost"
                  @click="handleSort('title')"
                >
                  Title
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                  <span v-if="sortField === 'title'" class="ml-1">
                    {{ sortDirection === "asc" ? "↑" : "↓" }}
                  </span>
                </Button>
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>
                <Button
                  :class="sortField === 'published' ? 'bg-muted' : ''"
                  variant="ghost"
                  @click="handleSort('published')"
                >
                  Status
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                  <span v-if="sortField === 'published'" class="ml-1">
                    {{ sortDirection === "asc" ? "↑" : "↓" }}
                  </span>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  :class="sortField === 'createdAt' ? 'bg-muted' : ''"
                  variant="ghost"
                  @click="handleSort('createdAt')"
                >
                  Created At
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                  <span v-if="sortField === 'createdAt'" class="ml-1">
                    {{ sortDirection === "asc" ? "↑" : "↓" }}
                  </span>
                </Button>
              </TableHead>
              <TableHead class="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="post in sortedData" :key="post.id">
              <TableCell>{{ post.title }}</TableCell>
              <TableCell>{{ post.author.username }}</TableCell>
              <TableCell>
                <Badge :variant="post.published ? 'default' : 'secondary'">
                  {{ post.published ? "Published" : "Draft" }}
                </Badge>
              </TableCell>
              <TableCell>{{
                new Date(post.createdAt).toLocaleDateString()
              }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as="Button" variant="ghost" size="icon">
                    <MoreHorizontal class="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem @click="handleEdit(post.id)">
                      <Pencil class="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      class="text-destructive focus:text-destructive"
                      @click="handleDelete(post.id)"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
