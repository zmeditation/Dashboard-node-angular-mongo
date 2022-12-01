export type AccountManager = {
  id?: string;
  _id: string;
  name: string;
  role: string;
}

export type User = {
  id: string;
  _id: string;
  name: string;
  role: string;
}

export type TestUserType = {
  id: string | number;
  uuid: string | number;
  name: string;
  is_test: boolean;
};
