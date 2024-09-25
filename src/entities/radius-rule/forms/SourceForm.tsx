import { Form, Input, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getClients } from 'app/entities/gateway-radius/gatewayRadius.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { countryList } from 'app/shared/mockdata/CountryList';
import { ipRegex, ipWithPortRegex } from 'app/shared/util/regex';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const { TextArea } = Input;

export const SourceForm: React.FC = () => {
  const { control, watch } = useFormContext();
  const searchTimeout = React.useRef(null);
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();

  const { clientLoading, clientList } = useAppSelector(state => state.gatewayRadius);

  const onSearchClient = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getClients({ searchtext: newValue, accountId: baseObj?.accountId }));
    }, 500);
  };

  React.useEffect(() => {
    dispatch(getClients({ accountId: baseObj?.accountId }));
  }, []);

  return (
    <div>
      <Form.Item label="Name :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder={'Name'} />} />
      </Form.Item>

      <Form.Item label="Description" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <TextArea autoSize={{ minRows: 2, maxRows: 10 }} {...field} placeholder={'Description'} />}
        />
      </Form.Item>

      <Form.Item label="Radius Client" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="radiusClientIds"
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              mode="multiple"
              allowClear
              showSearch
              loading={clientLoading}
              placeholder="Radius Client"
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
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
                    field.onChange(filteredItems);

                    break;
                  }
                  case selectedItems[selectedItems.length - 1] === 'all': {
                    field.onChange(['all']);

                    break;
                  }
                  case selectedItems.length === 0: {
                    field.onChange(['all']);

                    break;
                  }

                  default: {
                    field.onChange(selectedItems);
                    break;
                  }
                }
              }}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Source Address" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="sourceAddresses"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Source Address"
              optionLabelProp="label"
              options={[{ value: '0.0.0.0/0' }]}
              onChange={(v, o) => {
                const valueIsValid = ipRegex.test(v[v.length - 1]) || ipWithPortRegex.test(v[v.length - 1]);
                if (valueIsValid) {
                  if ((v[0].includes('0.0.0.0') || v[0].includes('0.0.0.0/0')) && v.length > 1) v.shift();
                  field.onChange(v);
                }
              }}
            />
          )}
        />
      </Form.Item>
      <Form.Item label="Source Country" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="sourceCountries"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
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
                    field.onChange(filteredItems);

                    break;
                  }
                  case selectedItems[selectedItems.length - 1] === 'all': {
                    field.onChange(['all']);

                    break;
                  }
                  case selectedItems.length === 0: {
                    field.onChange(['all']);

                    break;
                  }

                  default: {
                    field.onChange(selectedItems);
                    break;
                  }
                }
              }}
            />
          )}
        />
      </Form.Item>
    </div>
  );
};
