import { Component, Inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { Session } from '../../../../../common/Session';
import { LoadingComponent } from '../../../../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FrmConfirmComponent } from '../../../frm-confirm/frm-confirm.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SrvConfigRolesService } from '../../../../../servicios/srv-config-roles.service';

export interface DialogDataRol {

  title       : string;
  msj         : string;

  acciontipo  : number;

  rol         : string;
  rolId       : string;

}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-rol-data',
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
  templateUrl: './rol-data.component.html',
  styleUrl: './rol-data.component.css',
})

export class RolDataComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtDatosUsers      : any;

    public  dtPermissions     : any;
    public  dtRequests        : any;

    public _AccionTipo        : number = 0;

    public _RolSelect         : string = "";

    public _RolId             : string = "";
    public _Rol               : string = "";

    public _IsBtnGuardar      : boolean = false;
    public _IsBtnLimpiar      : boolean = false;

    public _IsEnabledFields   : boolean = false;

    constructor ( public aoDialogRef                    : MatDialogRef < RolDataComponent >,
                  @Inject(MAT_DIALOG_DATA) public data  : DialogDataRol,

                  private aoLoading                     : MatDialog,
                  private aoToastGral                   : ToastrService,
                  private aoDialog                      : MatDialog,

                  private aoSrvConfigRolesService       : SrvConfigRolesService ) {        

        this._AccionTipo  = data.acciontipo;
        this._RolSelect   = data.rol;
        this._RolId       = data.rolId;

        this.Show();

        //console.log(this._AccionTipo + " | " + this._RolSelect);

    }

    ngOnInit()                  : void { this.GetRol(); this.GetPermissions(); this.GetRequests(); }

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
        // RECARGAR EL LISTADO DE ROLES
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

            this._RolId = "000";

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

    public BtnGuardar_OnClick       ( piSeccion : number )  : void {

        // SECCION 0: Datos de Usuario
        if ( piSeccion == 0 ){

            if ( this.ValidarCampos ( piSeccion ) ) {

                var lbResultado = false;

                // GUARDAR: NUEVO REGISTRO
                if ( this._AccionTipo == 0 )
                {

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Create Rol ?",
                                                                                            msj   : ""
                                                                                          },
                                                                                    width   : '372px',
                                                                                    height  : '200px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado )
                                                                          this.AddRol();

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
                                                                          this.SetRol();

                                                                      });
                }

            }

        }

        // SECCION 1: Datos de Permissions / Requests
        if ( piSeccion == 1 ){

            if ( this.ValidarCampos ( piSeccion ) ) {

                var lbResultado = false;

                // GUARDAR: NUEVO REGISTRO
                if ( this._AccionTipo == 0 )
                {

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Add ?",
                                                                                            msj   : "Add Permissions / Requests"
                                                                                          },
                                                                                    width   : '370px',
                                                                                    height  : '201px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado ){ this.SetPermissions();
                                                                                            this.SetRequests(); }

                                                                      });

                }

                // GUARDAR: EDICION REGISTRO
                if ( this._AccionTipo == 2 )
                {            

                    let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Save ?",
                                                                                            msj   : "Save Permissions / Requests"
                                                                                          },
                                                                                    width   : '370px',
                                                                                    height  : '201px'
                                                                                  });

                    dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                        if ( lbResultado ){ this.SetPermissions();
                                                                                            this.SetRequests(); }
                                                                          

                                                                      });
                }

            }

        }

    }

    public ValidarCampos            ( piSeccion : number )  : boolean {

        var lsTitulo;
        var lsError;

        // SECCION 0: Datos del Rol
        if ( piSeccion == 0 ){

            // Rol name
            this._Rol = this._Rol.trimStart().trimEnd();
            console.log("_Rol " + this._Rol);
            if (( this._Rol == "" ) || ( this._Rol == null ))
            {

                lsError   = "Rol Name Empty!";
                lsTitulo  = "Please write a Rol Name";

                this.aoToastGral.error ( lsTitulo, lsError, { positionClass: 'toast-bottom-right_inside' });

                return false;

            }
            
        }

        // SECCION 1: Datos de Permissions / Requests
        if ( piSeccion == 1 ){

            // Permissions
            var lbPermissionsChecked = false;
            for ( const actualRow of this.dtPermissions ) {

                var liActivo = actualRow [ "Permission"      ].valueOf();

                if ( liActivo > 0 ){

                  lbPermissionsChecked = true;

                  break;

                }

            }
            if ( !lbPermissionsChecked )
            {

                lsError   = "Permissions List Empty!";
                lsTitulo  = "Please check almost one permission";

                this.aoToastGral.error ( lsTitulo, lsError, { positionClass: 'toast-bottom-right_inside' });

                return false;

            }

            // Requests ( No son obligatorios... )
            /*
            var lbRequestsChecked = false;
            for ( const actualRow of this.dtRequests ) {

                var liActivo = actualRow [ "RES_ACTIVO"      ].valueOf();

                if ( liActivo > 0 ){

                  lbRequestsChecked = true;

                  break;

                }

            }
            if ( !lbRequestsChecked )
            {

                lsError   = "Requests List Empty!";
                lsTitulo  = "Please check almost one request";

                this.aoToastGral.error ( lsTitulo, lsError );

                return false;

            }
            */

        }

        return true;

    }

    public BtnLimpiar_OnClick       ( piSeccion : number )  : void {

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

    public LimpiaCampos             ( piSeccion : number )  : boolean {

        // SECCION 0: Datos del Rol
        if ( piSeccion == 0 ){

          this._Rol   = "";

        }

        // SECCION 1: Datos de Permissions / Requests
        if ( piSeccion == 1 ){

            // Limpiamos Roles
            for ( const actualRow of this.dtPermissions ) {

              actualRow [ "RES_ACTIVO" ] = 0;

            }

            // Limpiamos Locations
            for ( const actualRow of this.dtRequests ) {

              actualRow [ "RES_ACTIVO" ] = 0;

            }

        }

        return true;

    }

    public chkPermissions_OnChange  ( event     : MatCheckboxChange,  piPermission : number,
                                      pbParent  : boolean,            piMenuParentId : number ) {

        // Permissions
        // Seteamos Permission activado en dtPermissions
        for ( const actualRow of this.dtPermissions ) {

            var liMenuId      = actualRow [ "RES_MENU_ID"         ];
            var liMenuParent  = actualRow [ "RES_MENU_PARENT_ID"  ];

            if ( pbParent ){

                if ( piPermission == liMenuId ){

                      if ( event.checked )
                        actualRow [ "Permission"  ] = true;
                      else
                        actualRow [ "Permission"  ] = false;

                }

               if ( piMenuParentId == liMenuParent ){

                    if ( event.checked )
                      actualRow [ "Permission"  ] = true;
                    else
                      actualRow [ "Permission"  ] = false;

                }

            }
            else {

                if ( piPermission == liMenuId ){

                    if ( event.checked )
                      actualRow [ "Permission"  ] = true;
                    else
                      actualRow [ "Permission"  ] = false;

                }

            }
            

        }

    }

    public chkRequests_OnChange     ( event : MatCheckboxChange, psRequests   : string ) {

        // Requests
        // Seteamos location activado en dtRequests
        for ( const actualRow of this.dtRequests ) {

            var lsNombre = actualRow [ "RES_REQUEST_DESCRIPCION" ];

            if ( psRequests == lsNombre ){

                if ( event.checked )
                  actualRow [ "RES_ACTIVO"  ] = 1;
                else
                  actualRow [ "RES_ACTIVO"  ] = 0;

            }

        }

    }

    public BtnEliminar_OnClick()    : void {

        var lbResultado = false;

        let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Delete Rol ?",
                                                                                msj   : ""
                                                                              },
                                                                        width   : '372px',
                                                                        height  : '200px'
                                                                      });

        dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                            if ( lbResultado )
                                                              this.SetRolDelete();
                                                            else
                                                              this.Close();
                                                          });

    }

    //---------------------------------
    // SECCION: ROLES
    //---------------------------------

        //CONSULTA
        public  GetRol() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading Rol Data"                                                  
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol = this._RolSelect;

          this.aoSrvConfigRolesService.GetRol()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR ROL....

                                              //this.dtDatos = this.dtResultado;

                                              try { this._RolId   = this.dtResultado [ 0 ][ "RES_ROL_ID"  ].toString(); } catch { this._RolId = ""; }
                                              try { this._Rol     = this.dtResultado [ 0 ][ "RES_ROL"     ].toString(); } catch { this._Rol   = ""; }

                                              this.dtDatosUsers   = this.dtResultado;

                                              return;

                                         }

                    this.aoToastGral.error ( "Error loading Rol", "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error loading Rol", "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetRol() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving Rol Data"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol          = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.rolName      = this._Rol;
          this.aoSrvConfigRolesService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigRolesService.SetRol()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving Rol" , "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error saving Rol" , "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //ELIMINADO
        public  SetRolDelete() {

          //console.log ( "Loading roles ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Deleting...",
                                                                                msj   : "Deleting Rol"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol          = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigRolesService.SetRolDelete()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {  this.aoToastGral.success ( "Delete Rol succesfully!", "Delete User", { positionClass: 'toast-bottom-right_inside' });

                                            this.Close();

                                            return; }

                    this.aoToastGral.error ( "Error deleting Rol" , "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error deleting Rol" , "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //ADICION
        public  AddRol() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Adding ...",
                                                                                msj   : "Adding Rol"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol          = this._Rol;
          this.aoSrvConfigRolesService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigRolesService.AddRol()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado     = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                    var mensajeError  = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                    if ( resultado < 0 ) {  this.aoToastGral.error   ( mensajeError , "Error!", { positionClass: 'toast-bottom-right_inside' }); return; }

                    if ( resultado > 0 ) {  this._RolId     = this.dtResultado [ 0 ][ "RES_ROL_ID" ];
                                            this._RolSelect = this._Rol;

                                            this.aoToastGral.success ( "Add Rol succesfully!", "Save Rol", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error adding Rol" , "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error adding Rol" , "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

    //---------------------------------
    // SECCION: PERMISSIONS
    //---------------------------------

        //CONSULTA
        public  GetPermissions() {

          //console.log ( "Loading Permissions ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading Permissions"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol   = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.rolId = this._RolId;

          this.aoSrvConfigRolesService.GetPermissions()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR PERMISSIONS....

                                              this.dtPermissions = this.dtResultado;

                                              return;

                                         }

                    this.aoToastGral.error ( "Error!" , "Error loading Permissions", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Network Error!" , "Error loading Permissions", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetPermissions() {

          //console.log ( "Loading Permissions ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving Permissions Data"                                                        
                                                                              }

                                                                            });
          // -----------------------------------------------------
          // CREAMOS LISTA DE STRINGS SOLO CON PERMISSIONS SELECCIONADOS
          // -----------------------------------------------------
          var lstPermissions: object[] = []; 
          for ( const actualRow of this.dtPermissions ) {

              var lsMenuId = actualRow [ "RES_MENU_ID"      ];
              var lsNombre = actualRow [ "RES_MENU_NOMBRE"  ];
              var liActivo = actualRow [ "Permission"       ];

              if ( liActivo == true ){

                let loPermission = { _Id: lsMenuId, _Nombre: lsNombre };

                lstPermissions.push ( loPermission );

              }

          }

          var lsPermissions = JSON.stringify ( lstPermissions );
          // -----------------------------------------------------

          this.aoSrvConfigRolesService.fbDatos.value.rol          = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.rolId        = this._RolId;
          this.aoSrvConfigRolesService.fbDatos.value.permissions  = lsPermissions;
          this.aoSrvConfigRolesService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigRolesService.SetPermissions()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving rol Permissions" , "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error saving rol Permisions" , "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

    //---------------------------------
    // SECCION: REQUESTS
    //---------------------------------

        //CONSULTA
        public  GetRequests() {

          //console.log ( "Loading Requests ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Loading ...",
                                                                                msj   : "Loading Requests"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigRolesService.fbDatos.value.rol    = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.rolId  = this._RolId;

          this.aoSrvConfigRolesService.GetRequests()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR REQUESTS....

                                              this.dtRequests = this.dtResultado;

                                              return;

                                         }

                    this.aoToastGral.error ( "Error!" , "Error loading Requests", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Network Error!" , "Error loading Requests", { positionClass: 'toast-bottom-right_inside' });

              });

        }

        //GUARDADO
        public  SetRequests() {

          //console.log ( "Loading Requests ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Saving ...",
                                                                                msj   : "Saving Requests Data"                                                        
                                                                              }

                                                                            });
          // -----------------------------------------------------
          // CREAMOS LISTA DE STRINGS SOLO CON PERMISSIONS SELECCIONADOS
          // -----------------------------------------------------
          var lstRequests: object[] = []; 
          for ( const actualRow of this.dtRequests ) {

              var lsNombre = actualRow [ "RES_REQUEST_DESCRIPCION"  ];
              var liActivo = actualRow [ "RES_ACTIVO"               ];

              if ( liActivo == 1 ){

                let loRequest = { _Nombre: lsNombre };

                lstRequests.push ( loRequest );

              }

          }

          var lsRequests = JSON.stringify ( lstRequests );
          // -----------------------------------------------------

          this.aoSrvConfigRolesService.fbDatos.value.rol          = this._RolSelect;
          this.aoSrvConfigRolesService.fbDatos.value.rolId        = this._RolId;
          this.aoSrvConfigRolesService.fbDatos.value.requests     = lsRequests;
          this.aoSrvConfigRolesService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigRolesService.SetRequests()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) { this.aoToastGral.success ( "Save data succesfully!", "Save Data", { positionClass: 'toast-bottom-right_inside' }); return; }

                    this.aoToastGral.error ( "Error saving rol Requests" , "Error!", { positionClass: 'toast-bottom-right_inside' });

                    return;

                  }

                  this.aoToastGral.error ( "Error saving rol Requests" , "Network Error!", { positionClass: 'toast-bottom-right_inside' });

              });

        }

}
