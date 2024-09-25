import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Alert, Col, Form, Radio, Row } from 'antd';
import React from 'react';

interface ICustomSelectOptions {
  iconName?: FontAwesomeIconProps['icon'];
  mainText: string;
  subText?: string;
  value: any;
}

interface ICustomSelect2Props {
  options: ICustomSelectOptions[];
  title: string;
  name: string;

  onError?: any;
  tooltip?: string;
}

export const CustomSelect2: React.FC<ICustomSelect2Props> = ({ title, options, name, tooltip, onError }) => {
  const [selectedValue, setSelectedValue] = React.useState(null);

  return (
    <div className="custom-select2-wrapper">
      <div className="select-header">
        <b>{`${title}`}</b>
        {onError !== undefined && <Alert type="error" message={`${title} required!`} />}
      </div>
      <Form.Item name={name} noStyle>
        <Radio.Group onChange={e => setSelectedValue(e.target.value)}>
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
                <label className={`option-label ${selectedValue === opt.value ? 'selected-box' : ''}`}>
                  {opt.iconName && <span className="icon-box">{<FontAwesomeIcon icon={opt.iconName} />}</span>}
                  <span className={`text-container ${selectedValue === opt.value ? 'selected-box-text' : ''}`}>
                    {opt.mainText}
                    {opt.subText && <span className="sub-text">{opt.subText}</span>}
                  </span>
                  <Radio value={opt.value} className="custom-radio" />
                </label>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};
