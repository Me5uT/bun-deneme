import { formField } from './checkoutFormModel';

const { accountCode, provider, companySignature, description, message, name, originator, password, userCode, username } = formField;

export const formInitialValues = {
  [name.name]: '',
  [message.name]: '',
  [originator.name]: '',
  [password.name]: '',
  [accountCode.name]: '',
  [companySignature.name]: '',
  [provider.name]: null,
  [username.name]: '',
  [description.name]: '',
  [userCode.name]: '',
};
