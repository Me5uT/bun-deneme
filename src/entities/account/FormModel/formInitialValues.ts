import { LicenceTypeInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import { formField } from './checkoutFormModel';

const {
  accountType,
  partnerId,
  name,
  expireDate,
  licenceType,
  licenceCount,
  ownerMail,
  ownerFirstName,
  ownerLastName,
  alias,
  isSupportActive,
  mentis,
} = formField;

export const formInitialValues = {
  [accountType.name]: TenantTypeInt.ENDUSER,
  [partnerId.name]: null,
  [name.name]: '',
  [ownerMail.name]: '',
  [ownerFirstName.name]: '',
  [ownerLastName.name]: '',
  [alias.name]: '',
  [expireDate.name]: null,
  [licenceCount.name]: null,
  [licenceType.name]: LicenceTypeInt.MFA,
  [mentis.name]: false,
  [isSupportActive.name]: true,
};
