<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 pt-4">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
