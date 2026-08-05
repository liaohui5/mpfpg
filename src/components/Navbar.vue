<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const route = useRoute();
const { t, locale } = useI18n();

const navItems = [
  { path: "/prompt", name: "PromptGenerate" },
  { path: "/config", name: "Config" },
];

const languages = [
  { value: "zh-CN", label: "中文" },
  { value: "en", label: "English" },
];

function handleLocaleChange(value: unknown) {
  if (typeof value === "string") {
    locale.value = value;
    localStorage.setItem("locale", value);
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 space-x-4">
      <div class="mr-4 hidden md:flex">
        <RouterLink to="/prompt" class="flex items-center space-x-2">
          <span class="font-bold text-lg">Mini Pure Function Prompt Generator</span>
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
          {{ t(`nav.${item.name === 'PromptGenerate' ? 'prompt' : 'config'}`) }}
        </RouterLink>
      </nav>

      <div class="ml-auto">
        <Select :model-value="locale" @update:model-value="handleLocaleChange">
          <SelectTrigger class="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="lang in languages" :key="lang.value" :value="lang.value">
              <SelectItemText>{{ lang.label }}</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </header>
</template>
