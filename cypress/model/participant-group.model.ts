import { ITenant } from "./tenant.model";
import { IGateway } from "./gateway.model";

export interface IParticipantGroup {
  id?: number;
  uid?: string;
  name?: string | null;
  description?: string | null;
  participantGroupType?: number | null;
  ldapGroupDn?: string | null;
  syncPeriod?: number | null;
  isSyncWaiting?: boolean | null;
  lastSyncDate?: string | null;
  lastSyncStatus?: number | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: number | null;
  createdDate?: string | null;
  updatedOn?: number | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  gateway?: IGateway | null;
}

export const defaultValue: Readonly<IParticipantGroup> = {
  isSyncWaiting: false,
  isActive: false,
  isDeleted: false,
};
