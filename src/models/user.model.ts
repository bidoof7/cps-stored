export interface UserModel {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  role: string;
}

export const createUserModel = (
  data: Partial<UserModel>
): UserModel => {
  return {
    username: data.username!,
    password: data.password!,
    email: data.email!,
    first_name: data.first_name!,
    last_name: data.last_name!,
    photo: data.photo!,
    role: data.role!,
  };
};
