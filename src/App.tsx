import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { SimpleThemeToggle } from './components/ThemeToggle';
import CreatePoll from './pages/CreatePoll';
import Poll from './pages/Poll';
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
            <Route path="/poll/:id" element={<Poll />} />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl font-bold text-foreground mb-6"
        >
          实时投票平台
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          创建实时投票，查看即时结果。支持多人同时参与，数据实时同步更新。
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/create"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg"
          >
            开始创建投票
          </Link>
          <Link
            to="/poll/demo"
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-lg"
          >
            查看示例投票
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">🚀 实时更新</h3>
            <p className="text-muted-foreground">投票结果实时同步，无需刷新页面即可看到最新数据</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">📊 数据可视化</h3>
            <p className="text-muted-foreground">美观的图表展示投票结果，让数据一目了然</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">🎨 现代设计</h3>
            <p className="text-muted-foreground">简洁现代的界面设计，支持深色和浅色主题</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
