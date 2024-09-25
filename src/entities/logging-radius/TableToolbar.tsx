import { SyncOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Space } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { AdvancedSearch } from 'app/shared/components/AdvancedSearch';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import React from 'react';
import { TableToolbarForm } from './forms/TableToolbarForm';
import { getEntities } from './loggingRadius.reducer';
import { AdvancedSearchWithValue } from 'app/shared/components/AdvancedSearchWithValue';

interface ITableToolbarProps {
  setSearchData: (arg: any) => void;
  searchData: any;
}

export const TableToolbar: React.FC<ITableToolbarProps> = ({ setSearchData, searchData }) => {
  const [baseObj] = useMirketPortal();
  const [mainSearchText, setMainSearchText] = React.useState<string>('');
  const [openAdvancedSearch, setOpenAdvancedSearch] = React.useState<boolean>(false);
  const [refreshDisabled, setRefreshDisabled] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);

  const searchTimeout = React.useRef(null);
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const onMainSearch = (text: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      setSearchData(prev => ({ ...prev, message: text }));
      // herhangi bir arama yapılıp yapılmadığının kontrolü
      if (text) setListFiltered(true);
      else setListFiltered(false);
    }, 500);
  };

  const onFinish = (values: any) => {
    const data = {
      // ...createSerializedObject(values),
      updatedDate: values?.updatedDate || null,

      username: Array.isArray(values?.user) && values?.user?.length > 0 ? values?.user.join(',') : null,

      authenticationResults:
        Array.isArray(values?.authenticationResults) && values?.authenticationResults?.length > 0
          ? values?.authenticationResults.join(',')
          : null,

      samname: Array.isArray(values?.samname) && values?.samname?.length > 0 ? values?.samname.join(',') : null,

      radiusGatewayUid:
        Array.isArray(values?.radiusGatewayUid) && values?.radiusGatewayUid?.length > 0 ? values?.radiusGatewayUid.join(',') : null,

      radiusClientIp: Array.isArray(values?.radiusClientIp) && values?.radiusClientIp?.length > 0 ? values?.radiusClientIp.join(',') : null,
    };

    setSearchData(prev => ({
      pagination: {
        ...prev?.pagination,
        pageNumber: 0,
      },
      ...data,
    }));

    setOpenAdvancedSearch(prev => false);
  };

  const onRefresh = () => {
    setRefreshDisabled(true);
    dispatch(
      getEntities({
        uid: baseObj?.accountId,
      })
    );
    setTimeout(() => {
      setRefreshDisabled(false);
    }, 2000);
    setListFiltered(false);
  };

  React.useEffect(() => {
    if (
      searchData?.username ||
      searchData?.authenticationResults ||
      searchData?.samname ||
      searchData?.updatedDate ||
      searchData?.radiusGatewayUid ||
      searchData?.radiusClientIp ||
      searchData?.message
    ) {
      setListFiltered(true);
    } else {
      setListFiltered(false);
    }
  }, [searchData]);

  return (
    <div className="toolbar-container">
      <Row gutter={16} justify={'space-between'} style={{ flexWrap: 'wrap-reverse', padding: '15px 20px', alignItems: 'center' }}>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Space direction="horizontal">
            <AdvancedSearchWithValue
              onMainSearch={onMainSearch}
              setOpenAdvancedSearch={setOpenAdvancedSearch}
              mainSearchText={mainSearchText ? mainSearchText : searchData?.searchtext}
            />
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
            <TableToolbarForm onFinish={onFinish} form={form} setOpenAdvancedSearch={setOpenAdvancedSearch} searchData={searchData} />
          </Modal>
        </Col>

        <Col xs={6} sm={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="refresh-log-btn"
            type="default"
            onClick={onRefresh}
            icon={<SyncOutlined />}
            disabled={refreshDisabled}
            loading={refreshDisabled}
          />
        </Col>
      </Row>
    </div>
  );
};
