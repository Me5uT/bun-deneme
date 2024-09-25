import { Checkbox, Form, FormInstance, TimePicker } from 'antd';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import { useAppSelector } from 'app/config/store';
import { IRadiusRuleDetailModel, RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
interface IRadiusRulesScheduleRecurringProps {
  form: FormInstance<any>;
}
export const Recurring: React.FC<IRadiusRulesScheduleRecurringProps> = ({ form }) => {
  const [startValue, setStartValue] = React.useState<Dayjs | null>(null);

  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const scheduleDaysRequired = Form.useWatch('scheduleType', form) === RuleScheduleType.RECURRING;

  const disabledTime = (current, type) => {
    if (type === 'end') {
      return {
        disabledHours() {
          if (startValue) {
            const hours = [];
            for (let i = 0; i < 24; i++) {
              if (i < startValue.hour()) {
                hours.push(i);
              }
            }
            return hours;
          }
          return [];
        },
        disabledMinutes(selectedHour) {
          if (startValue && selectedHour === startValue.hour()) {
            const minutes = [];
            for (let i = 0; i < 60; i++) {
              if (i <= startValue.minute()) {
                minutes.push(i);
              }
            }
            return minutes;
          }
          return [];
        },
      };
    }
    return {};
  };

  const handleStartChange = (value: Dayjs | null) => {
    setStartValue(value);
  };

  const dayOptions: CheckboxOptionType[] = React.useMemo(
    () => [
      {
        label: 'Monday',
        value: '0',
      },
      {
        label: 'Tuesday',
        value: '1',
      },
      {
        label: 'Wednesday',
        value: '2',
      },
      {
        label: 'Thursday',
        value: '3',
      },
      {
        label: 'Friday',
        value: '4',
      },
      {
        label: 'Saturday',
        value: '5',
      },
      {
        label: 'Sunday',
        value: '6',
      },
    ],
    []
  );

  return (
    <div>
      <Form.Item
        rules={[{ required: scheduleDaysRequired }]}
        name="scheduleDays"
        label={'Recursing Days'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Checkbox.Group options={dayOptions} />
      </Form.Item>
      <Form.Item
        rules={[{ required: scheduleDaysRequired }]}
        name={'recurringTimeRange'}
        label={'Time Range'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <TimePicker.RangePicker
          format="HH:mm"
          needConfirm={false}
          onCalendarChange={(values: any) => {
            handleStartChange(values ? values[0] : null);
          }}
          onChange={(values: any, formatString: [string, string]) => {
            form.setFieldValue('scheduleStartTime', formatString[0]);
            form.setFieldValue('scheduleEndTime', formatString[1]);
          }}
          disabledTime={disabledTime}
        />
      </Form.Item>
    </div>
  );
};
