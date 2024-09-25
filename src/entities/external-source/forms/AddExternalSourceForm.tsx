import { Button, Form, Input, Radio, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ESyncPeriod, IAddRequestExternalSourceModel } from 'app/shared/model/externalSourceModel';
import React from 'react';
import { checkGroupDN, createEntity, getAttributeProfiles, getLdapGatewayList, resetErrorMessage } from '../externalSource.reducer';
import { getEntities } from 'app/entities/attribute-profile/attributeProfile.reducer';

interface IAddExternalSourceProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddExternalSourceForm: React.FC<IAddExternalSourceProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [groupDNStatusFlag, setgroupDNStatusFlag] = React.useState<boolean>(false);

  const searchTimeout = React.useRef(null);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const gatewayLdapList = useAppSelector(state => state.externalSource.gatewayLdapList);
  const attributeProfileList = useAppSelector(state => state.externalSource.attributeProfileList);
  const checkStatus: boolean = useAppSelector(state => state.externalSource.checkStatus);
  const checkLoading = useAppSelector(state => state.externalSource.checkLoading);
  const loading = useAppSelector(state => state.externalSource.loading);
  const searchLoading = useAppSelector(state => state.externalSource.searchLoading);
  const errorMessage = useAppSelector(state => state.externalSource.errorMessage);

  const _handleModalClose = () => {
    setModalOpenClose(false);
    setgroupDNStatusFlag(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const serializedValues: IAddRequestExternalSourceModel = {
      ...values,
      accountId: baseObj?.accountId,
      isSyncManuel: values?.syncPeriod === ESyncPeriod.ONDEMAND,
    };

    console.log('Received values of form: ', serializedValues);
    await dispatch(createEntity(serializedValues));
    // _handleModalClose();
    setResultModalOpenClose(true);
  };

  const handleSearchGateway = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getLdapGatewayList({ accountId: baseObj?.accountId, searchtext: newValue }));
    }, 400);
  };
  const handleSearchAttributeProfile = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getAttributeProfiles({ accountId: baseObj?.accountId, searchtext: newValue }));
    }, 400);
  };
  // const handleChange = (newValue: string) => {
  //   setGateway(prev => newValue);
  // };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  React.useEffect(() => {
    dispatch(getLdapGatewayList({ accountId: baseObj?.accountId }));
    dispatch(getAttributeProfiles({ accountId: baseObj?.accountId }));
  }, []);

  return (
    <div>
      <Form
        className="add-modal-form-item"
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          syncPeriod: ESyncPeriod.ONEHOURS,
          type: 0,
        }}
      >
        <Form.Item
          name={'name'}
          label={'Name'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a External Source Name',
            },
          ]}
        >
          <Input placeholder={'External Source Name'} />
        </Form.Item>

        <Form.Item name={'description'} label={'Description'}>
          <Input placeholder={'Description'} />
        </Form.Item>

        <Form.Item
          name={'gatewayUid'}
          label={'LDAP Gateway'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a LDAP gateway',
            },
          ]}
        >
          <Select
            loading={searchLoading}
            showSearch
            placeholder={'Search Gateway'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearchGateway}
            onClear={() => {
              dispatch(getLdapGatewayList({ accountId: baseObj?.accountId }));
            }}
            options={(gatewayLdapList || []).map(d => ({
              value: d.uid,
              label: d.name,
            }))}
          />
        </Form.Item>
        <Form.Item name={'domainName'} label={'Domain Name'} rules={[{ required: true, message: 'Please enter a Domain Name!' }]}>
          <Input placeholder={'Domain Name'} />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="ldapGroupDn"
          label="LDAP Group DN"
          rules={[
            {
              required: true,
              message: 'Please enter a valid External LDAP Group DN',
              async validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('LDAP Group DN is required'));
                }

                setgroupDNStatusFlag(prev => true);

                if (searchTimeout.current) {
                  clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
                }

                try {
                  // Wrap the dispatch in a promise to await its completion
                  const result = await new Promise((resolve, reject) => {
                    searchTimeout.current = setTimeout(() => {
                      if (value.length > 0) {
                        dispatch(checkGroupDN({ accountId: baseObj?.accountId, ldapGroupDn: value, externalSourceId: null }))
                          .then(response => {
                            // Assume the action updates the checkStatus in the redux state
                            if (checkStatus && groupDNStatusFlag) {
                              // Adjust based on how your action returns success
                              resolve('Valid LDAP Group DN');
                            } else {
                              reject(new Error('Invalid LDAP Group DN'));
                            }
                          })
                          .catch(error => reject(new Error('Validation failed due to an error')));
                      }
                      if (value === '') {
                        reject(new Error('LDAP Group DN is required'));
                      }
                      if (value === null) {
                        resolve('');
                      }
                    }, 500);
                  });

                  return Promise.resolve(result);
                } catch (error) {
                  return Promise.reject(error);
                }
              },
            },
          ]}
          help={checkStatus === false && 'Invalid LDAP Group DN'}
          validateTrigger="onChange"
          validateStatus={checkLoading ? 'validating' : checkStatus && groupDNStatusFlag ? 'success' : checkStatus === false ? 'error' : ''}
        >
          <Input placeholder="LDAP Group DN" />
        </Form.Item>

        <Form.Item
          name={'attributeUid'}
          label={'Attribute'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter an Attribute',
            },
          ]}
        >
          <Select
            className="attribute-list-select"
            popupClassName="attribute-list-select-popup"
            loading={searchLoading}
            showSearch
            placeholder={'Attribute'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearchAttributeProfile}
            onClear={() => {
              dispatch(getAttributeProfiles({ accountId: baseObj?.accountId }));
            }}
            options={(attributeProfileList || []).map((d, i) => ({
              value: d.uid,
              label: d.name,
            }))}
          />
        </Form.Item>
        <Form.Item name={'samValue'} label={'SAM'} rules={[{ required: true, message: 'Please enter a SAM Value!' }]}>
          <Input placeholder={'SAM'} />
        </Form.Item>

        <Form.Item
          name={'type'}
          label="LDAP Type"
          rules={[
            {
              required: true,
              message: 'Please select a LDAP Type',
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <Select
            options={[
              {
                value: 0,
                label: 'Active Directory',
              },
              {
                value: 1,
                label: 'Others',
              },
            ]}
            placeholder={'Select a LDAP Type'}
          />
        </Form.Item>

        <Form.Item name="syncPeriod" label={'Sync Period'} required style={{ width: '100%' }}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={ESyncPeriod.ONDEMAND}>On Demand</Radio.Button>
            <Radio.Button value={ESyncPeriod.ONEHOURS}>1 Hour</Radio.Button>
            <Radio.Button value={ESyncPeriod.SIXHOURS}>6 Hours</Radio.Button>
            <Radio.Button value={ESyncPeriod.TWENTYFOURHOURS}>24 Hours</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item noStyle>
          <Row justify={'space-between'}>
            <Button type="default" onClick={_handleModalClose}>
              {'Close'}
            </Button>

            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {'Save'}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
