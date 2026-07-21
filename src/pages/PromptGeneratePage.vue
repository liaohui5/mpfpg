<script setup lang="ts">
import { ref, computed, watch } from "vue";
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

const { config, isConfigured } = useConfig();

const functionDescription = ref("");
const functionCallExample = ref("");
const functionReturnExample = ref("");
const promptText = ref("");
const isSending = ref(false);
const responseMessage = ref("");

const selectedLanguage = ref<string>("");
const generateUnitTest = ref(false);

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

const combinedPrompt = computed(() => {
  const parts: string[] = [];

  if (functionDescription.value.trim()) {
    let description = functionDescription.value.trim();

    if (selectedLanguage.value) {
      description = `请使用 ${selectedLanguage.value} 编程语言帮我实现函数: ${description}`;
    }

    if (generateUnitTest.value) {
      description = `${description},并且生成对应的单元测试代码`;
    }

    parts.push(`## 函数描述\n${description}`);
  }

  if (functionCallExample.value.trim()) {
    parts.push(`## 函数调用示例\n${functionCallExample.value.trim()}`);
  }

  if (functionReturnExample.value.trim()) {
    parts.push(`## 函数返回示例\n${functionReturnExample.value.trim()}`);
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
    responseMessage.value = "请先前往配置页面填写 AI 接口配置";
    return;
  }

  if (!promptText.value.trim()) {
    responseMessage.value = "请输入 prompt 内容";
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

    const systemRole = `
你是一个专业的代码助手。 根据用户提供的函数描述、调用示例和返回示例，生成对应的函数，
帮助开发者更好地理解和使用该函数。`.replaceAll("\n", "");

    const completion = await client.chat.completions.create({
      model: config.value.model,
      messages: [
        {
          role: "system",
          content: systemRole,
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
    responseMessage.value = `请求失败: ${err.message}`;
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Prompt 生成</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <Label for="selectedLanguage">编程语言</Label>
            <Select v-model="selectedLanguage">
              <SelectTrigger id="selectedLanguage" class="w-40">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>编程语言</SelectLabel>
                  <SelectItem v-for="lang in languageOptions" :key="lang.value" :value="lang.value">
                    <SelectItemText>{{ lang.label }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center gap-2">
            <Checkbox id="generateUnitTest" v-model="generateUnitTest" />
            <Label for="generateUnitTest">是否生成单元测试</Label>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="functionDescription">函数描述 <span class="text-destructive">*</span></Label>
          <Textarea
            id="functionDescription"
            v-model="functionDescription"
            placeholder="请输入函数描述，例如：计算两个数的和"
            rows="4"
          />
        </div>

        <div class="space-y-2">
          <Label for="functionCallExample">函数调用示例（可选）</Label>
          <Textarea
            id="functionCallExample"
            v-model="functionCallExample"
            placeholder="请输入函数调用示例，例如：add(1, 2)"
            rows="3"
          />
        </div>

        <div class="space-y-2">
          <Label for="functionReturnExample">函数返回示例（可选）</Label>
          <Textarea
            id="functionReturnExample"
            v-model="functionReturnExample"
            placeholder="请输入函数返回示例，例如：3"
            rows="3"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Prompt 预览与编辑</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="promptText">Prompt 内容</Label>
          <Textarea
            id="promptText"
            v-model="promptText"
            placeholder="生成的 prompt 将显示在这里，您可以手动修改..."
            rows="10"
          />
        </div>
        <Button @click="handleSend" :disabled="isSending" class="w-full">
          {{ isSending ? "发送中..." : "发送" }}
        </Button>
      </CardContent>
    </Card>

    <Card v-if="responseMessage">
      <CardHeader>
        <CardTitle>AI 响应</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border bg-muted/50 p-4 whitespace-pre-wrap text-sm">
          {{ responseMessage }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
