import dayjs from 'dayjs';
import { ITenant } from 'app/shared/model/tenant.model';
import { IParticipant } from 'app/shared/model/participant.model';
import { IParticipantGroup } from 'app/shared/model/participant-group.model';

export interface IParticipantGroupRelation {
  id?: number;
  uid?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: number | null;
  createdDate?: string | null;
  updatedOn?: number | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  participants?: IParticipant[] | null;
  participantGroups?: IParticipantGroup[] | null;
}

export const defaultValue: Readonly<IParticipantGroupRelation> = {
  isActive: false,
  isDeleted: false,
};
