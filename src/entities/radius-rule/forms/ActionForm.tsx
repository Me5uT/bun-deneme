import { Form, Input, Radio, Select, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/sms-provider/sms-provider.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { authorizationAttributeTypes } from 'app/shared/mockdata/AttributeTypes';
import { RadiusRuleAction, RuleOtpTimeout } from 'app/shared/model/RadiusRulesModel';
import { showOTPTimeout } from 'app/shared/util/UtilityService';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const ActionForm: React.FC = () => {
  const searchTimeout = React.useRef(null);
  const { control, watch } = useFormContext();
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const loading: boolean = useAppSelector(state => state.radiusRule.loading);
  const smsProviderList = useAppSelector(state => state.smsProvider.entities);
  const isVendorSpecific = watch('authorizationAttributeType') === 26;
  const providerUid = watch('providerId');
  const isAccept = watch('isAccept');
  const showOtp: boolean = React.useMemo(() => showOTPTimeout(providerUid, smsProviderList) || false, [providerUid, smsProviderList]);

  const otpTimeoutOptions = React.useMemo(
    () => [
      { label: 'None', value: RuleOtpTimeout.NOTIMEOUT },
      { label: '1 Hour', value: RuleOtpTimeout.ONEHOUR },
      { label: '8 Hours', value: RuleOtpTimeout.EIGHTHOUR },
      { label: '24 Hours', value: RuleOtpTimeout.TWENTYFOURHOUR },
    ],
    []
  );

  const ruleActionOptions = React.useMemo(
    () => [
      { label: 'Accept', value: RadiusRuleAction.Accept },
      { label: 'Deny', value: RadiusRuleAction.Deny },
    ],
    []
  );

  const onSearchProvider = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue.length > 2) {
        dispatch(getEntities({ searchtext: newValue, accountId: baseObj?.accountId }));
      }
    }, 500);
  };

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId }));
  }, []);

  if (loading) return <Spin />;

  return (
    <div>
      <Form.Item label="Action" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="isAccept"
          control={control}
          render={({ field }) => (
            <Radio.Group
              {...field}
              className="radius-rule-accept-deny"
              defaultValue={RadiusRuleAction.Accept}
              buttonStyle="solid"
              optionType="button"
              options={ruleActionOptions}
            />
          )}
        />
      </Form.Item>

      {isAccept === RadiusRuleAction.Accept && (
        <Form.Item label="Auth Method" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} required={isAccept === RadiusRuleAction.Accept}>
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                showSearch
                loading={loading}
                placeholder={'Authentication Method'}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={v => onSearchProvider(v)}
                options={smsProviderList.map(d => ({
                  value: d.uid,
                  label: d.name,
                }))}
              />
            )}
          />
        </Form.Item>
      )}
      {showOtp && isAccept === RadiusRuleAction.Accept && (
        <Form.Item label="OTP Timeout" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="otpTimeout"
            render={({ field }) => (
              <Radio.Group
                {...field}
                defaultValue={RuleOtpTimeout.NOTIMEOUT}
                options={otpTimeoutOptions}
                buttonStyle="solid"
                optionType="button"
              />
            )}
          />
        </Form.Item>
      )}

      {isAccept === RadiusRuleAction.Accept && (
        <Form.Item label="Attribute Type" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Controller
            name="authorizationAttributeType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                disabled={isAccept === RadiusRuleAction.Deny}
                style={{ width: '100%' }}
                showSearch
                placeholder={'Authorization'}
                suffixIcon={null}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={authorizationAttributeTypes}
              />
            )}
          />
        </Form.Item>
      )}
      {watch('authorizationAttributeType') !== 0 && isAccept === RadiusRuleAction.Accept && (
        <Form.Item
          label="Value"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          required={watch('authorizationAttributeType') !== 0 && isAccept === RadiusRuleAction.Accept}
        >
          <Controller name="authorizationValue" control={control} render={({ field }) => <Input {...field} placeholder={'Value'} />} />
        </Form.Item>
      )}

      {isVendorSpecific && isAccept === RadiusRuleAction.Accept && (
        <>
          <Form.Item
            label="Vendor Code"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            required={isVendorSpecific && isAccept === RadiusRuleAction.Accept}
          >
            <Controller
              name="vendorCode"
              control={control}
              render={({ field }) => <Input {...field} placeholder={'Vendor Code'} type="number" />}
            />
          </Form.Item>

          <Form.Item
            label="Attribute Number"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            required={isVendorSpecific && isAccept === RadiusRuleAction.Accept}
          >
            <Controller
              name="attributeNumber"
              control={control}
              render={({ field }) => <Input {...field} placeholder={'Attribute Number'} type="number" />}
            />
          </Form.Item>
        </>
      )}
    </div>
  );
};
