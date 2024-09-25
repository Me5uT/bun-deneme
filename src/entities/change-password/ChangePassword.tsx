/* eslint-disable no-useless-escape */
import { useSetState } from 'ahooks';
import { Button, Card, Form, Input, Result, Row, Space, Spin, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { changePassword, checkChangePassword } from 'app/modules/account/password-reset/password-reset.reducer';
import { PasswordInputWithMeter } from 'app/shared/components/PasswordInputWithMeter';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import { ERecordType } from 'app/shared/model/tenant-setting.model';
import { logout } from 'app/shared/reducers/authentication';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Text, Title } = Typography;

const ChangePassword = () => {
  const [searchParams, setSearchparams] = useSearchParams();
  const [states, setStates] = React.useState({
    recordtype: Number(searchParams.get('recordtype')),
    passwordtoken: searchParams.get('id'),
    passwordPolicyRegex: searchParams.get('passwordPolicyRegex').split(','),
    mirketToken: '',
    isPasswordMatched: false,
    pass: '',
    openWarnModal: false,
  });

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading: boolean = useAppSelector(state => state.passwordReset.loading);
  const errorMessage: string = useAppSelector(state => state.passwordReset.errorMessage);
  const canChangePassword: boolean = useAppSelector(state => state.passwordReset.canChangePassword);
  const isChangedPassword: boolean = useAppSelector(state => state.passwordReset.isChangedPassword);

  const onSubmit = async ({ newPassword, newPasswordRepeat }) => {
    if (states.isPasswordMatched) {
      await dispatch(
        changePassword({
          password: newPasswordRepeat,
          passwordToken: states.passwordtoken,
          mirketToken: states.mirketToken,
          recordType: Number(states.recordtype),
        })
      );

      setStates(prev => ({ ...prev, openWarnModal: true }));
      // await dispatch(checkChangePassword({ passwordtoken: states.passwordtoken, recordtype: Number(states.recordtype) }));
    }
  };

  const title = (patterns: string[]) => {
    const minLength = patterns[0];
    const includeLetterNumberCase = Boolean(patterns[1]);
    const includeSpecialChar = Boolean(patterns[2]);

    switch (true) {
      // sadece minimum karakter belirlenmiş ise
      case !includeLetterNumberCase && !includeSpecialChar:
        return `Use ${minLength} or more characters.`;

      // minimum karakter ve letter, number, case belirlenmiş ise
      case includeLetterNumberCase && !includeSpecialChar:
        return `Use ${minLength} or more characters and include at least one number, one uppercase letter, and one lowercase letter.`;

      // minimum karakter ve special char belirlenmiş ise
      case !includeLetterNumberCase && includeSpecialChar:
        return `Use ${minLength} or more characters and include at least one special character like * or -.`;

      // minimum karakter, letter, number, case ve special char belirlenmiş ise
      case includeLetterNumberCase && includeSpecialChar:
        return `Use ${minLength} characters and include at least one number, one uppercase letter, one lowercase letter, and one special character like * or -.`;

      default:
        ' ';
    }
  };

  const getPasswordPattern = (patterns: string[]): RegExp => {
    // pattern[0] = minimum karakter sayısı
    // pattern[1] = true ise en az 1 sayı, 1 küçük harf ve 1 büyük harf içermek zorunda
    // pattern[2] = true ise en az 1 özel karakter içermek zorunda. Özel karakterler: .,-?!*+#_

    const minLength = patterns[0];
    const includeLetterNumberCase = patterns[1] === 'true';
    const includeSpecialChar = patterns[2] === 'true';

    let pattern = `^.{${minLength},}$`;

    if (includeLetterNumberCase && includeSpecialChar) {
      pattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[.,-?!*+#_]).{${minLength},}$`;
    } else if (includeLetterNumberCase && !includeSpecialChar) {
      pattern = `^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${minLength},}$`;
    } else if (!includeLetterNumberCase && includeSpecialChar) {
      pattern = `^(?=.*[.,-?!*+#_]).{${minLength},}$`;
    }

    return new RegExp(pattern);
  };

  const getPasswordPatternMessages = (patterns: string[]): string => {
    // pattern[0] = minimum karakter sayısı
    // pattern[1] = true ise en az 1 sayı, 1 küçük harf ve 1 büyük harf içermek zorunda
    // pattern[2] = true ise en az 1 özel karakter içermek zorunda. Özel karakterler: .,-?!*+#_

    const minLength = patterns[0];
    const includeLetterNumberCase = patterns[1] === 'true';
    const includeSpecialChar = patterns[2] === 'true';

    switch (true) {
      // sadece minimum karakter belirlenmiş ise
      case !includeLetterNumberCase && !includeSpecialChar:
        return `Password must be at least ${minLength} characters long.`;

      // minimum karakter ve letter, number, case belirlenmiş ise
      case includeLetterNumberCase && !includeSpecialChar:
        return `Password must be at least ${minLength} characters long and include at least one number, one uppercase letter, and one lowercase letter.`;

      // minimum karakter ve special char belirlenmiş ise
      case !includeLetterNumberCase && includeSpecialChar:
        return `Password must be at least ${minLength} characters long and include at least one special character like * or -.`;

      // minimum karakter, letter, number, case ve special char belirlenmiş ise
      case includeLetterNumberCase && includeSpecialChar:
        return `Password must be at least ${minLength} characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character like * or -.`;

      default:
        throw new Error('Invalid pattern configuration');
    }
  };

  React.useEffect(() => {
    // dispatch(logout());
    dispatch(checkChangePassword({ passwordtoken: states.passwordtoken, recordtype: Number(states.recordtype) }));
  }, []);

  if (loading || canChangePassword === null) return <Spin fullscreen size="large" />;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        height: '100vh',
        paddingTop: '20vh',
      }}
    >
      {canChangePassword && !isChangedPassword && (
        <Card
          style={{
            maxWidth: '500px',
            height: '375px',
          }}
        >
          <Title level={4}>Setup New Password</Title>
          <Form form={form} name="setupNewPassword" onFinish={onSubmit} layout="vertical" style={{ width: '100%', height: '100%' }}>
            <Form.Item>
              <Text style={{ fontSize: '11px' }} type="secondary">
                {title(states?.passwordPolicyRegex)}
              </Text>
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your password!' },

                {
                  validator(_, value) {
                    const pattern = getPasswordPattern(states?.passwordPolicyRegex);
                    if (value && !pattern.test(value)) {
                      return Promise.reject(new Error(getPasswordPatternMessages(states?.passwordPolicyRegex)));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <PasswordInputWithMeter placeholder="New Password" visibilityToggle={false} />
            </Form.Item>
            <Form.Item
              name="newPasswordRepeat"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('newPassword') === value) {
                      setStates(prev => ({ ...prev, isPasswordMatched: true }));
                    } else {
                      setStates(prev => ({ ...prev, isPasswordMatched: false }));
                    }

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
                    Confirm
                  </Button>
                </Space>
              </Row>
            </Form.Item>
          </Form>
        </Card>
      )}
      {!canChangePassword && (
        <>
          <Result status="error" title="Error" subTitle={'You Can Not Change Password For Now !'} />
        </>
      )}

      {isChangedPassword && states?.recordtype === ERecordType.Participant && (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Result status="success" title={'Done'} subTitle={'Password has been successfully defined.'} />
        </div>
      )}
      <WarnDialog
        destroyOnClose
        modalType={!isChangedPassword ? 'error' : 'success'}
        open={states.openWarnModal}
        message={!isChangedPassword ? errorMessage : 'Password has been successfully defined.'}
        onClose={() => {
          if (!isChangedPassword) {
            setStates(prev => ({ ...prev, openWarnModal: false }));
          }
          if (isChangedPassword && states?.recordtype !== ERecordType.Participant) {
            setStates(prev => ({ ...prev, openWarnModal: false }));
            navigate('/login');
          }
          if (isChangedPassword && states?.recordtype === ERecordType.Participant) {
            setStates(prev => ({ ...prev, openWarnModal: false }));
          }
        }}
      />
    </div>
  );
};

export default ChangePassword;
