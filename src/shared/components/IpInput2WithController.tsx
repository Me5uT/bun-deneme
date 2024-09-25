import { useSetState } from 'ahooks';
import { Input, Space } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

interface IpInputProps {
  disabled?: boolean;
  initialValue?: string;
  value?: string;
  onChange?: any;
  name?: string;
  control: any;
}
export const IpInput2WithController: React.FC<IpInputProps> = ({ disabled, initialValue, control, name }) => {
  const [blocks, setBlocks] = useSetState({
    'block-1': initialValue?.split('.')[0] || '',
    'block-2': initialValue?.split('.')[1] || '',
    'block-3': initialValue?.split('.')[2] || '',
    'block-4': initialValue?.split('.')[3] || '',
    'block-5': initialValue?.split('/')[1] || '',
  });

  const [ipInput, setIpInput] = React.useState('');
  const [focusedInput, setFocusedInput] = React.useState(1);

  const unblockedCharCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 13, 32, 0];

  const handleChange = event => {
    if (Number(event.target.value.split('')[0]) === 0 && event.target.value.length > 1) {
      return;
    } else if ((event.target.value >= 0 && event.target.value < 256) || event.target.value === '') {
      setBlocks({ ...blocks, [event.target.name]: event.target.value });
    }
  };

  const handleClick = event => setFocusedInput(Number(event.target.name.split('-')[1]));

  const handleKeyEvents = event => {
    if (!unblockedCharCodes?.includes(event?.charCode)) event.preventDefault();

    if (event.charCode === 13 || event.charCode === 32) {
      if (focusedInput < 4) {
        setFocusedInput(focusedInput + 1);
      } else {
        setFocusedInput(1);
      }
    }
  };

  React.useEffect(() => {
    const blockArr = [];

    if (blocks[`block-${focusedInput}`]?.length === 3 && focusedInput < 4) {
      setFocusedInput(focusedInput + 1);
    }

    Object.keys(blocks).map(key => {
      blockArr.push(blocks[key]);
    });
    if (blockArr.length > 0) {
      setIpInput(blockArr.join('.'));
    }
  }, [blocks]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Space.Compact className="ip-wrapper2" direction="horizontal">
          <Input
            onKeyPress={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            maxLength={3}
            disabled={disabled}
            type="number"
            className="ip-input1"
            name="block-1"
            id="block-1"
            style={{ borderRightStyle: 'none' }}
            onChange={handleChange}
            onClick={handleClick}
            value={blocks['block-1']}
          />
          <div style={{ margin: 'auto', zIndex: 99, width: 0 }}>.</div>
          <Input
            onKeyPress={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            maxLength={3}
            disabled={disabled}
            type="number"
            className="ip-input2"
            name="block-2"
            id="block-2"
            style={{ borderRightStyle: 'none', borderLeftStyle: 'none' }}
            onChange={handleChange}
            onClick={handleClick}
            value={blocks['block-2']}
          />
          <div style={{ margin: 'auto', zIndex: 99, width: 0 }}>.</div>
          <Input
            onKeyPress={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            maxLength={3}
            disabled={disabled}
            type="number"
            className="ip-input3"
            name="block-3"
            id="block-3"
            style={{ borderRightStyle: 'none', borderLeftStyle: 'none' }}
            onChange={handleChange}
            onClick={handleClick}
            value={blocks['block-3']}
          />
          <div style={{ margin: 'auto', zIndex: 99, width: 0 }}>.</div>
          <Input
            onKeyPress={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            maxLength={3}
            disabled={disabled}
            type="number"
            className="ip-input4"
            name="block-4"
            id="block-4"
            style={{ borderRightStyle: 'none', borderLeftStyle: 'none' }}
            onChange={handleChange}
            onClick={handleClick}
            value={blocks['block-4']}
          />
          <div style={{ margin: 'auto', zIndex: 99, width: 0 }}>/</div>
          <Input
            onKeyPress={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            maxLength={3}
            disabled={disabled}
            type="number"
            className="ip-input5"
            name="block-5"
            id="block-5"
            style={{ borderLeftStyle: 'none' }}
            onChange={handleChange}
            onClick={handleClick}
            value={blocks['block-5']}
          />
        </Space.Compact>
      )}
    />
  );
};
