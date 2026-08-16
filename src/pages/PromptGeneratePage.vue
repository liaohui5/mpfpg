<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useConfig } from "@/composables/useConfig";
import OpenAI from "openai";

const { t } = useI18n();
const { config, isConfigured } = useConfig();

const functionDescription = useLocalStorage(
  "mini-pure-function-prompt-generator-function-description",
  "",
);
const functionCallExample = useLocalStorage(
  "mini-pure-function-prompt-generator-function-call-example",
  "",
);
const functionReturnExample = useLocalStorage(
  "mini-pure-function-prompt-generator-function-return-example",
  "",
);
const promptText = useLocalStorage("mini-pure-function-prompt-generator-prompt-text", "");
const isSending = ref(false);
const responseMessage = ref("");

const selectedLanguage = useLocalStorage(
  "mini-pure-function-prompt-generator-selected-language",
  "",
);
const generateUnitTest = useLocalStorage(
  "mini-pure-function-prompt-generator-generate-unit-test",
  false,
);

function handleReset() {
  functionDescription.value = "";
  functionCallExample.value = "";
  functionReturnExample.value = "";
  selectedLanguage.value = "";
  generateUnitTest.value = false;
  promptText.value = "";
  responseMessage.value = "";
}

const languageOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "C", label: "C" },
  { value: "PHP", label: "PHP" },
  { value: "Lua", label: "Lua" },
  { value: "Bash", label: "Bash" },
];

const systemRole = computed(() => t("prompt.system_role").replaceAll("\n", ""));

const combinedPrompt = computed(() => {
  const parts: string[] = [];

  if (functionDescription.value.trim()) {
    let description = functionDescription.value.trim();

    if (selectedLanguage.value) {
      description = `${t("prompt.lang_prefix", { language: selectedLanguage.value })}${description}`;
    }

    if (generateUnitTest.value) {
      description = `${description}${t("prompt.unit_test_suffix")}`;
    }

    parts.push(`## ${t("prompt.function_description")}\n${description}`);
  }

  if (functionCallExample.value.trim()) {
    parts.push(`## ${t("prompt.function_call_example")}\n\`\`\`${selectedLanguage.value}\n${functionCallExample.value.trim()}\n\`\`\``);
  }

  if (functionReturnExample.value.trim()) {
    parts.push(`## ${t("prompt.function_return_example")}\n${functionReturnExample.value.trim()}`);
  }

  if (parts.length === 0) {
    return "";
  }

  return parts.join("\n\n");
});

watch(combinedPrompt, (newVal) => {
  promptText.value = newVal;
});

async function handleSend() {
  if (!isConfigured()) {
    responseMessage.value = t("prompt.not_configured");
    return;
  }

  if (!promptText.value.trim()) {
    responseMessage.value = t("prompt.empty_prompt");
    return;
  }

  isSending.value = true;
  responseMessage.value = "";

  try {
    const client = new OpenAI({
      baseURL: config.value.endpoint,
      apiKey: config.value.accessToken,
      dangerouslyAllowBrowser: true,
    });

    const completion = await client.chat.completions.create({
      model: config.value.model,
      messages: [
        {
          role: "system",
          content: systemRole.value,
        },
        {
          role: "user",
          content: promptText.value,
        },
      ],
      temperature: 0.7,
    });

    responseMessage.value = completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    const err = error as Error;
    responseMessage.value = t("prompt.request_failed", { message: err.message });
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t("prompt.title") }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <Label for="selectedLanguage">{{ t("prompt.language_label") }}</Label>
            <Select v-model="selectedLanguage">
              <SelectTrigger id="selectedLanguage" class="w-40">
                <SelectValue :placeholder="t('prompt.language_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{{ t("prompt.language_group") }}</SelectLabel>
                  <SelectItem v-for="lang in languageOptions" :key="lang.value" :value="lang.value">
                    <SelectItemText>{{ lang.label }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center gap-2">
            <Checkbox id="generateUnitTest" v-model="generateUnitTest" />
            <Label for="generateUnitTest">{{ t("prompt.unit_test") }}</Label>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="functionDescription">
            {{ t("prompt.function_description") }} <span class="text-destructive">*</span>
          </Label>
          <Textarea
            id="functionDescription"
            v-model="functionDescription"
            :placeholder="t('prompt.function_description_placeholder')"
            rows="4"
          />
        </div>

        <div class="space-y-2">
          <Label for="functionCallExample">{{ t("prompt.function_call_example") }}</Label>
          <Textarea
            id="functionCallExample"
            v-model="functionCallExample"
            :placeholder="t('prompt.function_call_example_placeholder')"
            rows="3"
          />
        </div>

        <div class="space-y-2">
          <Label for="functionReturnExample">{{ t("prompt.function_return_example") }}</Label>
          <Textarea
            id="functionReturnExample"
            v-model="functionReturnExample"
            :placeholder="t('prompt.function_return_example_placeholder')"
            rows="3"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{{ t("prompt.prompt_title") }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="promptText">{{ t("prompt.prompt_label") }}</Label>
          <Textarea
            id="promptText"
            v-model="promptText"
            :placeholder="t('prompt.prompt_placeholder')"
            rows="10"
          />
        </div>
        <div class="flex gap-3">
          <Button @click="handleReset" variant="outline" class="flex-1 hover:cursor-pointer">{{
            t("prompt.reset")
          }}</Button>
          <Button @click="handleSend" :disabled="isSending" class="flex-1 hover:cursor-pointer">
            {{ isSending ? t("prompt.sending") : t("prompt.send") }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-if="responseMessage">
      <CardHeader>
        <CardTitle>{{ t("prompt.ai_response") }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border bg-muted/50 p-4 whitespace-pre-wrap text-sm">
          {{ responseMessage }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
