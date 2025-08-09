import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Clock, Users, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';
import { pollsApi, Poll, RealtimeChannel } from '../../lib/supabaseClient';

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

// 饼图颜色
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(346, 87%, 43%)',
  'hsl(262, 83%, 58%)',
  'hsl(32, 98%, 56%)',
];

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');
  const [, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // 获取投票结果数据
  const fetchPollResult = async (showRefreshLoader = false) => {
    if (!id) return;
    
    try {
      if (showRefreshLoader) setIsRefreshing(true);
      else setLoading(true);
      
      const result = await pollsApi.getPollResults(id);
      setPollResult(result);
      setError(null);
    } catch (err) {
      console.error('获取投票结果失败:', err);
      setError(err instanceof Error ? err.message : '获取投票结果失败');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 处理实时更新
  const handleRealtimeUpdate = () => {
    fetchPollResult(true);
  };

  // 初始加载和实时订阅
  useEffect(() => {
    if (!id) return;

    fetchPollResult();

    // 订阅实时更新
    const channel = pollsApi.subscribeToVotes(id, handleRealtimeUpdate);
    setRealtimeChannel(channel);

    return () => {
      if (channel) {
        pollsApi.unsubscribe(channel);
      }
    };
  }, [id]);

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

  // 准备图表数据
  const chartData = pollResult?.results.map(result => ({
    name: result.text,
    votes: result.votes,
    percentage: result.percentage,
  })) || [];

  // 饼图数据
  const pieData = pollResult?.results.map((result, index) => ({
    name: result.text,
    value: result.votes,
    percentage: result.percentage,
    color: COLORS[index % COLORS.length],
  })) || [];

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
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* 头部导航 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
          
          <button
            onClick={() => fetchPollResult(true)}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新数据
          </button>
        </motion.div>

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

        {/* 图表控制 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'bar'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              柱状图
            </button>
            <button
              onClick={() => setViewMode('pie')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'pie'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="w-4 h-4 mr-2 inline-block border-2 border-current rounded-full" />
              饼图
            </button>
          </div>
        </motion.div>

        {/* 图表区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-8 shadow-sm mb-8"
        >
          <AnimatePresence mode="wait">
            {viewMode === 'bar' ? (
              <motion.div
                key="bar-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-96 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      formatter={(value: number) => [
                        `${value} 票 (${value > 0 ? ((value / pollResult.totalVotes) * 100).toFixed(1) : 0}%)`,
                        '投票数'
                      ]}
                    />
                    <Bar 
                      dataKey="votes" 
                      fill="hsl(var(--primary))" 
                      name="投票数"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div
                key="pie-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-96 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => 
                        percentage > 5 ? `${name} (${percentage.toFixed(1)}%)` : ''
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      formatter={(value: number) => [
                        `${value} 票 (${value > 0 ? ((value / pollResult.totalVotes) * 100).toFixed(1) : 0}%)`,
                        '投票数'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {pollResult.results
            .sort((a, b) => b.votes - a.votes)
            .map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center mb-2">
                {index === 0 && result.votes > 0 && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                )}
                <h3 className="font-semibold text-foreground truncate">
                  {result.text}
                </h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {result.votes}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.percentage.toFixed(1)}% • {result.votes} 票
                </p>
              </div>

              {/* 进度条 */}
              <div className="mt-4 w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  className="h-2 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 空状态提示 */}
        {pollResult.totalVotes === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📊</div>
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
