export interface Roles {
  _id: string;
  id: string;
  name: string;
  permissions: string[];
}
export interface Publishers {
  _id: string;
  name: string;
  permissions: string[];
  role: string;
}
export interface UnsuccessAnswer {
  error: {
    msg: string;
    success: boolean;
  };
  headers: any;
}

export interface SuccessAnswer {
  success: boolean;
  userEdited: number;
  editedPerm?: number;
}

export interface AddRole {
  name: string;
  permissions: string[];
}
