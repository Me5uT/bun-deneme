import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space, Spin, StepProps, Steps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IRadiusRuleAddRequestModel, RadiusRuleAction, RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formInitialValues } from './FormModel/formInitialValues';
import { withGroupValidation, withUserValidation } from './FormModel/validationSchema';
import { ActionForm } from './forms/ActionForm';
import { ScheduleForm } from './forms/ScheduleForm';
import { SourceForm } from './forms/SourceForm';
import { UsersAndGroupsForm } from './forms/UsersAndGroupsForm';
import { UsersOrGroupsForm } from './forms/UsersOrGroupsForm';
import { createEntity, resetErrorMessage } from './radiusrule.reducer';
import { UserOrGroup } from './tabs/RadiusRulesUserAndGroups';

interface IAddAccountWizardProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddRadiusRuleWizard: React.FC<IAddAccountWizardProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [usersOrGroups, setUsersOrGroups] = React.useState<UserOrGroup>(UserOrGroup.USER);
  const initialSteps: StepProps[] = [
    { title: 'Source' },
    { title: 'Users or Groups' },
    { title: usersOrGroups === UserOrGroup.USER ? 'Users' : 'Groups' },
    { title: 'Schedule' },
    { title: 'Action' },
  ];

  const [steps, setSteps] = React.useState<StepProps[]>(initialSteps);
  const [activeStep, setActiveStep] = React.useState(0);

  const [baseObj] = useMirketPortal();

  const isLastStep = React.useMemo(() => activeStep === steps.length - 1, [activeStep]);
  const dispatch = useAppDispatch();

  const loading: boolean = useAppSelector(state => state.radiusRule.loading);
  const errorMessage: string = useAppSelector(state => state.radiusRule.errorMessage);

  const currentValidationSchema = () => {
    if (usersOrGroups === UserOrGroup.GROUP) return withGroupValidation[activeStep];
    else return withUserValidation[activeStep];
  };

  const methods = useForm({
    defaultValues: formInitialValues,
    resolver: yupResolver(currentValidationSchema() as any),
    mode: 'all',
  });

  const isAccept = React.useMemo(() => methods.watch('isAccept') === RadiusRuleAction.Accept, [methods.watch('isAccept')]);

  const updateStepsStatus = () => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index === activeStep) {
          return { ...step, status: 'process' };
        }
        if (index > activeStep + 1) {
          return { ...step, status: 'wait' };
        }
        if (index < activeStep + 1) {
          return { ...step, status: 'finish' };
        }
      })
    );
  };

  const _handleSubmit = async (values: any) => {
    console.log('form _handleSubmit values', values);

    // updateStepsStatus();
    // step'in son adımı ise
    if (isLastStep) {
      const participants = methods.watch('participants');
      const groups = methods.watch('participantGroups');
      const isAllParticipantsIncluded =
        Array.isArray(participants) && participants[0] === 'a' && Array.isArray(groups) && groups.length === 0;

      const schedule =
        values?.scheduleType === RuleScheduleType.ALL
          ? {
              scheduleType: RuleScheduleType.ALL,

              scheduleStartDateTime: null,
              scheduleEndDateTime: null,
              scheduleStartTime: null,
              scheduleEndTime: null,
              scheduleDays: null,
            }
          : values?.scheduleType === RuleScheduleType.RECURRING
          ? {
              scheduleType: RuleScheduleType.RECURRING,

              scheduleStartDateTime: null,
              scheduleEndDateTime: null,
              scheduleStartTime: values?.scheduleStartTime,
              scheduleEndTime: values?.scheduleEndTime,
              scheduleDays: values?.scheduleDays,
            }
          : {
              scheduleType: RuleScheduleType.ONETIME,

              scheduleStartDateTime: values?.scheduleStartDateTime,
              scheduleEndDateTime: values?.scheduleEndDateTime,
              scheduleStartTime: null,
              scheduleEndTime: null,
              scheduleDays: null,
            };

      const { userOrGroup, ...serializedValues }: IRadiusRuleAddRequestModel = {
        ...values,
        accountId: baseObj?.accountId,
        isAccept: methods.watch('isAccept') === RadiusRuleAction.Accept,
        participants: usersOrGroups === UserOrGroup.GROUP || isAllParticipantsIncluded ? null : participants,
        participantGroups: usersOrGroups === UserOrGroup.USER ? null : groups,
        radiusClientIds: values?.radiusClientIds.length === 1 && values?.radiusClientIds.includes('all') ? [] : values?.radiusClientIds,
        isAllParticipantsIncluded,
        ...schedule,
      } as IRadiusRuleAddRequestModel;

      await dispatch(createEntity(serializedValues));
      // _handleModalClose();
      setResultModalOpenClose(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const _handleModalClose = () => {
    setModalOpenClose(false);
    setActiveStep(prev => 0);
    setSteps(initialSteps);
    methods.reset(); // Reset form fields
  };

  const _handleBack = React.useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, [activeStep]);

  const _renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SourceForm />;
      case 1:
        return <UsersOrGroupsForm setUserOrGroup={setUsersOrGroups} />;
      case 2:
        return <UsersAndGroupsForm userOrGroup={usersOrGroups} />;
      case 3:
        return <ScheduleForm />;
      case 4:
        return <ActionForm />;

      default:
        return <div>{'Page not found'}</div>;
    }
  };

  React.useEffect(() => {
    initialSteps[2].title = usersOrGroups === UserOrGroup.USER ? 'Users' : 'Groups';
    setSteps(prev => {
      prev.find(item => item.title === 'Users' || item.title === 'Groups').title = usersOrGroups === UserOrGroup.USER ? 'Users' : 'Groups';
      return [...prev];
    });
  }, [usersOrGroups]);

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  if (loading) <Spin spinning={loading} />;

  return (
    <React.Fragment>
      <Steps current={activeStep} items={steps} style={{ display: 'flex', flexDirection: 'row', paddingTop: '-16px', flexWrap: 'wrap' }} />
      <hr />
      <React.Fragment>
        <FormProvider {...methods}>
          <form
            className="add-modal-form-item"
            onSubmit={methods.handleSubmit(_handleSubmit, errors => {
              console.log('form submit error:', errors);
            })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '480px',
              padding: '20px 5px',
            }}
          >
            {_renderStepContent(activeStep)}

            <Space style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px' }}>
              <Button onClick={_handleModalClose}>{'Close'}</Button>
              <Space>
                <Button onClick={_handleBack} disabled={activeStep === 0}>
                  {'Back'}
                </Button>
                <Button htmlType="submit" type="primary" loading={loading}>
                  {isLastStep ? 'Save' : 'Next'}
                </Button>
              </Space>
            </Space>
          </form>
        </FormProvider>
      </React.Fragment>
    </React.Fragment>
  );
};
