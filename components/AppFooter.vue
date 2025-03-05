<script lang="ts" setup>
const appName = useAppConfig().title;
</script>

<template>
  <footer class="py-6 px-6 bg-background border-t">
    <div class="container mx-auto">
      <div
        class="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style></style>
