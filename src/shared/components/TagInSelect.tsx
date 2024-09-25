import { Tag } from 'antd';
import React from 'react';
import { getColorByType } from '../util/UtilityService';

export const TagInSelect = props => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const group = React.useMemo(() => props.groupList?.find(g => g.uid === value), [props]);

  return (
    <Tag
      color={getColorByType(props.tagColorType, group?.groupType)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
