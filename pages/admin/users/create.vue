<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { z } from "zod";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type Role = (typeof Role)[keyof typeof Role];

const router = useRouter();
const { toast } = useToast();
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const avatarFile = ref<File | null>(null);

// Form validation schema
const validationSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh berisi huruf, angka, dan underscore"
      ),
    email: z
      .string()
      .email("Email tidak valid")
      .max(255, "Email terlalu panjang"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(32, "Password maksimal 32 karakter"),
    role: z.nativeEnum(Role, {
      errorMap: () => ({ message: "Role tidak valid" }),
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: role, errorMessage: roleError } = useField<Role>(
  "role",
  undefined,
  {
    initialValue: Role.USER,
  }
);

const isLoading = ref(false);

const handleFileInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    avatarFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    // Create user first
    const response = await $fetch("/api/users", {
      method: "POST",
      body: {
        username: values.username.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        role: values.role,
      },
    });

    // Upload avatar if selected
    if (avatarFile.value) {
      const formData = new FormData();
      formData.append("avatar", avatarFile.value);
      await $fetch(`/api/users/avatar/${response.id}`, {
        method: "POST",
        body: formData,
      });
    }

    toast({
      title: "Success",
      description: "User berhasil dibuat",
      duration: 3000,
    });

    router.push("/admin/users");
  } catch (error: unknown) {
    console.error("Create error:", error);
    const message =
      error.data?.message || error.message || "Gagal membuat user";
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Create User</h1>
        <p class="text-muted-foreground">Create a new user</p>
      </div>
      <NuxtLink to="/admin/users">
        <Button variant="outline">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </NuxtLink>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Create User</CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <!-- Avatar Upload -->
          <div class="space-y-2">
            <Label>Avatar</Label>
            <div class="flex items-center gap-4">
              <Avatar class="w-24 h-24">
                <AvatarImage :src="previewUrl || ''" />
                <AvatarFallback>
                  {{ username?.charAt(0).toUpperCase() || "U" }}
                </AvatarFallback>
              </Avatar>
              <Input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @input="handleFileInput"
              />
            </div>
          </div>

          <!-- Username field -->
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input id="username" v-model="username" placeholder="johndoe" />
            <span v-if="usernameError" class="text-sm text-destructive">
              {{ usernameError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="john@example.com"
            />
            <span v-if="emailError" class="text-sm text-destructive">
              {{ emailError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
            />
            <span v-if="passwordError" class="text-sm text-destructive">
              {{ passwordError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="role">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="Role.USER">User</SelectItem>
                <SelectItem :value="Role.ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <span v-if="roleError" class="text-sm text-destructive">
              {{ roleError }}
            </span>
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? "Creating..." : "Create User" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
