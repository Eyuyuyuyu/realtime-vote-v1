-- 快速更新SQL - 直接复制到Supabase SQL编辑器执行

-- 添加 is_public 字段并设置默认值
ALTER TABLE polls ADD COLUMN is_public BOOLEAN DEFAULT true NOT NULL;

-- 添加索引优化查询性能
CREATE INDEX idx_polls_is_public ON polls(is_public);
CREATE INDEX idx_polls_public_created ON polls(is_public, created_at DESC) WHERE is_active = true;
