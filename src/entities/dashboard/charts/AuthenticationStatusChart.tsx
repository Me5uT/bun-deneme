import { Card, Space } from 'antd';
import { APP_DATE_FORMAT_3, APP_DATE_FORMAT_4 } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IDashboardGraphic, IDashboardItem, PointsOfDay } from 'app/shared/model/DashboardModel';
import { formatDate } from 'app/shared/util/date-utils';
import React from 'react';
import Chart from 'react-apexcharts';
import { getDashboardGraphic } from '../dashboard.reducer';

export const AuthenticationStatusChart: React.FC = () => {
  const [periyots, setPeriyots] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [successData, setSuccessData] = React.useState<number[]>([]);
  const [failureData, setFailureData] = React.useState<number[]>([]);

  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const dashboardGraphicLoading: boolean = useAppSelector(state => state.dashboard.dashboardGraphicLoading);
  const dashboardGraphic: IDashboardGraphic = useAppSelector(state => state.dashboard.dashboardGraphic);

  React.useEffect(() => {
    if (dashboardGraphic) {
      const newCategories: string[] = [];
      const newPeriyots: string[] = [];
      const newSuccessData: number[] = [];
      const newFailureData: number[] = [];

      dashboardGraphic?.items?.forEach((item: IDashboardItem) => {
        item.pointsOfDay.forEach((point: PointsOfDay) => {
          newPeriyots.push(point.periodNumber.replace('00:00:00', ''));
          newCategories.push(formatDate(point.periodNumber.split(' ')[0], APP_DATE_FORMAT_3)); //   newCategories.push(formatDate(point.logDate, APP_DATE_FORMAT_3));
          newSuccessData.push(point.successCount);
          newFailureData.push(point.failureCount);
        });
      });
      setPeriyots(newPeriyots);
      setCategories(newCategories);
      setSuccessData(newSuccessData);
      setFailureData(newFailureData);
    }
  }, [dashboardGraphic]);

  React.useEffect(() => {
    dispatch(getDashboardGraphic({ accountId: baseObj?.accountId, type: 0, period: 4, day: 7 }));
  }, []);

  return (
    <Card
      loading={dashboardGraphicLoading}
      title={
        <Space>
          <div>Authentication Status</div>
          <div style={{ fontSize: '11px', marginTop: -5, marginLeft: -4, color: '#f5a864' }}>*Last Week</div>
        </Space>
      }
      styles={{
        header: { color: '#0d2b51' },
      }}
    >
      {dashboardGraphic && (
        <Chart
          options={{
            xaxis: {
              categories,
              type: 'category',
              tooltip: { enabled: false },
              labels: {
                formatter(value, timestamp, opts) {
                  return formatDate(value, APP_DATE_FORMAT_4);
                },
              },
              tickAmount: 7,
            },
            yaxis: {
              min: 0, // Y-Axis'in minimum değeri
              max: Math.max(...successData, ...failureData) + 10, // Verilere göre maksimum değeri ayarlar
              tickAmount: 10, // Math.max(...successData, ...failureData), // Her tam sayı değeri için bir tick ayarlamak
              forceNiceScale: true,
              decimalsInFloat: 0, // Küsürlü sayıların görünmesini engeller
            },
            dataLabels: {
              enabled: false,
            },
            chart: { toolbar: { show: false }, zoom: { enabled: false } },
            tooltip: {
              x: {
                formatter(val, opts) {
                  return periyots[val - 1]; // 'formatDate(val, APP_DATE_FORMAT_3)';
                },
              },
            },
          }}
          series={[
            {
              name: 'Success',
              data: successData,
              color: '#00e396',
            },
            {
              name: 'Failure',
              data: failureData,
              color: '#f85454',
            },
          ]}
          type="area"
        />
      )}
    </Card>
  );
};
