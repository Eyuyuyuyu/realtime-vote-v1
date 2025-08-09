# UI 配置使用指南

## 📁 项目结构

```
src/
├── config/
│   ├── ui-config.ts          # 统一的 UI 配置文件
│   └── theme.ts              # 原有主题配置（可选）
├── hooks/
│   └── useTheme.ts           # 主题状态管理钩子
├── components/
│   ├── ThemeProvider.tsx     # 主题提供器
│   ├── ThemeToggle.tsx       # 主题切换组件
│   └── UIShowcase.tsx        # UI 组件展示页面
```

## 🎨 配色方案

### 浅色模式
- **主色**: #b1f8f2 (青绿色)
- **次色**: #bcd39c (绿色)
- **高亮色**: #fffc99 (黄色)
- **辅助色**: #eafdcf (浅绿色)
- **背景色**: #ffffff (白色)
- **字体颜色**: #000000 (黑色)

### 暗色模式（降低亮度优化）
- **主色**: #81d9d4 (调暗后的青绿色)
- **次色**: #9bb47c (调暗后的绿色)
- **高亮色**: #d1cc80 (调暗后的黄色)
- **辅助色**: #c2dfb0 (调暗后的浅绿色)
- **背景色**: #1a1a1a (深灰色)
- **字体颜色**: #f5f5f5 (浅灰色)

## 🔧 使用方法

### 1. 在组件中使用主题颜色

```tsx
// 使用 Tailwind 类名
<div className="bg-primary text-foreground">主色背景</div>
<div className="bg-secondary text-foreground">次色背景</div>

// 使用自定义按钮样式
<button className="btn-confirm">确认</button>
<button className="btn-delete">删除</button>
<button className="btn-cancel">取消</button>
```

### 2. 使用主题钩子

```tsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <button onClick={toggleTheme}>
      当前主题: {actualTheme}
    </button>
  );
}
```

### 3. 添加主题切换器

```tsx
import { ThemeToggle, SimpleThemeToggle } from '../components/ThemeToggle';

// 完整版主题切换器（包含系统主题选项）
<ThemeToggle />

// 简化版主题切换器（仅深色/浅色切换）
<SimpleThemeToggle />
```

## 🎯 可用的 CSS 类

### 颜色类
```css
/* 背景颜色 */
.bg-primary       /* 主色背景 */
.bg-secondary     /* 次色背景 */
.bg-accent        /* 高亮色背景 */
.bg-auxiliary     /* 辅助色背景 */
.bg-background    /* 页面背景色 */
.bg-destructive   /* 危险色背景 */

/* 文字颜色 */
.text-foreground  /* 主要文字颜色 */
.text-muted       /* 次要文字颜色 */

/* 边框颜色 */
.border-border    /* 边框颜色 */
```

### 按钮类
```css
.btn-confirm      /* 确认按钮样式 */
.btn-delete       /* 删除按钮样式 */
.btn-cancel       /* 取消按钮样式 */
```

### 组件类
```css
.ui-card          /* 卡片样式 */
.ui-input         /* 输入框样式 */
.ui-progress      /* 进度条容器 */
.ui-progress-bar  /* 进度条填充 */
```

## 📱 响应式支持

项目包含完整的响应式设计支持：

- **移动端**: < 768px
- **平板端**: 768px - 1024px  
- **桌面端**: > 1024px

```css
/* 移动端适配 */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
```

## ♿ 无障碍支持

- **高对比度模式支持**
- **减少动画偏好支持**
- **键盘导航支持**

## 🔄 主题切换原理

1. **状态管理**: 使用 `useLocalStorageState` 持久化主题选择
2. **CSS 变量**: 通过 CSS 变量实现颜色动态切换
3. **系统检测**: 自动检测用户系统主题偏好
4. **DOM 更新**: 通过添加/移除 CSS 类实现主题切换

## 🚀 快速开始

1. 访问 `/ui-showcase` 查看所有 UI 组件效果
2. 在页面右上角使用主题切换器测试主题效果
3. 参考 `UIShowcase.tsx` 了解各种组件的使用方法

## 📝 自定义配置

如需修改配色方案，编辑 `src/config/ui-config.ts` 文件：

```typescript
// 修改浅色模式颜色
const lightColors: ColorScheme = {
  primary: '#your-color',
  // ... 其他颜色
};

// 修改暗色模式颜色  
const darkColors: ColorScheme = {
  primary: '#your-dark-color',
  // ... 其他颜色
};
```

修改后，Tailwind 会自动重新编译样式文件。
