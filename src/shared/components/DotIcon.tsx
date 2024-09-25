import React from 'react';

interface IDotIconProps {
  color?: string;
  size?: number;
  animation?: boolean;
  disabled?: boolean;
}

export const DotIcon: React.FC<IDotIconProps> = ({ color = '#f5a864', size = 6, disabled = false }) => {
  return (
    <div
      className="doticon"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: disabled ? '#b4b4b4' : color,
      }}
    />
  );
};
