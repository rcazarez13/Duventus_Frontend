export class Session {

  // -------------------------------------------------------
  // > DATOS QUE SE GUARDAN EN localStorage,
  // -------------------------------------------------------
      //DATOS: USUARIO
      public static _Email                  : string  = "";
      public static _IsCodigoResetPassword  : boolean = false;
      public static _CodigoResetPassword    : string  = "";

      //DATOS: PAGINA SELECCIONADA
      public static _MenuPadreSeleccionado  : string = "";
      public static _MenuHijoSeleccionado   : string = "";
      public static _MenuHijoIcono          : string = "";

  // -------------------------------------------------------
  //  > ACCESO A DATOS EN localStorage
  // -------------------------------------------------------

      //CARGA: DATOS DEL USUARIO ( localStorage/sessionStorage )
      public static getEmail()                  : string {

          var lsEmail = localStorage.getItem ( "_Email" );

          lsEmail     = ( lsEmail == null ) ? "" : lsEmail;

          return lsEmail;

      }

      public static getIsCodigoResetPassword()  : boolean {         

          var lbCodigoResetPassword = this.stringToBoolean ( sessionStorage.getItem ( "_IsCodigoResetPassword" )?.toString());

          lbCodigoResetPassword     = ( lbCodigoResetPassword == null ) ? false : lbCodigoResetPassword;

          return lbCodigoResetPassword;

      }

      public static getCodigoResetPassword()    : string {

          var lsCodigoResetPassword = sessionStorage.getItem ( "_CodigoResetPassword" );

          lsCodigoResetPassword     = ( lsCodigoResetPassword == null ) ? "" : lsCodigoResetPassword;

          return lsCodigoResetPassword;

      }


      //CARGA: DATOS PAGINA SELECCIONADA ( sessionStorage )
      public static getMenuPadreSeleccionado()  : string {

          var lsMenuPadreSeleccionado = sessionStorage.getItem ( "_MenuPadreSeleccionado" );

          lsMenuPadreSeleccionado     = ( lsMenuPadreSeleccionado == null ) ? "" : lsMenuPadreSeleccionado;

          return lsMenuPadreSeleccionado;

      }

      public static getMenuHijoSeleccionado()   : string {

          var lsMenuHijoSeleccionado = sessionStorage.getItem ( "_MenuHijoSeleccionado" );

          lsMenuHijoSeleccionado     = ( lsMenuHijoSeleccionado == null ) ? "" : lsMenuHijoSeleccionado;

          return lsMenuHijoSeleccionado;

      }

      public static getMenuHijoIcono()          : string {

          var lsMenuHijoIcono = sessionStorage.getItem ( "_MenuHijoIcono" );

          lsMenuHijoIcono     = ( lsMenuHijoIcono == null ) ? "" : lsMenuHijoIcono;

          return lsMenuHijoIcono;

      }

  // -------------------------------------------------------
  //  > GUARDADO DE DATOS EN localStorage
  // -------------------------------------------------------

      //GUARDADO: DATOS DEL USUARIO ( localStorage/sessionStorage )
      public static setEmail                  ( psEmail               : string  ) : boolean {

          // 1. Guardamos
          localStorage.setItem ( "_Email" , psEmail );

          // 2. Validamos
          var lsEmail     = localStorage.getItem ( "_Email" );

          // 3. Respondemos Ok o No
          if ( lsEmail == psEmail )
            return true;
          else
            return false;

      }

      public static setIsCodigoResetPassword  ( pbIsCode              : boolean )  : boolean {         

          // 1. Guardamos
            sessionStorage.setItem ( "_IsCodigoResetPassword" , String ( pbIsCode ));

          // 2. Validamos
            var lbCodigoResetPassword = sessionStorage.getItem ( "_IsCodigoResetPassword" );

          // 3. Respondemos Ok o No
            if ( String ( lbCodigoResetPassword ) == String ( pbIsCode ) )
              return true;
            else
              return false;

      }

      public static setCodigoResetPassword    ( psCode                  : string ) : boolean {

          // 1. Guardamos
          sessionStorage.setItem ( "_CodigoResetPassword" , psCode );

          // 2. Validamos
          var lsEmail     = sessionStorage.getItem ( "_CodigoResetPassword" );

          // 3. Respondemos Ok o No
          if ( lsEmail == psCode )
            return true;
          else
            return false;

      }


      //GUARDADO: DATOS PAGINA SELECCIONADA ( sessionStorage )
      public static setMenuPadreSeleccionado  ( psMenuPadreSeleccionado : string ) : boolean {

          // 1. Guardamos
          sessionStorage.setItem ( "_MenuPadreSeleccionado" , psMenuPadreSeleccionado );

          // 2. Validamos
          var lsMenuPadreSeleccionado     = sessionStorage.getItem ( "_MenuPadreSeleccionado" );

          // 3. Respondemos Ok o No
          if ( lsMenuPadreSeleccionado == psMenuPadreSeleccionado )
            return true;
          else
            return false;

      }

      public static setMenuHijoSeleccionado   ( psMenuHijoSeleccionado  : string ) : boolean {

          // 1. Guardamos
          sessionStorage.setItem ( "_MenuHijoSeleccionado" , psMenuHijoSeleccionado );

          // 2. Validamos
          var lsMenuHijoSeleccionado     = sessionStorage.getItem ( "_MenuHijoSeleccionado" );

          // 3. Respondemos Ok o No
          if ( lsMenuHijoSeleccionado == psMenuHijoSeleccionado )
            return true;
          else
            return false;

      }

      public static setMenuHijoIcono          ( psMenuHijoIcono         : string ) : boolean {

          // 1. Guardamos
          sessionStorage.setItem ( "_MenuHijoIcono" , psMenuHijoIcono );

          // 2. Validamos
          var lsMenuHijoIcono     = sessionStorage.getItem ( "_MenuHijoIcono" );

          // 3. Respondemos Ok o No
          if ( lsMenuHijoIcono == psMenuHijoIcono )
            return true;
          else
            return false;

      }

  // -------------------------------------------------------

      private static stringToBoolean ( stringValue : string | undefined ) : boolean {

          var lbResultado = false;

          switch ( stringValue?.toLowerCase().trim()){

            // -- TRUE --

            case "true":
              lbResultado = true;

              break;

            case "yes":
              lbResultado = true;

              break;

            case "1": 
              lbResultado = true;

              break;

            // -- FALSE --

            case "false":
              lbResultado = false;

              break;

            case "no":
              lbResultado = false;

              break;

            case "0":
              lbResultado = false;

              break;

            case null:
              lbResultado = false;

              break;

            case undefined:
                lbResultado = false;

              break;

          }

          return lbResultado;

      }

}
