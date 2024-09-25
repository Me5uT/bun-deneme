import { Button, Col, DatePicker, DatePickerProps, Form, FormInstance, Row, Select, Space, Tag } from 'antd';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/user/usertemp.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { RadiusStatus } from 'app/shared/model/LoggingModel';
import { getColorByType } from 'app/shared/util/UtilityService';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';
import { getClients, getEntities as getGateways } from '../../gateway-radius/gatewayRadius.reducer';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface ITableToolbarProps {
  onFinish?: (values: any) => void;
  form?: FormInstance<any>;
  setOpenAdvancedSearch: (v: boolean) => void;
  searchData: any;
}
const range2 = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
export const TableToolbarForm: React.FC<ITableToolbarProps> = ({ searchData, setOpenAdvancedSearch, onFinish, form }) => {
  const [userr, setUser] = React.useState<string>(null);
  const [samuserr, setSamUser] = React.useState<string>(null);
  const [gateway, setGateway] = React.useState<string>(null);
  const [clients, setClients] = React.useState<string>(null);

  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const participantList = useAppSelector(state => state.userTemp.entities);
  const participantLoading = useAppSelector(state => state.userTemp.loading);

  const gatewayList = useAppSelector(state => state.gatewayRadius.gatewayRadiusList);
  const gatewayLoading = useAppSelector(state => state.gatewayRadius.loading);

  const clientList = useAppSelector(state => state.gatewayRadius.clientList);
  const clientLoading = useAppSelector(state => state.gatewayRadius.clientLoading);

  const onClear = React.useCallback(() => {
    form.setFieldsValue({
      user: null,
      authenticationResults: null,
      samname: null,
      updatedDate: null,
      radiusGatewayUid: null,
      radiusClientIp: null,
    });
  }, []);

  const handleSearchUser = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue) {
        dispatch(getEntities({ searchtext: newValue, isExternal: false, accountId: baseObj?.accountId }));
      }
    }, 500);
  };
  const handleChangeUser = (newValue: string) => {
    setUser(prev => newValue);
  };
  const handleSearchSamUser = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue) {
        dispatch(getEntities({ searchtext: newValue, isExternal: false, accountId: baseObj?.accountId }));
      }
    }, 500);
  };
  const handleChangeSamUser = (newValue: string) => {
    setSamUser(prev => newValue);
  };
  const handleSearchGateway = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue) {
        dispatch(getGateways({ searchtext: newValue, accountId: baseObj?.accountId }));
      }
    }, 500);
  };
  const handleChangeGateway = (newValue: string) => {
    setGateway(prev => newValue);
  };
  const handleSearchClient = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue) {
        dispatch(getClients({ searchtext: newValue, accountId: baseObj?.accountId }));
      }
    }, 500);
  };
  const handleChangeClient = (newValue: string) => {
    setClients(prev => newValue);
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

  return (
    <Form onFinish={onFinish} form={form}>
      <Row>
        <Col span={24}>
          <Form.Item name="user">
            <Select
              mode="multiple"
              allowClear
              showSearch
              value={userr}
              loading={participantLoading}
              placeholder={'Username'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              onSearch={handleSearchUser}
              onChange={handleChangeUser}
              onClear={() => {
                setUser(null);
              }}
              options={(participantList || []).map(d => ({
                value: d.uid,
                label: d.username,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="authenticationResults">
            <Select
              allowClear
              showSearch={false}
              mode="multiple"
              tagRender={(props: CustomTagProps) => {
                const { label, value, closable, onClose } = props;
                const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                };
                return (
                  <Tag
                    color={getColorByType(RadiusStatus, value)}
                    onMouseDown={onPreventMouseDown}
                    closable={closable}
                    onClose={onClose}
                    style={{ marginRight: 3 }}
                  >
                    {label}
                  </Tag>
                );
              }}
              style={{ width: '100%' }}
              placeholder="Result"
              optionLabelProp="label"
              options={[
                {
                  label: Object.values(RadiusStatus)[RadiusStatus.SUCCESS],
                  value: RadiusStatus.SUCCESS,
                },
                {
                  label: Object.values(RadiusStatus)[RadiusStatus.WAITING],
                  value: RadiusStatus.WAITING,
                },
                {
                  label: Object.values(RadiusStatus)[RadiusStatus.FAILURE],
                  value: RadiusStatus.FAILURE,
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="samname">
            <Select
              mode="multiple"
              allowClear
              showSearch
              value={samuserr}
              loading={participantLoading}
              placeholder={'Sam'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              onSearch={handleSearchSamUser}
              onChange={handleChangeSamUser}
              onClear={() => {
                setSamUser(null);
              }}
              options={(participantList || []).map(d => ({
                value: d.uid,
                label: d.sam,
              }))}
            />
          </Form.Item>
        </Col>
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
          <Form.Item name="radiusGatewayUid">
            <Select
              mode="multiple"
              allowClear
              showSearch
              value={gateway}
              loading={gatewayLoading}
              placeholder={'Gateway'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              onSearch={handleSearchGateway}
              onChange={handleChangeGateway}
              onClear={() => {
                setGateway(null);
              }}
              options={(gatewayList || []).map(d => ({
                value: d.uid,
                label: d.name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="radiusClientIp">
            <Select
              mode="multiple"
              allowClear
              showSearch
              value={clients}
              loading={clientLoading}
              placeholder={'Client IP'}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              onSearch={handleSearchClient}
              onChange={handleChangeClient}
              onClear={() => {
                setClients(null);
              }}
              options={(clientList || []).map(d => ({
                value: d.uid,
                label: d.ipAddress,
              }))}
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
  );
};
