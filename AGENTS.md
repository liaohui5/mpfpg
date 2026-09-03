# 项目文档 (AGENTS.md)

> 本文档内容以仓库当前源码为准（核对基线：`d01c36d`，分支 `main`）。本文件不是 README 的转述——README 存在多处过时信息，见「注意事项」。

## 项目概述

- **项目名称**: mini-pure-function-prompt-generator（缩写 mpfpg）
- **版本**: 0.0.1（`package.json` 中尚无 `version` 之外的发布通道，无 tag）
- **许可证**: MIT（`LICENSE`）
- **作者**: `<liaohui5>i@liaohui5.cn`
- **项目定位**: 用于生成函数提示词（Function Prompt）的 Web 小工具。用户填写函数描述、调用示例、返回示例，工具自动组合为结构化 Prompt，并可通过任意 OpenAI 兼容接口（可配置 Endpoint/Token/Model）直接发送请求获取实现代码。纯前端 SPA，无后端。

## 技术栈与环境

依赖版本取自 `pnpm-lock.yaml`（`lockfileVersion: '9.0'`）实际解析出的精确版本（快照时间 2025-09）。`package.json` 中多数为 `^` / `~` 范围声明。

### 运行时依赖（dependencies）

| 依赖 | 实际安装版本 | 用途 |
|------|------|------|
| vue | 3.5.41 | 框架（Composition API + `<script setup>`） |
| vue-router | 4.6.4 | 路由（hash 模式，`createWebHashHistory`） |
| vue-i18n | 11.4.8 | 国际化（中文/英文，`legacy: false`） |
| openai | 6.49.0 | AI 接口调用（浏览器直连 `dangerouslyAllowBrowser`） |
| reka-ui | 2.10.3 | shadcn-vue 底层组件库 |
| @lucide/vue | 1.31.0 | 图标库（`ConfigPage.vue` 使用 `AlertCircleIcon` / `CheckCircle2Icon`） |
| @vueuse/core | 14.4.0 | `useLocalStorage`（表单持久化） |
| class-variance-authority | 0.7.1 | Button 等组件变体（cva） |
| clsx + tailwind-merge | 2.1.1 + 3.6.0 | `cn()` 类名合并（`src/lib/utils.ts`） |
| tailwindcss | 4.3.3 | 样式（CSS-first） |
| @tailwindcss/vite | 4.3.3 | Tailwind v4 的 Vite 插件（在 vite.config.ts 使用） |

### 开发依赖（devDependencies）

| 依赖 | 实际安装版本 | 用途 |
|------|------|------|
| vite | 8.2.1 | 构建工具 |
| @vitejs/plugin-vue | 6.0.8 | Vue SFC 编译插件 |
| typescript | 5.9.2 | 语言（`~5.9.2`） |
| vue-tsc | 3.3.10 | 类型检查（`pnpm build` 中 `vue-tsc -b`） |
| @vue/tsconfig | 0.9.1 | TS 基础配置（`tsconfig.app.json` 继承其 dom 配置） |
| tw-animate-css | 1.4.0 | shadcn-vue 动画库（`style.css` 中 `@import`） |
| vite-tsconfig-paths | 6.1.1 | 已安装但**未启用**（见注意事项 2） |
| @types/node | 24.13.3 | Node 类型（供 `tsconfig.node.json` 的 vite.config 使用） |

- **UI 组件体系**: shadcn-vue（New York 风格，`components.json` 声明 font: `jetbrains-mono`、icon: `lucide`、base color: `stone`、cssVariables: true）
- **包管理器**: pnpm（`pnpm-workspace.yaml` 声明 `allowBuilds.vue-demi: true`；lockfileVersion 9.0）
- **格式化**: 仅存在 `.oxfmtrc.json`（oxfmt 配置：`semi: true`、`singleQuote: false`、`trailingCommas: "all"`、`alwaysParens: true`）。**无 lint / format 脚本**，仓库代码并非全部按此格式化（见注意事项 11）

## 常用命令

