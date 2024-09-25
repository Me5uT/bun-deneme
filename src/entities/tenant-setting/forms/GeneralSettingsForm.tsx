import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Checkbox, Col, Form, FormInstance, Input, Row, Select, Spin, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/sms-provider/sms-provider.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { countryList } from 'app/shared/mockdata/CountryList';
import { timeZones } from 'app/shared/mockdata/TimeZones';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { languagesOptions } from 'app/shared/util/SettingOptions';
import { acceptJustNumericCharacter } from 'app/shared/util/UtilityService';
import React from 'react';

interface IGeneralSettingsFormProps {
  form: FormInstance<any>;
}

export const GeneralSettingsForm: React.FC<IGeneralSettingsFormProps> = ({ form }) => {
  const [baseObj] = useMirketPortal();

  const loading = useAppSelector(state => state.tenantSetting.loading);
  const splitedSmsProviderList = useAppSelector(state => state.smsProvider.splitedSmsProviderList);
  const smsProviderLoading = useAppSelector(state => state.smsProvider.loading);

  const inputsReadOnly = React.useMemo(() => baseObj?.adminProfile === AdminProfileInt.ReadOnly, [baseObj]);

  if (loading) {
    return <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Row>
        <Col span={10} offset={1}>
          <Form.Item name="companyName" label={'Company Name'} labelCol={{ sm: 24, md: 16, xl: 10 }} wrapperCol={{ sm: 24, md: 8, xl: 14 }}>
            <Input style={{ width: '100%' }} readOnly={inputsReadOnly} maxLength={40} />
          </Form.Item>
          <Form.Item
            name="adminSetPasswordTimeoutTime"
            label={'Admin Set Password Timeout'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Input style={{ width: '100%' }} suffix={'hours'} onKeyDown={acceptJustNumericCharacter} readOnly={inputsReadOnly} />
          </Form.Item>
          <Form.Item
            name="adminVerificationTimeoutTime"
            label={'Admin Verification Timeout'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Input style={{ width: '100%' }} suffix={'hours'} onKeyDown={acceptJustNumericCharacter} readOnly={inputsReadOnly} />
          </Form.Item>
          <Form.Item
            name="userSetPasswordTimeoutTime"
            label={'User Set Password Timeout'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Input style={{ width: '100%' }} suffix={'hours'} onKeyDown={acceptJustNumericCharacter} readOnly={inputsReadOnly} />
          </Form.Item>
          <Form.Item
            name="userVerificationTimeoutTime"
            label={'User Verification Timeout'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Input style={{ width: '100%' }} suffix={'hours'} onKeyDown={acceptJustNumericCharacter} readOnly={inputsReadOnly} />
          </Form.Item>
          <Form.Item
            name="bruteForceProtectionTime"
            label={'MFA Bombing Attack Protection'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Input style={{ width: '100%' }} suffix={'seconds'} onKeyDown={acceptJustNumericCharacter} readOnly={inputsReadOnly} />
          </Form.Item>
          <Form.Item
            name="defaultOtpProvider"
            label={'Default SMS Provider'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Select
              disabled={splitedSmsProviderList.length === 0 || inputsReadOnly}
              allowClear
              loading={smsProviderLoading}
              placeholder={'None'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              options={splitedSmsProviderList.map(d => ({
                value: d.uid,
                label: d.name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={10} offset={1}>
          <Form.Item name="language" label={'Mail Language'} labelCol={{ sm: 24, md: 16, xl: 10 }} wrapperCol={{ sm: 24, md: 8, xl: 14 }}>
            <Select open={inputsReadOnly ? false : undefined} placeholder={'Select Language'} options={languagesOptions} />
          </Form.Item>
          <Form.Item name="timeZone" label={'Time Zone'} labelCol={{ sm: 24, md: 16, xl: 10 }} wrapperCol={{ sm: 24, md: 8, xl: 14 }}>
            <Select
              open={inputsReadOnly ? false : undefined}
              showSearch={inputsReadOnly ? false : true}
              placeholder="Select Time Zone"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={timeZones}
            />
          </Form.Item>
          <Form.Item
            name="phoneCountryCode"
            label={'Phone Country'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Select
              open={inputsReadOnly ? false : undefined}
              showSearch={inputsReadOnly ? false : true}
              placeholder="Select Phone Country"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={countryList}
            />
          </Form.Item>
          <Form.Item
            name="manuelProvision"
            label={'Manuel Provision'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
          >
            <Switch style={{ marginLeft: '8px' }} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>

          <Form.Item
            name={'passwordPolicyMinChar'}
            label={'Password Policy'}
            labelCol={{ sm: 24, md: 16, xl: 10 }}
            wrapperCol={{ sm: 24, md: 8, xl: 14 }}
            style={{ marginBottom: '5px' }}
          >
            <Input
              readOnly={inputsReadOnly}
              defaultValue={8}
              addonBefore={'Minimum'}
              addonAfter={' character'}
              type="number"
              slot={'none'}
            />
          </Form.Item>

          <Row>
            <Col offset={10}>
              <Form.Item name={'regex1'} noStyle valuePropName="checked">
                <Checkbox>{'At least one number, one uppercase letter, one lowercase letter'}</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col offset={10}>
              <Form.Item name={'regex2'} noStyle valuePropName="checked">
                <Checkbox>{'At least one special character like that "*-."'}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
