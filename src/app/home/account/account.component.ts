import { Session } from '../../common/Session';
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SrvAccountService } from '../../servicios/srv-account.service';
import { AuthService } from '../../servicios/auth.service';
import { LoadingComponent } from '../loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatFormFieldModule, MatInputModule,
             MatButtonModule, MatListModule, MatDividerModule, FormsModule,
             MatCheckboxModule, RouterOutlet ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

    private dtResultado     : any;

    public _Email           : string  = "";
    public _Password        : string  = "";
    public _RememberMe      : boolean = false;

    private _isAuth         : boolean = false;

    public isChkRememberMe  : boolean = false;
    public isBtnLogin       : boolean = false;

    public isVentanaLogin           : boolean = true;
    public isVentanaForgotPassword  : boolean = false;

    constructor ( private aoSrvAccountService : SrvAccountService,
                  private aoToastGral         : ToastrService,
                  private aoRouter            : Router,
                  private route               : ActivatedRoute,
                  private aoAuth              : AuthService,

                  private aoLoading           : MatDialog ) { }

    ngOnInit(): void {  this.isRememberMe(); this.switchVentanas ( 1 ); }

    //---------------------------------
    // EVENTOS
  
    public  btnLogin_OnCLick() {

      //localStorage.removeItem('Token');

      this._isAuth = this.aoAuth.isAuthenticated ( true,this._Email );

      if ( this.ValidarCampos() ) { this.GetLogin(); }

    }

    public  btnForgotPassword_OnCLick() {

      if ( this.ValidarCampos() ) { this.GetForgotPassword(); }

    }

    public  switchVentanas  ( piVentana : number ) {

      if ( piVentana == 1 ){ // LOGIN

        this.isVentanaLogin           = true;
        this.isVentanaForgotPassword  = false;

      }

      if ( piVentana == 2 ){ // FORGOT PASSWORD

        this.isVentanaLogin           = false;
        this.isVentanaForgotPassword  = true;

      }

    }

    private isRememberMe() {

      var liRememberMe = localStorage.getItem ( "_RememberMe" );

      if ( liRememberMe == '1' ) {

        var lsEmail       = localStorage.getItem ( "_Email" );
        this._Email       = ( lsEmail == null ) ? "" : lsEmail ;

        var lsPassword    = localStorage.getItem ( "_Password" );
        this._Password    = ( lsPassword == null ) ? "" : lsPassword ;

        this._RememberMe  = true;

        return;

      }

    }

    public  checkRememebeMe() {

      if ( this.ValidarCampos() ) { if ( this._RememberMe ) {

                                        localStorage.setItem  ( "_RememberMe"  , '1'            );
                                        localStorage.setItem  ( "_Email"       , this._Email    );
                                        localStorage.setItem  ( "_Password"    , this._Password );

                                        return;

                                      }

                                      localStorage.removeItem ( "_RememberMe" );
                                      localStorage.removeItem ( "_Email"      );
                                      localStorage.removeItem ( "_Password"   );

                                   }

      this._RememberMe = false;

    }

    private ValidarCampos(): boolean {

      //VALIDAR CAMPOS EMAIL Y PASSWORD QUE NO ESTEN VACIOS
      if ( this._Email.length == 0 || this._Password.length == 0 ) {

        this.msjAlerta ( 2, "Please put Email / Password ..." );

        return false;

      }

        return true;

    }

    public  msjAlerta       ( piTipo : number, psMensaje: string ) {

      if ( piTipo == 1 )
        this.aoToastGral.success  ( psMensaje, 'Succes!', { positionClass:'toast-bottom-right'  });

      if ( piTipo == 2 )
        this.aoToastGral.error    ( psMensaje, 'Error!',  { positionClass:'toast-bottom-right'  });



    }

    //---------------------------------
    // METODOS CONSULTA

    private GetLogin() {

        this.aoLoading.open ( LoadingComponent, { data: { title:  "Loging...",
                                                          msj:    "Please wait, conecting with server."
                                                        },
                                                  disableClose: true
                                                });

        this.aoSrvAccountService.fbDatos.value.email      = this._Email;
        this.aoSrvAccountService.fbDatos.value.password   = this._Password;
        this.aoSrvAccountService.fbDatos.value.rememberMe = false;
        this.aoSrvAccountService.fbDatos.value.isauth     = this._isAuth;

        this.aoSrvAccountService.GetLogin()
          .subscribe ( respuesta => { this.dtResultado = JSON.parse ( respuesta.toString());

              this.aoLoading.closeAll();

              if ( this.dtResultado != null ) {

                //console.log ( this.dtResultado [ 0 ][ "RES_RESULTADO" ]);
                //console.log ( this.dtResultado [ 0 ][ "RES_MENSAJE"   ]);

                var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                var mensaje   = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                if ( resultado > 0 ) {  //this.aoToastGral.success ( "Login", mensaje );
                  this.aoToastGral.success ( "User : " + this._Email, "Login", { positionClass: 'toast-bottom-right' });

                                        if ( !this._isAuth ){

                                          var lsToken   = "[" + this.dtResultado [ 0 ][ "RES_TOKEN"   ] + "]";
                                          localStorage.setItem ( 'Token', lsToken.toString() );

                                          var dateNow   = new Date();
                                          var milisNow  = dateNow.getTime();

                                          localStorage.setItem ( 'Time_login_milis', milisNow.toString() );

                                        }
                                        
                                        this.checkRememebeMe();

                                        // Se guardara de cualquier forma email en caché para tener acceso a el
                                        // en cualquier momento.
                                        localStorage.setItem  ( "_Email"       , this._Email    );
                                        Session._Email = this._Email;

                                        //console.log ("Token >> " + localStorage.getItem ( 'Token' ));

                                        // CARGAR MENUS / DASHBOARD
                                        this.aoRouter.navigate ([ '/home/menu' ], { relativeTo: this.route });

                                        return;
                                     }
               
                this.aoToastGral.error ( mensaje, "Login Error!", { positionClass: 'toast-bottom-right' });

              }

          });

    }

    public  GetForgotPassword() {

      this.aoLoading.open ( LoadingComponent, { data: { title:  "Loging...",
                                                        msj:    "Please wait, conecting with server."
                                                      }
                                                });

        this.aoSrvAccountService.fbDatos.value.email    = this._Email;

        this.aoSrvAccountService.GetForgotPassword()
          .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

            this.aoLoading.closeAll();

              if ( this.dtResultado != null ) {

                //console.log ( this.dtResultado [ 0 ][ "RES_RESULTADO" ]);
                //console.log ( this.dtResultado [ 0 ][ "RES_MENSAJE"   ]);

                var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                var mensaje   = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                if ( resultado > 0 ) {  this.aoToastGral.success ( "Forgot Password", mensaje, { positionClass:'toast-bottom-right' });

                                        this.switchVentanas ( 1 );

                                        return;
                                     }
               
                this.aoToastGral.error( "Forgot Password Error!" , mensaje, { positionClass:'toast-bottom-right' });

              }

          });

    }

}

