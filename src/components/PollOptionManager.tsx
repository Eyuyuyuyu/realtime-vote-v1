import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface PollOptionManagerProps {
  options: string[];
  onChange: (options: string[]) => void;
  error?: string;
}

export const PollOptionManager: React.FC<PollOptionManagerProps> = ({
  options,
  onChange,
  error
}) => {
  const addOption = () => {
    onChange([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      onChange(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none">
          投票选项 <span className="text-muted-foreground">(至少2项)</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加选项
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <Input
                  placeholder={`选项 ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  error={!option.trim() ? `选项 ${index + 1} 不能为空` : undefined}
                />
              </div>
              {options.length > 2 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
