-- 修复投票计数问题 - 添加触发器自动更新 vote_count
-- 执行顺序：按照下面的顺序逐个执行SQL语句

-- 1. 创建或替换函数来更新选项的投票数量
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 投票时增加计数
    UPDATE poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- 删除投票时减少计数
    UPDATE poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. 删除现有触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_update_vote_count ON votes;

-- 3. 创建触发器
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_count();

-- 4. 重新计算所有现有投票的计数（修复现有数据）
UPDATE poll_options
SET vote_count = (
  SELECT COUNT(*)
  FROM votes
  WHERE votes.option_id = poll_options.id
);

-- 5. 启用实时功能
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- 6. 验证修复 - 检查投票计数是否正确
SELECT 
  po.text as option_text,
  po.vote_count as stored_count,
  COUNT(v.id) as actual_count,
  (po.vote_count = COUNT(v.id)) as count_matches
FROM poll_options po
LEFT JOIN votes v ON po.id = v.option_id
GROUP BY po.id, po.text, po.vote_count
ORDER BY po.text;

SELECT 'Vote count fix completed successfully!' as status;
