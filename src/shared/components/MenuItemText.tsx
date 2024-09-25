import React from 'react';

interface MenuItemTextProps {
  text: string;
  disabled?: boolean;
}

export const MenuItemText: React.FC<MenuItemTextProps> = ({ text, disabled = false }) => {
  return <b style={{ color: disabled ? '#b4b4b4' : '#6d6b77' }}>{text}</b>;
};
