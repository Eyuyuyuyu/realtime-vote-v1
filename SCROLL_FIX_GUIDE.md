# 页面滚动位置问题修复指南

## 问题描述

在使用 React Router + Framer Motion 的项目中，页面切换时经常出现页面从中间位置开始显示的问题，而不是从顶部开始。这是因为：

1. **浏览器保持滚动位置**：当用户从一个页面滚动到中间位置，然后点击链接跳转到新页面时，浏览器会保持之前的滚动位置
2. **Framer Motion 动画冲突**：`motion.div` 组件使用 `initial={{ opacity: 0, y: 20 }}` 等动画，会从偏移位置开始动画
3. **时序问题**：页面内容加载和动画开始的时间不同步

## 解决方案

### 自定义 useScrollToTop Hook

创建 `src/hooks/useScrollToTop.ts`：

```tsx
import { useEffect } from 'react';

export const useScrollToTop = () => {
  useEffect(() => {
    const resetScroll = () => {
      if (window.scrollY > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }
    };
    
    resetScroll();
    requestAnimationFrame(resetScroll);
    
    const timeoutId = setTimeout(resetScroll, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
```

### 在页面组件中使用

在每个页面组件中调用 `useScrollToTop()`：

```tsx
import { useScrollToTop } from '../hooks/useScrollToTop';

const MyPage: React.FC = () => {
  useScrollToTop();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 页面内容 */}
    </motion.div>
  );
};
```

## 修复的页面

- ✅ `src/pages/Result/index.tsx`
- ✅ `src/pages/Poll/index.tsx`
- ✅ `src/pages/CreatePoll/index.tsx`
- ✅ `src/components/UIShowcase.tsx`

## 技术细节

### 为什么需要多次执行滚动重置？

1. **立即执行**：确保在组件挂载时立即重置
2. **requestAnimationFrame**：在下一帧执行，避免与 Framer Motion 动画冲突
3. **setTimeout**：延迟执行，确保在所有动画开始前滚动位置正确

### 使用 `behavior: 'instant'` 的原因

- 避免平滑滚动动画与 Framer Motion 动画产生冲突
- 确保滚动重置立即生效，不会影响页面动画效果

### 检查 `window.scrollY > 0` 的原因

- 避免不必要的滚动操作
- 提高性能，只在需要时执行滚动重置

## 测试验证

修复后，以下场景应该正常工作：

1. 从主页点击投票卡片进入结果页面 → 页面从顶部开始显示
2. 从投票页面跳转到结果页面 → 页面从顶部开始显示
3. 从创建投票页面跳转到投票页面 → 页面从顶部开始显示
4. 所有页面切换都应该从顶部开始显示

## 注意事项

- 此修复不会影响用户手动滚动到页面中间后刷新页面的行为
- 此方案与 Framer Motion 的动画效果完全兼容
- 使用 BrowserRouter 时，此 Hook 是处理滚动位置的最佳方案
