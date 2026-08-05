<script setup lang="ts">
import { AlertCircleIcon, CheckCircle2Icon } from '@lucide/vue'
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Input } from "@/components/ui/input";
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
  showNotify();
}

function handleReset() {
  reset();
  localEndpoint.value = config.value.endpoint;
  localAccessToken.value = config.value.accessToken;
  localModel.value = config.value.model;
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
          <Label for="model">{{ t("config.model") }}</Label>
          <Input id="model" v-model="localModel" :placeholder="t('config.model_placeholder')" />
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
