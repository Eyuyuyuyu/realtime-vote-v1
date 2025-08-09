import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle, Users, AlertCircle } from 'lucide-react';
import { pollsApi, Poll as PollType, RealtimeChannel, getUserId } from '../../lib/supabaseClient';
import useLocalStorageState from 'use-local-storage-state';

interface ChartData {
  name: string;
  votes: number;
  color: string;
}

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
  const fetchPoll = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
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
        }
      } catch (err) {
        // 如果检查失败，继续使用本地缓存状态
        console.warn('检查投票状态失败，使用本地缓存状态:', err);
      }
    } catch (err: any) {
      setError(err.message || '加载投票失败');
    } finally {
      setLoading(false);
    }
  }, [id, hasVoted, isExpired, userId, setHasVoted]);

  // 处理投票
  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted || isSubmitting || isExpired(poll)) return;
    
    try {
      setIsSubmitting(true);
      await pollsApi.vote(poll.id, optionId, userId);
      
      // 更新本地状态
      setHasVoted(true);
      setVotedOptionId(optionId);
      
      // 立即刷新投票数据以显示最新结果
      await fetchPoll();
    } catch (err: any) {
      setError(err.message || '投票失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 实时更新处理
  const handleRealtimeUpdate = useCallback(async (payload: any) => {
    // 当有新投票时，重新获取投票数据
    if (payload.eventType === 'INSERT' && payload.new?.poll_id === id) {
      await fetchPoll();
    }
  }, [id, fetchPoll]);

  // 设置实时订阅
  useEffect(() => {
    if (!id || !poll) return;
    
    const channel = pollsApi.subscribeToVotes(id, handleRealtimeUpdate);
    setRealtimeChannel(channel);
    
    return () => {
      if (channel) {
        pollsApi.unsubscribe(channel);
      }
    };
  }, [id, poll, handleRealtimeUpdate]);

  // 初始加载
  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // 清理
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        pollsApi.unsubscribe(realtimeChannel);
      }
    };
  }, [realtimeChannel]);

  // 准备图表数据
  const chartData: ChartData[] = React.useMemo(() => {
    if (!poll?.options) return [];
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    return poll.options.map((option, index) => ({
      name: option.text.length > 20 ? option.text.substring(0, 20) + '...' : option.text,
      votes: option.vote_count,
      color: colors[index % colors.length],
    }));
  }, [poll?.options]);

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
          <h1 className="text-4xl font-bold text-foreground mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-muted-foreground text-lg">{poll.description}</p>
          )}
          
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
          {!showResults ? (
            // 投票模式
            <div className="space-y-4">
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
                    className="w-full p-4 text-left bg-muted hover:bg-muted/80 rounded-lg border border-border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
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
            </div>
          ) : (
            // 结果模式
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">投票结果</h3>
                <div className="text-sm text-muted-foreground">
                  总计 {totalVotes} 票
                </div>
              </div>

              {/* 图表显示 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} 票`, '投票数']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* 详细结果列表 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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
                          : 'bg-muted border-border'
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
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Poll;
