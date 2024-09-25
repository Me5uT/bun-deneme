import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space, StepProps, Steps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formInitialValues } from './FormModel/formInitialValues';
import validationSchema from './FormModel/validationSchema';
import { GroupForm } from './forms/GroupForm';
import { UserInfoForm } from './forms/UserInfoForm';
import { createEntity, resetErrorMessage } from './usertemp.reducer';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';

interface IAddAccountWizardProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
  searchParams: IQueryParams;
}

export const AddUserWizard: React.FC<IAddAccountWizardProps> = ({ setModalOpenClose, setResultModalOpenClose, searchParams }) => {
  const initialSteps: StepProps[] = [
    { title: 'User Info', status: 'wait' },
    { title: 'Group Info', status: 'wait' },
  ];

  const [steps, setSteps] = React.useState<StepProps[]>(initialSteps);
  const [activeStep, setActiveStep] = React.useState(0);

  const [baseObj] = useMirketPortal();
  const dispatch = useAppDispatch();
  const loading: boolean = useAppSelector(state => state.userTemp.loading);
  const errorMessage: string = useAppSelector(state => state.userTemp.errorMessage);

  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const _renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserInfoForm />;
      case 1:
        return <GroupForm />;

      default:
        return <div>{'Page not found'}</div>;
    }
  };

  const methods = useForm({
    defaultValues: formInitialValues,
    resolver: yupResolver(currentValidationSchema as any),
    mode: 'onSubmit',
  });

  const updateStepsStatus = () => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index === activeStep) {
          return { ...step, status: 'finish' };
        }
        return step;
      })
    );
  };

  const _handleSubmit = async (values: any) => {
    console.log('form values:', values);

    updateStepsStatus();
    if (isLastStep) {
      await dispatch(createEntity({ ...values, accountId: baseObj?.accountId, searchParams }));
      // _handleModalClose();
      setResultModalOpenClose(true);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const _handleModalClose = () => {
    methods.reset(); // Reset form fields
    setModalOpenClose(false);
    setActiveStep(0);
  };

  const _handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      dispatch(resetErrorMessage());
      _handleModalClose();
    }
  }, [errorMessage]);

  return (
    <React.Fragment>
      <Steps current={activeStep} items={items} style={{ display: 'flex', flexDirection: 'row', paddingTop: '-16px', flexWrap: 'wrap' }} />
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
              padding: '10px 5px',
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
