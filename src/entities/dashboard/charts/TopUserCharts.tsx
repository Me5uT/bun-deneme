import { animated, useSpring } from '@react-spring/web';
import { Avatar, Card, Radio, Select, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ParticipantStatusInt, ParticipantTypeInt } from 'app/shared/model/participant.model';
import { getColorByType, getRateColorForSuccess, getRateColorForFail } from 'app/shared/util/UtilityService';
import React from 'react';
import { getDashboarTopUsers } from '../dashboard.reducer';
import { IDashboardTopUserType } from 'app/shared/model/DashboardModel';

export const TopUserCharts = () => {
  const [flipTable, setFlipTable] = React.useState<0 | 1>(0);
  const [selectedUserType, setSelectedUserType] = React.useState<IDashboardTopUserType>(IDashboardTopUserType.Radius);

  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const dashboardTopUserLoading: boolean = useAppSelector(state => state.dashboard.dashboardTopUserLoading);
  const dashboardTopUsers: any[] = useAppSelector(state => state.dashboard.dashboardTopUsers);

  const flipStyles = useSpring({
    transform: `rotateY(${flipTable === 0 ? 0 : 360}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const sucColumns: ColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'username',
        title: 'USERNAME',
        render(_, record, i) {
          return (
            <Space direction="horizontal">
              <Avatar style={{ backgroundColor: getRateColorForSuccess(i) }}>{record?.username[0]?.toUpperCase()}</Avatar>
              <div>{record?.username}</div>
            </Space>
          );
        },
      },
      {
        dataIndex: 'accessCount',
        title: 'COUNT',
      },

      {
        dataIndex: 'authenticationResult',
        title: 'STATUS',
        render(_, record, i) {
          return (
            <Tag color={getColorByType(ParticipantStatusInt, record?.status)}>{Object.values(ParticipantStatusInt)[record?.status]}</Tag>
          );
        },
      },
    ],
    []
  );

  const failColumns: ColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'username',
        title: 'USERNAME',
        render(_, record, i) {
          return (
            <Space direction="horizontal">
              <Avatar style={{ backgroundColor: getRateColorForFail(i) }}>{record?.username[0]?.toUpperCase()}</Avatar>
              <div>{record?.username}</div>
            </Space>
          );
        },
      },
      {
        dataIndex: 'accessCount',
        title: 'COUNT',
      },

      {
        dataIndex: 'authenticationResult',
        title: 'STATUS',
        render(_, record, i) {
          return (
            <Tag color={getColorByType(ParticipantStatusInt, record?.status)}>{Object.values(ParticipantStatusInt)[record?.status]}</Tag>
          );
        },
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getDashboarTopUsers({ accountId: baseObj?.accountId, type: selectedUserType, status: flipTable }));
  }, [selectedUserType, flipTable]);

  return (
    <Card
      loading={dashboardTopUserLoading}
      title={
        <Space>
          <div>Top User Charts</div>
          <div style={{ fontSize: '11px', marginTop: -5, marginLeft: -4, color: '#f5a864' }}>*Today</div>
        </Space>
      }
      styles={{
        header: { color: '#0d2b51' },
        body: { padding: '21px' },
      }}
      extra={
        <Space>
          <Space>
            <span>Type:</span>
            <Select
              defaultValue={selectedUserType}
              style={{ width: 120 }}
              onChange={(v: IDashboardTopUserType) => {
                setSelectedUserType(v);
              }}
              options={[
                {
                  label: Object.values(IDashboardTopUserType)[IDashboardTopUserType.Radius],
                  value: IDashboardTopUserType.Radius,
                },
                {
                  label: Object.values(IDashboardTopUserType)[IDashboardTopUserType.Admin],
                  value: IDashboardTopUserType.Admin,
                  disabled: true,
                },
                {
                  label: 'User Portal',
                  value: IDashboardTopUserType.UserPortal,
                  disabled: true,
                },
              ]}
            />
          </Space>

          <Radio.Group
            className="radius-rule-accept-deny"
            defaultValue={0}
            onChange={e => {
              setFlipTable(e.target.value);
            }}
            buttonStyle="solid"
            optionType="button"
            options={[
              { label: 'Successfull', value: 0 },
              { label: 'Unsuccessfull', value: 1 },
            ]}
          />
        </Space>
      }
    >
      <animated.div style={flipStyles}>
        {flipTable === 0 ? (
          <Table
            // rowClassName={(_, i) => `slide-in${i}`}
            rowKey={'uid'}
            columns={sucColumns}
            dataSource={dashboardTopUsers}
            pagination={false}
          />
        ) : (
          <Table
            // rowClassName={(_, i) => `slide-in${i}`}
            rowKey={'uid'}
            columns={failColumns}
            dataSource={dashboardTopUsers}
            pagination={false}
          />
        )}
      </animated.div>
    </Card>
  );
};