| 命令 | 作用 |
|------|------|
| `pnpm install` | 安装依赖（按 `pnpm-lock.yaml` 精确安装） |
| `pnpm dev` | 启动开发服务器（脚本为 `vite . --port 8080`，端口 8080） |
| `pnpm build` | 类型检查 + 构建（`vue-tsc -b && vite build`，产物在 `dist/`） |
| `pnpm preview` | 本地预览生产构建 |

> 项目**没有** lint 脚本、测试框架与测试脚本；唯一的质量关卡是 `pnpm build` 内置的 `vue-tsc -b` 类型检查。

## 目录结构

```
mpfpg/
├── index.html                  # 入口 HTML（标题: 纯函数提示词生成小工具；lang="en"）
├── package.json                # 依赖与脚本配置
├── pnpm-lock.yaml              # 依赖锁定（lockfileVersion 9.0）
├── pnpm-workspace.yaml         # pnpm 配置（vue-demi 构建许可）
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # 工程引用（references app + node）
├── tsconfig.app.json           # 应用侧 TS 配置（继承 @vue/tsconfig dom）
├── tsconfig.node.json          # Node 侧 TS 配置（含 vite.config.ts）
├── components.json             # shadcn-vue 配置
├── .oxfmtrc.json               # oxfmt 格式化配置
├── README.md                   # 项目简介（多处过时，见注意事项 1）
├── public/
│   ├── favicon.svg             # 站点图标（index.html 引用 /favicon.svg）
│   └── icons.svg               # SVG symbol 合集（未被任何代码引用，预留资源）
└── src/
    ├── main.ts                 # 应用入口：createApp + use(router) + use(i18n) + mount("#app")
    ├── App.vue                 # 根组件：<Navbar /> + <RouterView />（无 KeepAlive）
    ├── style.css               # 全局样式与设计令牌（Tailwind v4 CSS-first）
    ├── router/index.ts         # 路由配置（hash 模式，/prompt 与 /config 懒加载）
    ├── locales/                # 国际化（zh-CN.ts / en.ts / index.ts）
    ├── composables/useConfig.ts # AI 配置读写（localStorage）
    ├── assets/                 # vite.svg + vue.svg（Vite 脚手架残留，未被引用）
    ├── pages/
    │   ├── PromptGeneratePage.vue  # Prompt 生成页（/prompt）
    │   └── ConfigPage.vue          # AI 配置页（/config）
    ├── components/
    │   ├── Navbar.vue          # 导航栏（含语言切换）
    │   └── ui/                 # shadcn-vue 组件（见下）
    └── lib/utils.ts            # cn() 工具函数
```

### `src/components/ui/` 组件族

| 目录 | 导出 |
|------|------|
| `alert` | Alert、AlertDescription、AlertTitle |
| `button` | Button（cva 变体：default/destructive/outline/secondary/ghost/link + size） |
| `card` | Card、CardAction、CardContent、CardDescription、CardFooter、CardHeader、CardTitle |
| `checkbox` | Checkbox（reka-ui 封装，`v-model` 为 boolean） |
| `input` | Input |
| `label` | Label |
| `select` | Select、SelectContent、SelectGroup、SelectItem、SelectItemText、SelectLabel、SelectScrollDownButton、SelectScrollUpButton、SelectSeparator、SelectTrigger、SelectValue 等 |
| `textarea` | Textarea |

导入惯例：`import { Button } from "@/components/ui/button"`（每族一个 `index.ts` 汇聚）。

## 页面与路由

`src/router/index.ts`：`createWebHashHistory`（hash 模式，便于静态托管），`/` 重定向到 `/prompt`，两页均为懒加载 `() => import(...)`：

- 路由名 `PromptGenerate` → `/prompt`
- 路由名 `Config` → `/config`

### `/prompt`（PromptGeneratePage.vue）——核心页面

表单字段与本地状态（均经 `@vueuse/core` `useLocalStorage` 持久化，key 前缀 `mini-pure-function-prompt-generator-`）：

| 字段 | ref 名 | 存储 key 后缀 | 默认 |
|------|--------|--------------|------|
| 函数描述（Label 标注 `*`） | `functionDescription` | `-function-description` | `""` |
| 函数调用示例 | `functionCallExample` | `-function-call-example` | `""` |
| 函数返回示例 | `functionReturnExample` | `-function-return-example` | `""` |
| Prompt 文本（预览/可编辑） | `promptText` | `-prompt-text` | `""` |
| 编程语言 | `selectedLanguage` | `-selected-language` | `""` |
| 是否生成单元测试 | `generateUnitTest` | `-generate-unit-test` | `false` |

