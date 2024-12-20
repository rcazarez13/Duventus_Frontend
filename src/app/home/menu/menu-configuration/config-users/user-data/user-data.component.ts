import { Component, Inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { SrvConfigUsersService } from '../../../../../servicios/srv-config-users.service';
import { Session } from '../../../../../common/Session';
import { LoadingComponent } from '../../../../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FrmConfirmComponent } from '../../../frm-confirm/frm-confirm.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

export interface DialogData {

  title       : string;
  msj         : string;

  acciontipo  : number;

  email       : string;

}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css',
})

export class UserDataComponent {

    private dtResultado       : any;
    public  dtDatos           : any;

    public  dtRoles           : any;
    public  dtLocations       : any;

    public _AccionTipo        : number = 0;

    public _EmailUserSelect   : string = "";

    public _UserId            : string = "";
    public _FirstName         : string = "";
    public _LastName          : string = "";
    public _GPUser            : string = "";
    public _GPSLPRSNID        : string = "";
    public _Email             : string = "";
    public _Telephone         : string = "";
    public _Status            : string = "";

    public _IsBtnGuardar      : boolean = false;
    public _IsBtnLimpiar      : boolean = false;

    public _IsEnabledFields   : boolean = false;

    constructor ( public aoDialogRef                    : MatDialogRef < UserDataComponent >,
                  @Inject(MAT_DIALOG_DATA) public data  : DialogData,

                  private aoLoading                     : MatDialog,
                  private aoToastGral                   : ToastrService,
                  private aoDialog                      : MatDialog,

                  private aoSrvConfigUsersService       : SrvConfigUsersService ) {        

        this._AccionTipo      = data.acciontipo;
        this._EmailUserSelect = data.email;

        this.Show();

        //console.log(this._AccionTipo + " | " + this._RolSelect);

    }

    ngOnInit()                  : void { this.GetUser(); this.GetRoles(); this.GetLocations(); }

    //---------------------------------
    // EVENTOS
    //---------------------------------

    public Show()               : void {

        $( '.loading' ).fadeIn ( 'slow' );

        this.BtnsAccionTipo();

    }

    public Close()              : void {     

        //console.log("close..");
        var lbResultado = false;

        // SI ES DIFERENTE A LA ACCION DE VISUALIZAR
        // ENVIAREMOS PERMISO PARA PODER RECARGAR
        // RECARGAR EL LISTADO DE USUARIOS
        if ( this._AccionTipo != 1 )
          lbResultado = true;

        this.aoDialogRef.close ( lbResultado );

        $('.loading').fadeOut('slow');

    }

    public BtnsAccionTipo()     : void {

        //console.log("_AccionTipo > " + this._AccionTipo);

        switch ( this._AccionTipo ) {

          // NUEVO REGISTRO
          case 0: 

            this._IsEnabledFields = true;
            //console.log("_IsEnabledFields > " + this._IsEnabledFields);
            this._IsBtnGuardar = true;
            this._IsBtnLimpiar = true;

            this._UserId = "000";
            this._Status = "Active";

            break;

          // VER REGISTRO
          case 1: 

            this._IsEnabledFields = false;
            //console.log("_IsEnabledFields > " + this._IsEnabledFields);
            this._IsBtnGuardar = false;
            this._IsBtnLimpiar = false;

            break;

          // EDITAR REGISTRO
          case 2: 

            this._IsEnabledFields = true;
            //console.log("_IsEnabledFields > " + this._IsEnabledFields);
            this._IsBtnGuardar = true;
            this._IsBtnLimpiar = false;

            break;

          // ELIMINAR REGISTRO
          case 3: 

            this._IsEnabledFields = false;
            //console.log("_IsEnabledFields > " + this._IsEnabledFields);
            this._IsBtnGuardar = false;
            this._IsBtnLimpiar = false;

            this.BtnEliminar_OnClick();

            break;

        }

    }

    public BtnGuardar_OnClick     ( piSeccion : number )  : void {

        // SECCION 0: Datos de Usuario
        if ( piSeccion == 0 ){

            if ( this.ValidarCampos ( piSeccion ) ) {

                var lbResultado = false;

                // GUARDAR: NUEVO REGISTRO
                if ( this._AccionTipo == 0 )
                {

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Create User ?",
                                                                                            msj   : ""
                                                                                          },
                                                                                    width   : '372px',
                                                                                    height  : '200px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado )
                                                                          this.AddUser();

                                                                      });

                }

