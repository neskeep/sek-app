<script setup lang="ts">
const navigation = useNavigationStore()
const { menuItems } = storeToRefs(navigation)
</script>

<template>
  <header class="bg-white border-b border-gray-100">
    <div class="container-app">
      <nav class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="font-bold text-xl text-primary">
          SEK Colombia
        </NuxtLink>
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-primary transition-colors"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