另有非持久化的 `isSending`（发送中）与 `responseMessage`（AI 响应/校验消息）。

**语言选项**（组件内硬编码 10 种，`value === label`，非 i18n）：JavaScript、TypeScript、Java、Python、Go、Rust、C、PHP、Lua、Bash。

**Prompt 生成逻辑**（`combinedPrompt` computed，输出为 Markdown 文本）：

- `functionDescription` 非空时输出首段：`## 函数描述`（标题文案取自 i18n `prompt.function_description`）
  - 选中语言时，在描述正文前拼接前缀——来自 i18n `prompt.lang_prefix` 的插值模板：中文为 `请使用 {language} 编程语言帮我实现函数: `（`{language}` 传入所选语言）
  - 勾选单测时，在描述正文后拼接 `prompt.unit_test_suffix`（中文：`,并且生成对应的单元测试代码`）
- `functionCallExample` 非空时输出代码段：`## 函数调用示例` 标题 + 以所选语言为语言标识的 Markdown 围栏代码块（```{language}）
- `functionReturnExample` 非空时输出末段：`## 函数返回示例` + 原文
- 各段以空行（`"\n\n"`）连接；全部为空时返回 `""`
- `watch(combinedPrompt)` 将结果同步到 `promptText`（可手动编辑，但任一源字段变化即被覆盖）

**发送请求**（`handleSend`）：校验不通过（未配置 / prompt 为空）时把 i18n 错误文案写入 `responseMessage` 并直接返回。通过后：
- `new OpenAI({ baseURL: config.endpoint, apiKey: config.accessToken, dangerouslyAllowBrowser: true })`
- `chat.completions.create({ model: config.model, messages: [system 角色, user = promptText], temperature: 0.7 })`
- system 消息来自 i18n `prompt.system_role` 并剔除换行（`replaceAll("\n", "")`）
- 成功把 `choices[0].message.content` 写入 `responseMessage`；失败写入 `prompt.request_failed`（`{message}` 插值）
- 「AI 响应」Card 仅在 `responseMessage` 非空时渲染（`v-if`），校验错误也会显示在该卡内
- 发送中按钮禁用并显示「发送中...」；发送/校验期间 `isSending` 状态正确复位（`finally`）

**重置**（`handleReset`）：6 个持久化字段 + `responseMessage` 全部清空。

### `/config`（ConfigPage.vue）——AI 配置页

- 配置项 4 个（对应 `useConfig` 的 `AiConfig`）：
  1. **Endpoint**（默认 `https://api.openai.com/v1`）
  2. **Access Token**（`type="password"` 输入）
  3. **模型列表**（逗号分隔输入框，如 `gpt-4o,gpt-3.5-turbo`，保存为 `string[]`）
  4. **选择模型**（`Select` 下拉，选项来自模型列表拆分为逗号去空后的数组，保存为单个 `model` 字符串）
- 本地编辑态 `localEndpoint/localAccessToken/localModel/localModels`，`modelOptions` computed 负责列表解析
- `watch` 监听 `config` 变化回填本地字段；因历史存储格式可能为数组，回填时用 `Array.isArray(...) ? v[0] : v` 归一化（兼容 string / string[] 两种形态）
- **保存**（`handleSave`）：各字段 `trim()` 后写回 `config`（`models` 写解析后的数组）→ `save()` 持久化 → 显示 1 秒成功 Alert（`v-show` + `setTimeout` 1000ms）
- **恢复默认**（`handleReset`）：`reset()` 后用新 config 重新回填本地字段
- 底部常驻一条「配置仅保存到本地 localStorage」提示 Alert；保存成功 Alert（`CheckCircle2Icon`）在其后，用 `v-show` 控制
- 图标：`@lucide/vue` 的 `AlertCircleIcon`、`CheckCircle2Icon`

## 关键实现细节

