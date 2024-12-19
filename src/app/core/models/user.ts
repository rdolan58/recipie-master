export class User {
  id!: number;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  img!: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string; // ISO timestamp format
}

