import { Button, Form, Input, Row, Space, Typography } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { PasswordInputWithMeter } from 'app/shared/components/PasswordInputWithMeter';
import React from 'react';

const { Text, Title } = Typography;
export const PasswordPage = () => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const handleValidSubmit = ({ newPassword, newPasswordRepeat }) => {
    console.log('Received values of form: ', newPassword, newPasswordRepeat);
    // dispatch(savePassword({ currentPassword, newPassword }));
  };

  return (
    <div style={{ width: '470px', margin: 'auto', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title level={4}>Setup New Password</Title>
      <Form
        form={form}
        name="setupNewPassword"
        onFinish={handleValidSubmit}
        layout="vertical"
        style={{ width: '100%', height: '100%', paddingTop: '20px' }}
      >
        <Form.Item>
          <Text style={{ fontSize: '11px' }} type="secondary">
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </Text>
        </Form.Item>
        <Form.Item name="newPassword" rules={[{ required: true, message: 'Please input your password!', type: 'string' }]}>
          <PasswordInputWithMeter placeholder="New Password" visibilityToggle={false} />
        </Form.Item>

        <Form.Item
          name="newPasswordRepeat"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords don't match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="New Password Repeat" visibilityToggle={false} />
        </Form.Item>
        <Form.Item>
          <Row justify={'center'}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordPage;
