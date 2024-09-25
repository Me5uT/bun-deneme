import * as Yup from 'yup';
import { formField } from './checkoutFormModel';

const { accountCode, provider, companySignature, description, message, name, originator, password, userCode, username } = formField;

export default [
  Yup.object().shape({
    [name.name]: Yup.string().required('required'),
    [provider.name]: Yup.number().required('required'),
    [description.name]: Yup.string().nullable(),
  }),

  Yup.object().shape({
    [message.name]: Yup.string().nullable(),
    [userCode.name]: Yup.string().nullable(),
    [password.name]: Yup.string().nullable(),
    [companySignature.name]: Yup.string().nullable(),
    [username.name]: Yup.string().nullable(),
    [originator.name]: Yup.string().nullable(),
    [accountCode.name]: Yup.string().nullable(),
  }),
];
