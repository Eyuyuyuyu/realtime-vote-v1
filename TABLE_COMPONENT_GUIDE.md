# Table 组件使用指南

## 概述

项目中包含了两个表格组件：
- `Table`: 功能完整的表格组件，支持分页、排序、自定义渲染等
- `SimpleTable`: 简化版本，适用于快速创建简单表格

## 特性

### ✅ 已实现的功能
- 🎨 **深浅色主题适配** - 自动跟随系统主题或手动切换
- 📱 **响应式设计** - 移动端自动优化布局和字体大小
- 🎯 **高对比度支持** - 符合无障碍阅读标准
- 📄 **分页功能** - 内置分页器，支持大数据集展示
- 🎨 **自定义渲染** - 支持单元格内容自定义渲染
- ⚡ **加载状态** - 内置骨架屏加载效果
- 🈳 **空状态处理** - 优雅的空数据展示
- 🖱️ **交互功能** - 行点击、悬停效果等
- ♿ **无障碍性** - 键盘导航和焦点管理

## 基础使用

### 1. 导入组件

```tsx
import { Table, SimpleTable, TableColumn } from './components/ui/Table';
```

### 2. 定义数据和列

```tsx
// 数据类型定义
interface UserData {
  id: number;
  name: string;
  age: number;
  city: string;
  status: string;
}

// 示例数据
const data: UserData[] = [
  { id: 1, name: '张三', age: 28, city: '北京', status: '活跃' },
  { id: 2, name: '李四', age: 32, city: '上海', status: '待审核' },
  // ...更多数据
];

// 列定义
const columns: TableColumn<UserData>[] = [
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
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === '活跃' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
      }`}>
        {value}
      </span>
    ),
  },
];
```

### 3. 使用完整功能表格

```tsx
<Table
  columns={columns}
  data={data}
  pagination={true}
  pageSize={10}
  hover={true}
  onRowClick={(record) => console.log('点击了:', record)}
  responsive={true}
/>
```

### 4. 使用简化表格

```tsx
<SimpleTable
  headers={['姓名', '年龄', '城市']}
  rows={[
    ['张三', 28, '北京'],
    ['李四', 32, '上海'],
    ['王五', 25, '广州'],
  ]}
  responsive={true}
/>
```

## 高级功能

### 自定义渲染

```tsx
const columns: TableColumn[] = [
  {
    key: 'avatar',
    title: '头像',
    render: (_, record) => (
      <img 
        src={record.avatar} 
        alt={record.name}
        className="w-8 h-8 rounded-full"
      />
    ),
  },
  {
    key: 'votes',
    title: '投票数',
    dataIndex: 'votes',
    render: (value) => (
      <div className="flex items-center">
        <span className="font-medium text-primary">{value}</span>
        <span className="ml-1 text-muted">票</span>
      </div>
    ),
  },
];
```

### 加载和空状态

```tsx
// 加载状态
<Table
  columns={columns}
  data={[]}
  loading={true}
/>

// 空数据状态
<Table
  columns={columns}
  data={[]}
  emptyText="没有找到相关数据"
/>
```

### 分页配置

```tsx
<Table
  columns={columns}
  data={data}
  pagination={true}
  pageSize={20}  // 每页显示数量
/>
```

## 样式自定义

### CSS 类名

表格组件使用了以下 CSS 类名，可以通过覆盖这些类来自定义样式：

- `.ui-table` - 表格主体
- `.ui-table-container` - 表格容器（响应式滚动）
- `.ui-table th` - 表头单元格
- `.ui-table td` - 数据单元格
- `.ui-table tbody tr:hover` - 行悬停状态

### 主题颜色变量

表格使用以下 CSS 变量，会自动跟随主题变化：

```css
/* 浅色模式 */
--table-header: #f5f5f5;
--table-row: #ffffff;
--table-row-hover: #f9f9f9;
--table-border: #cccccc;

/* 深色模式 */
--table-header: #222222;
--table-row: #1a1a1a;
--table-row-hover: #2a2a2a;
--table-border: #444444;
```

## 响应式设计

### 移动端优化

- **字体大小**: 自动调整为移动端友好的大小
- **间距**: 优化触摸目标和视觉间距
- **滚动**: 水平滚动支持，防止内容被截断

### 断点说明

- `768px` 以下：平板/手机优化
- `480px` 以下：小屏手机进一步优化

## 无障碍性

### 键盘导航
- 支持 Tab 键在表格中导航
- 行点击支持 Enter 键激活

### 屏幕阅读器
- 表格包含适当的 ARIA 标签
- 表头和数据关联正确

### 高对比度模式
- 自动检测系统高对比度偏好
- 提升边框和文字对比度

## 完整 API 参考

### Table Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | 必需 | 列定义数组 |
| `data` | `T[]` | 必需 | 数据数组 |
| `loading` | `boolean` | `false` | 是否显示加载状态 |
| `className` | `string` | `''` | 自定义类名 |
| `rowKey` | `string \| function` | `'id'` | 行唯一标识 |
| `onRowClick` | `function` | - | 行点击回调 |
| `pagination` | `boolean` | `false` | 是否启用分页 |
| `pageSize` | `number` | `10` | 每页数量 |
| `emptyText` | `string` | `'暂无数据'` | 空数据提示 |
| `responsive` | `boolean` | `true` | 是否响应式 |
| `hover` | `boolean` | `true` | 是否启用悬停效果 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 表格尺寸 |

### TableColumn 接口

| 属性 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | 列唯一标识 |
| `title` | `string` | 列标题 |
| `dataIndex` | `string` | 数据字段名 |
| `width` | `string \| number` | 列宽度 |
| `align` | `'left' \| 'center' \| 'right'` | 对齐方式 |
| `render` | `function` | 自定义渲染函数 |
| `className` | `string` | 自定义类名 |

### SimpleTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `headers` | `string[]` | 必需 | 表头数组 |
| `rows` | `(string \| number \| ReactNode)[][]` | 必需 | 数据行数组 |
| `className` | `string` | `''` | 自定义类名 |
| `responsive` | `boolean` | `true` | 是否响应式 |

## 最佳实践

1. **性能优化**: 对于大数据集，建议启用分页功能
2. **移动端适配**: 在小屏幕上考虑减少列数或使用卡片布局
3. **加载状态**: 始终为异步数据提供加载状态
4. **错误处理**: 为网络错误等异常情况提供友好提示
5. **无障碍性**: 确保表格内容对屏幕阅读器友好

## 示例项目

查看 `src/components/UIShowcase.tsx` 文件中的完整示例，了解表格组件的各种用法和效果。
