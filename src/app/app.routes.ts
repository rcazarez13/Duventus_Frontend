/// <reference path="home/menu/menu-rmas/rmas-authorizers/rmas-authorizers.component.ts" />
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './servicios/auth-guard.service';
import { NgModule } from '@angular/core';

export const routes: Routes = [

  { path: '', redirectTo: '/home/account'     , pathMatch: 'full' },
  { path: 'home', redirectTo: '/home/account' , pathMatch: 'full' },

  { path: 'home',
    loadComponent: () => import ( './home/home.component' )
                                .then ( mod => mod.HomeComponent ),
    children: [

      //LOGIN                           | Aprox. Enero 2024
      { path: 'account', 
        loadComponent: () => import ( './home/account/account.component' )
                                    .then ( mod => mod.AccountComponent )
      },

      //RESET PASSWORD                  | Aprox. Enero 2024
      { path: 'account/reset-password',
        loadComponent: () => import ( './home/account/reset-password/reset-password.component' )
                                    .then ( mod => mod.ResetPasswordComponent )
      },

      //MENUS
      { path: 'menu',
        loadComponent: () => import ( './home/menu/menu.component' )
                                    .then ( mod => mod.MenuComponent ),
        canActivate: [ AuthGuard ],

        children: [

        // ***************************************************************************************************

        // AQUI SE AGREGAN LOS PERMISOS PARA ACCEDER A MENUS NUEVOS QUE SE VALLAN CREANDO...

        // ***************************************************************************************************

          //----------------------------------------------------
          // MENU > RMAs

            //----------------------------------------------------
            // SUBMENUS > Requests                                    | 13/09/2024
            {
              path: 'menu-rmas/rmas-requests',
              loadComponent: () => import('./home/menu/menu-rmas/rmas-requests/rmas-requests.component')
                                          .then( mod => mod.RmasRequestsComponent              ),
              canActivate: [ AuthGuard ],
            },

            //----------------------------------------------------
            // SUBMENUS > Authorizers                                 | 10/09/2024
            {
              path: 'menu-rmas/rmas-authorizers',
              loadComponent: () => import('./home/menu/menu-rmas/rmas-authorizers/rmas-authorizers.component')
                                          .then( mod => mod.RmasAuthorizersComponent              ),
              canActivate: [ AuthGuard ],
            },

            // ----------------------------------------------------
            // SUBMENUS > Search Serial Number / Search Spare Parts   | Aprox. Enero 2024

            { path: 'menu-rmas/rmas-search-serial-number',
              loadComponent: () => import('./home/menu/menu-rmas/rmas-search-serial-number/rmas-search-serial-number.component'  )
                                          .then( mod => mod.RmasSearchSerialNumberComponent  ),
              canActivate: [ AuthGuard ],
            },

            { path: 'menu-rmas/rmas-inventory',
              loadComponent: () => import('./home/menu/menu-rmas/rmas-inventory/rmas-inventory.component'                         )
                                          .then( mod => mod.RmasInventoryComponent            ),
              canActivate: [ AuthGuard ],
            },

          // ----------------------------------------------------
          // MENU > CONFIGURATION
          
            // ----------------------------------------------------
            // SUBMENUS > Users / Roles                               | Aprox. Enero 2024

            { path: 'menu-configuration/config-users',
              loadComponent: () => import ( './home/menu/menu-configuration/config-users/config-users.component' )
                                          .then ( mod => mod.ConfigUsersComponent ),
              canActivate: [ AuthGuard ],
            },

            { path: 'menu-configuration/config-roles',
              loadComponent: () => import ( './home/menu/menu-configuration/config-roles/config-roles.component' )
                                          .then ( mod => mod.ConfigRolesComponent ),
              canActivate: [ AuthGuard ],
            },

        // ***************************************************************************************************

        ]
      },

      //GUARANTEES CERTIFICATE          | 17/10/2024
      { path: 'guarantee-certificate',
        loadComponent: () => import('./home/guarantee-certificate/guarantee-certificate.component' )
                                    .then( mod => mod.GuaranteeCertificateComponent ),
        //canActivate: [ AuthGuard ],
      },

    ]
  }

];
