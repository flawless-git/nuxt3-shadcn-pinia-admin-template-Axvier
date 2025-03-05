<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import type { User } from "@/types/data";
import { Pencil, Trash2, MoreHorizontal, UserPlus } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const { toast } = useToast();
const users = ref<User[]>([]);
const isLoading = ref(false);

// Fetch users
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch<User[]>("/api/users");
    users.value = data;
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to fetch users",
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const router = useRouter();

const handleEdit = (userId: string) => {
  router.push(`/admin/users/${userId}/edit`);
};

// Delete user
const handleDelete = async (id: string) => {
  try {
    await $fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    toast({
      title: "Success",
      description: "User berhasil dihapus",
      duration: 3000,
    });
    await fetchUsers();
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to delete user",
      duration: 3000,
    });
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Users</h1>
        <p class="text-muted-foreground">Manage system users</p>
      </div>
      <NuxtLink to="/admin/users/create">
        <Button>
          <UserPlus class="w-4 h-4 mr-2" />
          Create User
        </Button>
      </NuxtLink>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>List of all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead class="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell>{{ user.username }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>{{ user.role }}</TableCell>
              <TableCell>{{
                new Date(user.createdAt).toLocaleDateString()
              }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as="Button" variant="ghost" size="icon">
                    <MoreHorizontal class="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem @click="handleEdit(user.id)">
                      <Pencil class="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      class="text-destructive focus:text-destructive"
                      @click="handleDelete(user.id)"
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
