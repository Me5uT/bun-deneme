export interface IVersion {
  id?: number;
  uid?: string;
  name?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
}

export const defaultValue: Readonly<IVersion> = {
  isActive: false,
  isDeleted: false,
};
