import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React from 'react';
import { FilterIcon } from './icons/FilterIcon';

export interface IAdvancedSearchProps {
  onMainSearch: (text: string) => void;
  setOpenAdvancedSearch?: (v: boolean) => void;
}

export const AdvancedSearch: React.FC<IAdvancedSearchProps> = ({ onMainSearch, setOpenAdvancedSearch }) => {
  return (
    <Space className="search-container" style={{ width: '100%' }}>
      <Input
        prefix={<SearchOutlined />}
        allowClear
        onChange={v => {
          onMainSearch(v.target.value);
        }}
        placeholder="Search..."
        style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', width: '333px' }}
      />
      {setOpenAdvancedSearch && (
        <Button
          className="filter-icon-button"
          onClick={() => {
            setOpenAdvancedSearch(true);
          }}
          icon={<FilterIcon />}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '31.6px' }}
        />
      )}
    </Space>
  );
};
