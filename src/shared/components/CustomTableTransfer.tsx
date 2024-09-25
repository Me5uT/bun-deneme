/* eslint-disable object-shorthand */
import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, TableColumnsType } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import React from 'react';
import { removeItemsByUid } from '../util/UtilityService';
import { TablePaginationConfig } from 'antd/lib';

interface CustomTableTransferProps {
  rDataSource: any[];
  lDataSource: any[];
  titles: [string, string];
  onChange: (direction: TransferDirection, moveKeys: string[], targetKeys?: string[]) => void;
  lColumns?: TableColumnsType<any>;
  rColumns?: TableColumnsType<any>;
  rLoading?: boolean;
  lLoading?: boolean;
  rPagination?: false | TablePaginationConfig;
  lPagination?: false | TablePaginationConfig;
  rOnSearch?: React.ChangeEventHandler<HTMLInputElement>;
  lOnSearch?: React.ChangeEventHandler<HTMLInputElement>;
  makeSourceUnique?: boolean;
  readonly?: boolean;
  errorMessage?: string;
}

export const CustomTableTransfer: React.FC<CustomTableTransferProps> = ({
  titles,
  readonly = false,
  onChange,
  lDataSource = [],
  rDataSource = [],
  lColumns,
  lLoading,
  lOnSearch,
  lPagination,
  rColumns,
  rLoading = false,
  rOnSearch,
  rPagination,
  makeSourceUnique = false,
  errorMessage,
}) => {
  const [lSelectedRowKeys, setLSelectedRowKeys] = React.useState<string[]>([]);
  const [rSelectedRowKeys, setRSelectedRowKeys] = React.useState<string[]>([]);
  const [rightSearchText, setRightSearchText] = React.useState<string>('');
  const [lsd, setLSD] = React.useState<any[]>([]);

  const lRowSelection = {
    selectedRowKeys: lSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setLSelectedRowKeys(selectedRowKeys as string[]);
    },
  };

  const rRowSelection = {
    selectedRowKeys: rSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setRSelectedRowKeys(selectedRowKeys as string[]);
    },
  };

  React.useEffect(() => {
    if (makeSourceUnique) setLSD(removeItemsByUid(lDataSource, rDataSource));
  }, [rDataSource.length > 0, rDataSource.length]);

  return (
    <div className="custom-transfer-container">
      <div className="table-container">
        <div className="table-title-container">
          <div>{`${lDataSource?.length} ${lDataSource?.length > 1 ? 'items' : 'item'}`}</div>
          <div>{titles[0]}</div>
        </div>
        <div className="table-body-container">
          {lOnSearch && (
            <Input
              allowClear
              onChange={lOnSearch}
              prefix={<SearchOutlined />}
              style={{ width: '100%', borderRadius: '8px', backgroundColor: '#f9f9f9' }}
            />
          )}
          <Table
            title={() => ''}
            className="available-items-table"
            size="small"
            dataSource={lsd.length > 0 ? lsd : lDataSource}
            columns={lColumns}
            loading={lLoading}
            rowKey={item => item.uid}
            rowSelection={!readonly ? lRowSelection : null}
            pagination={{ ...lPagination }}
          />
        </div>
      </div>
      <Space direction="horizontal">
        <Button
          className="custom-transfer-action-btn"
          type={lSelectedRowKeys.length === 0 ? 'default' : 'primary'}
          icon={<RightOutlined style={{ fontSize: '10px' }} />}
          disabled={lSelectedRowKeys.length === 0}
          onClick={() => {
            const rData = [...rDataSource.map(d => d.uid), ...lSelectedRowKeys];
            onChange('right', lSelectedRowKeys, rData);
            setLSelectedRowKeys([]);
          }}
        />
        <Button
          className="custom-transfer-action-btn"
          type={rSelectedRowKeys.length === 0 ? 'default' : 'primary'}
          icon={<LeftOutlined style={{ fontSize: '10px' }} />}
          disabled={rSelectedRowKeys.length === 0}
          onClick={() => {
            const rData = rDataSource.map(d => d.uid).filter(item => !rSelectedRowKeys.includes(item));
            onChange('left', rSelectedRowKeys, rData);
            setRSelectedRowKeys([]);
          }}
        />
      </Space>
      <div className="table-container">
        <div className="table-title-container">
          <div>{`${rDataSource?.length} ${rDataSource?.length > 1 ? 'items' : 'item'}`}</div>
          <div>{titles[1]}</div>
        </div>
        <div className="table-body-container">
          <Input
            allowClear
            onChange={e => {
              setRightSearchText(e.target.value);
            }}
            prefix={<SearchOutlined />}
            style={{ width: '100%', borderRadius: '8px', backgroundColor: '#f9f9f9' }}
          />

          <Table
            className="selected-items-table"
            title={() => {
              return errorMessage ? <div style={{ color: 'red' }}>{`* ${errorMessage}`}</div> : <div> </div>;
            }}
            size="small"
            dataSource={
              rightSearchText
                ? rDataSource.filter((data: any) => data?.name?.includes(rightSearchText) || data?.username?.includes(rightSearchText))
                : rDataSource
            }
            columns={rColumns}
            loading={rLoading}
            rowKey={item => item.uid}
            rowSelection={!readonly ? rRowSelection : null}
            pagination={{ ...rPagination }}
          />
        </div>
      </div>
    </div>
  );
};
