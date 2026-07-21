# 项目文档 (AGENTS.md)

## 项目概述

**项目名称**: mini-function-prompt-generator
**版本**: 0.0.1
**作者**: liaohui5i@liaohui5.cn
**项目定位**: 用于生成函数提示词（Function Prompt）的 Web 小工具

## 技术栈

- **框架**: Vue 3.5.39（Composition API + `<script setup>` 语法）
- **构建工具**: Vite 8.1.1
- **语言**: TypeScript 5.9
- **样式**: Tailwind CSS 4.3.3（通过 `@tailwindcss/vite` 插件集成）
- **图标库**: Lucide Vue (`@lucide/vue` 1.25.0)
- **UI 组件体系**: shadcn-vue（New York 风格，JetBrains Mono 字体）
- **包管理器**: pnpm

## 项目结构

```
mini-function-prompt-generator/
├── index.html                  # 入口 HTML，挂载 #app
├── package.json                # 依赖与脚本配置
├── vite.config.ts              # Vite 配置（Vue 插件 + Tailwind 插件 + @ 别名）
├── tsconfig.json               # TS 根配置，定义 @/* 路径别名
├── tsconfig.app.json           # 应用 TS 配置
├── tsconfig.node.json          # Node 环境 TS 配置
├── components.json             # shadcn-vue 组件库配置
├── .oxfmtrc.json               # 格式化器配置
├── .gitignore                  # Git 忽略规则
├── README.md                   # 项目简介
├── public/                     # 静态资源目录
├── src/
│   ├── main.ts                 # 应用入口，创建并挂载 Vue 实例
│   ├── App.vue                 # 根组件（当前为计数器 Demo）
│   ├── style.css               # 全局样式，Tailwind + shadcn-vue 设计令牌
│   ├── assets/                 # 静态资源（vite.svg, vue.svg）
│   └── lib/
│       └── utils.ts            # 工具函数（cn() 用于合并 Tailwind 类名）
└── node_modules/               # 依赖目录
```

## 关键配置说明

### Vite 配置 (`vite.config.ts`)
- 使用 `@vitejs/plugin-vue` 支持 Vue SFC
- 使用 `@tailwindcss/vite` 集成 Tailwind CSS v4
- 配置 `@` 路径别名指向 `./src/`

### 样式配置 (`src/style.css`)
- 引入 JetBrains Mono 字体
- 使用 Tailwind CSS v4 的 `@import "tailwindcss"` 语法
- 引入 `tw-animate-css` 动画库
- 定义完整的 shadcn-vue 设计令牌（CSS 变量），支持亮色/暗色主题（`.dark` 类切换）
- 基础色板为 `stone` 色系

### shadcn-vue 配置 (`components.json`)
- 风格: `new-york`
- 字体: `jetbrains-mono`
- 图标库: `lucide`
- CSS 变量: 开启
- 路径别名:
  - `@/components` → `src/components`
  - `@/lib` → `src/lib`
  - `@/composables` → `src/composables`

## 脚本命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器，端口 8080 |
| `pnpm build` | 类型检查（vue-tsc）+ 生产构建 |
| `pnpm preview` | 本地预览生产构建结果 |

## 当前状态

项目处于**初始脚手架阶段**。`App.vue` 中目前仅实现了一个简单的计数器 Demo（两个按钮：increment / decrement），尚未实现"函数提示词生成"的核心功能。

## 注意事项

1. `App.vue` 中 `decrement` 函数存在 Bug：内部调用的是 `count.value++` 而非 `count.value--`， decrement 实际效果与 increment 相同。
2. 项目依赖 `@lucide/vue` 和 `class-variance-authority`，但当前代码中尚未实际使用。
3. `public/` 目录下应放置 `favicon.svg`（`index.html` 中引用了该文件）。
