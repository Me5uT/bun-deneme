import { GroupOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Alert, Col, Radio, Row } from 'antd';
import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { MirketUserIcon } from './icons/MirketUserIcon';
import { MirketGroupIcon } from './icons/MirketGroupIcon';

interface ICustomSelectOptions {
  iconName?: FontAwesomeIconProps['icon'] | string;
  mainText: string;

  value: any;
}

interface ICustomSelect2Props {
  options: ICustomSelectOptions[];
  title: string;
  name: string;
  control: any;
  onError?: FieldError | any;
  tooltip?: string;
  required?: boolean;
  onChange?: (e: any) => void;
}

export const CustomSelect2WithControl: React.FC<ICustomSelect2Props> = ({ title, options, name, control, onChange, required, onError }) => {
  const renderIcon = (iconName: string | FontAwesomeIconProps['icon']) => {
    switch (iconName) {
      case 'user':
        return <UserOutlined style={{ fontSize: '8em' }} />;

      case 'mirketuser':
        return <MirketUserIcon />;

      case 'group':
        return <GroupOutlined style={{ fontSize: '8em' }} />;

      case 'mirketgroup':
        return <MirketGroupIcon />;

      default:
        return <FontAwesomeIcon fontSize={'8em'} icon={iconName as FontAwesomeIconProps['icon']} />;
    }
  };

  return (
    <div className="custom-select2-wrapper">
      <div className="select-header">
        {required && <span style={{ color: 'red' }}> *</span>} <b>{`${title}`}</b>
        {onError !== undefined && <Alert type="error" message={`${title} required!`} />}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Radio.Group
            value={field.value}
            onChange={e => {
              field.onChange(e.target.value);
              if (onChange) onChange(e.target.value);
            }}
          >
            <Row gutter={[8, 8]}>
              {options.map((opt, index) => (
                <Col
                  xs={24}
                  sm={24 / options.length}
                  md={24 / options.length}
                  lg={24 / options.length}
                  key={index}
                  style={{ minHeight: 'auto' }}
                >
                  <div
                    className={`custom-select-card ${field.value === opt.value ? 'selected-box' : ''}`}
                    onClick={() => {
                      field.onChange(opt.value);
                      if (onChange) onChange(opt.value);
                    }}
                  >
                    {opt.iconName && <span className="icon-box">{renderIcon(opt.iconName)}</span>}
                    <span className={`text-container ${field.value === opt.value ? 'selected-box-text' : ''}`}>{opt.mainText}</span>
                    <Radio value={opt.value} className="custom-radio" />
                  </div>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      />
    </div>
  );
};
