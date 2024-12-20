import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private asToken             : string = "";
    private aiTiempoExpiracion  : number = 1;   // Tiempo expiracion = 1hr, Pruebas con 1 min = 0.016

    constructor() { }

    public  isAuthenticated ( pbEmail : boolean, psEmail : string ) : boolean {

      var loToken = localStorage.getItem ( 'Token' );

      if ( loToken == null )            return false;

      this.asToken = loToken;

      if ( pbEmail ) {

        if ( !this.isEmail ( psEmail )) return false;

      }        

        if ( !this.isExpired() )        return false;

      return true;

    }

    private isEmail ( psEmail : string )  : boolean {

        var lsToken = this.asToken;

        //console.log ( lsToken );

        if ( lsToken == null || lsToken == '[null]' ) return true;
        else {

          var loToken = JSON.parse ( lsToken.toString() );

          var lsEmail = loToken [ 0 ][ "userName" ];

          if ( lsEmail != psEmail ) {

            localStorage.removeItem ( 'Token'             );
            localStorage.removeItem ( 'Time_login_milis'  );

            //console.log("Token guardado usuario diferente");

            return false;

          }

        }

        return true;

    }

    private isExpired()                   : boolean {

        this.aiTiempoExpiracion = this.aiTiempoExpiracion * 60 * 60 * 1000;

        var lsToken = this.asToken;

        if ( lsToken == null || lsToken == '[null]'  ) return false;
        else {

          var loToken = JSON.parse ( lsToken.toString() );

          var lsExpires = loToken [ 0 ][ ".expires" ];

          //console.log ( loToken );

          var dateNow       = new Date();
          var dateExpires   = new Date ( lsExpires );

          var milisNow        = dateNow.getTime();
          //var milisExpires    = dateExpires.getTime();
          var milisExpires    = localStorage.getItem ( 'Time_login_milis' );

          if (milisExpires == null)
            milisExpires = "0";

          var milisFaltantes  = ( parseInt ( milisExpires ) + this.aiTiempoExpiracion ) - milisNow;

          //console.log ( dateNow.getTime()     );
          //console.log ( dateExpires.getTime() );
          //console.log (( milisFaltantes / 1000) + " Seg" );

          if ( milisFaltantes <= 0 ) {

            localStorage.removeItem ( 'Token'             );
            localStorage.removeItem ( 'Time_login_milis'  );

            console.log("Token Expiro!");

            return false;

            

          }

        }

        return true;

    }

}
