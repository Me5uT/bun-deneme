import { IAdminModel, ITenant } from 'app/shared/model/tenant.model';
import { IVersion } from './version.model';

export interface ILicenceHistory {
  id?: number;
  uid?: string;
  licenceType?: number | null;
  licenceStatus?: number | null;
  totalUser?: number | null;
  usedTotalUser?: number | null;
  isCsaActive?: boolean | null;
  csaAmount?: number | null;
  usedCsaAmount?: number | null;
  expireDate?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  ownerAdmin?: IAdminModel | null;
  version?: IVersion | null;
}

export const defaultValue: Readonly<ILicenceHistory> = {
  isCsaActive: false,
  isActive: false,
  isDeleted: false,
};
