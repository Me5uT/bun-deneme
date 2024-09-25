import { Checkbox, DatePicker, Form, Radio, TimePicker } from 'antd';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import { APP_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const ScheduleForm: React.FC = () => {
  const { control, watch, setValue, resetField } = useFormContext();
  const [startValue, setStartValue] = React.useState<Dayjs | null>(null);

  const handleStartChange = (value: Dayjs | null) => {
    setStartValue(value);
  };

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

  const scheduleOptions = React.useMemo(
    () => [
      { label: 'All', value: RuleScheduleType.ALL },
      { label: 'Recurring', value: RuleScheduleType.RECURRING },
      { label: 'One Time', value: RuleScheduleType.ONETIME },
    ],
    []
  );

  return (
    <div>
      <Form.Item label="Schedule Type :" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="scheduleType"
          render={({ field }) => (
            <Radio.Group
              {...field}
              onChange={e => {
                resetField('scheduleDays');
                resetField('scheduleRange');
                field.onChange(e);
              }}
              defaultValue={RuleScheduleType.ALL}
              options={scheduleOptions}
              optionType="button"
              buttonStyle="solid"
            />
          )}
        />
      </Form.Item>

      {watch('scheduleType') === RuleScheduleType.RECURRING && (
        <Form.Item label="Recursing Days " required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="scheduleDays"
            control={control}
            render={({ field }) => (
              <Checkbox.Group
                {...field}
                options={dayOptions}
                onChange={(checkedValue: any[]) => {
                  field.onChange(checkedValue.join(','));
                }}
              />
            )}
          />
        </Form.Item>
      )}

      {watch('scheduleType') === RuleScheduleType.RECURRING && (
        <Form.Item label="Time Range" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="scheduleRange"
            control={control}
            render={({ field }) => (
              <TimePicker.RangePicker
                {...field}
                format="HH:mm"
                needConfirm={false}
                onCalendarChange={(values: any) => {
                  handleStartChange(values ? values[0] : null);
                }}
                onChange={(values: any, formatString: [string, string]) => {
                  setValue('scheduleStartTime', formatString[0]);
                  setValue('scheduleEndTime', formatString[1]);
                  field.onChange(values);
                }}
                disabledTime={disabledTime}
              />
            )}
          />
        </Form.Item>
      )}

      {watch('scheduleType') === RuleScheduleType.ONETIME && (
        <Form.Item label="Time Range" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="scheduleRange"
            control={control}
            render={({ field }) => (
              <DatePicker.RangePicker
                {...field}
                showTime
                format={APP_DATE_FORMAT}
                needConfirm={false}
                onChange={(dates: any, dateStrings: [string, string]) => {
                  setValue('scheduleStartDateTime', dayjs(dates[0]).format(APP_LOCAL_DATETIME_FORMAT));
                  setValue('scheduleEndDateTime', dayjs(dates[1]).format(APP_LOCAL_DATETIME_FORMAT));

                  field.onChange(dates);
                }}
                // disabledDate={(current, { from }) => {
                //   return current && current.isBefore(dayjs().endOf('minute') as any);
                // }}
              />
            )}
          />
        </Form.Item>
      )}
    </div>
  );
};
