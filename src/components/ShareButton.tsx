import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, QrCode, MessageCircle, Twitter, Link as LinkIcon } from 'lucide-react';
import { ShareUtils } from '../lib/shareUtils';

interface ShareButtonProps {
  pollId: string;
  pollTitle: string;
  shareType?: 'poll' | 'result';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  pollId,
  pollTitle,
  shareType = 'poll',
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 生成分享链接
  const shareLink = shareType === 'poll' 
    ? ShareUtils.generatePollShareLink(pollId)
    : ShareUtils.generateResultShareLink(pollId);

  // 处理复制链接
  const handleCopyLink = async () => {
    const success = await ShareUtils.copyToClipboard(shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 处理社交媒体分享
  const handleSocialShare = (platform: 'wechat' | 'weibo' | 'qq') => {
    ShareUtils.shareToSocial(platform, pollTitle, shareLink);
    setIsOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowQR(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 样式变量
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* 分享按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
      >
        <Share2 className="w-4 h-4" />
        分享
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-lg z-50"
          >
            <div className="p-3">
              {/* 标题 */}
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">分享投票</span>
              </div>

              {/* 链接输入框 */}
              <div className="mb-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md border">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-transparent text-xs text-foreground border-none outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        复制
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 快捷分享选项 */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">快捷分享</div>
                
                {/* 复制链接 */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {copied ? '已复制到剪贴板' : '复制链接'}
                  </span>
                </button>

                {/* 二维码 */}
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                >
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">二维码</span>
                </button>

                {/* 社交媒体分享 */}
                <button
                  onClick={() => handleSocialShare('weibo')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                >
                  <Twitter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">分享到微博</span>
                </button>

                <button
                  onClick={() => handleSocialShare('qq')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">分享到QQ</span>
                </button>

                <button
                  onClick={() => handleSocialShare('wechat')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">分享到微信</span>
                </button>
              </div>

              {/* 二维码显示 */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-border"
                  >
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">扫码分享</div>
                      <div className="inline-block p-2 bg-white rounded">
                        <img
                          src={ShareUtils.generateQRCodeUrl(shareLink, 120)}
                          alt="投票二维码"
                          className="w-30 h-30"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
