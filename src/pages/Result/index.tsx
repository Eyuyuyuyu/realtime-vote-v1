import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 示例数据，实际使用时从 Supabase 获取
const mockData = [
  { name: '选项 A', votes: 120 },
  { name: '选项 B', votes: 85 },
  { name: '选项 C', votes: 67 },
  { name: '选项 D', votes: 43 },
];

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-foreground mb-8"
        >
          投票结果
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-8 shadow-sm"
        >
          <p className="text-muted-foreground text-lg mb-4">
            投票 ID: <span className="font-mono text-foreground">{id}</span>
          </p>
          
          <p className="text-muted-foreground text-lg mb-6">
            在这里显示实时投票结果图表。页面结构已就绪，等待后续功能实现。
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-96 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                />
                <Legend />
                <Bar 
                  dataKey="votes" 
                  fill="hsl(var(--primary))" 
                  name="投票数"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {mockData.map((item, index) => (
              <div 
                key={item.name}
                className="bg-muted/50 rounded-lg p-4 text-center"
              >
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-2xl font-bold text-primary mt-2">{item.votes}</p>
                <p className="text-sm text-muted-foreground">票</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Result;
