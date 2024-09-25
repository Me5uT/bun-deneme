import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { DatePicker, Form, Input, Radio, Switch, Tooltip } from 'antd';
import useFirstRender from 'app/shared/hooks/useInitialRender';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { systemSettings } from 'app/shared/mockdata/SystemSettings';
import { LicenceType, LicenceTypeInt } from 'app/shared/model/tenant.model';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const LicenseForm: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const { control, watch, resetField } = useFormContext();
  const firstRender = useFirstRender();
  const hasDatePickerPreset = useSize(document.querySelector('body'))?.width > 429;

  const licenceOptions: any[] = React.useMemo(() => {
    const options: any[] = [
      {
        value: LicenceTypeInt.Demo,
        label: LicenceType.Demo,
      },
      {
        value: LicenceTypeInt.MFA,
        label: LicenceType.MFA,
      },
      {
        value: LicenceTypeInt.SSO,
        label: LicenceType.SSO,
      },
    ];

    return options.slice(
      0,
      {
        [LicenceTypeInt.Demo]: 1,
        [LicenceTypeInt.MFA]: 2,
        [LicenceTypeInt.SSO]: 3,
      }[baseObj?.licenceType] || 0
    );
  }, [baseObj?.licenceType]);

  React.useEffect(() => {
    if (!firstRender) {
      resetField('licenceCount');
      resetField('expireDate');
    }
  }, [watch('licenceType')]);

  return (
    <div>
      <Form.Item label="License Type :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="licenceType"
          control={control}
          render={({ field }) => <Radio.Group {...field} optionType="button" buttonStyle="solid" options={licenceOptions} />}
        />
      </Form.Item>
      <Form.Item
        label="License Count :"
        required={watch('licenceType') !== LicenceTypeInt.Demo}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Controller
          name="licenceCount"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Input
              {...field}
              placeholder={'License Count'}
              max={baseObj?.licenceCount - 1}
              type="number"
              value={watch('licenceType') === LicenceTypeInt.Demo ? Number(systemSettings.demo_values.user_count) : field.value}
              disabled={watch('licenceType') === LicenceTypeInt.Demo}
              onChange={event => {
                const value = Number(event.target.value);
                if (value < 1) {
                  onChange(1 as any);
                } else {
                  onChange(value as any);
                }
              }}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Expire Date:"
        required={watch('licenceType') !== LicenceTypeInt.Demo}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Controller
          name="expireDate"
          control={control}
          render={({ field }) => {
            // Ensure the expire date is set when licenceType is 'Demo'
            const isDemo = watch('licenceType') === LicenceTypeInt.Demo;
            const expireDateValue = isDemo
              ? dayjs().add(dayjs.duration({ days: systemSettings.demo_values.expire_days }))
              : field.value
              ? dayjs(field.value)
              : null;

            return (
              <DatePicker
                {...field}
                value={expireDateValue}
                style={{ width: '100%' }}
                format={'DD.MM.YYYY'}
                placeholder="Expire Date"
                presets={
                  hasDatePickerPreset
                    ? ([
                        { label: 'A Month', value: dayjs().add(1, 'month') },
                        { label: 'A Year', value: dayjs().add(1, 'year') },
                        { label: '3 Years', value: dayjs().add(3, 'years') },
                      ] as any[])
                    : undefined
                }
                disabled={isDemo}
                disabledDate={current => {
                  // Bugünün tarihini ve maksimum tarihi tanımlayın
                  const today = dayjs().startOf('day');
                  const maxDate = dayjs(baseObj?.expireDate);

                  // Geçerli tarihin bugünden önce veya maksimum tarihten sonra olup olmadığını kontrol edin
                  return current && (current.isBefore(today as any) || current.isAfter(maxDate as any));
                }}
              />
            );
          }}
        />
      </Form.Item>

      <Form.Item label="Mentis :" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="mentis"
          control={control}
          render={({ field }) => <Switch {...field} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />}
        />
      </Form.Item>
    </div>
  );
};
