import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

// aggiunta

import { ExtraOptions, Routes } from '@angular/router';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
// fine aggiunta


@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
       
        // aggiunta
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module')
          .then(m => m.PagesModule),
      },
      {
        path: 'auth',
        component: NbAuthComponent,
        children: [
          {
            path: '',
            component: NbLoginComponent,
          },
          {
            path: 'login',
            component: NbLoginComponent,
          },
          {
            path: 'register',
            component: NbRegisterComponent,
          },
          {
            path: 'logout',
            component: NbLogoutComponent,
          },
          {
            path: 'request-password',
            component: NbRequestPasswordComponent,
          },
          {
            path: 'reset-password',
            component: NbResetPasswordComponent,
          },
        ],
      },
      ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED },
      
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
