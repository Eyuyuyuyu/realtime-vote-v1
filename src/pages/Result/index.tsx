import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, Users, ArrowLeft, RefreshCw } from 'lucide-react';
import { pollsApi, Poll, RealtimeChannel } from '../../lib/supabaseClient';
import { ShareButtonDirect } from '../../components/ShareButtonDirect';

interface ResultData {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface PollResult {
  poll: Poll;
  totalVotes: number;
  results: ResultData[];
}



const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // 获取投票结果数据
  const fetchPollResult = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const result = await pollsApi.getPollResults(id);
      setPollResult(result);
      setError(null);
    } catch (err) {
      console.error('获取投票结果失败:', err);
      setError(err instanceof Error ? err.message : '获取投票结果失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 处理实时更新
  const handleRealtimeUpdate = useCallback((payload: any) => {
    // 当有新投票时，只更新对应选项的计数
    if (payload.new?.option_id) {
      setPollResult(currentResult => {
        if (!currentResult) return currentResult;
        
        const updatedResults = currentResult.results.map(result => 
          result.id === payload.new.option_id 
            ? { ...result, votes: result.votes + 1 }
            : result
        );
        
        const newTotalVotes = currentResult.totalVotes + 1;
        
        // 重新计算百分比
        const resultsWithPercentage = updatedResults.map(result => ({
          ...result,
          percentage: newTotalVotes > 0 ? (result.votes / newTotalVotes) * 100 : 0
        }));
        
        return {
          ...currentResult,
          totalVotes: newTotalVotes,
          results: resultsWithPercentage
        };
      });
    }
  }, []);

  // 初始加载
  useEffect(() => {
    if (!id) return;
    fetchPollResult();
  }, [id, fetchPollResult]);

  // 实时订阅
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

  // 检查投票是否过期
  const isExpired = pollResult ? pollsApi.isPollExpired(pollResult.poll) : false;

  // 格式化时间
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">正在加载投票结果...</p>
        </div>
      </div>
    );
  }

  if (error || !pollResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">投票不存在</h1>
          <p className="text-muted-foreground mb-6">
            {error || '未找到指定的投票，请检查链接是否正确。'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* 头部导航 - 与App.tsx中的导航栏布局保持一致 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-6xl mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
          
          <div className="flex items-center gap-3">
            <ShareButtonDirect 
              pollId={pollResult.poll.id}
              shareType="result"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">

        {/* 投票标题和状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {pollResult.poll.title}
          </h1>
          
          {pollResult.poll.description && (
            <p className="text-lg text-muted-foreground mb-4">
              {pollResult.poll.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              总投票数: <span className="font-medium text-foreground ml-1">{pollResult.totalVotes}</span>
            </span>
            
            {pollResult.poll.expires_at && (
              <span className={`flex items-center ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Clock className="w-4 h-4 mr-2" />
                {isExpired ? '已过期' : '截止时间'}: 
                <span className="font-medium ml-1">
                  {formatDate(pollResult.poll.expires_at)}
                </span>
              </span>
            )}
            
            <span className="flex items-center text-muted-foreground">
              创建时间: <span className="font-medium text-foreground ml-1">
                {formatDate(pollResult.poll.created_at)}
              </span>
            </span>
          </div>

          {/* 过期提示 */}
          <AnimatePresence>
            {isExpired && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-center text-destructive">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">此投票已过期，结果仅供查看</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>



        {/* 投票结果表格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
        >
          <div className="ui-table-container">
            <table className="ui-table">
              <thead>
                <tr>
                  <th className="text-left">排名</th>
                  <th className="text-left">选项</th>
                  <th className="text-center">票数</th>
                  <th className="text-center">百分比</th>
                  <th className="text-left">进度</th>
                </tr>
              </thead>
              <tbody>
                {pollResult.results
                  .sort((a, b) => b.votes - a.votes)
                  .map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="hover:bg-table-row-hover transition-colors"
                  >
                    <td className="text-left">
                      <div className="flex items-center">
                        {index === 0 && result.votes > 0 ? (
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-left">
                      <span className="font-medium text-foreground">{result.text}</span>
                    </td>
                    <td className="text-center">
                      <span className="text-lg font-bold text-primary">{result.votes}</span>
                    </td>
                    <td className="text-center">
                      <span className="text-sm font-medium">{result.percentage.toFixed(1)}%</span>
                    </td>
                    <td className="text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-2 min-w-[100px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.percentage}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            className="h-2 bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {result.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 空状态提示 */}
        {pollResult.totalVotes === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">
              还没有人投票
            </h3>
            <p className="text-muted-foreground">
              分享这个投票链接，让更多人参与进来吧！
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Result;
