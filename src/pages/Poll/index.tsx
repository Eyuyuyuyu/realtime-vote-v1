import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Clock, CheckCircle, Users, AlertCircle, Shield } from 'lucide-react';
import { pollsApi, Poll as PollType, RealtimeChannel, getUserId, supabase } from '../../lib/supabaseClient';
import { AntiSpamUtils } from '../../lib/antiSpamUtils';
import { ShareButtonDirect } from '../../components/ShareButtonDirect';
import useLocalStorageState from 'use-local-storage-state';



const Poll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<PollType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useLocalStorageState<boolean>(`poll-voted-${id}`, {
    defaultValue: false,
  });
  const [votedOptionId, setVotedOptionId] = useLocalStorageState<string | null>(`poll-option-${id}`, {
    defaultValue: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);
  const [antiSpamWarning, setAntiSpamWarning] = useState<string | null>(null);

  
  // 获取用户ID（用于防重复投票）
  const userId = React.useMemo(() => {
    const newUserId = getUserId();
    
    // 如果用户ID发生了变化（从旧格式升级），清除相关的投票状态缓存
    const storedUserId = localStorage.getItem('current-user-id');
    if (storedUserId !== newUserId) {
      console.log('用户ID已更新，清除旧的投票状态缓存');
      // 清除所有以 poll-voted- 和 poll-option- 开头的localStorage项
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('poll-voted-') || key.startsWith('poll-option-')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('current-user-id', newUserId);
    }
    
    return newUserId;
  }, []);

  // 检查投票是否已过期
  const isExpired = useCallback((poll: PollType) => {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  }, []);

  // 获取投票数据
  const fetchPoll = useCallback(async (showLoader = true) => {
    if (!id) return;
    
    try {
      if (showLoader) setLoading(true);
      const pollData = await pollsApi.getPoll(id);
      if (!pollData) {
        setError('投票不存在');
        return;
      }
      setPoll(pollData);
      
      // 检查服务端是否已投票（双重验证）
      try {
        const serverHasVoted = await pollsApi.hasUserVoted(id, userId);
        if (serverHasVoted && !hasVoted) {
          // 如果服务端显示已投票但本地缓存显示未投票，同步状态
          setHasVoted(true);
          
          // 尝试从服务端获取用户的投票选项
          const { data: userVote } = await supabase
            .from('votes')
            .select('option_id')
            .eq('poll_id', id)
            .eq('user_id', userId)
            .limit(1)
            .single();
          
          if (userVote) {
            setVotedOptionId(userVote.option_id);
            console.log('同步用户投票选项:', userVote.option_id);
          }
        }
      } catch (err) {
        // 如果检查失败，继续使用本地缓存状态
        console.warn('检查投票状态失败，使用本地缓存状态:', err);
      }

      // 检查防刷票状态 [[memory:2457904]]
      if (id) {
        const spamCheck = AntiSpamUtils.hasVoted(id, userId);
        if (spamCheck.hasVoted && !hasVoted) {
          console.log(`[AntiSpam] 检测到投票记录，来源: ${spamCheck.source}`);
          setHasVoted(true);
        }
      }
    } catch (err: any) {
      setError(err.message || '加载投票失败');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [id, hasVoted, isExpired, userId, setHasVoted]);

  // 处理投票
  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted || isSubmitting || isExpired(poll) || !id) return;
    
    try {
      setIsSubmitting(true);
      setAntiSpamWarning(null);

      // 防刷票检查 [[memory:2457904]]
      // 1. 检查投票频率限制
      const rateLimit = AntiSpamUtils.checkVoteRateLimit(id, 1); // 1分钟限制
      if (!rateLimit.allowed) {
        setAntiSpamWarning(`请等待 ${rateLimit.waitTime} 秒后再投票`);
        return;
      }

      // 2. 检查多重投票状态
      const spamCheck = AntiSpamUtils.hasVoted(id, userId);
      if (spamCheck.hasVoted) {
        setAntiSpamWarning('检测到重复投票，已被阻止');
        setHasVoted(true);
        return;
      }

      // 3. 检查设备投票状态
      const deviceVoted = AntiSpamUtils.hasDeviceVoted(id);
      if (deviceVoted) {
        setAntiSpamWarning('此设备已经投票过了');
        return;
      }

      // 执行投票
      const voteResult = await pollsApi.vote(poll.id, optionId, userId);
      console.log('投票结果:', voteResult);
      
      // 标记防刷票状态
      AntiSpamUtils.markAsVoted(id, userId, optionId);
      AntiSpamUtils.markDeviceAsVoted(id);
      AntiSpamUtils.updateVoteRateLimit(id);
      
      // 立即更新本地状态，不需要重新获取数据
      setHasVoted(true);
      setVotedOptionId(optionId);
      
      // 立即更新本地投票计数（乐观更新）
      setPoll(currentPoll => {
        if (!currentPoll) return currentPoll;
        return {
          ...currentPoll,
          options: currentPoll.options.map(option => 
            option.id === optionId 
              ? { ...option, vote_count: option.vote_count + 1 }
              : option
          )
        };
      });
      
    } catch (err: any) {
      console.error('投票处理失败:', err);
      setError(err.message || '投票失败');
      // 如果投票失败，重置状态
      setHasVoted(false);
      setVotedOptionId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 实时更新处理
  const handleRealtimeUpdate = useCallback((payload: any) => {
    // 当其他用户投票时，只更新对应选项的计数
    if (payload.new?.option_id) {
      setPoll(currentPoll => {
        if (!currentPoll) return currentPoll;
        return {
          ...currentPoll,
          options: currentPoll.options.map(option => 
            option.id === payload.new.option_id 
              ? { ...option, vote_count: option.vote_count + 1 }
              : option
          )
        };
      });
    }
  }, []);

  // 设置实时订阅
  useEffect(() => {
    if (!id) return;
    
    const channel = pollsApi.subscribeToVotes(id, handleRealtimeUpdate);
    setRealtimeChannel(channel);
    
    return () => {
      if (channel) {
        pollsApi.unsubscribe(channel);
      }
    };
  }, [id, handleRealtimeUpdate]);

  // 初始加载
  useEffect(() => {
    fetchPoll();
    
    // 定期清理过期的防刷票数据 [[memory:2457904]]
    AntiSpamUtils.cleanupExpiredData(30);
  }, [fetchPoll]);

  // 清理
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        pollsApi.unsubscribe(realtimeChannel);
      }
    };
  }, [realtimeChannel]);



  // 计算总投票数
  const totalVotes = poll?.options.reduce((sum, option) => sum + option.vote_count, 0) || 0;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse"></div>
              <div className="space-y-3 pt-4">
                <div className="h-12 bg-muted rounded-md animate-pulse"></div>
                <div className="h-12 bg-muted rounded-md animate-pulse"></div>
                <div className="h-12 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="flex items-center space-x-3 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">出错了</h2>
            </div>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!poll) return null;

  const expired = isExpired(poll);
  const showResults = hasVoted || expired;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{poll.title}</h1>
              {poll.description && (
                <p className="text-muted-foreground text-lg">{poll.description}</p>
              )}
            </div>
            <div className="ml-4">
              <ShareButtonDirect 
                pollId={poll.id}
                shareType="result"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{totalVotes} 票</span>
            </div>
            
            {poll.expires_at && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  {expired ? '已过期' : `截止：${new Date(poll.expires_at).toLocaleString()}`}
                </span>
              </div>
            )}
            
            {hasVoted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>已投票</span>
              </div>
            )}
            

          </div>
        </motion.div>

        {/* 防刷票警告 */}
        {antiSpamWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 text-red-800">
              <Shield className="w-5 h-5" />
              <span className="font-medium">安全提示</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{antiSpamWarning}</p>
          </motion.div>
        )}

        {expired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">投票期限已过</span>
            </div>
            <p className="text-orange-700 text-sm mt-1">此投票已结束，以下是最终结果。</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-8 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {!showResults ? (
              // 投票模式
              <motion.div
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-foreground mb-6">请选择一个选项：</h3>
                <div className="space-y-3">
                  {poll.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      onClick={() => handleVote(option.id)}
                      disabled={isSubmitting}
                      className="w-full p-4 text-left bg-background hover:bg-secondary rounded-lg border border-border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                          {option.text}
                        </span>
                        {isSubmitting && (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // 结果模式
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">投票结果</h3>
                  <div className="text-sm text-muted-foreground">
                    总计 {totalVotes} 票
                  </div>
                </div>



              {/* 投票结果列表 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3"
              >
                {poll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (option.vote_count / totalVotes * 100).toFixed(1) : '0';
                  const isUserVoted = votedOptionId === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={`p-4 rounded-lg border ${
                        isUserVoted 
                          ? 'bg-primary/10 border-primary shadow-md' 
                          : 'bg-background border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${isUserVoted ? 'text-primary' : 'text-foreground'}`}>
                          {option.text}
                          {isUserVoted && <span className="ml-2 text-xs">✓ 您的选择</span>}
                        </span>
                        <div className="text-sm text-muted-foreground">
                          {option.vote_count} 票 ({percentage}%)
                        </div>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                          className={`h-2 rounded-full ${
                            isUserVoted ? 'bg-primary' : 'bg-muted-foreground'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Poll;
