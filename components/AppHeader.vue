<script setup lang="ts">
const { title } = useAppConfig();

const components = [
  {
    title: "Dashboard",
    path: "/",
    description: "Lihat statistik dan informasi penting",
  },
  {
    title: "Products (Test 404 Page)",
    path: "/products",
    description: "Kelola produk dan inventori",
  },
  {
    title: "Admin",
    path: "/admin",
    description: "Manajemen pengguna dan hak akses",
  },
];

const handleNavigation = (path: string) => {
  navigateTo(path);
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
  >
    <div class="flex h-16 items-center px-6 gap-4 justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul
                  class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                >
                  <li v-for="component in components" :key="component.title">
                    <NavigationMenuLink as-child>
                      <button
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        @click="handleNavigation(component.path)"
                      >
                        <div class="text-sm font-medium leading-none">
                          {{ component.title }}
                        </div>
                        <p
                          class="line-clamp-2 text-sm leading-snug text-muted-foreground"
                        >
                          {{ component.description }}
                        </p>
                      </button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div class="flex-1 flex justify-center">
        <SearchPost />
      </div>

      <div class="flex items-center">
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Spacer to prevent content from going under the fixed header -->
  <div class="h-16" />
</template>
