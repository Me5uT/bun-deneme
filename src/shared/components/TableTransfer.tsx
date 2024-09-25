import { Table, TableColumnsType, Transfer } from 'antd';
import type { TransferItem, TransferProps } from 'antd/es/transfer';
import { DataType } from 'app/entities/user/forms/GroupForm';
import React from 'react';

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
  loading?: boolean;
}

const difference = (arr, ...values) => {
  const otherValues = new Set(values.flat());
  return arr.filter(item => !otherValues.has(item));
};
export const TableTransfer = ({ leftColumns, rightColumns, loading, ...restProps }: TableTransferProps) => (
  <Transfer {...restProps}>
    {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
          const diffKeys = selected ? difference(treeSelectedKeys, listSelectedKeys) : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          loading={loading}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key }) => ({
            onClick() {
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);
