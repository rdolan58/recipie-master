export class User {
  id?: number;
  username!: string;
  password?: string;
  first_name!: string;
  last_name!: string;
  token?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string; // ISO timestamp format
  last_login?: string; // ISO timestamp format
  email?: string;

  roles?: string[]; // Array of roles
  permissions?: string[]; // Array of permissions

  profile_image?: string;
  profile_image_url?: string;

  // Additional fields for profile form
  phone?: string;
  bio?: string;
  social_media_links?: {
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
  };
}


// export class User {
//   id?: number;
//   username!: string;
//   password?: string;
//   first_name!: string;
//   last_name!: string;
//   token?: string;
//   //img?: string;
//   is_superuser?: boolean;
//   is_staff?: boolean;
//   is_active?: boolean;
//   date_joined?: string; // ISO timestamp format
//   last_login?: string; // ISO timestamp format
//   email?: string;

//   // Add roles and permissions
//   roles?: string[]; // Array of roles
//   permissions?: string[]; // Array of permissions

//   profile_image?: string;
//   profile_image_url?: string;
// }