import { Button, Form, Input, Radio, Row } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfile, AdminProfileInt, AdminType, AdminTypeInt, IAdminModel } from 'app/shared/model/AdminModel';
import { TenantTypeInt } from 'app/shared/model/tenant.model';
import React from 'react';
import { createEntity, resetErrorMessage } from '../admin.reducer';

interface IAddLdapModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddAdminForm: React.FC<IAddLdapModalProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  // const info = useRenderInfo('Add Admin');

  const [baseObj] = useMirketPortal();
  const loading = useAppSelector(state => state.admin.loading);
  const errorMessage = useAppSelector(state => state.admin.errorMessage);

  const _handleModalClose = () => {
    setModalOpenClose(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const serializedValues: IAdminModel = {
      ...values,
      adminType: values?.adminType || AdminTypeInt.ACCOUNT_ADMIN,
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
      <Form form={form} onFinish={handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} className="add-modal-form-item">
        <Form.Item
          name={'firstName'}
          label={'First Name'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please input first name.',
            },
          ]}
        >
          <Input placeholder={'First Name'} />
        </Form.Item>
        <Form.Item
          name={'lastName'}
          label={'Last Name'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please input last name.',
            },
          ]}
        >
          <Input placeholder={'Last Name'} />
        </Form.Item>
        <Form.Item
          name={'mail'}
          label={'Mail'}
          rules={[
            { required: true, message: 'Mail is required.' },
            () => ({
              validator(_, value) {
                const emailRegex = /^[a-zA-Z0-9_.-]+$/;
                if (value && !emailRegex.test(value)) {
                  return Promise.reject(new Error('Invalid character.'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input addonAfter={`@${baseObj?.domain}`} placeholder={'Mail'} style={{ textAlign: 'end' }} />
        </Form.Item>
        {baseObj?.tenantType !== TenantTypeInt.ENDUSER && (
          <Form.Item name={'adminType'} required label={'Admin Type'} initialValue={AdminTypeInt.ACCOUNT_ADMIN}>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  value: AdminTypeInt.MASTER_ADMIN,
                  label: AdminType.MASTER_ADMIN,
                },
                {
                  value: AdminTypeInt.ACCOUNT_ADMIN,
                  label: AdminType.ACCOUNT_ADMIN,
                },
              ]}
            />
          </Form.Item>
        )}
        <Form.Item name={'adminProfile'} required label={'Admin Profile'} initialValue={AdminProfileInt.FullControl}>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              {
                value: AdminProfileInt.FullControl,
                label: AdminProfile.FullControl,
              },
              {
                value: AdminProfileInt.ReadOnly,
                label: AdminProfile.ReadOnly,
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
