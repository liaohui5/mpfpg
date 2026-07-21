import { ref } from "vue";

export interface AiConfig {
  endpoint: string;
  accessToken: string;
  model: string;
}

const STORAGE_KEY = "mini-function-prompt-generator-config";

const defaultConfig: AiConfig = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  accessToken: "",
  model: "gpt-4o",
};

function readConfig(): AiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AiConfig;
      return { ...defaultConfig, ...parsed };
    }
  } catch {
    // ignore parse error
  }
  return { ...defaultConfig };
}

function writeConfig(config: AiConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function useConfig() {
  const config = ref<AiConfig>(readConfig());

  function save() {
    writeConfig(config.value);
  }

  function reset() {
    config.value = { ...defaultConfig };
    writeConfig(config.value);
  }

  function isConfigured(): boolean {
    return Boolean(config.value.endpoint && config.value.accessToken && config.value.model);
  }

  return {
    config,
    save,
    reset,
    isConfigured,
  };
}