                // GUARDAR: EDICION REGISTRO
                if ( this._AccionTipo == 2 )
                {            

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Save Data ?",
                                                                                            msj   : ""
                                                                                          },
                                                                                    width   : '372px',
                                                                                    height  : '200px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado )
                                                                          this.SetUser();

                                                                      });
                }

            }

        }

        // SECCION 1: Datos de Roles / Locations
        if ( piSeccion == 1 ){

            if ( this.ValidarCampos ( piSeccion ) ) {

                var lbResultado = false;

                // GUARDAR: NUEVO REGISTRO
                if ( this._AccionTipo == 0 )
                {

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Add ?",
                                                                                            msj   : "Adding Roles / Locations"
                                                                                          },
                                                                                    width   : '370px',
                                                                                    height  : '201px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado ){ this.SetRoles();
                                                                                            this.SetLocations(); }

                                                                      });

                }

                // GUARDAR: EDICION REGISTRO
                if ( this._AccionTipo == 2 )
                {            

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Save ?",
                                                                                            msj   : "Save Roles / Locations"
                                                                                          },
                                                                                    width   : '370px',
                                                                                    height  : '201px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado ){ this.SetRoles();
                                                                                            this.SetLocations(); }
                                                                          

                                                                      });
                }

            }

        }

    }

    public ValidarCampos          ( piSeccion : number )  : boolean {

        var lsTitulo;
        var lsError;

        // SECCION 0: Datos de Usuario
        if ( piSeccion == 0 ){

            // First name
            this._FirstName = this._FirstName.trimStart().trimEnd();
            console.log("lsFirstName" + this._FirstName);
            if (( this._FirstName == "" ) || ( this._FirstName == null ))
            {

              lsError   = "First Name Empty!";
              lsTitulo  = "Please write a First Name";

              this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

              return false;

            }        

            // Last name
            this._LastName = this._LastName.trimStart().trimEnd();
            if (( this._LastName == "" ) || ( this._LastName == null ))
            {

              lsError   = "Last Name Empty!";
              lsTitulo  = "Please write a Last Name";

              this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

              return false;

            }

            // Email name
            this._Email = this._Email.trimStart().trimEnd();
            if (( this._Email == "" ) || ( this._Email == null ))
            {

              lsError   = "Email Empty!";
              lsTitulo  = "Please write an Email";

              this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

              return false;

            }

            // Telephone name
            /* Se solicito que validacion de telefono no fuera obligatoria
            this._Telephone = this._Telephone.trimStart().trimEnd();
            if (( this._Telephone == "" ) || ( this._Telephone == null ))
            {

              lsError   = "Phone Number Empty!";
              lsTitulo  = "Please write a Phone Number";

              this.aoToastGral.error ( lsTitulo, lsError );

              return false;

            }
            */

        }

        // SECCION 1: Datos de Roles / Locations
        if ( piSeccion == 1 ){

            // Roles
            var lbRolesChecked = false;
            for ( const actualRow of this.dtRoles ) {

                var liActivo = actualRow [ "RES_ACTIVO"      ].valueOf();

                if ( liActivo > 0 ){

                  lbRolesChecked = true;

                  break;

                }

            }
            if ( !lbRolesChecked )
            {

                lsError   = "Roles List Empty!";
                lsTitulo  = "Please check almost one role";

                this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

                return false;

            }

            // Locations
            var lbLocationsChecked = false;
            for ( const actualRow of this.dtLocations ) {

                var liActivo = actualRow [ "RES_ACTIVO"      ].valueOf();

                if ( liActivo > 0 ){

                  lbLocationsChecked = true;

                  break;

                }

            }
            if ( !lbLocationsChecked )
            {

                lsError   = "Locations List Empty!";
                lsTitulo  = "Please check almost one location";

                this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

                return false;

            }


        }

        return true;

    }

    public BtnLimpiar_OnClick     ( piSeccion : number ) : void {

        var lbResultado = false;

        let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Clean Fields ?",
                                                                                msj   : ""
                                                                              },
                                                                        width   : '372px',
                                                                        height  : '200px'
                                                                      });

        dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                            if ( lbResultado )
                                                              this.LimpiaCampos ( piSeccion );

                                                          });

    }

    public LimpiaCampos           ( piSeccion : number )       : boolean {

        // SECCION 0: Datos de Usuario
        if ( piSeccion == 0 ){

          this._FirstName   = "";
          this._LastName    = "";
          this._GPUser      = "";
          this._GPSLPRSNID  = "";
          this._Email       = "";
          this._Telephone   = "";
          //this._Status      = "";

        }

        // SECCION 1: Datos de Roles / Locations
        if ( piSeccion == 1 ){

            // Limpiamos Roles
            for ( const actualRow of this.dtRoles ) {

              actualRow [ "RES_ACTIVO" ] = 0;

            }

            // Limpiamos Locations
            for ( const actualRow of this.dtLocations ) {

              actualRow [ "RES_ACTIVO" ] = 0;

            }

        }

        return true;

    }

    public chkRoles_OnChange      ( event : MatCheckboxChange, psRol      : string ) {

        // Roles
        // Seteamos rol activado en dtPermissions
        for ( const actualRow of this.dtRoles ) {

            var lsNombre = actualRow [ "RES_ROL" ];

            if ( psRol == lsNombre ){

                if ( event.checked )
                  actualRow [ "RES_ACTIVO"  ] = 1;
                else
                  actualRow [ "RES_ACTIVO"  ] = 0;

            }

        }

    }

    public chkLocations_OnChange  ( event : MatCheckboxChange, psLocation : string ) {

        // Locations
        // Seteamos location activado en dtRequests
        for ( const actualRow of this.dtLocations ) {

            var lsNombre = actualRow [ "RES_LOCATION" ];

            if ( psLocation == lsNombre ){

                if ( event.checked )
                  actualRow [ "RES_ACTIVO"  ] = 1;
                else
                  actualRow [ "RES_ACTIVO"  ] = 0;

            }

        }

    }

    public BtnEliminar_OnClick()    : void {

        var lbResultado = false;

        let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Delete User ?",
                                                                                msj   : ""
                                                                              },
                                                                        width   : '372px',
                                                                        height  : '200px'
                                                                      });

        dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                            if ( lbResultado )
                                                              this.SetUserDelete();
                                                            else
                                                              this.Close();
                                                          });

    }

    //---------------------------------
    // SECCION: USUARIOS
    //---------------------------------

        //CONSULTA
        public  GetUser() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading User Data"                                                  
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user   = this._EmailUserSelect;

          this.aoSrvConfigUsersService.GetUser()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if ( resultado > 0 ) {    // CARGAR USER....

                                              //this.dtDatos = this.dtResultado;

                                              this._UserId      = this.dtResultado [ 0 ][ "UserId"      ].valueOf();

                                              try { this._FirstName   = this.dtResultado [ 0 ][ "FirstName"   ].toString(); } catch { this._FirstName   = ""; }
                                              try { this._LastName    = this.dtResultado [ 0 ][ "LastName"    ].toString(); } catch { this._LastName    = ""; }
                                              try { this._GPUser      = this.dtResultado [ 0 ][ "GPUser"      ].toString(); } catch { this._GPUser      = ""; }
                                              try { this._GPSLPRSNID  = this.dtResultado [ 0 ][ "GPSLPRSNID"  ].toString(); } catch { this._GPSLPRSNID  = ""; }
                                              try { this._Email       = this.dtResultado [ 0 ][ "Email"       ].toString(); } catch { this._Email       = ""; }
                                              try { this._Telephone   = this.dtResultado [ 0 ][ "Telephone"   ].toString(); } catch { this._Telephone   = ""; }
                                              try { this._Status      = this.dtResultado [ 0 ][ "Status"      ].toString(); } catch { this._Status      = ""; }

                                              return;

                                         }

                    this.aoToastGral.error ( "Error!", "Error loading user", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                this.aoToastGral.error ( "Network Error!", "Error loading user", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetUser() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving User Data"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._EmailUserSelect;

          this.aoSrvConfigUsersService.fbDatos.value.FirstName    = this._FirstName;
          this.aoSrvConfigUsersService.fbDatos.value.LastName     = this._LastName;
          this.aoSrvConfigUsersService.fbDatos.value.GPUser       = this._GPUser;
          this.aoSrvConfigUsersService.fbDatos.value.GPSLPRSNID   = this._GPSLPRSNID;
          this.aoSrvConfigUsersService.fbDatos.value.Email        = this._Email;
          this.aoSrvConfigUsersService.fbDatos.value.Telephone    = this._Telephone;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.SetUser()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if (resultado > 0) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving user", "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                this.aoToastGral.error ( "Error saving user", "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //ELIMINADO
        public  SetUserDelete() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Deleting...",
                                                                                msj   : "Deleting User"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._EmailUserSelect;
          this.aoSrvConfigUsersService.fbDatos.value.statusDes    = this._Status;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.SetUserDelete()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if ( resultado > 0 ) { try {  this._Status      = this.dtResultado [ 0 ][ "Status"      ].toString(); } catch { this._Status      = ""; }
                  
                      this.aoToastGral.success ( "Delete User succesfully!", "Delete User", { positionClass: 'toast-bottom-right_inside' });

                                                  return; }

                    this.aoToastGral.error ( "Error deleting user", "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                this.aoToastGral.error ( "Error deleting user", "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //ADICION
        public  AddUser() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Adding ...",
                                                                                msj   : "Adding User"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._Email;

          this.aoSrvConfigUsersService.fbDatos.value.FirstName    = this._FirstName;
          this.aoSrvConfigUsersService.fbDatos.value.LastName     = this._LastName;
          this.aoSrvConfigUsersService.fbDatos.value.GPUser       = this._GPUser;
          this.aoSrvConfigUsersService.fbDatos.value.GPSLPRSNID   = this._GPSLPRSNID;
          this.aoSrvConfigUsersService.fbDatos.value.Email        = this._Email;
          this.aoSrvConfigUsersService.fbDatos.value.Telephone    = this._Telephone;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.AddUser()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado     = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                    var mensajeError  = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                    if (resultado < 0) { this.aoToastGral.error ( mensajeError, "Error!", { positionClass: 'toast-bottom-right_inside' }); return; }

                    if ( resultado > 0 ) {  this._UserId = resultado;

                                            this._EmailUserSelect = this._Email;

                      this.aoToastGral.success ( "Add user succesfully!", "Save User", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error adding user" , "Error!", { positionClass:'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error adding user" , "Network Error!", { positionClass:'toast-bottom-right' });

              });

        }

    //---------------------------------
    // SECCION: ROLES
    //---------------------------------

        //CONSULTA
        public  GetRoles() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading Roles"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user   = this._EmailUserSelect;

          this.aoSrvConfigUsersService.GetRoles()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR ROLES....

                                              this.dtRoles = this.dtResultado;

                                              return;

                                         }

                    this.aoToastGral.error ( "Error!", "Error loading roles", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                this.aoToastGral.error ( "Network Error!", "Error loading roles", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetRoles() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving Roles Data"                                                        
                                                                              }

                                                                            });
          // -----------------------------------------------------
          // CREAMOS LISTA DE STRINGS SOLO CON ROLES SELECCIONADOS
          // -----------------------------------------------------
          var lstRoles: object[] = []; 
          for ( const actualRow of this.dtRoles ) {

              var lsNombre = actualRow [ "RES_ROL"    ];
              var liActivo = actualRow [ "RES_ACTIVO" ];

              if ( liActivo == 1 ){

                let loRol = { _Nombre: lsNombre };

                lstRoles.push ( loRol );

              }

          }

          var lsRoles = JSON.stringify(lstRoles);
          // -----------------------------------------------------

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._EmailUserSelect;
          this.aoSrvConfigUsersService.fbDatos.value.roles        = lsRoles;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.SetRoles()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if (resultado > 0) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving user roles" , "Error!", { positionClass:'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error saving user roles" , "Network Error!", { positionClass:'toast-bottom-right_inside' });

              });

        }

    //---------------------------------
    // SECCION: LOCATIONS
    //---------------------------------

        //CONSULTA
        public  GetLocations() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading Locations"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user   = this._EmailUserSelect;

          this.aoSrvConfigUsersService.GetLocations()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR LOCATIONS....

                                              this.dtLocations = this.dtResultado;

                                              return;

                                         }

                    this.aoToastGral.error ( "Error!", "Error loading locations", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                this.aoToastGral.error ( "Network Error!", "Error loading locations", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetLocations() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving Locations Data"                                                        
                                                                              }
                                                                      });

          // -----------------------------------------------------
          // CREAMOS LISTA DE STRINGS SOLO CON LOCATIONS SELECCIONADOS
          // -----------------------------------------------------
          var lstLocations: object[] = []; 
          for ( const actualRow of this.dtLocations ) {

              var lsNombre = actualRow [ "RES_LOCATION" ];
              var liActivo = actualRow [ "RES_ACTIVO"   ];

              if ( liActivo == 1 ){

                let loLocation = { _Nombre: lsNombre };

                lstLocations.push ( loLocation );

              }

          }

          var lsLocations = JSON.stringify ( lstLocations );
          // -----------------------------------------------------

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._EmailUserSelect;
          this.aoSrvConfigUsersService.fbDatos.value.locations    = lsLocations;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.SetLocations()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if (resultado > 0) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving user locations" , "Error!", { positionClass:'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error saving user locations" , "Network Error!", { positionClass:'toast-bottom-right_inside' });

              });

        }


}
