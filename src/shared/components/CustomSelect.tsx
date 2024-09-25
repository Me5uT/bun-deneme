import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Alert, Col, Radio, Row } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

export interface ICustomSelectOptions {
  iconName: FontAwesomeIconProps['icon'];
  mainText: string;
  subText: string;
  value: any;
}

interface ICustomSelect2Props {
  options: ICustomSelectOptions[];
  title: string;
  name: string;
  control: any;
  tooltip?: string;
  onError?: any;
}

export const CustomSelect: React.FC<ICustomSelect2Props> = ({ onError, tooltip, control, title, options, name }) => {
  return (
    <div className="custom-select-wrapper">
      <div className="select-header">
        <b>{`${title}`}</b>
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
            }}
          >
            <Row gutter={[8, 8]}>
              {options.map((opt, index) => (
                <Col xs={24} sm={12} md={12} lg={12} key={index} style={{ minHeight: 'auto' }}>
                  <label className={`option-label ${field.value === opt.value ? 'selected-box' : ''}`}>
                    {opt.iconName && <span className="icon-box">{<FontAwesomeIcon icon={opt.iconName} />}</span>}
                    <span className={`text-container ${field.value === opt.value ? 'selected-box-text' : ''}`}>
                      {opt.mainText}
                      {opt.subText && <span className="sub-text">{opt.subText}</span>}
                    </span>
                    <Radio value={opt.value} className="custom-radio" />
                  </label>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      />
    </div>
  );
};
