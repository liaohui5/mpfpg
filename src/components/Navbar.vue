<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { cn } from "@/lib/utils";

const route = useRoute();

const navItems = [
  { path: "/prompt", label: "提示词", name: "PromptGenerate" },
  { path: "/config", label: "配置", name: "Config" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
      <div class="mr-4 hidden md:flex">
        <RouterLink to="/prompt" class="mr-6 flex items-center space-x-2">
          <span class="hidden font-bold sm:inline-block text-lg">Pure Function Prompt Generator</span>
        </RouterLink>
      </div>
      <nav class="flex items-center space-x-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="
            cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              route.name === item.name
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )
          "
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
