export interface UserModel {
  email: string;
  username: string;
  subdomain: string;
  status: "active" | "blocked";
}

export interface User extends UserModel {
  id: any;
}
