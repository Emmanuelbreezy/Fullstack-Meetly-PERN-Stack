export type loginType = { email: string; password: string };
export type LoginResponseType = {
  message: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  accessToken: string;
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};
