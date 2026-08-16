<script setup lang="ts">
import { AlertCircleIcon, CheckCircle2Icon } from '@lucide/vue'
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemText, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConfig } from "@/composables/useConfig";

const { t } = useI18n();
const { config, save, reset } = useConfig();

const localEndpoint = ref(config.value.endpoint);
const localAccessToken = ref(config.value.accessToken);
const localModel = ref(config.value.model);
const localModels = ref(config.value.models ? config.value.models.join(',') : '');
const modelOptions = computed(() => {
  return localModels.value.split(',').map(m => m.trim()).filter(m => m);
});

const isShowNotify = ref(false)

function showNotify() {
  isShowNotify.value = true;
  startHideNotifyTimer()
}

function hideNotify() {
  isShowNotify.value = false;
}

let showNotifyTimer: any = null;
function startHideNotifyTimer() {
  showNotifyTimer && clearTimeout(showNotifyTimer)
  showNotifyTimer = setTimeout(hideNotify, 1000)
}

watch(
  () => [config.value.endpoint, config.value.accessToken, config.value.model, config.value.models],
  ([endpoint, accessToken, model, models]) => {
    localEndpoint.value = endpoint;
    localAccessToken.value = accessToken;
    localModel.value = model;
    localModels.value = models ? models.join(',') : '';
  },
);

function handleSave() {
  config.value.endpoint = localEndpoint.value.trim();
  config.value.accessToken = localAccessToken.value.trim();
  config.value.model = localModel.value.trim();
  // Parse comma‑separated models list into array
  config.value.models = modelOptions.value;
  save();
  showNotify();
}

function handleReset() {
  reset();
  localEndpoint.value = config.value.endpoint;
  localAccessToken.value = config.value.accessToken;
  localModel.value = config.value.model;
  localModels.value = config.value.models ? config.value.models.join(',') : '';
}
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-8 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t("config.title") }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="endpoint">{{ t("config.endpoint") }}</Label>
          <Input id="endpoint" v-model="localEndpoint" :placeholder="t('config.endpoint_placeholder')" />
          <p class="text-xs text-muted-foreground">
            {{ t("config.endpoint_hint", { endpoint: localEndpoint }) }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="accessToken">{{ t("config.access_token") }}</Label>
          <Input id="accessToken" v-model="localAccessToken" type="password"
            :placeholder="t('config.access_token_placeholder')" />
        </div>

        <div class="space-y-2">
          <Label for="modelList">{{ t("config.model") }} ({{ t('config.model_list') }})</Label>
          <Input id="modelList" v-model="localModels" placeholder="e.g., gpt-4o,gpt-3.5-turbo" />
        </div>
        <div class="space-y-2">
          <Label for="modelSelect">{{ t("config.model_select") }}</Label>
          <Select v-model="localModel">
            <SelectTrigger id="modelSelect" class="w-40">
              <SelectValue :placeholder="t('config.model_placeholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{{ t('config.model_options') }}</SelectLabel>
                <SelectItem v-for="m in modelOptions" :key="m" :value="m">
                  <SelectItemText>{{ m }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex gap-3">
          <Button @click="handleSave" class="flex-1 hover:cursor-pointer">{{ t("config.save") }}</Button>
          <Button @click="handleReset" variant="outline" class="flex-1 hover:cursor-pointer">{{ t("config.reset") }}</Button>
        </div>
      </CardContent>
    </Card>

    <Alert>
      <AlertCircleIcon />
      <AlertDescription>{{ t("config.storage_alert") }}</AlertDescription>
    </Alert>

    <Alert v-show="isShowNotify">
      <CheckCircle2Icon />
      <AlertDescription>{{ t("config.storage_alert_success") }}</AlertDescription>
    </Alert>
  </div>
</template>
