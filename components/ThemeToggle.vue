<script setup lang="ts">
const colorMode = useColorMode();
import { Sun, Moon } from "lucide-vue-next";
</script>

<template>
  <Button
    variant="outline"
    @click="
      colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
    "
  >
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
