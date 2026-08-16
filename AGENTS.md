# 项目文档 (AGENTS.md)

## 项目概述

- **项目名称**: mini-pure-function-prompt-generator（缩写 mpfpg）
- **版本**: 0.0.1
- **许可证**: MIT
- **作者**: `<liaohui5>i@liaohui5.cn`
- **项目定位**: 用于生成函数提示词（Function Prompt）的 Web 小工具。用户填写函数描述、调用示例、返回示例，工具自动组合为结构化 Prompt，并可集成 OpenAI 兼容接口直接发送请求获取实现代码。

## 技术栈

以下版本以 `pnpm-lock.yaml` 中实际安装的版本为准：

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | 3.5.40 | 框架（Composition API + `<script setup>`） |
| vite | 8.2.0 | 构建工具 |
| typescript | 5.9.2 | 语言 |
| vue-router | 4.6.4 | 路由（hash 模式） |
| vue-i18n | 11.4.8 | 国际化（中文/英文） |
| openai | 6.49.0 | AI 接口调用（浏览器直连） |
| tailwindcss | 4.3.3 | 样式（`@tailwindcss/vite` 插件集成） |
| reka-ui | 2.10.1 | shadcn-vue 底层组件库 |
| @lucide/vue | 1.28.0 | 图标库 |
| @vueuse/core | 14.4.0 | VueUse 组合式函数（UI 组件内使用） |
| class-variance-authority | 0.7.1 | 组件变体（Button 等） |
| clsx + tailwind-merge | 2.1.1 + 3.6.0 | `cn()` 类名合并 |
| tw-animate-css | 1.4.0 | shadcn-vue 动画库 |
| vue-tsc | 3.3.9 | 类型检查 |
| @vue/tsconfig | 0.9.1 | TS 基础配置 |

- **UI 组件体系**: shadcn-vue（New York 风格，jetbrains-mono 字体，stone 色板）
- **包管理器**: pnpm（`pnpm-workspace.yaml` 配置了 `allowBuilds.vue-demi: true`）
- **格式化器**: oxfmt（配置见 `.oxfmtrc.json`，分号、双引号、尾逗号全量）

## 项目结构

```
mpfpg/
├── index.html                  # 入口 HTML（标题: 纯函数提示词生成小工具）
├── package.json                # 依赖与脚本配置
├── pnpm-workspace.yaml         # pnpm 配置（vue-demi 构建许可）
├── vite.config.ts              # Vite 配置
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── components.json             # shadcn-vue 配置
├── .oxfmtrc.json               # oxfmt 格式化配置
├── README.md                   # 项目简介（部分信息已过时，见注意事项）
├── public/
│   ├── favicon.svg             # 站点图标（index.html 引用）
│   └── icons.svg               # SVG symbol 合集（当前未被应用代码引用）
└── src/
    ├── main.ts                 # 应用入口：挂载 router 与 i18n
    ├── App.vue                 # 根组件：Navbar + RouterView
    ├── style.css               # 全局样式与设计令牌
    ├── router/index.ts         # 路由配置（hash 模式）
    ├── locales/                # 国际化（zh-CN.ts / en.ts / index.ts）
    ├── composables/useConfig.ts # AI 配置读写（localStorage）
    ├── pages/
    │   ├── PromptGeneratePage.vue  # Prompt 生成页（/prompt）
    │   └── ConfigPage.vue          # AI 配置页（/config）
    ├── components/
    │   ├── Navbar.vue          # 导航栏（含语言切换）
    │   └── ui/                 # shadcn-vue 组件（alert/button/card/checkbox/input/label/select/textarea）
    └── lib/utils.ts            # cn() 工具函数
```

## 页面与路由

路由使用 `createWebHashHistory`（hash 模式，便于静态托管），`/` 重定向到 `/prompt`，页面均为懒加载：

- **`/prompt`（PromptGeneratePage）**: 核心页面
  - 表单字段：函数描述（必填，UI 标注 `*`）、函数调用示例（可选）、函数返回示例（可选）、编程语言下拉（可选，共 10 种语言）、是否生成单元测试复选框（可选）
  - **Prompt 生成逻辑**（`combinedPrompt` 计算属性）：仅当描述/示例非空时输出对应段落，段落标题为 `## 函数描述`、`## 函数调用示例`、`## 函数返回示例`（标题文案来自 i18n），段落间以空行分隔
  - 语言前缀：选中语言后，在描述前拼接 `请使用 {language} 编程语言帮我实现函数: `
  - 单测后缀：勾选后，在描述后拼接 `,并且生成对应的单元测试代码`
  - 生成结果通过 `watch` 同步到 `promptText`（可手动编辑，但源字段变化时会被覆盖）
  - **表单持久化**：6 个字段（描述/调用示例/返回示例/promptText/语言/单测勾选）均通过 `@vueuse/core` 的 `useLocalStorage` 持久化到 localStorage（key 前缀 `mini-pure-function-prompt-generator-`），刷新后表单与预览内容不丢失；点击重置后各字段赋回默认值（`""`/`false`），存储同步清空
  - **发送请求**：调用 `openai` SDK，`baseURL`/`apiKey`/`model` 取自配置，`dangerouslyAllowBrowser: true`（浏览器直连），`temperature: 0.7`，system 消息来自 i18n 的 `prompt.system_role`（去除换行符），响应展示在底部「AI 响应」卡片
  - 校验：未配置时提示先前往配置页；prompt 为空时提示输入
