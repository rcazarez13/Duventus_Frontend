import { Injectable           } from '@angular/core';
import { Router, CanActivate  } from '@angular/router';
import { AuthService          } from './auth.service';

@Injectable ({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor ( private aoRouter : Router,
                private aoAuth   : AuthService ) { }

    canActivate()                : boolean {

      if ( !this.aoAuth.isAuthenticated ( false, "" )) {

        this.aoRouter.navigate([ '/home/account' ]);

        return false;

      }

      return true;

    }

}
