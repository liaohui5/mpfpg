# 介绍

用于生成函数提示词(Function Prompt)的小工具。支持多字段组合、编程语言前缀、单元测试后缀，并集成 OpenAI SDK 直接发送请求。

> mpfpg = mini pure function prompt generator

## 功能

- **Prompt 生成**：填写函数描述、调用示例、返回示例，自动组合成结构化 Prompt
- **编程语言选择**：选中语言后自动在描述前添加 「请使用 xxx 编程语言帮我实现函数:」
- **单元测试开关**：勾选后自动在描述后追加 「,并且生成对应的单元测试代码」
- **Prompt 预览与编辑**：生成的 Prompt 可手动修改，源字段变化时自动同步
- **AI 请求**：集成 OpenAI SDK，一键发送 Prompt 并展示响应
- **配置管理**：Endpoint / Access Token / Model 配置，保存到 localStorage
- **响应式布局**：支持亮色/暗色主题

## 技术栈

| 名称 | 版本 |
|------|------|
| Vue | 3.5.39 |
| Vite | 8.1.1 |
| TypeScript | 5.9 |
| Tailwind CSS | 4.3.3 |
| shadcn-vue | New York 风格 |
| Vue Router | 4.x |
| OpenAI SDK | 6.x |
| Lucide Vue | 1.x |
| pnpm | 包管理器 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 8080）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 页面说明

### Prompt 生成页（/prompt）
- 选择编程语言（可选）
- 勾选「是否生成单元测试」（可选）
- 填写函数描述（必填）
- 填写函数调用示例（可选）
- 填写函数返回示例（可选）
- 自动生成 Prompt 字符串，可手动编辑
- 点击「发送」调用 AI 接口
- 点击「重置」清空所有表单

### 配置页（/config）
- 配置 API Endpoint、Access Token、Model
- 保存后持久化到 localStorage
- 支持恢复默认值

## 项目结构

```
src/
├── main.ts                 # 应用入口
├── App.vue                 # 根组件（KeepAlive + RouterView）
├── style.css               # 全局样式与设计令牌
├── router/
│   └── index.ts            # vue-router 路由配置
├── components/
│   ├── Navbar.vue          # 导航栏
│   └── ui/                 # shadcn-vue 组件（Button、Input、Card 等）
├── composables/
│   └── useConfig.ts        # 配置读写 localStorage
├── pages/
│   ├── PromptGeneratePage.vue  # Prompt 生成页
│   └── ConfigPage.vue          # 配置页
└── lib/
    └── utils.ts            # cn() 工具函数
```
