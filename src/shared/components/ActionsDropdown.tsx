import { Button, Dropdown } from 'antd';
import React, { ReactNode, useState } from 'react';

interface IActionsDropdown {
  className?: string;
  children: ReactNode | null;
  icon?: React.ReactNode;
  buttonLabel?: string;
  buttonType?: 'link' | 'text' | 'primary' | 'dashed' | 'default';
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  trigger?: ('hover' | 'click' | 'contextMenu')[];
}

const ActionsDropdownComponent: React.FC<IActionsDropdown> = ({
  className,
  children,
  placement,
  buttonLabel,
  buttonType,
  icon,
  trigger,
}) => {
  const [visible, setVisible] = useState(false);

  const handleVisibility = (flag: boolean) => {
    setVisible(flag);
  };

  const items = React.Children.map(
    children,
    (child, index) =>
      child !== null && {
        key: index.toString(),
        label: React.cloneElement(child as React.ReactElement<any>, {
          style: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          },
        }),
      }
  );

  // Create MenuProps object
  const menuProps = { items };

  return (
    <Dropdown
      className={className}
      trigger={trigger}
      menu={menuProps}
      onOpenChange={handleVisibility}
      open={visible}
      placement={placement ? placement : 'bottomRight'}
    >
      <Button
        icon={icon}
        type={buttonType ? buttonType : 'text'}
        style={{
          backgroundColor: '#d9d8db',
        }}
      >
        {buttonLabel ? buttonLabel : 'Actions'}
      </Button>
    </Dropdown>
  );
};
export const ActionsDropdown = React.memo(ActionsDropdownComponent);
