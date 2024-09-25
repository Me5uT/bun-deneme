import { Form, FormInstance, Input, Radio, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import { AttributeProfileStatusCondition } from 'app/shared/model/AttributeProfile.model';
import React from 'react';

interface ILdapProfileSettingsProps {
  form: FormInstance<any>;
}

export const LdapProfileSettings: React.FC<ILdapProfileSettingsProps> = ({ form }) => {
  const loading = useAppSelector(state => state.attributeProfile.loading);
  const attributeProfile = useAppSelector(state => state.attributeProfile.entity);
  const requiringPhonePattern = Form.useWatch('phoneAttribute', form);

  React.useEffect(() => {
    form.resetFields();
  }, [attributeProfile]);

  if (loading || !attributeProfile) {
    return <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
      <Form.Item required name="name" label={'Name'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="description" label={'Description'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="mailAttribute"
        label={'Mail Attribute'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[
          {
            required: true,
            message: 'Mail Attribute is required!',
          },
        ]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="phoneAttribute" label={'Phone Attribute'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      {requiringPhonePattern && (
        <>
          <Form.Item
            name="phonePattern"
            label={'Phone Pattern'}
            labelCol={{ sm: 8, md: 8, xl: 6 }}
            wrapperCol={{ sm: 10, md: 10, xl: 8 }}
            rules={[
              {
                required: requiringPhonePattern,
                message: 'Phone Patter is required!',
              },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="phonePatternReplacer"
            label={'Phone Pattern Replacer'}
            labelCol={{ sm: 8, md: 8, xl: 6 }}
            wrapperCol={{ sm: 10, md: 10, xl: 8 }}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
        </>
      )}
      <Form.Item
        name={'statusCondition'}
        label={'User Status Condition'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Radio.Group
          buttonStyle="solid"
          optionType="button"
          options={[
            {
              value: AttributeProfileStatusCondition.ENABLE_ACCOUNTS,
              label: 'Enable Accounts',
            },
            {
              value: AttributeProfileStatusCondition.ALL_ACCOUNTS,
              label: 'All Account',
            },
          ]}
        />
      </Form.Item>
    </div>
  );
};
