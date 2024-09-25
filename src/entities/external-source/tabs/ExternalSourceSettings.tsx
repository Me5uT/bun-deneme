import { Form, FormInstance, Input, Radio, Select, Spin, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import React from 'react';
import { checkGroupDN, getAttributeProfiles, getLdapGatewayList } from '../externalSource.reducer';
import { useParams } from 'react-router-dom';
import { ESyncPeriod, IExternalSourceModel } from 'app/shared/model/externalSourceModel';

interface IExternalSourceSettingsProps {
  form: FormInstance<any>;
}

export const ExternalSourceSettings: React.FC<IExternalSourceSettingsProps> = ({ form }) => {
  const [groupDNStatusFlag, setgroupDNStatusFlag] = React.useState<boolean>(false);

  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const { id } = useParams<'id'>();

  const loading = useAppSelector(state => state.externalSource.loading);
  const searchLoading = useAppSelector(state => state.externalSource.searchLoading);
  const externalSourceDetail: IExternalSourceModel = useAppSelector(state => state.externalSource.entity);
  const gatewayLdapList = useAppSelector(state => state.externalSource.gatewayLdapList);
  const checkStatus: boolean = useAppSelector(state => state.externalSource.checkStatus);
  const checkLoading = useAppSelector(state => state.externalSource.checkLoading);
  const attributeProfileList = useAppSelector(state => state.externalSource.attributeProfileList);

  const handleSearchGateway = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue.length > 1) {
        dispatch(getLdapGatewayList({ accountId: baseObj?.accountId, searchtext: newValue }));
      }
    }, 600);
  };
  const handleSearchAttributeProfile = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getAttributeProfiles({ accountId: baseObj?.accountId, searchtext: newValue }));
    }, 400);
  };

  React.useEffect(() => {
    form.resetFields();
  }, [externalSourceDetail]);

  React.useEffect(() => {
    dispatch(getLdapGatewayList({ accountId: baseObj?.accountId }));
    dispatch(getAttributeProfiles({ accountId: baseObj?.accountId }));
  }, []);

  if (loading || !externalSourceDetail) {
    return <Spin spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
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

      <Form.Item labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }} name={'description'} label={'Description'}>
        <Input placeholder={'Description'} />
      </Form.Item>

      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
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
      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        name={'domainName'}
        label={'Domain Name'}
        rules={[{ required: true, message: 'Please enter a Domain Name!' }]}
      >
        <Input placeholder={'Domain Name'} />
      </Form.Item>
      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        name="ldapGroupDn"
        label="LDAP Group DN"
        // hasFeedback
        // rules={[
        //   {
        //     required: true,
        //     message: 'Please enter a valid External LDAP Group DN',
        //     async validator(_, value) {
        //       if (!value) {
        //         return Promise.reject(new Error('LDAP Group DN is required'));
        //       }

        //       setgroupDNStatusFlag(prev => true);

        //       if (searchTimeout.current) {
        //         clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
        //       }

        //       try {
        //         // Wrap the dispatch in a promise to await its completion
        //         const result = await new Promise((resolve, reject) => {
        //           searchTimeout.current = setTimeout(() => {
        //             // güncel ldapGroupDN 'den aynı değer girilmişse onayla
        //             if (value === externalSourceDetail?.ldapGroupDn) resolve('Valid LDAP Group DN');

        //             // güncel ldapGroupDN 'den farklı değer girilmişse sorgula
        //             if (value.length > 0 && value !== externalSourceDetail?.ldapGroupDn) {
        //               dispatch(checkGroupDN({ accountId: baseObj?.accountId, ldapGroupDn: value, externalSourceId: null }))
        //                 .then(response => {
        //                   if (checkStatus && groupDNStatusFlag) {
        //                     // Adjust based on how your action returns success
        //                     resolve('Valid LDAP Group DN');
        //                   } else {
        //                     reject(new Error('Invalid LDAP Group DN'));
        //                   }
        //                 })
        //                 .catch(error => reject(new Error('Validation failed due to an error')));
        //             }

        //             // değer boş ise required mesajı göster
        //             if (value === '') {
        //               reject(new Error('LDAP Group DN is required'));
        //             }
        //           }, 400);
        //         });

        //         return Promise.resolve(result);
        //       } catch (error) {
        //         return Promise.reject(error);
        //       }
        //     },
        //   },
        // ]}
        //   help={checkStatus === false && 'Invalid LDAP Group DN'}
        //   validateTrigger="onChange"
        //   validateStatus={checkLoading ? 'validating' : checkStatus && groupDNStatusFlag ? 'success' : checkStatus === false ? 'error' : ''}
      >
        <Input placeholder="LDAP Group DN" disabled />
      </Form.Item>

      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
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
          options={(attributeProfileList || []).map(d => ({
            value: d.uid,
            label: d.name,
          }))}
        />
      </Form.Item>
      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        name={'samValue'}
        label={'SAM'}
        rules={[{ required: true, message: 'Please enter a SAM Value!' }]}
      >
        <Input placeholder={'SAM'} />
      </Form.Item>

      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
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

      <Form.Item
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        name="syncPeriod"
        label={'Sync Period'}
        required
        style={{ width: '100%' }}
      >
        <Radio.Group buttonStyle="solid">
          <Radio.Button value={ESyncPeriod.ONDEMAND}>On Demand</Radio.Button>
          <Radio.Button value={ESyncPeriod.ONEHOURS}>1 Hour</Radio.Button>
          <Radio.Button value={ESyncPeriod.SIXHOURS}>6 Hours</Radio.Button>
          <Radio.Button value={ESyncPeriod.TWENTYFOURHOURS}>24 Hours</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};
