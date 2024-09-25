import { Button, Form, Input, Row, Select, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGatewayLDAPAddRequestModel } from 'app/shared/model/gateway.model';
import React from 'react';
import { createEntity, resetErrorMessage } from '../gatewayLdap.reducer';
const { TextArea } = Input;
interface IAddLdapModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddLdapForm: React.FC<IAddLdapModalProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const loading = useAppSelector(state => state.gatewayLdap.loading);
  const errorMessage = useAppSelector(state => state.gatewayLdap.errorMessage);

  const _handleModalClose = () => {
    setModalOpenClose(false);
    form.resetFields();
  };

  const handleSubmit = async (values: IGatewayLDAPAddRequestModel) => {
    const serializedValues: IGatewayLDAPAddRequestModel = {
      ...values,
      isLdapSecure: values.isLdapSecure === true ? true : false,
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
          name={'name'}
          label="Gateway Name"
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a gateway name',
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <Input placeholder={'Gateway Name'} />
        </Form.Item>

        <Form.Item
          name={'description'}
          label="Description"
          rules={[
            {
              type: 'string',
              message: 'Please enter a description',
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <TextArea placeholder={'Description'} />
        </Form.Item>

        {/* <Form.Item
          name={'isLdapSecure'}
          label={'Is LDAP Secure'}
          rules={[
            {
              type: 'boolean',
            },
          ]}
        >
          <Switch defaultChecked={false} />
        </Form.Item> */}
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
