<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { z } from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { onMounted } from "vue";

const router = useRouter();
const { login } = useAuth();
const { toast } = useToast();

// Form validation schema
const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, "Email atau username harus diisi")
      .transform((val) => val.toLowerCase().trim()),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(32, "Password maksimal 32 karakter"),
  })
);

const { handleSubmit, meta, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

const email = ref("");
const password = ref("");

// Watch for changes and update form
watch(email, (newValue) => {
  setFieldValue("email", newValue);
});

watch(password, (newValue) => {
  setFieldValue("password", newValue);
});

const isLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const success = await login({
      email: values.email,
      password: values.password,
    });

    if (success) {
      toast({
        title: "Success",
        description: "Login berhasil",
      });
      router.push("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email/Username atau password salah",
      });
    }
  } catch (error: unknown) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    isLoading.value = false;
  }
});

onMounted(() => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    router.push("/admin");
  }
});
</script>

<template>
  <div class="min-h-screen grid place-items-center">
    <Card class="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle>Login Admin</CardTitle>
        <CardDescription>
          Masuk ke dashboard admin untuk mengelola sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="email">Email/Username</Label>
            <Input
              id="email"
              v-model="email"
              type="text"
              placeholder="Masukkan email atau username"
            />
            <span v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
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
            <span v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </span>
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="isLoading || !meta.valid"
          >
            {{ isLoading ? "Loading..." : "Login" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
