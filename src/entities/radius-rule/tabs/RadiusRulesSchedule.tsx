import { Form, FormInstance, Radio, Spin } from 'antd';
import React from 'react';
import { OneTime } from './schedule-tabs/OneTime';
import { Recurring } from './schedule-tabs/Recurring';
import { All } from './schedule-tabs/All';
import { useAppSelector } from 'app/config/store';
import { IRadiusRuleDetailModel, RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
interface IRadiusRulesScheduleProps {
  form: FormInstance<any>;
}
export const RadiusRulesSchedule: React.FC<IRadiusRulesScheduleProps> = ({ form }) => {
  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const loading = useAppSelector(state => state.radiusRule.loading);

  const scheduleType = Form.useWatch('scheduleType', form) || RuleScheduleType.ALL;

  const renderSchedule = (tab: RuleScheduleType) => {
    switch (tab) {
      case RuleScheduleType.ALL:
        return <All />;
      case RuleScheduleType.RECURRING:
        return <Recurring form={form} />;
      case RuleScheduleType.ONETIME:
        return <OneTime form={form} />;

      default:
        return <All />;
    }
  };

  React.useEffect(() => {
    form.resetFields();
  }, [radiusRule]);

  if (loading || !radiusRule) {
    return <Spin />;
  }

  return (
    <div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '10px 0px 15px 0px' }}>
        <Form.Item name={'scheduleType'}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={RuleScheduleType.ALL}>All</Radio.Button>
            <Radio.Button value={RuleScheduleType.RECURRING}> Recurring</Radio.Button>
            <Radio.Button value={RuleScheduleType.ONETIME}>One Time</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      {renderSchedule(scheduleType)}
    </div>
  );
};
