export class User {
  id?: number;
  username!: string;
  password?: string;
  first_name!: string;
  last_name!: string;
  token?: string;
  //img?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string; // ISO timestamp format
  last_login?: string; // ISO timestamp format
  email?: string;
}