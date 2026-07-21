<script setup lang="ts">
import { ref, watch } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfig } from "@/composables/useConfig";

const { config, save, reset } = useConfig();

const localEndpoint = ref(config.value.endpoint);
const localAccessToken = ref(config.value.accessToken);
const localModel = ref(config.value.model);

watch(
  () => [config.value.endpoint, config.value.accessToken, config.value.model],
  ([endpoint, accessToken, model]) => {
    localEndpoint.value = endpoint;
    localAccessToken.value = accessToken;
    localModel.value = model;
  },
);

function handleSave() {
  config.value.endpoint = localEndpoint.value.trim();
  config.value.accessToken = localAccessToken.value.trim();
  config.value.model = localModel.value.trim();
  save();
}

function handleReset() {
  reset();
  localEndpoint.value = config.value.endpoint;
  localAccessToken.value = config.value.accessToken;
  localModel.value = config.value.model;
}
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-8">
    <Card>
      <CardHeader>
        <CardTitle>AI 配置</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="endpoint">Endpoint</Label>
          <Input
            id="endpoint"
            v-model="localEndpoint"
            placeholder="https://api.openai.com/v1/chat/completions"
          />
        </div>

        <div class="space-y-2">
          <Label for="accessToken">Access Token</Label>
          <Input
            id="accessToken"
            v-model="localAccessToken"
            type="password"
            placeholder="sk-..."
          />
        </div>

        <div class="space-y-2">
          <Label for="model">Model</Label>
          <Input
            id="model"
            v-model="localModel"
            placeholder="gpt-4o"
          />
        </div>

        <div class="flex gap-3">
          <Button @click="handleSave" class="flex-1">保存配置</Button>
          <Button @click="handleReset" variant="outline" class="flex-1">恢复默认</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
