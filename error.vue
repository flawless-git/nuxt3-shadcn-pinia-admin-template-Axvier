<script setup lang="ts">
import { ArrowLeft, Home } from "lucide-vue-next";
const error = useError();

// Props from Nuxt error handling
defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

useHead({
  title: "Error - Something went wrong",
});

const router = useRouter();

const handleError = () => {
  clearError({ redirect: "/" });
};

const goBack = () => {
  router.back();
};

const errorMessage = computed(() => {
  if (error.value?.statusCode === 404) {
    return "Halaman yang Anda cari tidak dapat ditemukan";
  }
  return "Terjadi kesalahan pada sistem";
});

const errorCode = computed(() => {
  return error.value?.statusCode || "500";
});
</script>

<template>
  <NuxtLayout>
    <div
      class="min-h-screen grid place-items-center px-6 py-24 sm:py-32 lg:px-8"
    >
      <div class="text-center">
        <!-- Animated Error Number -->
        <div class="relative">
          <h1
            class="text-9xl font-black text-gray-200 dark:text-gray-800 animate-pulse"
          >
            {{ errorCode }}
          </h1>
          <p
            class="absolute inset-0 grid place-items-center text-4xl font-bold tracking-tight text-primary"
          >
            Oops!
          </p>
        </div>

        <!-- Error Message -->
        <div class="mt-8">
          <h2 class="text-2xl font-semibold tracking-tight">
            {{ error?.statusMessage || "Something went wrong" }}
          </h2>
          <p class="mt-4 text-base text-muted-foreground max-w-[500px] mx-auto">
            {{
              error?.message ||
              "Sorry, we couldn't find what you were looking for."
            }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 flex items-center justify-center gap-4">
          <Button @click="goBack" variant="outline" size="lg" class="gap-2">
            <ArrowLeft class="h-4 w-4" />
            Kembali
          </Button>
          <Button @click="handleError" size="lg" class="gap-2">
            <Home class="h-4 w-4" />
            Ke Beranda
          </Button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
