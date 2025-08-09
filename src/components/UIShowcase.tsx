import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle, SimpleThemeToggle } from './ThemeToggle';
import { Table, SimpleTable, TableColumn } from './ui/Table';

export const UIShowcase: React.FC = () => {
  const { actualTheme } = useTheme();
  const [progress, setProgress] = useState(65);

  // 示例数据
  const sampleData = [
    { name: '选项 A', value: 45, color: 'var(--color-primary)' },
    { name: '选项 B', value: 30, color: 'var(--color-secondary)' },
    { name: '选项 C', value: 20, color: 'var(--color-accent)' },
    { name: '选项 D', value: 5, color: 'var(--color-auxiliary)' },
  ];

  // 表格示例数据
  const tableData = [
    { id: 1, name: '张三', age: 28, city: '北京', votes: 120, status: '活跃' },
    { id: 2, name: '李四', age: 32, city: '上海', votes: 85, status: '活跃' },
    { id: 3, name: '王五', age: 25, city: '广州', votes: 67, status: '待审核' },
    { id: 4, name: '赵六', age: 35, city: '深圳', votes: 43, status: '活跃' },
    { id: 5, name: '钱七', age: 29, city: '杭州', votes: 156, status: '活跃' },
  ];

  // 表格列定义
  const columns: TableColumn[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: '15%',
      align: 'center',
    },
    {
      key: 'city',
      title: '城市',
      dataIndex: 'city',
      width: '20%',
    },
    {
      key: 'votes',
      title: '投票数',
      dataIndex: 'votes',
      width: '20%',
      align: 'right',
      render: (value) => (
        <span className="font-medium text-primary">{value}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: '25%',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === '活跃'
              ? 'bg-success/20 text-success'
              : 'bg-warning/20 text-warning'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题和主题信息 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">UI 组件展示</h1>
          <p className="text-lg text-muted mb-4">
            当前主题：<span className="font-semibold">{actualTheme === 'dark' ? '深色模式' : '浅色模式'}</span>
          </p>
          <ThemeToggle />
        </motion.div>

        {/* 颜色展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">主题颜色</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: '主色', var: '--color-primary', label: 'Primary' },
              { name: '次色', var: '--color-secondary', label: 'Secondary' },
              { name: '高亮', var: '--color-accent', label: 'Accent' },
              { name: '辅助', var: '--color-auxiliary', label: 'Auxiliary' },
              { name: '成功', var: '--color-success', label: 'Success' },
              { name: '警告', var: '--color-warning', label: 'Warning' },
              { name: '危险', var: '--color-destructive', label: 'Destructive' },
              { name: '边框', var: '--color-border', label: 'Border' },
            ].map((color) => (
              <div key={color.var} className="text-center">
                <div
                  className="w-full h-16 rounded-lg border border-border mb-2"
                  style={{ backgroundColor: `var(${color.var})` }}
                />
                <p className="text-sm font-medium text-foreground">{color.name}</p>
                <p className="text-xs text-muted">{color.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 按钮展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">按钮样式</h2>
          <div className="space-y-6">
            {/* 原生按钮样式 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">基础按钮</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-primary text-foreground rounded-md hover:bg-primary/90 transition-colors">
                  主要按钮
                </button>
                <button className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/90 transition-colors">
                  次要按钮
                </button>
                <button className="px-4 py-2 bg-accent text-foreground rounded-md hover:bg-accent/90 transition-colors">
                  高亮按钮
                </button>
                <button className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors">
                  危险按钮
                </button>
              </div>
            </div>

            {/* 自定义按钮样式 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">自定义按钮</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-confirm">确认</button>
                <button className="btn-delete">删除</button>
                <button className="btn-cancel">取消</button>
              </div>
            </div>

            {/* 按钮尺寸 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">按钮尺寸</h3>
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-2 py-1 text-sm bg-primary text-foreground rounded hover:bg-primary/90 transition-colors">
                  小按钮
                </button>
                <button className="px-4 py-2 bg-primary text-foreground rounded-md hover:bg-primary/90 transition-colors">
                  普通按钮
                </button>
                <button className="px-6 py-3 text-lg bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  大按钮
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 输入框和表单元素 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">表单元素</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                文本输入框
              </label>
              <input
                type="text"
                className="ui-input w-full"
                placeholder="请输入内容..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                文本域
              </label>
              <textarea
                className="ui-input w-full h-24 resize-none"
                placeholder="请输入多行内容..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                选择框
              </label>
              <select className="ui-input w-full">
                <option>选项 1</option>
                <option>选项 2</option>
                <option>选项 3</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* 进度条展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">进度条</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">投票进度</span>
                <span className="text-sm text-muted">{progress}%</span>
              </div>
              <div className="ui-progress">
                <motion.div
                  className="ui-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                  className="btn-cancel text-sm"
                >
                  -10%
                </button>
                <button
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                  className="btn-confirm text-sm"
                >
                  +10%
                </button>
              </div>
            </div>

            {/* 多个进度条 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">投票选项结果</h3>
              {sampleData.map((item, index) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm text-muted">{item.value}%</span>
                  </div>
                  <div className="ui-progress">
                    <motion.div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 卡片和布局 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">卡片和布局</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <motion.div
                key={num}
                className="ui-card p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  卡片标题 {num}
                </h3>
                <p className="text-muted mb-4">
                  这是卡片的描述内容，展示了文本在不同主题下的效果。
                </p>
                <div className="flex gap-2">
                  <button className="btn-confirm text-sm">操作</button>
                  <button className="btn-cancel text-sm">取消</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 主题切换器展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">主题切换器</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">完整版主题切换器</h3>
              <ThemeToggle />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">简化版主题切换器</h3>
              <SimpleThemeToggle />
            </div>
          </div>
        </motion.section>

        {/* 表格展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="ui-card p-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">表格组件</h2>
          
          <div className="space-y-8">
            {/* 完整功能表格 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">完整功能表格</h3>
              <Table
                columns={columns}
                data={tableData}
                pagination={true}
                pageSize={3}
                hover={true}
                onRowClick={(record) => alert(`点击了：${record.name}`)}
              />
            </div>

            {/* 简化表格 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">简化表格</h3>
              <SimpleTable
                headers={['选项', '票数', '占比']}
                rows={[
                  ['选项 A', '120', '45%'],
                  ['选项 B', '85', '32%'],
                  ['选项 C', '43', '16%'],
                  ['选项 D', '18', '7%'],
                ]}
              />
            </div>

            {/* 加载状态演示 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">加载状态</h3>
              <Table
                columns={columns.slice(0, 3)}
                data={[]}
                loading={true}
                pageSize={3}
              />
            </div>

            {/* 空数据状态 */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">空数据状态</h3>
              <Table
                columns={columns.slice(0, 3)}
                data={[]}
                emptyText="没有找到相关数据"
              />
            </div>
          </div>
        </motion.section>

        {/* 响应式测试提示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="ui-card p-6 text-center"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4">响应式测试</h2>
          <p className="text-muted mb-4">
            调整浏览器窗口大小或在移动设备上查看，测试响应式布局效果。
          </p>
          <div className="text-sm text-muted space-y-1">
            <p>当前视口：<span className="sm:hidden">移动端</span><span className="hidden sm:inline md:hidden">平板端</span><span className="hidden md:inline lg:hidden">小桌面</span><span className="hidden lg:inline">大桌面</span></p>
            <p className="mt-2">表格在移动端自动变为响应式布局，支持横向滚动。</p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default UIShowcase;
