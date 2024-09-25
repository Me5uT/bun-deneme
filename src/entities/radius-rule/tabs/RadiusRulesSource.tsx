import { Form, FormInstance, Input, Select, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getClients } from 'app/entities/gateway-radius/gatewayRadius.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { countryList } from 'app/shared/mockdata/CountryList';
import React from 'react';

interface IRadiusRulesSourceProps {
  form: FormInstance<any>;
}
export const RadiusRulesSource: React.FC<IRadiusRulesSourceProps> = ({ form }) => {
  const [error, setError] = React.useState<boolean>(false);
  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const radiusRule = useAppSelector(state => state.radiusRule.entity);
  const loading = useAppSelector(state => state.radiusRule.loading);
  const clientLoading = useAppSelector(state => state.gatewayRadius.clientLoading);
  const clientList = useAppSelector(state => state.gatewayRadius.clientList);

  const onSearchClient = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getClients({ searchtext: newValue, accountId: baseObj?.accountId }));
    }, 300);
  };

  React.useEffect(() => {
    form.resetFields();
  }, [radiusRule]);

  if (loading || !radiusRule) {
    return <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item name="name" label={'Name'} required labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item name="description" label={'Description'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input placeholder="Description" />
      </Form.Item>
      <Form.Item
        name="radiusClientIds"
        label={'Radius Client'}
        required
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Select
          mode="multiple"
          allowClear
          showSearch
          loading={clientLoading}
          placeholder="Radius Client"
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          onSearch={v => onSearchClient(v)}
          onFocus={() => dispatch(getClients({ searchtext: '', accountId: baseObj?.accountId }))}
          options={[
            {
              value: 'all',
              label: 'All',
            },
            ...clientList.map(d => ({
              value: d.uid,
              label: d.name,
            })),
          ]}
          onChange={selectedItems => {
            switch (true) {
              case selectedItems[0] === 'all' && selectedItems.length > 1: {
                const filteredItems = selectedItems.filter(item => item !== 'all');
                form.setFieldValue('radiusClientIds', filteredItems);

                break;
              }
              case selectedItems[selectedItems.length - 1] === 'all': {
                form.setFieldValue('radiusClientIds', ['all']);

                break;
              }
              case selectedItems.length === 0: {
                form.setFieldValue('radiusClientIds', ['all']);

                break;
              }

              default: {
                form.setFieldValue('radiusClientIds', selectedItems);
                break;
              }
            }
          }}
        />
      </Form.Item>
      <Form.Item
        name="sourceAddresses"
        status={error ? 'error' : 'validating'}
        trigger={'onChange'}
        rules={[
          {
            required: true,
            validateTrigger: 'onChange',
            message: 'Need at least one Source Address',
            type: 'array',
            whitespace: true,
            transform: value => value?.map(v => v.trim()),
            validator(rule, value, callback) {
              const valueIsValid =
                /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[/]\d{1,5}\b/.test(
                  value[value.length - 1]
                ) ||
                /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(value[value.length - 1]);
              if (valueIsValid) {
                setError(false);
                callback();
              } else {
                setError(true);
                callback('Invalid Source Address');
              }
            },
          },
        ]}
        label={'Source Address'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Source Address"
          optionLabelProp="label"
          suffixIcon={false}
          options={[]}
          onChange={(v, o) => {
            const valueIsValid =
              /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[/]\d{1,5}\b/.test(
                v[v.length - 1]
              ) || /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(v[v.length - 1]);
            if (valueIsValid) {
              setError(false);
              form.setFieldValue('sourceAddresses', v);
            } else {
              setError(true);
            }
          }}
        />
      </Form.Item>
      <Form.Item
        name="sourceCountries"
        label={'Source Country'}
        required
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Source Country"
          optionLabelProp="label"
          options={[{ label: 'All Countries', value: 'all' }, ...countryList]}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          onChange={selectedItems => {
            switch (true) {
              case selectedItems[0] === 'all' && selectedItems.length > 1: {
                const filteredItems = selectedItems.filter(item => item !== 'all');
                form.setFieldValue('sourceCountries', filteredItems);

                break;
              }
              case selectedItems[selectedItems.length - 1] === 'all': {
                form.setFieldValue('sourceCountries', ['all']);

                break;
              }
              case selectedItems.length === 0: {
                form.setFieldValue('sourceCountries', ['all']);

                break;
              }

              default: {
                form.setFieldValue('sourceCountries', selectedItems);
                break;
              }
            }
          }}
        />
      </Form.Item>
    </div>
  );
};
