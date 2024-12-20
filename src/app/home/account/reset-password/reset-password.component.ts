import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { SrvAccountService } from '../../../servicios/srv-account.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../../loading/loading.component';
import { Session } from '../../../common/Session';
import { FrmConfirmComponent } from '../../menu/frm-confirm/frm-confirm.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatFormFieldModule, MatInputModule,
             MatButtonModule, MatListModule, MatDividerModule, FormsModule,
             MatCheckboxModule ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

    private dtResultado       : any;

    public _Email             : string  = "";
    public _Password          : string  = "";
    public _ConfirmPassword   : string  = "";

    private _IsCodePassword   : boolean = false
    private _CodePassword     : string  = "";

    public isBtnResetPassword : boolean = false;

    constructor ( private aoSrvAccountService : SrvAccountService,
                  private aoToastGral         : ToastrService,
                  private aoRouter            : Router,
                  private route               : ActivatedRoute,

                  private aoLoading           : MatDialog,
                  private aoDialog            : MatDialog ) { }

    ngOnInit(): void {  /*this.getURLParams();*/ this.getParams(); }

    //---------------------------------
    // EVENTOS

    public  btnResetPasword_OnCLick() {

      if ( this.ValidarCampos() ) { this.GetResetPassword(); }

    }

    public  btnCancel_OnCLick() {

        var lbResultado = false;

        let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿Do You Wish to Cancel?",
                                                                                msj   : ""
                                                                              },
                                                                        width   : '370px',
                                                                        height  : '201px'
                                                                      });

        dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                            if ( lbResultado )
                                                              this.CancelResetPassword();

                                                          });

    }

    private CancelResetPassword() {

        var lbIsCodigoResetPassword = Session.getIsCodigoResetPassword();
        var lsCodigoResetPassword   = Session.getCodigoResetPassword();

        Session.setIsCodigoResetPassword  ( false );
        Session.setCodigoResetPassword    ( ''    );

        lbIsCodigoResetPassword   = Session.getIsCodigoResetPassword();
        var lsCodigoResetPassword = Session.getCodigoResetPassword();

        // SI LA VENTANA SE ABRIO DESDE DENTRO DEL SISTEMA...
        if ( this._IsCodePassword ){            

            // CARGAR MENUS / DASHBOARD
            this.aoRouter.navigate ([ '/home/menu' ], { relativeTo: this.route });

        }
        // SI LA VENTANA SE ABRIO DESDE EL LINK DEL CORREO...
        else {

            // CARGAR MENUS / DASHBOARD
            this.aoRouter.navigate ([ '/home' ], { relativeTo: this.route });

        }

    }

    private getParams() {

      var lbIsCodigoResetPassword = Session.getIsCodigoResetPassword();

      this._IsCodePassword        = lbIsCodigoResetPassword;

      if ( this._IsCodePassword ){

          var lsCodigoResetPassword = Session.getCodigoResetPassword();

          this._CodePassword  = lsCodigoResetPassword;

          this._Email         = Session.getEmail();

      }
      else
        this.getURLParams();      

    }

    private getURLParams() {

      // METODO ANTERIOR CUANDO NO SE USABA HASH ( # ) EN LA URL
      /*
      let loParams  = new URLSearchParams ( location.search );
      var lsCode    = loParams.get        ( 'code' );

      this._Code    = ( lsCode != null ) ? lsCode : "";      
      */

      // METODO ACTUAL CON USO DE HASH ( # ) EN LA URL

      var loURLOk   = document.location.toString().replace("/#/", "/");

      let loParams  = new URL       ( loURLOk ).searchParams;
      var lsCode    = loParams.get  ( "code" );

      this._CodePassword  = ( lsCode != null ) ? lsCode : "";

      /*
      console.log("loURLOk " + loURLOk);

      console.log("loParams " + loParams);

      console.log("lsCode " + lsCode);

      console.log("_Code " + this._Code);
      */

    }

    private ValidarCampos(): boolean {

      //VALIDAR CAMPOS EMAIL Y PASSWORD QUE NO ESTEN VACIOS

      if ( this._Email.length == 0 ) {

        this.msjAlerta ( 2, "Please put Email ..." );

        return false;

      }

      if (this._Password.length == 0 || this._ConfirmPassword.length == 0) {

        this.msjAlerta ( 2, "Please put Password / Confirm Password ..." );

        return false;

      }

      if ( this._Password != this._ConfirmPassword ) {

        this.msjAlerta ( 2, "Password / Confirm Password Mismatch..." );

        return false;

      }

      if ( this._CodePassword.length == 0 ) {

        this.msjAlerta ( 2, "Error null password code ..." );

        return false;

      }

        return true;

    }

    public  msjAlerta       ( piTipo : number, psMensaje: string ) {

      if ( piTipo == 1 )
        this.aoToastGral.success  ( psMensaje, 'Succes!', { positionClass:'toast-bottom-right' });

      if ( piTipo == 2 )
        this.aoToastGral.error    ( psMensaje, 'Error!', { positionClass:'toast-bottom-right' });

    }

    //---------------------------------
    // METODOS CONSULTA

    public  GetResetPassword() {

        this.aoLoading.open ( LoadingComponent, { data: { title:  "Loging...",
                                                          msj:    "Please wait, conecting with server."
                                                        }
                                                });

        this.aoSrvAccountService.fbDatos.value.email            = this._Email;        
        this.aoSrvAccountService.fbDatos.value.password         = this._Password;
        this.aoSrvAccountService.fbDatos.value.confirmPassword  = this._ConfirmPassword;
        this.aoSrvAccountService.fbDatos.value.code             = this._CodePassword;  

        this.aoSrvAccountService.GetResetPassword()
          .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

            this.aoLoading.closeAll();

              if ( this.dtResultado != null ) {

                console.log ( this.dtResultado [ 0 ][ "RES_RESULTADO" ]);
                console.log ( this.dtResultado [ 0 ][ "RES_MENSAJE"   ]);

                var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                var mensaje   = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                if ( resultado > 0 ) {  this.aoToastGral.success ( "Reset Password", mensaje, { positionClass:'toast-bottom-right' });

                                        if ( this._IsCodePassword ){

                                            // CARGAR MENU PRINCIPAL
                                            this.aoRouter.navigate ([ '/home/menu' ], { relativeTo: this.route });

                                        }                                          
                                        else {

                                            // CARGAR LOGIN
                                            this.aoRouter.navigate ([ '/home/account' ], { relativeTo: this.route });

                                        }

                                        return;

                                     }
               
                this.aoToastGral.error ( "Reset Password Error!" , mensaje, { positionClass:'toast-bottom-right' });

              }

          });

    }

}
