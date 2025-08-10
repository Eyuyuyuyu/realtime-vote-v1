import { useEffect } from 'react';

/**
 * 自定义 Hook：在组件挂载时重置页面滚动位置到顶部
 * 解决 React Router + Framer Motion 导致的页面滚动位置问题
 * 
 * 此 Hook 专门处理页面切换时的滚动位置重置，确保页面从顶部开始显示
 */
export const useScrollToTop = () => {
  useEffect(() => {
    // 使用 requestAnimationFrame 确保在下一帧执行，避免与 Framer Motion 动画冲突
    const resetScroll = () => {
      // 检查当前滚动位置，如果不在顶部则重置
      if (window.scrollY > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // 使用 instant 避免动画冲突
        });
      }
    };
    
    // 立即执行一次
    resetScroll();
    
    // 在下一帧再次执行，确保动画开始前滚动位置已重置
    requestAnimationFrame(resetScroll);
    
    // 额外延迟执行一次，确保在所有动画开始前滚动位置正确
    const timeoutId = setTimeout(resetScroll, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
