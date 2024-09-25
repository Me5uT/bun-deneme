import { formField } from './checkoutFormModel';

const { displayName, username, isExternal, mail, phone, sam, groups } = formField;

export const formInitialValues = {
  [displayName.name]: '',
  [username.name]: '',
  [isExternal.name]: false,
  [sam.name]: '',
  [phone.name]: '',
  [mail.name]: '',
  [groups.name]: [],
};
