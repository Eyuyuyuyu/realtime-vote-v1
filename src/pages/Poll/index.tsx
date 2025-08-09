import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Poll: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-foreground mb-8"
        >
          投票页面
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
            在这里用户可以参与实时投票。页面结构已就绪，等待后续功能实现。
          </p>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="h-12 bg-muted rounded-md animate-pulse"></div>
              <div className="h-12 bg-muted rounded-md animate-pulse"></div>
              <div className="h-12 bg-muted rounded-md animate-pulse"></div>
            </div>
            
            <div className="pt-4">
              <div className="h-10 bg-primary/20 rounded-md w-32 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Poll;
