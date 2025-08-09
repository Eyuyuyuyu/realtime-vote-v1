-- 更新Supabase数据库以支持投票公开/非公开功能
-- 执行顺序：按照下面的顺序逐个执行SQL语句

-- 1. 添加 is_public 字段到 polls 表
ALTER TABLE polls ADD COLUMN is_public BOOLEAN DEFAULT true;

-- 2. 为现有投票设置默认值（所有现有投票设为公开）
UPDATE polls SET is_public = true WHERE is_public IS NULL;

-- 3. 设置字段为非空
ALTER TABLE polls ALTER COLUMN is_public SET NOT NULL;

-- 4. 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_polls_is_public ON polls(is_public);

-- 5. 添加复合索引以优化首页投票列表查询（按创建时间排序的公开投票）
CREATE INDEX IF NOT EXISTS idx_polls_public_created ON polls(is_public, created_at DESC) WHERE is_active = true;

-- 6. 验证更改 - 查看表结构
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'polls' 
-- ORDER BY ordinal_position;

-- 7. 验证数据 - 查看投票统计
-- SELECT 
--   is_public,
--   COUNT(*) as poll_count
-- FROM polls 
-- GROUP BY is_public;

-- 可选：如果需要更严格的行级安全策略，可以取消注释以下语句
-- 这将限制只有公开投票或投票创建者才能查看投票
/*
-- 删除现有的宽松策略
DROP POLICY IF EXISTS "Allow read access for all users" ON polls;

-- 创建新的限制性策略
CREATE POLICY "Public polls or owner access" ON polls 
  FOR SELECT USING (
    is_public = true OR 
    creator_id = auth.uid()::text OR 
    creator_id IS NULL  -- 允许访问没有创建者ID的投票（匿名投票）
  );
*/

-- 完成提示
SELECT 'Database update completed successfully!' as status;
