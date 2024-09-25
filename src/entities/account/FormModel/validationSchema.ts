import * as Yup from 'yup';
import { formField } from './checkoutFormModel';
import { LicenceTypeInt, TenantTypeInt } from 'app/shared/model/tenant.model';

const {
  name,
  partnerId,
  ownerMail,
  ownerFirstName,
  ownerLastName,
  alias,
  accountType,
  expireDate,
  licenceCount,
  licenceType,
  isSupportActive,
  mentis,
} = formField;

export default [
  Yup.object().shape({
    [name.name]: Yup.string().required('required'),
    [partnerId.name]: Yup.string().nullable(),
    [ownerMail.name]: Yup.string().email().required('required'),
    [ownerFirstName.name]: Yup.string().required('required'),
    [ownerLastName.name]: Yup.string().required('required'),
    [alias.name]: Yup.string().required('required'),
    [accountType.name]: Yup.mixed<TenantTypeInt>().nullable(),
  }),

  Yup.object().shape({
    [mentis.name]: Yup.boolean().required('required'),
    [licenceType.name]: Yup.mixed<LicenceTypeInt>().required('required'),
    [expireDate.name]: Yup.date().when([licenceType.name], ([licenceTypeValue], schema) => {
      return licenceTypeValue !== LicenceTypeInt.Demo ? schema.required('required') : schema.nullable();
    }),
    [licenceCount.name]: Yup.number().when([licenceType.name], ([licenceTypeValue], schema) => {
      return licenceTypeValue !== LicenceTypeInt.Demo ? schema.required('required') : schema.nullable();
    }),
  }),

  Yup.object().shape({
    [isSupportActive.name]: Yup.boolean().required('required'),
  }),
];
