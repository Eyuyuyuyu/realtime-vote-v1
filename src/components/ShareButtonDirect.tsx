import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { ShareUtils } from '../lib/shareUtils';

interface ShareButtonDirectProps {
  pollId: string;
  shareType?: 'poll' | 'result';
  className?: string;
}

/**
 * 直接复制链接的分享按钮组件
 * 点击后直接复制链接到剪贴板，并显示动画反馈
 */
export const ShareButtonDirect: React.FC<ShareButtonDirectProps> = ({
  pollId,
  shareType = 'result',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [hasBeenCopied, setHasBeenCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareLink = shareType === 'poll' 
      ? ShareUtils.generatePollShareLink(pollId)
      : ShareUtils.generateResultShareLink(pollId);
      
    const success = await ShareUtils.copyToClipboard(shareLink);
    if (success) {
      setCopied(true);
      setHasBeenCopied(true);
      // 2秒后恢复，给动画更多时间
      setTimeout(() => setCopied(false), 2000);
    }
  };



  return (
    <div className="relative inline-block">
      <AnimatePresence mode="wait">
        {!copied ? (
          // 分享按钮 - 圆形，只有图标
          <motion.button
            key="button"
            onClick={handleShare}
            className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ 
              scale: hasBeenCopied ? 0 : 1, 
              opacity: hasBeenCopied ? 0 : 1 
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: hasBeenCopied ? { 
                duration: 0.3, 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                delay: 0.2 // 延迟0.2秒开始进入动画，确保成功动画完全退出
              } : { duration: 0 } // 首次加载无动画
            }}
            exit={{ 
              scale: 0, 
              opacity: 0,
              transition: { duration: 0.2, ease: "easeInOut" }
            }}
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        ) : (
          // App Store 风格的成功动画
          <motion.div
            key="success"
            className="flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ 
              scale: 0,
              transition: { 
                duration: 0.3, 
                ease: "easeInOut",
                delay: 0.1 // 延迟0.1秒开始退出动画
              }
            }}
            transition={{ 
              duration: 0.4, 
              type: "spring", 
              stiffness: 400, 
              damping: 20 
            }}
          >
            {/* 橘色圆圈背景 */}
            <motion.div
              className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3, 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
            >
              {/* 白色打勾图标 */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.2, 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30 
                }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
              
              {/* 扩散波纹效果 */}
              <motion.div
                className="absolute inset-0 bg-orange-500 rounded-full"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut" 
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButtonDirect;
