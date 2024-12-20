import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SrvAccountService } from '../../servicios/srv-account.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Session } from '../../common/Session';
import { UserDataComponent } from './menu-configuration/config-users/user-data/user-data.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    MatExpansionModule,
    RouterOutlet,
    RouterLink,
    MatMenuModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class MenuComponent {

  private dtResultado : any;
  public  dtMenus     : any;

  public  _Email                    : string  = "";
  public  _CodigoResetPassword      : string  = "";

  public  abShowSubmenu             : boolean = false;
  public  abMenus                   : boolean = false;

  public  asMenuPadreSeleccionado   : string  = "";
  public  asMenuHijoSeleccionado    : string  = "";
  public  asMenuHijoIcono           : string  = "";

  public  asRutaSeleccionada        : string  = "";

  constructor ( private aoSrvAccountService : SrvAccountService,
                private aoToastGral         : ToastrService,
                private aoRouter            : Router,
                private route               : ActivatedRoute,
                private aoLoading           : MatDialog,
                private aoDialog            : MatDialog ) { }

  ngOnInit()    : void { this.GetMenus(); this.CheckSelectedRoute ( "","", "fa fa-home", false ); }

  //---------------------------------
  // EVENTOS

    public  CheckSelectedRoute  ( psMenuPadre: string, psMenuHijo: string, psMenuHijoIcono : string, pbIsMenuClick : boolean ): void {

      if ( pbIsMenuClick ){

          Session.setMenuPadreSeleccionado  ( psMenuPadre );
          Session.setMenuHijoSeleccionado   ( psMenuHijo );
          Session.setMenuHijoIcono          ( psMenuHijoIcono );

      }   

      this.asMenuPadreSeleccionado  = Session.getMenuPadreSeleccionado();
      this.asMenuHijoSeleccionado   = Session.getMenuHijoSeleccionado();
      this.asMenuHijoIcono          = Session.getMenuHijoIcono();

      if ( this.asMenuPadreSeleccionado != "" && this.asMenuHijoSeleccionado != "" )
        this.asRutaSeleccionada = this.asMenuPadreSeleccionado + " > " + this.asMenuHijoSeleccionado;
      else {
        this.asRutaSeleccionada     = " HVAC Mirage Inc.";
        this.asMenuHijoSeleccionado = " HVAC Mirage Inc.";
      }

      // PARA CERRAR BARRA LATERAL UNA VES QUE SE HALLA HECHO CLICK
      // EN ALGUN SUB MENU...
      this.abMenus = false;

    }

    public  btnMenu_click       ( psnName : string ) {

      console.log ( "click >> " + psnName );

      if ( psnName == "user"  ) { this.GetUserData(); return; }

      if ( psnName == "logout"  ) { this.GetLogOut(); return; }

    }

    private GetUserData() {
        /*
          0 : Nuevo Usuario
          1 : Ver Usuario
          2 : Editar Usuario
          3 : Eliminar Usuario
        */

        let liAccionTipo  : number = 1;
        let lsEmailUser   : string = Session.getEmail();

        let dlgConfirmRef = this.aoDialog.open ( UserDataComponent, { data: { title: "Loading ...",
                                                                              msj: "Loading User Data",

                                                                              acciontipo: 1,

                                                                              email: lsEmailUser
                                                                            },

                                                                        width: '672px',
                                                                        height: '492px'

                                                                      });


    }

    public  btnResetPasword_OnCLick() {

        this.GetCodigoResetPassword();

    }

  //---------------------------------
  // SECCION: CONSULTAS
  //---------------------------------

    // CONSULTA: RESET CONSULTA RESET PASSWORD
    public GetCodigoResetPassword() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Generating Password Code"
                                                          }
          });

          this.aoSrvAccountService.fbDatos.value.email = Session.getEmail();

          this.aoSrvAccountService.GetCodigoResetPassword()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {  this._CodigoResetPassword = this.dtResultado [ 0 ][ "RES_CODIGO_RESET_PASSWORD" ];

                                            Session.setIsCodigoResetPassword  ( true      );
                                            Session.setCodigoResetPassword    ( this._CodigoResetPassword  );

                                            // CARGAR RESET PASSWORD
                                            this.aoRouter.navigate ([ '/home/account/reset-password' ], { relativeTo: this.route });

                                            return;
                                          }

                    this.aoToastGral.error ( "Error Generating Password Code.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error Generating Password Code.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

    // CONSULTA: OBTENER MENUS
    public  GetMenus() {

      console.log ( "Loading user ..." );

      this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                        msj:    "Loading user menus"
                                                      }
                                                });

      var lsEmail       = localStorage.getItem ( "_Email" );
      this._Email       = ( lsEmail == null ) ? "" : lsEmail ;

      //this.aoSrvAccountService.fbDatos.value.email = Session._EmailUserSelect;
      this.aoSrvAccountService.fbDatos.value.email = this._Email;

      this.aoSrvAccountService.GetMenus()
          .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

            this.aoLoading.closeAll();

              if ( this.dtResultado != null ) {

                console.log ( this.dtResultado [ 0 ][ "RES_RESULTADO" ]);

                var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                if ( resultado > 0 ) {    // CARGAR MENUS....
                                          this.dtMenus = this.dtResultado;

                                          return;
                                     }

                this.aoToastGral.error ( "Error loading user menus.", "Error!", { positionClass:'toast-bottom-right' });

                return;

              }

              this.aoToastGral.error ( "Error loading user menus.", "Network Error!", { positionClass:'toast-bottom-right' });

          });

    }

    // LOGOUT
    public  GetLogOut() {

      console.log ( "logging out..." );

      this.aoLoading.open ( LoadingComponent, { data: { title:  "Logging Out...",
                                                        msj:    ""
                                                      }
                                                });

        this.aoSrvAccountService.GetLogOut()
          .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

            this.aoLoading.closeAll();

              if ( this.dtResultado != null ) {

                //console.log ( this.dtResultado [ 0 ][ "RES_RESULTADO" ]);
                //console.log ( this.dtResultado [ 0 ][ "RES_MENSAJE"   ]);

                var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                var mensaje   = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                if ( resultado > 0 ) {  localStorage.removeItem ( 'Token'             );
                                        localStorage.removeItem ( 'Time_login_milis'  );

                                        Session.setMenuPadreSeleccionado  ( '' );
                                        Session.setMenuHijoSeleccionado   ( '' );
                                        Session.setMenuHijoIcono          ( '' );

                                        Session.setIsCodigoResetPassword  ( false );
                                        Session.setCodigoResetPassword    ( ''    );

                                        // CARGAR MENUS / DASHBOARD
                                        this.aoRouter.navigate ([ '/home' ], { relativeTo: this.route });

                                        return;
                                     }
               
                this.aoToastGral.error( "Forgot Password Error!" , mensaje, { positionClass:'toast-bottom-right' });

              }

          });

    }

}