- **`/config`（ConfigPage）**: AI 配置页
  - 配置项：Endpoint（默认 `https://api.openai.com/v1`）、Access Token、Model（默认 `gpt-4o`）
  - 保存时对输入做 `trim()` 后写入 localStorage；恢复默认按钮重置为默认值；保存成功通过 Alert 提示 1 秒后自动消失

## 关键实现细节

### 配置持久化（`src/composables/useConfig.ts`）
- `AiConfig` 接口：`{ endpoint: string; accessToken: string; model: string }`
- localStorage key：`mini-pure-function-prompt-generator-config`
- 读取时 `JSON.parse` 失败则静默回退默认值（`try/catch` 中忽略错误）
- 默认值通过展开合并保证字段完整性：`{ ...defaultConfig, ...parsed }`
- 对外暴露：`config`（ref）、`save`、`reset`、`isConfigured`（三项均非空才为 true）

### 国际化（`src/locales/index.ts`）
- 使用 `createI18n`，`legacy: false`（Composition API 模式）
- 语言：`zh-CN`（默认）与 `en`，`fallbackLocale: "en"`
- 初始语言从 `localStorage.getItem("locale")` 读取，切换时由 Navbar 写入该 key
- 消息 schema 类型由 `zhCN` 推导（`MessageSchema = typeof zhCN`），新增 key 需同步两个语言文件

### 导航栏（`src/components/Navbar.vue`）
- 品牌标题：Mini Pure Function Prompt Generator（仅 `md` 以上断点显示）
- 导航项根据 `route.name` 高亮当前页；语言切换 Select 写入 localStorage

### 样式（`src/style.css`）
- 字体：Google Fonts 引入 JetBrains Mono（400–700）
- Tailwind CSS v4 语法：`@import "tailwindcss"` + `@import "tw-animate-css"`
- `@custom-variant dark (&:is(.dark *))` 实现暗色模式
- 完整 shadcn-vue 设计令牌（`@theme inline` + `:root` + `.dark`），基础色板 stone，`--radius: 0.625rem`，颜色为 oklch 格式
- `@layer base` 中全局设置 `border-border outline-ring/50` 与 body 背景/前景色

## 关键配置说明

### Vite（`vite.config.ts`）
- 插件：`tailwindcss()` + `vue()`
- `@` 别名手动指向绝对路径 `/src/`（注意：`vite-tsconfig-paths` 已安装但**未**在配置中使用）

### TypeScript（`tsconfig.app.json`）
- 继承 `@vue/tsconfig/tsconfig.dom.json`
- `paths`: `@/*` → `./src/*`，`baseUrl: "."`
- 开启 `noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`、`noFallthroughCasesInSwitch`

### shadcn-vue（`components.json`）
- 风格 `new-york`、字体 `jetbrains-mono`、图标库 `lucide`、基础色 `stone`、CSS 变量开启
- 别名：`@/components`、`@/lib`、`@/composables`、`@/components/ui`

### 格式化（`.oxfmtrc.json`）
- `semi: true`、`singleQuote: false`、`trailingCommas: all`、`alwaysParens: true`、不使用 tab

## 脚本命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（`vite . --port 8080`，端口 8080） |
| `pnpm build` | 类型检查（`vue-tsc -b`）+ 生产构建（`vite build`） |
| `pnpm preview` | 本地预览生产构建 |

> 注意：项目**没有** lint 脚本，也没有测试框架与测试脚本；质量检查依赖 `pnpm build` 中的 vue-tsc 类型检查。

## 注意事项（严谨性说明）

1. **README.md 部分信息已过时**：README 中「App.vue 为 KeepAlive + RouterView」与实际情况不符（当前仅为 Navbar + RouterView，无 KeepAlive）；README 中的 Vue/Vite 版本号（3.5.39/8.1.1）也与实际安装版本（3.5.40/8.2.0）不一致。
2. **`vite-tsconfig-paths` 已安装但未启用**：`vite.config.ts` 中未引用该插件，`@` 别名由 Vite 的 `resolve.alias` 和 tsconfig 的 `paths` 分别手动配置。
3. **Index 与语言设置**：`index.html` 的 `lang="en"`，而站点默认语言为中文；`viewport` 中禁用了用户缩放（`user-scalable=no`）。
4. **`public/icons.svg` 未被应用代码引用**：仓库中存在该文件但 `src/` 与 `index.html` 均未引用，可能为预留资源。
5. **Prompt 可编辑但会被覆盖**：`promptText` 由 `watch(combinedPrompt)` 同步，用户手动编辑后，只要任一源字段（描述/示例/语言/单测勾选）变化即被重新生成的 Prompt 覆盖；`handleReset` 会显式清空 `promptText`。
6. **函数描述非强制校验**：UI 上函数描述标有 `*`，但 `handleSend` 仅校验 `promptText` 非空，描述为空时仍可生成并发送。
7. **请求安全性**：Access Token 明文存储在 localStorage，且请求在浏览器端直接发起（`dangerouslyAllowBrowser: true`），存在凭证泄露风险。
8. **`ConfigPage.vue` 中 `showNotifyTimer` 类型为 `any`**，且保存成功提示依赖 `setTimeout`，组件销毁时未清理定时器。
9. **i18n 一致性**：新增/修改 `zh-CN.ts` 中的文案时须同步修改 `en.ts`，类型检查（`MessageSchema`）可发现缺失的 key。
10. **UI 组件使用惯例**：shadcn-vue 组件从 `src/components/ui/<name>/index.ts` 按需导入（如 `import { Button } from "@/components/ui/button"`）；自定义组件名首字母大写（`Textarea`、`Button`），页面/组件文件名为 PascalCase。