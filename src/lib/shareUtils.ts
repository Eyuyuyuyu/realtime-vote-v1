// 分享功能工具函数
export class ShareUtils {
  // 生成投票分享链接
  static generatePollShareLink(pollId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/poll/${pollId}`;
  }

  // 生成投票结果分享链接
  static generateResultShareLink(pollId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/result/${pollId}`;
  }

  // 复制链接到剪贴板
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案：使用传统的 document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      return false;
    }
  }

  // 分享到社交媒体（微信、微博等）
  static shareToSocial(platform: 'wechat' | 'weibo' | 'qq', pollTitle: string, shareLink: string) {
    const encodedTitle = encodeURIComponent(`参与投票：${pollTitle}`);
    const encodedUrl = encodeURIComponent(shareLink);
    const encodedText = encodeURIComponent(`快来参与投票吧！${pollTitle} ${shareLink}`);

    let shareUrl: string;

    switch (platform) {
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`;
        break;
      case 'wechat':
        // 微信分享通常需要通过微信 JS-SDK，这里提供一个通用的分享提示
        alert('请复制链接后在微信中分享');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  // 生成二维码 URL（使用第三方服务）
  static generateQRCodeUrl(text: string, size: number = 200): string {
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
  }
}
