import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import en from "./en";

type MessageSchema = typeof zhCN;

const i18n = createI18n<[MessageSchema], "zh-CN" | "en">({
  legacy: false,
  locale: localStorage.getItem("locale") || "zh-CN",
  fallbackLocale: "en",
  messages: {
    "zh-CN": zhCN,
    en,
  },
});

export default i18n;
