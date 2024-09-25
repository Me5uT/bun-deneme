import { Form, FormInstance, Input, Radio, Select, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/sms-provider/sms-provider.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { authorizationAttributeTypes } from 'app/shared/mockdata/AttributeTypes';
import { IRadiusRuleDetailModel, RuleOtpTimeout } from 'app/shared/model/RadiusRulesModel';
import { showOTPTimeout } from 'app/shared/util/UtilityService';
import React from 'react';
interface IRadiusRulesProviderProps {
  form: FormInstance<any>;
  showSaveButton: boolean;
}
export const RadiusRulesAction: React.FC<IRadiusRulesProviderProps> = ({ form, showSaveButton }) => {
  const [searchText, setSearchText] = React.useState('');
  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const loading: boolean = useAppSelector(state => state.radiusRule.detailLoading);
  const smsProviderList = useAppSelector(state => state.smsProvider.entities);
  const smsProviderLoading = useAppSelector(state => state.smsProvider.loading);

  const isNoTimeout = Form.useWatch('authorizationAttributeType', form);
  const isVendorSpecific = Form.useWatch('authorizationAttributeType', form) === 26;
  const provider = Form.useWatch('providerId', form);
  const isAccept = Form.useWatch('isAccept', form);

  // const showOtp = React.useMemo(() => showOTPTimeout(provider), [provider]);
  const showOtp = React.useMemo(() => showOTPTimeout(provider, smsProviderList), [provider, smsProviderList]);

  const otpTimeoutOptions = React.useMemo(
    () => [
      { label: 'None', value: RuleOtpTimeout.NOTIMEOUT },
      { label: '1 Hour', value: RuleOtpTimeout.ONEHOUR },
      { label: '8 Hours', value: RuleOtpTimeout.EIGHTHOUR },
      { label: '24 Hours', value: RuleOtpTimeout.TWENTYFOURHOUR },
    ],
    []
  );

  const onSearchProvider = (newValue: string) => {
    if (newValue === '') {
      dispatch(getEntities({ searchtext: '', accountId: baseObj?.accountId }));
    } else {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
      }

      searchTimeout.current = setTimeout(() => {
        if (newValue.length > 0) {
          setSearchText(newValue);
          dispatch(getEntities({ searchtext: newValue, accountId: baseObj?.accountId }));
        }
      }, 500);
    }
  };

  React.useEffect(() => {
    form.resetFields();
  }, [radiusRule]);

  React.useEffect(() => {
    if (isAccept === true && radiusRule?.isAccept === false) form.setFieldValue('authorizationAttributeType', 0);
  }, [isAccept]);

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId }));
  }, []);

  if (loading || !radiusRule) {
    return <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {(radiusRule?.isAccept || showSaveButton) && isAccept && !smsProviderLoading && (
        <>
          <Form.Item
            rules={[
              {
                required: isAccept,
                message: 'Authentication Method is required!',
              },
            ]}
            name="providerId"
            label={'Auth Method'}
            labelCol={{ sm: 8, md: 8, xl: 6 }}
            wrapperCol={{ sm: 10, md: 10, xl: 8 }}
          >
            <Select
              showSearch
              value={searchText}
              // loading={smsProviderLoading}
              placeholder={'Authentication Method'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              //     onFocus={() => onSearchProvider('')}
              onSearch={v => onSearchProvider(v)}
              options={smsProviderList.map(d => ({
                value: d.uid,
                label: d.name,
              }))}
            />
          </Form.Item>

          {showOtp && (
            <Form.Item name="otpTimeout" label={'OTP Timeout'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
              <Radio.Group options={otpTimeoutOptions} buttonStyle="solid" optionType="button" />
            </Form.Item>
          )}
          <Form.Item
            name="authorizationAttributeType"
            label={'Attribute Type'}
            labelCol={{ sm: 8, md: 8, xl: 6 }}
            wrapperCol={{ sm: 10, md: 10, xl: 8 }}
            rules={[
              {
                required: isAccept,
                message: 'Attribute Type is required!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder={'Attribute Type'}
              suffixIcon={null}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={authorizationAttributeTypes}
            />
          </Form.Item>
          {isNoTimeout !== 0 && isNoTimeout && (
            <Form.Item
              name="authorizationValue"
              label={'Value'}
              labelCol={{ sm: 8, md: 8, xl: 6 }}
              wrapperCol={{ sm: 10, md: 10, xl: 8 }}
              rules={[
                {
                  required: isNoTimeout !== 0 && isAccept,
                  message: 'Value is required!',
                },
              ]}
            >
              <Input placeholder={'Value'} />
            </Form.Item>
          )}

          {isVendorSpecific && (
            <>
              <Form.Item
                name="vendorCode"
                label={'Vendor Code'}
                labelCol={{ sm: 8, md: 8, xl: 6 }}
                wrapperCol={{ sm: 10, md: 10, xl: 8 }}
                rules={[{ required: isVendorSpecific, message: 'Vendor Code is required!' }]}
              >
                <Input placeholder={'Vender Code'} />
              </Form.Item>
              <Form.Item
                name="attributeNumber"
                label={'Attribute Number'}
                labelCol={{ sm: 8, md: 8, xl: 6 }}
                wrapperCol={{ sm: 10, md: 10, xl: 8 }}
                rules={[{ required: isVendorSpecific, message: 'Attribute Number is required!' }]}
              >
                <Input placeholder={'Attribute Number'} />
              </Form.Item>
              {/* <Form.Item name="prefix" label={'Prefix'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
                <Input placeholder={'Prefix'} />
              </Form.Item>
              <Form.Item name="seperator" label={'Seperator'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
                <Input placeholder={'Seperator'} />
              </Form.Item> */}
            </>
          )}
        </>
      )}
      <Form.Item name="isAccept" label="Action" labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Radio.Group className="radius-rule-accept-deny" buttonStyle="solid">
          <Radio.Button value={true}>Accept</Radio.Button>
          <Radio.Button value={false}>Deny</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};
