import React from 'react';
import { motion } from 'framer-motion';

// 表格列定义接口
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
}

// 表格属性接口
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  className?: string;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  pagination?: boolean;
  pageSize?: number;
  emptyText?: string;
  responsive?: boolean;
  striped?: boolean;
  hover?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// 加载骨架组件
const TableSkeleton: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => (
  <div className="ui-table-container">
    <table className="ui-table">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 空状态组件
const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center py-8 text-muted">
    <p className="text-lg">{text}</p>
  </div>
);

// 主表格组件
export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  className = '',
  rowKey = 'id',
  onRowClick,
  pagination = false,
  pageSize = 10,
  emptyText = '暂无数据',
  responsive = true,
  striped = false,
  hover = true,
  size = 'medium',
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // 获取行的唯一标识
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // 获取单元格的值
  const getCellValue = (record: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(
        column.dataIndex ? record[column.dataIndex] : record,
        record,
        data.indexOf(record)
      );
    }
    return column.dataIndex ? record[column.dataIndex] : '';
  };

  // 分页逻辑
  const paginatedData = React.useMemo(() => {
    if (!pagination) return data;
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(data.length / pageSize);

  // 尺寸类名映射
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm md:text-base',
    large: 'text-base md:text-lg',
  };

  // 加载状态
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={pageSize} />;
  }

  // 空数据状态
  if (data.length === 0) {
    return <EmptyState text={emptyText} />;
  }

  const tableContainerClass = responsive ? 'ui-table-container' : '';
  const tableClass = `ui-table ${sizeClasses[size]} ${className}`.trim();

  return (
    <div className="space-y-4">
      {/* 表格容器 */}
      <div className={tableContainerClass}>
        <table className={tableClass}>
          {/* 表头 */}
          <thead>
            <tr>
              {columns.map((column) => (
                              <th
                key={column.key}
                className={`${column.align ? `text-${column.align}` : 'text-left'} ${
                  column.className || ''
                }`}
                style={{ width: column.width }}
              >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* 表体 */}
          <tbody>
            {paginatedData.map((record, index) => (
              <motion.tr
                key={getRowKey(record, index)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-muted/30' : ''}
                  ${hover ? 'hover:bg-table-row-hover cursor-pointer' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${column.align ? `text-${column.align}` : 'text-left'} ${
                      column.className || ''
                    }`}
                  >
                    {getCellValue(record, column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页器 */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-background border border-border rounded-lg">
          <div className="text-sm text-muted">
            显示 {(currentPage - 1) * pageSize + 1} 到{' '}
            {Math.min(currentPage * pageSize, data.length)} 条，共 {data.length} 条
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 简化版表格组件（用于快速创建简单表格）
export interface SimpleTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
  responsive?: boolean;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  rows,
  className = '',
  responsive = true,
}) => {
  const tableContainerClass = responsive ? 'ui-table-container' : '';
  
  return (
    <div className={tableContainerClass}>
      <table className={`ui-table ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
