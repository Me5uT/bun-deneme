import { Form, Input, Radio, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { TenantTypeInt } from 'app/shared/model/tenant.model';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { searchPartner } from '../account.reducer';

export const AccountForm: React.FC = () => {
  const searchTimeout = React.useRef(null);
  const { control, watch } = useFormContext();
  const [baseObj] = useMirketPortal();
  const dispatch = useAppDispatch();
  const partnerList: any[] = useAppSelector(state => state.account.partnerList);
  const partnerLoading: boolean = useAppSelector(state => state.account.partnerLoading);

  const handleSearch = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue.length > 2) {
        dispatch(searchPartner(newValue));
      }
    }, 500);
  };

  React.useEffect(() => {
    dispatch(searchPartner(''));
  }, []);

  return (
    <div>
      {baseObj?.tenantType === TenantTypeInt.MIRKET && (
        <Form.Item label="Account Type :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="accountType"
            control={control}
            render={({ field }) => (
              <Radio.Group
                {...field}
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    value: TenantTypeInt.ENDUSER,
                    label: 'End User',
                  },
                  {
                    value: TenantTypeInt.MSSP,
                    label: 'MSSP',
                  },
                  {
                    value: TenantTypeInt.PARTNER,
                    label: 'Partner',
                  },
                ]}
              />
            )}
          />
        </Form.Item>
      )}
      {watch('accountType') === TenantTypeInt.ENDUSER && baseObj?.tenantType === TenantTypeInt.MIRKET && (
        <Form.Item label="Partner" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="partnerId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                loading={partnerLoading}
                placeholder={'Search Partner'}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearch}
                onClear={() => {
                  dispatch(searchPartner(''));
                }}
                options={(partnerList || []).map(d => ({
                  value: d.uid,
                  label: d.name,
                }))}
              />
            )}
          />
        </Form.Item>
      )}

      <Form.Item label="Account Name :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder={'Account Name'} />} />
      </Form.Item>

      <Form.Item label="Owner First Name :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="ownerFirstName" control={control} render={({ field }) => <Input {...field} placeholder={'Owner First Name'} />} />
      </Form.Item>

      <Form.Item label="Owner Last Name :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="ownerLastName" control={control} render={({ field }) => <Input {...field} placeholder={'Owner Last Name'} />} />
      </Form.Item>

      <Form.Item label="Owner Mail :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="ownerMail"
          control={control}
          render={({ field }) => <Input {...field} type="email" placeholder={'Owner Mail'} />}
        />
      </Form.Item>

      <Form.Item label="Alias :" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="alias"
          control={control}
          render={({ field }) => <Input {...field} type="text" readOnly disabled placeholder={'Alias'} />}
        />
      </Form.Item>
    </div>
  );
};
