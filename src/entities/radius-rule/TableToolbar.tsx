import { Button, Col, Form, Modal, Row, Select, Space } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AdvancedSearch } from 'app/shared/components/AdvancedSearch';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { StatusInt } from 'app/shared/model/tenant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { createSerializedObject } from 'app/shared/util/UtilityService';
import React from 'react';
import { getClients } from '../gateway-radius/gatewayRadius.reducer';
import { getEntities as getGroupEntities } from '../group/group.reducer';
import { getEntities } from '../user/usertemp.reducer';

interface ITableToolbarProps {
  setModalOpenClose: (v: boolean) => void;
  setSearchData: (v: any) => void;
  setListFiltered: (v: boolean) => void;
  listFiltered: boolean;
}

export const TableToolbar: React.FC<ITableToolbarProps> = ({ listFiltered, setListFiltered, setModalOpenClose, setSearchData }) => {
  const [openAdvancedSearch, setOpenAdvancedSearch] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  const searchTimeout = React.useRef(null);
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const { clientLoading, clientList } = useAppSelector(state => state.gatewayRadius);
  const userList = useAppSelector(state => state.userTemp.entities);
  const userLoading = useAppSelector(state => state.userTemp.loading);
  const groupList = useAppSelector(state => state.group.entities);
  const groupLoading = useAppSelector(state => state.group.loading);

  const onMainSearch = React.useCallback(
    (text: string) => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
      }

      searchTimeout.current = setTimeout(() => {
        const query = text ? { searchtext: text } : { searchtext: undefined };
        setSearchData((s: IQueryParams) => ({ ...s, ...query }));

        // herhangi bir arama yapılıp yapılmadığının kontrolü
        if (text) setListFiltered(true);
        else setListFiltered(false);
      }, 1000); // 0.5 saniye (500 ms) gecikme
    },
    [setSearchData] // Bağımlılıklar
  );

  const onFinish = (values: any) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    const serializedValues = values;
    const data = createSerializedObject(serializedValues);
    setOpenAdvancedSearch(prev => false);

    searchTimeout.current = setTimeout(() => {
      setSearchData(serializedValues);

      // herhangi bir arama yapılıp yapılmadığının kontrolü
      if (Object.keys(data).length === 0) setListFiltered(false);
      else setListFiltered(true);
    }, 500);
  };

  const onClear = React.useCallback(() => {
    form.resetFields();
  }, [form]);

  const onSearchClient = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getClients({ searchtext: newValue, accountId: baseObj?.accountId }));
    }, 500);
  };

  const onSearchUser = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getEntities({ searchtext: newValue, accountId: baseObj?.accountId, page: 0, size: 5 }));
    }, 500);
  };

  const onSearchGroup = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getGroupEntities({ searchtext: newValue, accountId: baseObj?.accountId }));
    }, 500);
  };

  return (
    <div className="toolbar-container">
      <Row gutter={16} justify={'space-between'} style={{ flexWrap: 'wrap-reverse', padding: '15px 20px', alignItems: 'center' }}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Space direction="horizontal">
            <AdvancedSearch onMainSearch={onMainSearch} setOpenAdvancedSearch={setOpenAdvancedSearch} />
            {listFiltered && <div style={{ fontSize: '12px', marginTop: -5, color: '#f5a864' }}>{'* List has been filtered.'}</div>}
          </Space>
          <Modal
            title="Advanced Search"
            open={openAdvancedSearch}
            width={400}
            onOk={() => {
              setOpenAdvancedSearch(false);
            }}
            onCancel={() => setOpenAdvancedSearch(false)}
            footer={null}
          >
            <Form onFinish={onFinish} form={form}>
              <Row>
                <Col span={24}>
                  <Form.Item name="status">
                    <Select
                      allowClear
                      placeholder={'Status'}
                      style={{ width: '100%' }}
                      options={[
                        { value: StatusInt.Active, label: 'Active' },
                        { value: StatusInt.Passive, label: 'Passive' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="client">
                    <Select
                      allowClear
                      showSearch
                      loading={clientLoading}
                      placeholder={'Radius Client'}
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      onSearch={v => onSearchClient(v)}
                      onFocus={() => dispatch(getClients({ searchtext: '', accountId: baseObj?.accountId }))}
                      options={clientList.map(d => ({
                        value: d.uid,
                        label: d.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="user">
                    <Select
                      allowClear
                      showSearch
                      loading={userLoading}
                      placeholder={'User'}
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      onSearch={v => onSearchUser(v)}
                      onFocus={() => dispatch(getEntities({ searchtext: '', accountId: baseObj?.accountId, page: 0, size: 5 }))}
                      options={userList.map(d => ({
                        value: d.uid,
                        label: d.username,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="group">
                    <Select
                      allowClear
                      showSearch
                      loading={groupLoading}
                      placeholder={'Group'}
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      onSearch={v => onSearchGroup(v)}
                      onFocus={() => dispatch(getGroupEntities({ accountId: baseObj?.accountId }))}
                      options={groupList.map(d => ({
                        value: d.uid,
                        label: d.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="isAccept">
                    <Select
                      allowClear
                      placeholder={'Action'}
                      style={{ width: '100%' }}
                      options={[
                        { value: 0, label: 'Accept' },
                        { value: 1, label: 'Deny' },
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
                      setOpenAdvancedSearch(false);
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

        <Col xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!baseObj?.isReadOnly && (
            <Button className="btn-add-radius-rule" type="primary" onClick={() => setModalOpenClose(true)} style={{ marginLeft: '10px' }}>
              {'Add Radius Rule'}
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
