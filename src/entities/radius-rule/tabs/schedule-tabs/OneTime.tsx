import { DatePicker, Form, FormInstance } from 'antd';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import React from 'react';

interface IRadiusRulesScheduleOneTimeProps {
  form: FormInstance<any>;
}
export const OneTime: React.FC<IRadiusRulesScheduleOneTimeProps> = ({ form }) => {
  const oneTimeRequired = Form.useWatch('scheduleType', form) === RuleScheduleType.ONETIME;

  return (
    <div>
      <Form.Item
        name={'onetimeRange'}
        label={'Time Range'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: oneTimeRequired }]}
      >
        <DatePicker.RangePicker
          showTime
          format={APP_DATE_FORMAT}
          needConfirm={false}
          // disabledDate={(current, { from }) => {
          //   return current && current.isBefore(dayjs().endOf('minute') as any);
          // }}
        />
      </Form.Item>
    </div>
  );
};
