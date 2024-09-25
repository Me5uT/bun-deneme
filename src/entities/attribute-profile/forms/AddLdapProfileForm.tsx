import { Button, Form, Input, Radio, Row } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AttributeProfileStatusCondition, IAttributeProfile, ILdapProfileUpdateRequest } from 'app/shared/model/AttributeProfile.model';
import React from 'react';
import { createEntity, resetErrorMessage } from '../attributeProfile.reducer';

interface IAddAttributeProfileModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddLdapProfileForm: React.FC<IAddAttributeProfileModalProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [baseObj] = useMirketPortal();
  const loading = useAppSelector(state => state.attributeProfile.loading);
  const errorMessage = useAppSelector(state => state.attributeProfile.errorMessage);

  const _handleModalClose = () => {
    setModalOpenClose(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const serializedValues: IAttributeProfile = {
      ...values,
      accountId: baseObj?.accountId,
    };

    console.log('Received values of form: ', serializedValues);
    await dispatch(createEntity(serializedValues));
    // _handleModalClose();
    setResultModalOpenClose(true);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="add-modal-form-item">
        <Form.Item
          name={'name'}
          label={'Name'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a name.',
            },
          ]}
        >
          <Input placeholder={'Name'} />
        </Form.Item>
        <Form.Item name={'description'} label={'Description'}>
          <Input placeholder={'Description'} />
        </Form.Item>
        <Form.Item
          name={'mailAttribute'}
          label={'Mail Attribute'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a mail attribute.',
            },
          ]}
        >
          <Input placeholder={'Mail Attribute'} />
        </Form.Item>
        <Form.Item name={'phoneAttribute'} label={'Phone Attribute'}>
          <Input placeholder={'Phone Attribute'} />
        </Form.Item>

        <Form.Item
          hidden={!Form.useWatch('phoneAttribute', form)}
          name={'phonePattern'}
          label={'Phone Pattern'}
          rules={[
            {
              required: Form.useWatch('phoneAttribute', form) ? true : false,
              message: 'Please input a phone pattern.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue('phoneAttribute') || value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Phone pattern is required when phone attribute is provided.'));
              },
            }),
          ]}
        >
          <Input placeholder={'Phone Pattern'} />
        </Form.Item>
        <Form.Item hidden={!Form.useWatch('phoneAttribute', form)} name={'phonePatternReplacer'} label={'Phone Pattern Replacer'}>
          <Input placeholder={'Phone Pattern Replacer'} />
        </Form.Item>

        <Form.Item name={'statusCondition'} label={'User Status Condition'}>
          <Radio.Group
            defaultValue={AttributeProfileStatusCondition.ENABLE_ACCOUNTS}
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

        <Form.Item noStyle>
          <Row justify={'space-between'}>
            <Button type="default" onClick={_handleModalClose}>
              {'Close'}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {'Save'}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
