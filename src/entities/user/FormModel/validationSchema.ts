import * as Yup from 'yup';
import { formField } from './checkoutFormModel';

const { displayName, username, mail, phone, isExternal, groups, sam } = formField;

export default [
  Yup.object().shape({
    [displayName.name]: Yup.string().required(displayName.requiredErrorMsg),
    [username.name]: Yup.string().required(username.requiredErrorMsg),
    [mail.name]: Yup.string().email().required(mail.requiredErrorMsg),
    [phone.name]: Yup.string().nullable(),
    [isExternal.name]: Yup.boolean(),
    [sam.name]: Yup.string().required(sam.requiredErrorMsg),
  }),

  Yup.object().shape({
    [groups.name]: Yup.array()
      .of(
        Yup.object().shape({
          groupUid: Yup.string().required('Group ID is required'),
        })
      )
      .nullable(),
  }),
];
