import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { SimpleThemeToggle } from './components/ThemeToggle';
import { pollsApi, Poll } from './lib/supabaseClient';
import ShareButton from './components/ShareButton';
import CreatePoll from './pages/CreatePoll';
import PollPage from './pages/Poll';
import Result from './pages/Result';
import UIShowcase from './components/UIShowcase';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
        {/* 导航栏 */}
        <nav className="bg-card border-b border-border shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Realtime Vote
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                <Link
                  to="/create"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  创建投票
                </Link>
                <Link
                  to="/result/demo"
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors font-medium"
                >
                  查看结果
                </Link>
                <Link
                  to="/ui-showcase"
                  className="px-4 py-2 bg-auxiliary text-foreground rounded-md hover:bg-auxiliary/80 transition-colors font-medium"
                >
                  UI 展示
                </Link>
                <SimpleThemeToggle />
              </motion.div>
            </div>
          </div>
        </nav>

        {/* 主要内容区域 */}
        <main>
          <Routes>
            {/* 首页重定向到创建投票页面 */}
            <Route path="/" element={<Home />} />
            {/* 创建投票页面 */}
            <Route path="/create" element={<CreatePoll />} />
            {/* 投票页面 */}
            <Route path="/poll/:id" element={<PollPage />} />
            {/* 结果页面 */}
            <Route path="/result/:id" element={<Result />} />
            {/* UI 展示页面 */}
            <Route path="/ui-showcase" element={<UIShowcase />} />
          </Routes>
        </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

// 首页组件
const Home: React.FC = () => {
  const [polls, setPolls] = React.useState<Poll[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 获取所有投票
  React.useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const pollsData = await pollsApi.getPolls();
        setPolls(pollsData);
        setError(null);
      } catch (err) {
        console.error('获取投票列表失败:', err);
        setError(err instanceof Error ? err.message : '获取投票列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // 格式化时间显示
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}天前`;
    if (diffHours > 0) return `${diffHours}小时前`;
    if (diffMinutes > 0) return `${diffMinutes}分钟前`;
    return '刚刚';
  };

  // 检查是否过期
  const isPollExpired = (poll: Poll) => {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  };

  // 获取投票状态图标和文本
  const getPollStatus = (poll: Poll) => {
    if (!poll.is_active) {
      return { icon: '⏸️', text: '已暂停', color: 'text-muted-foreground' };
    }
    if (isPollExpired(poll)) {
      return { icon: '⏰', text: '已过期', color: 'text-destructive' };
    }
    return { icon: '🚀', text: '进行中', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载投票列表...</p>
        </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-foreground mb-6">
            实时投票平台
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            创建实时投票，查看即时结果。支持多人同时参与，数据实时同步更新。
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/create"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg"
            >
              开始创建投票
            </Link>
          </motion.div>
        </motion.div>

        {/* 投票列表区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                加载失败
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                重新加载
              </button>
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                还没有投票
              </h3>
              <p className="text-muted-foreground mb-6">
                创建你的第一个投票，开始收集大家的意见吧！
              </p>
              <Link
                to="/create"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                立即创建
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                  所有投票 ({polls.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {polls.map((poll, index) => {
                  const status = getPollStatus(poll);
                  const totalVotes = poll.options.reduce((sum, option) => sum + option.vote_count, 0);
                  
                  return (
                    <motion.div
                      key={poll.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={`/result/${poll.id}`}
                        className="block bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                              {poll.title}
                            </h3>
                            {poll.description && (
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {poll.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <ShareButton 
                              pollId={poll.id}
                              pollTitle={poll.title}
                              shareType="poll"
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* 状态和统计信息 */}
                          <div className="flex items-center justify-between text-sm">
                            <span className={`flex items-center ${status.color}`}>
                              <span className="mr-1">{status.icon}</span>
                              {status.text}
                            </span>
                            <span className="text-muted-foreground">
                              {totalVotes} 票
                            </span>
                          </div>

                          {/* 投票选项预览 */}
                          <div className="space-y-2">
                            {poll.options.slice(0, 3).map((option) => {
                              const percentage = totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0;
                              return (
                                <div key={option.id} className="text-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-foreground truncate">
                                      {option.text}
                                    </span>
                                    <span className="text-muted-foreground ml-2">
                                      {option.vote_count}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-1.5">
                                    <div
                                      className="bg-primary rounded-full h-1.5 transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            {poll.options.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{poll.options.length - 3} 个选项
                              </p>
                            )}
                          </div>

                          {/* 时间信息 */}
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>创建于 {formatTimeAgo(poll.created_at)}</span>
                              {poll.expires_at && (
                                <span className={isPollExpired(poll) ? 'text-destructive' : ''}>
                                  {isPollExpired(poll) ? '已过期' : '截止'} {formatTimeAgo(poll.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
