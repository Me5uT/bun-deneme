import { animated, useSpring } from '@react-spring/web';
import { Button, Card, Form, Input, Row, Space, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { reset } from '../password-reset.reducer';
import { MirketCode } from './MirketCode';
const { Text, Link } = Typography;
interface PasswordResetInitProps {
  cardFlipped: (v: any) => void;
}
export const PasswordResetInit: React.FC<PasswordResetInitProps> = ({ cardFlipped }) => {
  const [showForm, setShowForm] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorMessage = useAppSelector(state => state.passwordReset.errorMessage);

  const formAnimation = useSpring({
    opacity: showForm ? 1 : 0,
    transform: showForm ? 'rotateY(0deg)' : 'rotateY(-180deg)',
    display: showForm ? 'flex' : 'none',
    config: { duration: 700 }, // Animasyon süresini 1.5 saniye olarak ayarla
  });

  // MirketCode için animasyon
  const mirketCodeAnimation = useSpring({
    opacity: showForm ? 0 : 1,
    transform: showForm ? 'rotateY(180deg)' : 'rotateY(0deg)',
    display: showForm ? 'none' : 'flex',
    config: { duration: 700 }, // Aynı şekilde burada da 1.5 saniye süre ayarla
  });
  React.useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const onFinish = values => {
    setEmail(values.email);
    setShowForm(false); // Submit'e basıldığında animasyonu tetikle
  };

  return (
    <Card
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-between',
        },
      }}
    >
      {showForm ? (
        <animated.div style={{ ...formAnimation, flexDirection: 'column' }}>
          <Typography.Title level={4}>Forgot Password ?</Typography.Title>
          <Text
            type="secondary"
            style={{
              marginBottom: '40px',
            }}
          >
            Enter your email to reset your password.
          </Text>

          <Form form={form} name="forgot_password" onFinish={onFinish} layout="vertical" style={{ width: '100%', height: '100%' }}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}>
              <Input placeholder="Email" width={'100%'} />
            </Form.Item>

            <Form.Item>
              <Row justify={'center'}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      navigate('/login');
                      cardFlipped('login');
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Row>
            </Form.Item>
          </Form>
        </animated.div>
      ) : (
        <animated.div style={{ ...mirketCodeAnimation, flexDirection: 'column' }}>
          <MirketCode mail={email} errorMessage={errorMessage} setShowForm={setShowForm} />
        </animated.div>
      )}
    </Card>
  );
};

export default PasswordResetInit;
