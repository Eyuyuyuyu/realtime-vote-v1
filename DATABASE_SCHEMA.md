# Supabase 数据库架构

## 表结构设计

### 1. polls 表（投票主表）

```sql
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_multiple BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明：**
- `id`: 投票唯一标识符
- `title`: 投票标题（必填）
- `description`: 投票描述（可选）
- `is_multiple`: 是否允许多选
- `expires_at`: 投票有效期（可选，留空表示永不过期）
- `is_active`: 投票是否激活
- `is_public`: 是否公开（公开的投票会在首页显示，非公开的只能通过分享链接访问）
- `creator_id`: 创建者ID（可选）
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 2. poll_options 表（投票选项表）

```sql
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明：**
- `id`: 选项唯一标识符
- `poll_id`: 关联的投票ID
- `text`: 选项文本
- `vote_count`: 投票数量（冗余字段，用于优化查询）
- `created_at`: 创建时间

### 3. votes 表（投票记录表）

```sql
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明：**
- `id`: 投票记录唯一标识符
- `poll_id`: 关联的投票ID
- `option_id`: 选择的选项ID
- `user_id`: 投票用户ID（可选，用于匿名投票）
- `created_at`: 投票时间

## 索引建议

```sql
-- 为了优化查询性能，建议创建以下索引
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_polls_is_active ON polls(is_active);
CREATE INDEX idx_polls_is_public ON polls(is_public);
CREATE INDEX idx_polls_public_created ON polls(is_public, created_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
```

## 触发器（用于实时更新投票数量）

```sql
-- 创建函数来更新选项的投票数量
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_count();
```

## 行级安全性 (RLS)

```sql
-- 启用行级安全性
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 设置策略（允许所有人读取，但限制写入）
CREATE POLICY "Allow read access for all users" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON polls FOR INSERT WITH CHECK (true);

-- 可选：如果需要更严格的访问控制，可以设置只有公开投票才能被所有人查看
-- CREATE POLICY "Public polls readable by all" ON polls FOR SELECT USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Allow read access for all users" ON poll_options FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON poll_options FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access for all users" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON votes FOR INSERT WITH CHECK (true);
```

## 实时功能

项目使用 Supabase 的实时功能来实现投票结果的实时更新。主要监听 `votes` 表的变化：

```typescript
supabase
  .channel(`votes:poll_id=eq.${pollId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'votes',
    filter: `poll_id=eq.${pollId}`,
  }, callback)
  .subscribe();
```

这样可以确保当有新的投票时，所有查看该投票的用户都能实时看到结果更新。
