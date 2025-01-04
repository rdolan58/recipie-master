import { Route } from "@angular/router";
import { BlankComponent } from "./blank/blank.component";
import { ProfileComponent } from "./profile/profile.component";


export const EXTRA_PAGES_ROUTE: Route[] = [
  {
    path: 'blank',
    component: BlankComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
];
