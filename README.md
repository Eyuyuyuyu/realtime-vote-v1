# Realtime Vote - 实时投票平台

一个基于 React 18 + Vite + TypeScript 构建的现代化实时投票 H5 网站。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS + shadcn/ui
- **动画库**: Framer Motion
- **图表库**: Recharts
- **路由**: React Router DOM
- **实时数据**: Supabase Realtime
- **状态管理**: React Hooks

## 功能特性

- 🚀 **实时投票**: 基于 Supabase Realtime 的实时数据同步
- 📊 **数据可视化**: 使用 Recharts 展示投票结果
- 🎨 **现代设计**: 支持深色/浅色主题切换
- 📱 **响应式布局**: 完美适配移动端和桌面端
- ⚡ **高性能**: Vite 构建，快速开发和部署

## 项目结构

```
src/
├── config/          # 配置文件
│   └── theme.ts     # 主题配置
├── lib/             # 工具库
│   ├── supabaseClient.ts  # Supabase 客户端
│   └── utils.ts     # 通用工具函数
├── pages/           # 页面组件
│   ├── CreatePoll/  # 创建投票页面
│   ├── Poll/        # 投票页面
│   └── Result/      # 结果页面
├── App.tsx          # 主应用组件
├── main.tsx         # 入口文件
└── index.css        # 全局样式
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并配置 Supabase 连接信息：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 路由配置

- `/` - 首页
- `/create` - 创建投票页面
- `/poll/:id` - 投票页面
- `/result/:id` - 结果页面

## 开发脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产版本
- `npm run lint` - 代码检查

## Supabase 数据库结构

项目需要以下数据表：

### polls 表
```sql
create table polls (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  is_active boolean default true,
  creator_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### poll_options 表
```sql
create table poll_options (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references polls(id) on delete cascade,
  text text not null,
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### votes 表
```sql
create table votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references polls(id) on delete cascade,
  option_id uuid references poll_options(id) on delete cascade,
  user_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Netlify 部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录上传到 Netlify
3. 配置环境变量

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