### 配置持久化（`src/composables/useConfig.ts`）

```ts
interface AiConfig {
  endpoint: string;
  accessToken: string;
  model: string;      // 当前选中的模型
  models: string[];   // 模型列表（v0.0.1 新增）
}
```

- localStorage key：`mini-pure-function-prompt-generator-config`
- `defaultConfig`：`{ endpoint: "https://api.openai.com/v1", accessToken: "", model: "gpt-4o", models: ["gpt-4o"] }`
- `readConfig()`：`JSON.parse` 失败时静默回退默认值（`try/catch` 忽略错误）；默认值通过展开合并保证字段完整性：`{ ...defaultConfig, ...parsed }`（旧存储缺 `models` 时自动补默认）
- 对外暴露：`config`（`ref<AiConfig>`）、`save`（写 localStorage）、`reset`（还原默认并写入）、`isConfigured`（`endpoint`/`accessToken`/`model` 三者均非空才为 true，不看 `models`）

### 国际化（`src/locales/index.ts`）

- `createI18n`，`legacy: false`（Composition API 模式）
- 语言：`zh-CN`（默认）与 `en`，`fallbackLocale: "en"`
- 初始语言从 `localStorage.getItem("locale")` 读取；切换由 Navbar 写入同 key
- 消息 schema 由 `zhCN` 推导（`type MessageSchema = typeof zhCN`），新增 key 必须同步两个语言文件，否则 vue-tsc 类型检查报错
- Prompt 相关文案含参数插值：`lang_prefix`（`{language}`）、`request_failed`（`{message}`）

### 导航栏（`src/components/Navbar.vue`）

- 品牌标题「Mini Pure Function Prompt Generator」仅 `md` 以上断点显示（`hidden md:flex`），点击跳 `/prompt`
- 导航项来自 `navItems`（/prompt、/config），文案经 i18n（`t(\`nav.${...}\`)`），以 `route.name === item.name` 高亮当前页（激活为 `bg-muted text-foreground`）
- 语言切换：reka Select，`zh-CN`/`en` 两项；`:model-value="locale"` + `@update:model-value="handleLocaleChange"`，后者同时更新 `locale` 与 localStorage
- 样式：`sticky top-0 z-50`、`bg-background/95 backdrop-blur`、高度 `h-14`

### 样式（`src/style.css`）

- 字体：Google Fonts 引入 JetBrains Mono（400–700）
- Tailwind CSS v4 语法：`@import "tailwindcss"` + `@import "tw-animate-css"`
- `@custom-variant dark (&:is(.dark *))` 声明暗色变体；`:root` 与 `.dark` 两套完整设计令牌（oklch 格式，stone 色系：背景白/stone-900 文字，primary 取 stone-900 反白，destructive/ring/chart/sidebar 等齐全）
- **圆角已像素化**（`d01c36d`）：`:root { --radius: 4px }`，派生 `--radius-sm: calc(-2px)=2px`、`md` 3px、`lg` 4px、`xl` 5px（此前为 `0.625rem`）
- `@layer base`：`* { border-border outline-ring/50 }`，`body { bg-background text-foreground }`
- 暗色令牌与 `dark:` 变体类齐全，但应用内**无任何主题切换入口**（源码无 classList/prefers-color-scheme 操作）——README 宣称的「支持亮色/暗色主题」仅指 CSS 层面的令牌能力，默认恒为亮色

## 关键配置说明

### Vite（`vite.config.ts`）
- 插件：`tailwindcss()` + `vue()`
- `@` 别名手动指向绝对路径 `/src/`（`resolve.alias`）
- 注意：`vite-tsconfig-paths` 在 devDependencies 中但**未**在配置中使用

### TypeScript
- `tsconfig.json`：工程引用（`references`）app 与 node 两个子工程；同时声明 `baseUrl: "."` + `paths: { "@/*": ["./src/*"] }`
- `tsconfig.app.json`：继承 `@vue/tsconfig/tsconfig.dom.json`；`types: ["vite/client"]`；开启 `noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`、`noFallthroughCasesInSwitch`；`include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]`
- `tsconfig.node.json`：target es2023 / module nodenext，`types: ["node"]`，`include: ["vite.config.ts"]`

