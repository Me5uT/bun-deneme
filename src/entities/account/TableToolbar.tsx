import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space } from 'antd';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AdvancedSearch } from 'app/shared/components/AdvancedSearch';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ITenant, LicenceStatusInt, LicenceType, LicenceTypeInt, TenantStatusInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { createSerializedObject } from 'app/shared/util/UtilityService';
import dayjs from 'dayjs';
import React from 'react';
import { getMSSP, searchPartner } from './account.reducer';

const { RangePicker } = DatePicker;

interface ITableToolbarProps {
  setModalOpenClose: (v: boolean) => void;
  setSearchData: (arg: any) => void;
}

export const TableToolbar: React.FC<ITableToolbarProps> = ({ setModalOpenClose, setSearchData }) => {
  const [openAdvancedSearch, setOpenAdvancedSearch] = React.useState<boolean>(false);
  const [parent, setParent] = React.useState<string>();
  const [partner, setPartner] = React.useState<string>();
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);

  const searchTimeout = React.useRef(null);

  const dispatch = useAppDispatch();
  const msspList: ITenant[] = useAppSelector(state => state.account.msspList);
  const msspLoading: boolean = useAppSelector(state => state.account.msspLoading);
  const partnerList: ITenant[] = useAppSelector(state => state.account.partnerList);
  const partnerLoading: boolean = useAppSelector(state => state.account.partnerLoading);

  const [form] = Form.useForm();
  const [baseObj] = useMirketPortal();

  const onMainSearch = React.useCallback(
    (text: string) => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
      }

      searchTimeout.current = setTimeout(() => {
        const query = { searchtext: text, size: 10, page: 0 };
        setSearchData((s: IQueryParams) => ({ ...s, ...query }));

        // herhangi bir arama yapılıp yapılmadığının kontrolü
        if (text) setListFiltered(true);
        else setListFiltered(false);
      }, 1000); // 1 saniye (1000 ms) gecikme
    },
    [] // Bağımlılıklar
  );

  const handleSearchOnParent = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getMSSP(newValue));
    }, 500);
  };

  const handleChangeOnParent = (newValue: string) => {
    setParent(prev => newValue);
  };

  const handleSearchOnPartner = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(searchPartner(newValue));
    }, 500);
  };

  const handleChangeOnPartner = (newValue: string) => {
    setPartner(prev => newValue);
  };

  const onFinish = React.useCallback((values: any) => {
    console.log('onFinish values', values);
    let serializedValues = {};

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    // expire date aralığı varsa ayrı ayrı set ediyoruz
    if (values.expireDate?.length === 2) {
      serializedValues = {
        ...values,
        expireDate: undefined,
        expireDateStart: values.expireDate[0].valueOf(),
        expireDateEnd: values.expireDate[1].valueOf(),
      };
    } else {
      serializedValues = {
        ...values,
        expireDate: undefined,
        expireDateStart: undefined,
        expireDateEnd: undefined,
      };
    }
    const data = createSerializedObject(serializedValues);

    setOpenAdvancedSearch(prev => false);

    searchTimeout.current = setTimeout(() => {
      setSearchData(serializedValues);

      // herhangi bir arama yapılıp yapılmadığının kontrolü
      if (Object.keys(data).length === 0) setListFiltered(false);
      else setListFiltered(true);
    }, 1000); // 1 saniye (1000 ms) gecikme
  }, []);

  const onClear = React.useCallback(() => {
    form.resetFields();
  }, [form]);

  React.useEffect(() => {
    dispatch(getMSSP(''));
    dispatch(searchPartner(''));
  }, []);

  return (
    <div className="toolbar-container">
      <Row gutter={16} justify={'space-between'} style={{ flexWrap: 'wrap-reverse', padding: '15px 20px', alignItems: 'center' }}>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Space direction="horizontal" style={{ width: '100%' }}>
            <AdvancedSearch onMainSearch={onMainSearch} setOpenAdvancedSearch={setOpenAdvancedSearch} />
            {listFiltered && <div style={{ fontSize: '12px', marginTop: -5, color: '#f5a864' }}>{'* List has been filtered.'}</div>}
          </Space>
          <Modal
            title="Advanced Search"
            open={openAdvancedSearch}
            width={400}
            onOk={() => {
              setOpenAdvancedSearch(prev => false);
            }}
            onCancel={() => setOpenAdvancedSearch(prev => false)}
            footer={null}
          >
            <Form onFinish={onFinish} form={form}>
              <Row>
                <Col span={24}>
                  <Form.Item name="name">
                    <Input allowClear placeholder={'Account Name'} />
                  </Form.Item>
                </Col>
              </Row>
              {baseObj?.tenantType === TenantTypeInt.MIRKET && (
                <Row>
                  <Col span={24}>
                    <Form.Item name="tenantType">
                      <Select
                        allowClear
                        placeholder={'Account Type'}
                        style={{ width: '100%' }}
                        options={[
                          { value: TenantTypeInt.ENDUSER, label: 'End User' },
                          { value: TenantTypeInt.MSSP, label: 'MSSP' },
                          { value: TenantTypeInt.PARTNER, label: 'Partner' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {baseObj?.tenantType === TenantTypeInt.MIRKET && (
                <Row>
                  <Col span={24}>
                    <Form.Item name="parentAccountId">
                      <Select
                        allowClear
                        showSearch
                        value={parent}
                        loading={msspLoading}
                        placeholder={'Parent Account'}
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        onSearch={handleSearchOnParent}
                        onChange={handleChangeOnParent}
                        onClear={() => {
                          dispatch(getMSSP(''));
                        }}
                        options={(msspList || []).map(d => ({
                          value: d.uid,
                          label: d.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {baseObj?.tenantType === TenantTypeInt.MIRKET && (
                <Row>
                  <Col span={24}>
                    <Form.Item name="partnerAccountId">
                      <Select
                        allowClear
                        showSearch
                        value={partner}
                        loading={partnerLoading}
                        placeholder={'Partner Account'}
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        onSearch={handleSearchOnPartner}
                        onChange={handleChangeOnPartner}
                        onClear={() => {
                          dispatch(searchPartner(''));
                        }}
                        options={partnerList.map(d => ({
                          value: d.uid,
                          label: d.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={24}>
                  <Form.Item name="tenantStatus">
                    <Select
                      allowClear
                      placeholder={'Account Status'}
                      style={{ width: '100%' }}
                      options={[
                        { value: TenantStatusInt.Active, label: 'Active' },
                        { value: TenantStatusInt.Passive, label: 'Passive' },
                        { value: TenantStatusInt.Pending, label: 'Pending' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="licenceType">
                    <Select
                      allowClear
                      placeholder={'Licence Type'}
                      style={{ width: '100%' }}
                      options={[
                        { value: LicenceTypeInt.Demo, label: LicenceType.Demo },
                        { value: LicenceTypeInt.MFA, label: LicenceType.MFA },
                        { value: LicenceTypeInt.SSO, label: LicenceType.SSO },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="licenceStatus">
                    <Select
                      allowClear
                      placeholder={'Licence Status'}
                      style={{ width: '100%' }}
                      options={[
                        { value: LicenceStatusInt.Active, label: 'Active' },
                        { value: LicenceStatusInt.Expired, label: 'Expired' },
                        { value: LicenceStatusInt.Soon, label: 'Soon' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="expireDate" preserve>
                    <RangePicker
                      style={{ width: '100%' }}
                      format={APP_LOCAL_DATE_FORMAT}
                      placeholder={['Expire Start Date', 'Expire End Date']}
                      presets={[
                        // value: [Start Date , End Date]
                        { label: 'Last 7 Days', value: [dayjs().add(-7, 'd') as any, dayjs() as any] },
                        { label: 'Last 30 Days', value: [dayjs().add(-30, 'd') as any, dayjs() as any] },
                        { label: 'Last 90 Days', value: [dayjs().add(-90, 'd') as any, dayjs() as any] },

                        { label: 'Next 7 Days', value: [dayjs() as any, dayjs().add(7, 'd') as any] },
                        { label: 'Next 30 Days', value: [dayjs() as any, dayjs().add(30, 'd') as any] },
                        { label: 'Next 90 Days', value: [dayjs() as any, dayjs().add(90, 'd') as any] },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                style={{
                  marginBottom: '0px',
                }}
              >
                <Row justify={'space-between'}>
                  <Button
                    onClick={() => {
                      setOpenAdvancedSearch(prev => false);
                    }}
                  >
                    {'Close'}
                  </Button>
                  <Space>
                    <Button onClick={onClear}>{'Clear'}</Button>
                    <Button htmlType="submit" type="primary">
                      {'Search'}
                    </Button>
                  </Space>
                </Row>
              </Form.Item>
            </Form>
          </Modal>
        </Col>

        <Col xs={6} sm={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!baseObj?.isReadOnly && (baseObj?.tenantType === TenantTypeInt.MIRKET || baseObj?.tenantType === TenantTypeInt.MSSP) && (
            <Button className="btn-add-account" type="primary" onClick={() => setModalOpenClose(true)} style={{ marginLeft: '10px' }}>
              {'Add Account'}
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
