import * as React from 'react';
import { TableProps } from './Table';
import { HeaderProps } from './SortableTable/Header';

type HorizontalAlignment = 'left' | 'center' | 'right';

export interface SortableColumn<T>
  extends Omit<HeaderProps, 'children' | 'onSort'> {
  align?: HorizontalAlignment;
  cell: (row: T) => React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  key: string;
  onSort?: (ascending: boolean) => void;
  width?: string;
}

interface SortableTableProps<T> extends TableProps {
  className?: string;
  allSelected?: boolean;
  columns: SortableColumn<T>[];
  expandableColumn?: Partial<SortableColumn<T>>;
  footer?: React.ReactNode;
  onExpand?: (row: T) => void;
  onSelect?: (row: T, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  rowSelected?: (row: T) => boolean;
  rows: T[];
  rowClassName?: (row: T) => React.ReactNode | undefined;
  rowExpanded?: (row: T) => React.ReactNode | boolean;
  rowOnClick?: (row: T, evt: React.MouseEvent) => void;
  truncate?: boolean;
}

declare class SortableTable<T> extends React.Component<
  SortableTableProps<T>,
  {}
  > { }
export default SortableTable;
