export interface ISystemSetting {
  id?: number;
  uid?: string;
  parent_key?: string | null;
  key?: string | null;
  value?: string | null;
  value_type?: string | null;
  is_secret?: boolean;
  is_active?: boolean;
  is_deleted?: boolean;
  created_on?: string | null;
  created_date?: string | null;
  updated_on?: string | null;
  updated_date?: string | null;
}

export const defaultValue: Readonly<ISystemSetting> = {
  is_secret: false,
  is_active: false,
  is_deleted: false,
};
