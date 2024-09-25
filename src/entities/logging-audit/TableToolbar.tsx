/* eslint-disable no-sparse-arrays */
import { SyncOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, DatePickerProps, Form, Modal, Row, Select, Space } from 'antd';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AdvancedSearch } from 'app/shared/components/AdvancedSearch';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { LogLevel } from 'app/shared/model/LoggingModel';
import { createSerializedObject, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntities as getAdmins } from '../administration/admin.reducer';
import { getEntities, getLogLookup } from './loggingAudit.reducer';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface ITableToolbarProps {
  setSearchData: (arg: any) => void;
  searchData: any;
}
const range2 = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const TableToolbar: React.FC<ITableToolbarProps> = ({ searchData, setSearchData }) => {
  const [baseObj] = useMirketPortal();
  const [openAdvancedSearch, setOpenAdvancedSearch] = React.useState<boolean>(false);
  const [refreshDisabled, setRefreshDisabled] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);
  const [parent, setParent] = React.useState<string>();

  const searchTimeout = React.useRef(null);
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const logTypes = useAppSelector(state => state.loggingAudit.logTypes);
  const adminList = useAppSelector(state => state.admin.entities);
  const adminLoading = useAppSelector(state => state.admin.loading);

  const onMainSearch = (text: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setSearchData(prev => ({ ...prev, message: text }));
      // herhangi bir arama yapılıp yapılmadığının kontrolü
      if (text) setListFiltered(true);
      else setListFiltered(false);
    }, 500);
  };

  const onFinish = (values: any) => {
    const data = createSerializedObject(values);

    setSearchData(prev => ({
      pagination: {
        ...prev?.pagination,
        pageNumber: 0,
      },
      ...data,
    }));

    // herhangi bir arama yapılıp yapılmadığının kontrolü
    if (Object.keys(data).length === 0) setListFiltered(false);
    else setListFiltered(true);

    setOpenAdvancedSearch(prev => false);
  };

  const onClear = React.useCallback(() => {
    form.setFieldsValue({
      updatedDate: null,
      level: null,
      user: null,
      logtype: null,
    });
  }, []);

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

  const handleSearchUser = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue.length > 2) {
        dispatch(getAdmins({ searchtext: newValue, accountId: baseObj?.accountId }));
      }
    }, 500);
  };

  const handleChangeUser = (newValue: string) => {
    setParent(prev => newValue);
  };

  const disabledTime = (date: any, range: 'start' | 'end', info: { from?: any }) => {
    const fromTime = info?.from;

    // Saatleri kısıtlamak için fonksiyon
    const disabledHours = () => {
      if (!fromTime) return [];

      const fromDate = fromTime.toDate();
      // Eğer 'end' seçiliyorsa saat farkı en fazla 48 saat olabilir
      if (range === 'end') {
        // fromTime'a 2 gün ekle
        const maxDate = dayjs(fromDate).add(2, 'day');
        // fromTime'ın day'ini maxDate'ın day'i ile eşit ise maxDate'ın saatinden sonraki saatleri döndür

        if (date.day() === maxDate.day()) {
          return range2(fromTime.hour(), 24);
        } else {
          return [];
        }
      }
      return [];
    };

    // Dakikaları kısıtlamak için fonksiyon
    const disabledMinutes = (selectedHour: number) => {
      if (!fromTime) return [];

      const fromHour = fromTime.hour();
      const fromMinute = fromTime.minute();

      // Eğer saatler aynıysa, dakikaları kısıtlıyoruz
      return range === 'end' && selectedHour === fromHour ? Array.from({ length: 60 }, (_, i) => i).slice(fromMinute + 1) : [];
    };

    // 'start' seçimi için tüm saat ve dakikalar kullanılabilir
    if (range === 'start') {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    // 'end' seçimi için saat ve dakikalar kısıtlanmış şekilde döndürülüyor
    return {
      disabledHours,
      disabledMinutes: (hour: number) => disabledMinutes(hour),
    };
  };

  const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    const today = new Date();

    // Bugünden büyük tarihler engellenir
    if (current.toDate() >= today) {
      return true;
    }

    // Eğer 1. tarih (from) varsa, 2. tarih hem ondan küçük olamaz hem de 48 saat sonrasını aşamaz
    if (from) {
      const maxDate = new Date(from.toDate());
      maxDate.setHours(maxDate.getHours() + 48);
      const minDate = new Date(from.toDate());
      minDate.setHours(minDate.getHours() - 24);
      // 2. tarih 1. tarihten küçük olamaz ve 48 saati aşamaz
      return current.toDate() < minDate || current.toDate() >= maxDate;
    }

    return false;
  };

  React.useEffect(() => {
    dispatch(getLogLookup());
  }, []);

  React.useEffect(() => {
    if (searchData?.updatedDate || searchData?.level || searchData?.user || searchData?.logtype) {
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
                  <Form.Item name="updatedDate">
                    <RangePicker
                      style={{ width: '100%' }}
                      showTime={{ format: 'HH:mm' }}
                      disabledDate={disabledDate}
                      disabledTime={disabledTime}
                      format={APP_DATE_FORMAT}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="level">
                    <Select
                      allowClear
                      placeholder={'Level'}
                      style={{ width: '100%' }}
                      options={[
                        { value: LogLevel.CONFIG, label: <div style={{ color: getColorByType(LogLevel, LogLevel.CONFIG) }}>CONFIG</div> },
                        { value: LogLevel.INFO, label: <div style={{ color: getColorByType(LogLevel, LogLevel.INFO) }}>INFO</div> },
                        {
                          value: LogLevel.WARNING,
                          label: <div style={{ color: getColorByType(LogLevel, LogLevel.WARNING) }}>WARNING</div>,
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="user">
                    <Select
                      allowClear
                      showSearch
                      value={parent}
                      loading={adminLoading}
                      placeholder={'Search User'}
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      onSearch={handleSearchUser}
                      onChange={handleChangeUser}
                      onClear={() => {
                        dispatch(getAdmins({ searchtext: '', accountId: baseObj?.accountId }));
                      }}
                      options={(adminList || []).map(d => ({
                        value: d.email,
                        label: d.email,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="logtype">
                    <Select allowClear placeholder={'Log Type'} style={{ width: '100%' }} options={logTypes} />
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
