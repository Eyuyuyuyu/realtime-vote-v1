import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Settings } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { PollOptionManager } from '../../components/PollOptionManager';
import { pollsApi, CreatePollInput } from '../../lib/supabaseClient';

interface FormData {
  title: string;
  description: string;
  isMultiple: boolean;
  expiresAt: string;
  options: string[];
}

interface FormErrors {
  title?: string;
  options?: string;
  submit?: string;
}

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    isMultiple: false,
    expiresAt: '',
    options: ['', '']
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证标题
    if (!formData.title.trim()) {
      newErrors.title = '投票标题不能为空';
    }

    // 验证选项
    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = '至少需要2个有效选项';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const validOptions = formData.options.filter(option => option.trim());
      
      const pollInput: CreatePollInput = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        is_multiple: formData.isMultiple,
        expires_at: formData.expiresAt || undefined,
        options: validOptions,
      };

      const createdPoll = await pollsApi.createPoll(pollInput);
      
      // 跳转到投票页面
      navigate(`/poll/${createdPoll.id}`);
    } catch (error) {
      console.error('创建投票失败:', error);
      setErrors({
        submit: error instanceof Error ? error.message : '创建投票失败，请重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          创建投票
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">基本信息</h2>
              </div>

              <Input
                label="投票标题"
                placeholder="请输入投票标题"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={errors.title}
                required
              />

              <Textarea
                label="投票描述"
                placeholder="请输入投票描述（可选）"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* 投票设置 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">投票设置</h2>
              </div>

              <Switch
                label="允许多选"
                description="开启后用户可以选择多个选项"
                checked={formData.isMultiple}
                onChange={(e) => setFormData(prev => ({ ...prev, isMultiple: e.target.checked }))}
              />

              <Input
                label="有效期"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                description="留空表示永不过期"
              />
            </div>

            {/* 投票选项 */}
            <div className="space-y-6">
              <PollOptionManager
                options={formData.options}
                onChange={(options) => setFormData(prev => ({ ...prev, options }))}
                error={errors.options}
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              {errors.submit && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              <motion.div
                className="flex gap-4 ml-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden"
                >
                  <motion.span
                    animate={isSubmitting ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    创建投票
                  </motion.span>
                  
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePoll;
