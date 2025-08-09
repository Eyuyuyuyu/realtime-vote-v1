// 防刷票工具函数
export class AntiSpamUtils {
  // Cookie 操作工具
  private static setCookie(name: string, value: string, days: number = 30): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  private static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // 检查是否已经投票（双重验证：localStorage + Cookie）
  static hasVoted(pollId: string, userId: string): {
    hasVoted: boolean;
    source: 'localStorage' | 'cookie' | 'both' | 'none';
    timestamp?: number;
  } {
    const localStorageKey = `poll-voted-${pollId}`;
    const cookieKey = `vote_${pollId}_${userId.substring(0, 8)}`;

    // 检查 localStorage
    const localVoted = localStorage.getItem(localStorageKey);
    const localTimestamp = localStorage.getItem(`${localStorageKey}_time`);
    
    // 检查 Cookie
    const cookieVoted = this.getCookie(cookieKey);

    const hasLocalVote = localVoted === 'true';
    const hasCookieVote = cookieVoted === 'true';

    let source: 'localStorage' | 'cookie' | 'both' | 'none';
    if (hasLocalVote && hasCookieVote) {
      source = 'both';
    } else if (hasLocalVote) {
      source = 'localStorage';
    } else if (hasCookieVote) {
      source = 'cookie';
    } else {
      source = 'none';
    }

    return {
      hasVoted: hasLocalVote || hasCookieVote,
      source,
      timestamp: localTimestamp ? parseInt(localTimestamp, 10) : undefined
    };
  }

  // 标记已投票（双重存储：localStorage + Cookie）
  static markAsVoted(pollId: string, userId: string, optionId: string): void {
    const timestamp = Date.now();
    
    // localStorage 存储
    const localStorageKey = `poll-voted-${pollId}`;
    const optionKey = `poll-option-${pollId}`;
    const timestampKey = `${localStorageKey}_time`;
    
    localStorage.setItem(localStorageKey, 'true');
    localStorage.setItem(optionKey, optionId);
    localStorage.setItem(timestampKey, timestamp.toString());

    // Cookie 存储 (使用用户ID的前8位作为标识，避免过长)
    const cookieKey = `vote_${pollId}_${userId.substring(0, 8)}`;
    this.setCookie(cookieKey, 'true', 30); // 30天过期
    
    // 额外的时间戳 Cookie
    this.setCookie(`${cookieKey}_time`, timestamp.toString(), 30);

    console.log(`[AntiSpam] 投票记录已保存 - Poll: ${pollId}, User: ${userId.substring(0, 8)}, Option: ${optionId}`);
  }

  // 检查投票频率限制（防止短时间内重复请求）
  static checkVoteRateLimit(pollId: string, limitMinutes: number = 1): {
    allowed: boolean;
    waitTime?: number;
  } {
    const rateLimitKey = `vote_rate_${pollId}`;
    const lastVoteTime = localStorage.getItem(rateLimitKey);
    
    if (!lastVoteTime) {
      return { allowed: true };
    }

    const lastTime = parseInt(lastVoteTime, 10);
    const now = Date.now();
    const timeDiff = now - lastTime;
    const limitMs = limitMinutes * 60 * 1000;

    if (timeDiff < limitMs) {
      const waitTime = Math.ceil((limitMs - timeDiff) / 1000);
      return { 
        allowed: false, 
        waitTime 
      };
    }

    return { allowed: true };
  }

  // 更新投票率限制时间戳
  static updateVoteRateLimit(pollId: string): void {
    const rateLimitKey = `vote_rate_${pollId}`;
    localStorage.setItem(rateLimitKey, Date.now().toString());
  }

  // 检查浏览器指纹（简单的设备识别）
  static getBrowserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // 生成简单的哈希
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    return Math.abs(hash).toString(36);
  }

  // 检查设备是否已投票
  static hasDeviceVoted(pollId: string): boolean {
    const fingerprint = this.getBrowserFingerprint();
    const deviceKey = `device_voted_${pollId}_${fingerprint}`;
    return localStorage.getItem(deviceKey) === 'true';
  }

  // 标记设备已投票
  static markDeviceAsVoted(pollId: string): void {
    const fingerprint = this.getBrowserFingerprint();
    const deviceKey = `device_voted_${pollId}_${fingerprint}`;
    localStorage.setItem(deviceKey, 'true');
    
    console.log(`[AntiSpam] 设备投票记录已保存 - Poll: ${pollId}, Device: ${fingerprint}`);
  }

  // 清理过期的防刷票数据
  static cleanupExpiredData(maxAgeDays: number = 30): void {
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const keysToRemove: string[] = [];

    // 遍历 localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // 检查投票相关的时间戳键
      if (key.includes('_time') && (key.startsWith('poll-voted-') || key.startsWith('vote_') || key.startsWith('device_voted_'))) {
        const timestamp = localStorage.getItem(key);
        if (timestamp) {
          const age = now - parseInt(timestamp, 10);
          if (age > maxAgeMs) {
            keysToRemove.push(key);
            // 同时删除对应的主键
            const mainKey = key.replace('_time', '');
            keysToRemove.push(mainKey);
          }
        }
      }
    }

    // 清理过期数据
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(`[AntiSpam] 清理了 ${keysToRemove.length} 个过期数据项`);
    }
  }

  // 获取投票统计信息（用于调试）
  static getVoteStats(): {
    totalVotedPolls: number;
    totalDeviceVotes: number;
    recentVotes: Array<{
      pollId: string;
      timestamp: number;
      source: string;
    }>;
  } {
    const votedPolls = new Set<string>();
    const deviceVotes = new Set<string>();
    const recentVotes: Array<{ pollId: string; timestamp: number; source: string }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.startsWith('poll-voted-')) {
        const pollId = key.replace('poll-voted-', '');
        votedPolls.add(pollId);
        
        const timestampKey = `${key}_time`;
        const timestamp = localStorage.getItem(timestampKey);
        if (timestamp) {
          recentVotes.push({
            pollId,
            timestamp: parseInt(timestamp, 10),
            source: 'localStorage'
          });
        }
      }

      if (key.startsWith('device_voted_')) {
        deviceVotes.add(key);
      }
    }

    return {
      totalVotedPolls: votedPolls.size,
      totalDeviceVotes: deviceVotes.size,
      recentVotes: recentVotes.sort((a, b) => b.timestamp - a.timestamp)
    };
  }
}
