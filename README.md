# BuzzChat

## 项目简介

`BuzzChat`是一个多功能在线社交平台，集文字聊天、语音通话和视频互动于一体。你可以在服务器中与朋友们聊天，也可以单开窗口进行一对一的互动。无论是与朋友交流、团队协作，还是建立自己的社群，`BuzzChat`都能为你提供轻松愉快的沟通体验

UI参考Discord，曾用HappyChatVideo

## 技术栈

- 前端部分：React + Next.js
- 构建工具：Vite
- 编程语言：TypeScript
- 样式与组件库：Tailwind CSS、shadcn/ui
- ORM：Prisma
- 数据及状态管理：React-Query、Zustand
- 用户认证与文件上传：Clerk、Uploadthing
- 实时通讯：Socket.io、Livekit

## 运行程序

### 安装依赖

```powershell
# npm
npm i --registry=https://registry.npmmirror.com

# pnpm
pnpm i --registry=https://registry.npmmirror.com
```

### 添加环境

在项目中创建`.env`文件，按照如下格式配置自己的`env`

```plaintext
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_AFTER_SIGN_OUT_URL=/

# Prisma Database URL (PostgreSQL)
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME>?sslmode=require"

# Uploadthing keys
UPLOADTHING_SECRET=sk_live_YOUR_UPLOADTHING_SECRET
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_APP_ID

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Livekit API
LIVEKIT_API_KEY=YOUR_LIVEKIT_API_KEY
LIVEKIT_API_SECRET=YOUR_LIVEKIT_API_SECRET
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
```

将`=`后替换为自己的密钥，相关内容在`#`后有标注

### 运行程序

```powershell
#npm 
npm run dev

# pnpm
pnpm run dev
```

## 项目结构

```LUA
.
├── .env
├── .eslintrc.json
├── .gitignore
├── .next/
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache/
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── server/
│   ├── static/
│   ├── trace
│   └── types/
├── app/
│   ├── (auth)/
│   ├── (invite)/
│   ├── (main)/
│   ├── (setup)/
│   ├── api/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── ...
├── docs/
│   └── README.md
├── hooks/
│   └── ...
├── lib/
├── LICENSE
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pages/
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma/
├── public/
├── README.md
├── stores/
├── tailwind.config.ts
├── tsconfig.json
├── types/
└── utils/
```

