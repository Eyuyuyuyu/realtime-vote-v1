# 分享链接逻辑测试

## 修复内容

### 问题描述
之前的分享链接逻辑有问题：
- Poll页面硬编码为 `shareType="result"`，导致分享出去的是结果页面
- 缺少智能判断，没有根据投票状态动态决定分享类型

### 修复方案
1. **Poll页面智能分享**：
   - 如果投票还在进行中且没有人投票 → 分享 `poll` 页面（让别人来投票）
   - 如果投票已过期或有人投票 → 分享 `result` 页面（查看结果）

2. **Result页面**：始终分享 `result` 页面

3. **添加提示功能**：用户悬停时显示当前分享的链接类型

## 测试用例

### 场景1：新建投票，无人投票
- **页面**：Poll页面
- **状态**：投票进行中，totalVotes = 0
- **预期**：分享 `poll` 链接
- **提示**："分享投票链接 - 邀请朋友参与投票"

### 场景2：投票进行中，有人已投票
- **页面**：Poll页面
- **状态**：投票进行中，totalVotes > 0
- **预期**：分享 `result` 链接
- **提示**："分享结果链接 - 查看投票结果"

### 场景3：投票已过期
- **页面**：Poll页面
- **状态**：投票已过期
- **预期**：分享 `result` 链接
- **提示**："分享结果链接 - 查看投票结果"

### 场景4：结果页面
- **页面**：Result页面
- **状态**：任何状态
- **预期**：分享 `result` 链接
- **提示**："分享结果链接 - 查看投票结果"

## 代码修改

### 1. Poll页面 (src/pages/Poll/index.tsx)
```typescript
<ShareButtonDirect 
  pollId={poll.id}
  shareType={expired || totalVotes > 0 ? "result" : "poll"}
  showTooltip={true}
/>
```

### 2. ShareButtonDirect组件 (src/components/ShareButtonDirect.tsx)
- 添加 `showTooltip` 属性
- 添加提示文本生成逻辑
- 在按钮上添加 `title` 属性

### 3. Result页面 (src/pages/Result/index.tsx)
```typescript
<ShareButtonDirect 
  pollId={pollResult.poll.id}
  shareType="result"
  showTooltip={true}
/>
```

## 验证方法

1. 创建新投票，检查Poll页面的分享按钮提示
2. 投一票，检查分享按钮提示是否变化
3. 等待投票过期，检查分享按钮提示
4. 进入结果页面，检查分享按钮提示

## 预期结果

- 新建投票时，分享的是投票链接，提示"邀请朋友参与投票"
- 有人投票后，分享的是结果链接，提示"查看投票结果"
- 投票过期后，分享的是结果链接，提示"查看投票结果"
- 结果页面始终分享结果链接，提示"查看投票结果"