### shadcn-vue（`components.json`）
- 风格 `new-york`、字体 `jetbrains-mono`、图标库 `lucide`、基础色 `stone`、CSS 变量开启、`pointer: false`
- 别名：`components` → `@/components`、`utils` → `@/lib/utils`、`ui` → `@/components/ui`、`lib` → `@/lib`、`composables` → `@/composables`

### 格式化（`.oxfmtrc.json`）
- `useTabs: false`、`semi: true`、`singleQuote: false`、`trailingCommas: "all"`、`bracketSpacing: true`、`alwaysParens: true`、`bracketSameLine: false`
- 仅声明配置，无脚本执行（见注意事项 11）

## 注意事项（严谨性说明）

1. **README.md 已过时**：README 的「App.vue 为 KeepAlive + RouterView」与实际情况不符（当前为 Navbar + RouterView，见 `src/App.vue`）；README 技术栈表写 Vue 3.5.39 / Vite 8.1.1，实际为 3.5.41 / 8.2.1；README 未覆盖配置页的模型列表新能力。
2. **`vite-tsconfig-paths` 已安装但未启用**：`vite.config.ts` 中未引用，`@` 别名由 Vite `resolve.alias` 与 tsconfig `paths` 分别手动配置。
3. **Index 与语言设置**：`index.html` 的 `lang="en"`，而站点默认语言为中文（i18n 默认 zh-CN）；`viewport` 禁用了用户缩放（`user-scalable=no`）。
4. **`public/icons.svg` 未被引用**：仓库中存在但 `src/` 与 `index.html` 均未引用（预留资源）。同理 `src/assets/vite.svg`、`src/assets/vue.svg` 是 Vite 脚手架残留，未被引用，可安全删除。
5. **Prompt 可编辑但会被覆盖**：`promptText` 由 `watch(combinedPrompt)` 同步；用户手动编辑后，只要任一源字段（描述/示例/语言/单测勾选）变化即被重新生成的 Prompt 覆盖。`handleReset` 会显式清空 `promptText`（连同 `responseMessage`）。
6. **函数描述非强制校验**：UI 上函数描述标有 `*`，但 `handleSend` 仅校验 `promptText` 非空——描述为空、仅填示例时仍可生成并发送。
7. **请求安全性**：Access Token 明文存 localStorage，且请求在浏览器端直接发起（`dangerouslyAllowBrowser: true`），存在凭证泄露风险；页面已常驻提示文案。
8. **`ConfigPage.vue` 定时器**：`showNotifyTimer` 类型为 `any`（`let showNotifyTimer: any = null`），保存成功提示依赖 `setTimeout`(1000ms)，组件销毁时未清理定时器（`onUnmounted` 缺失）。
9. **i18n 一致性**：新增/修改 `zh-CN.ts` 文案须同步 `en.ts`；类型检查（`MessageSchema = typeof zhCN`）可发现缺失的 key。
10. **UI 组件使用惯例**：从 `src/components/ui/<name>/index.ts` 按需导入（`import { Button } from "@/components/ui/button"`）；页面/组件文件名为 PascalCase。
11. **格式化不统一**：`.oxfmtrc.json` 声明分号/双引号/尾逗号全量，但仓库代码并非一致遵循——`src/components/ui/**` 与 `src/lib/utils.ts` 为 shadcn 生成风格（双引号、**无分号**）；`ConfigPage.vue` 顶部的 `@lucide/vue` 导入行使用单引号且无分号。手写业务代码（pages/composables/router/locales）大体遵循 oxfmt 风格。仓库无 lint/format 脚本。
12. **配置结构演进**：`models`（模型列表）为近期新增（`25ecfb9`、`c0dde27`）；旧 localStorage 中若字段为数组形态也能被 `useConfig` 与 `ConfigPage` 的 `Array.isArray` 归一化逻辑兼容读取，缺失字段经 `{ ...defaultConfig, ...parsed }` 自动补齐。
13. **工作区杂项**：仓库根目录存在空目录 `assets/`、`design/` 及 `.pi/`（本地工具产物，未被 git 追踪，`git status` 干净，非项目结构）。
