import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../../../loading/loading.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { SrvRmasAuthorizersService } from '../../../../servicios/srv-rmas-authorizers.service';
import { Session } from '../../../../common/Session';
import { FrmConfirmComponent } from '../../frm-confirm/frm-confirm.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-rmas-authorizers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatDividerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './rmas-authorizers.component.html',
  styleUrl: './rmas-authorizers.component.css'
})
export class RmasAuthorizersComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public dtLocations       : any;
    public dtUsers           : any;

    public  _Id               : number = 0;
    public  _Location         : number = 0;
    public  _User             : number = 0;
    public  _Status           : number = 0;

    // ATRIBUTOS PARA ORDENAMIENTO DE REGISTROS | DEFAULT: Columna 'Id' en DESC
    public  _ColumnSort       : string = "Id";
    public  _OrderSort        : number = 1; // 0: ASC | 1: DESC

    // ATRIBUTOS PARA PAGINACION DE REGISTROS
    public  aiPageSize        : number = 5;
    public  aiCurrentPage     : number = 0;
    public  aiTotalSize       : number = 0;

    public  sortedData        : any;

    // ATRIBUTOS PARA BUSQUEDA | Default 0: Gral
    public _BusquedaPlaceHolder : string = "";
    public _Busqueda            : string = ""; 

    //---------------------------------

    @ViewChild ( MatPaginator ) paginator : MatPaginator;
    @ViewChild ( MatSort      ) sort      : MatSort;

    constructor ( private aoSrvRmasAuthorizersService : SrvRmasAuthorizersService,
                  private aoToastGral                 : ToastrService,
                  private aoLoading                   : MatDialog,
                  private aoDialog                    : MatDialog ) {  }

    ngOnInit(): void { /*this.GetReturnWareHouse();*/ this.GetUsers(); this.GetAuthorizers(); }

    //---------------------------------
    // EVENTOS

      private PaginatorInit(){

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtResultado;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

      public  matPage_Change    ( e         : any     )  {

        this.aiCurrentPage  = e.pageIndex;
        this.aiPageSize     = e.pageSize;

        this.PageIterator();

      }

      private PageIterator() {

        const end     = ( this.aiCurrentPage + 1 )  * this.aiPageSize;
        const start   = this.aiCurrentPage          * this.aiPageSize;
        const part    = this.dtPagina.slice ( start, end );
        this.dtDatos  = part;

      }

      public  SortingTable      ( sort      : Sort    ) {

        this._ColumnSort = sort.active;

        if ( sort.direction == 'asc' )
          this._OrderSort = 0;
        else
          this._OrderSort = 1;

        this.GetAuthorizers();

      }

      public  btnAdd_Click()    : void {

          if ( this.ValidarCampos() ) {

              var lbResultado = false;

              let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿Do You Wish to Add Authorizer?",
                                                                                      msj   : ""
                                                                                    },
                                                                              width   : '370px',
                                                                              height  : '201px'
                                                                            });

              dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                  if ( lbResultado )
                                                                    this.AddAuthorizer();

                                                                });

          }

      }

      public  ValidarCampos()   : boolean {

          var lsTitulo;
          var lsError;

          // Location
          //this._ReturnWareHouse = this._ReturnWareHouse.trimStart().trimEnd();
          /*
          console.log("_ReturnWareHouse" + this._ReturnWareHouse);
          if (( this._ReturnWareHouse == 0 ) || ( this._ReturnWareHouse == null ))
          {

            lsError   = "Location Empty!";
            lsTitulo  = "Please select a Location";

            this.aoToastGral.error ( lsTitulo, lsError );

            return false;

          }
          */

          // User
          //this._User = this._User.trimStart().trimEnd();
          console.log("_User" + this._User);
          if (( this._User == 0 ) || ( this._User == null ))
          {

            lsError   = "User Empty!";
            lsTitulo  = "Please select an User";

            this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right' } );

            return false;

          }

          return true;

      }

      public  BtnEliminar_OnClick ( piId : number ) : void {

          var lbResultado = false;

          let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿Do You Wish to Delete Authorizer?",
                                                                                  msj   : ""
                                                                                },
                                                                          width   : '370px',
                                                                          height  : '204px'
                                                                        });

          dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                              if ( lbResultado )
                                                                this.SetAuthorizerDelete ( piId );

                                                            });

      }

      public  BtnLimpiar_OnClick () : void {

        this.LimpiarCampos();

      }

      private LimpiarCampos(): void {

          this._Id        = 0;
          this._Location  = 0;
          this._User      = 0;
          //this._Status    = 0;

          //this.dtCustomer      = null;

      }

      public  cbxLocations_OnChange(): void {

          if ( this._Location > 0 ){

            this._User = 0;

            this.dtUsers = null;

            this.GetUsers();

          }           

      }

      public  txtBuscar_OnKeyDown() : void {

        this.dtDatosFilter.filter = this._Busqueda;

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtDatosFilter.filteredData;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

    //---------------------------------
    // SECCION: AUTHORIZERS
    //---------------------------------

      // CONSULTA: LOCATIONS
      public  GetLocations() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Locations"
                                                          }
          });

          this.aoSrvRmasAuthorizersService.fbDatos.value.location = 0;

          this.aoSrvRmasAuthorizersService.GetLocations()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR LOCATIONS....

                                              this.dtLocations = this.dtResultado

                                              //this._ReturnWareHouse = this.dtResultado [ 0 ][ "RES_LOCATION_ID" ];

                                              //this.GetCustomers();

                                              return;
                                          }

                    this.aoToastGral.error ( "Error Loading Locations.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error Loading Locations.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      // CONSULTA: USUARIOS
      public  GetUsers() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Users"
                                                          }
                                                    });

          this.aoSrvRmasAuthorizersService.fbDatos.value.location = this._Location;

          this.aoSrvRmasAuthorizersService.GetUsers()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR USERS....

                                              this.dtUsers = this.dtResultado;

                                              return;
                                          }

                    this.aoToastGral.error ( "Error loading Users.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error loading Users.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      // CONSULTA: AUTORIZADORES CONFIGURADOS
      public  GetAuthorizers() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Searching ...",
                                                            msj:    "Searching Authorizers"
                                                          }
                                                    });

          this.aoSrvRmasAuthorizersService.fbDatos.value.id           = this._Id;
          this.aoSrvRmasAuthorizersService.fbDatos.value.columnsort   = this._ColumnSort;
          this.aoSrvRmasAuthorizersService.fbDatos.value.ordersort    = this._OrderSort

          this.aoSrvRmasAuthorizersService.GetAuthorizers()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR SPARE PARTS....

                                              this.dtDatos            = new MatTableDataSource < Element > ( this.dtResultado );

                                              // DATATABLE PARA FILTRADO DE DATOS
                                              this.dtDatosFilter  = new MatTableDataSource < Element > ( this.dtResultado );


                                              this.PaginatorInit();

                                              return;
                                          }

                    this.aoToastGral.error ( "Error searching Authorizers.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error searching Authorizers.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      //ELIMINADO
      public  SetAuthorizerDelete ( piId : number ) {

        //console.log ( "Loading users ..." );

        let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Deleting...",
                                                                              msj   : "Deleting Authorizer"                                                        
                                                                            }
                                                                    });

        this.aoSrvRmasAuthorizersService.fbDatos.value.id           = piId;
        this.aoSrvRmasAuthorizersService.fbDatos.value.Registeruser = Session.getEmail();

        this.aoSrvRmasAuthorizersService.SetAuthorizerDelete()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                dlgLoadingRef.close();

                if ( this.dtResultado != null ) {

                  var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                  if ( resultado > 0 ) { //try {  this._Status      = this.dtResultado [ 0 ][ "RES_STATUS"  ].toString(); } catch { this._Status  = 0; }
                  
                                          this.aoToastGral.success ( "Delete Authorizer succesfully!", "Delete Authorizer", { positionClass:'toast-bottom-right' });

                                          this.GetAuthorizers();

                                          return; }

                  this.aoToastGral.error ( "Error deleting Authorizer" , "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

                this.aoToastGral.error ( "Error deleting user" , "Network Error!", { positionClass:'toast-bottom-right' });

            });

      }

      //ADICION
      public  AddAuthorizer() {

        //console.log ( "Loading users ..." );

        let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Adding ...",
                                                                              msj   : "Adding Authorizer"                                                        
                                                                            }
                                                                    });

        this.aoSrvRmasAuthorizersService.fbDatos.value.id       = this._Id;
        this.aoSrvRmasAuthorizersService.fbDatos.value.location = this._Location;
        this.aoSrvRmasAuthorizersService.fbDatos.value.user     = this._User;        
        this.aoSrvRmasAuthorizersService.fbDatos.value.status   = 1;//this._Status;

        this.aoSrvRmasAuthorizersService.fbDatos.value.Registeruser = Session.getEmail();

        this.aoSrvRmasAuthorizersService.AddAuthorizer()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                dlgLoadingRef.close();

                if ( this.dtResultado != null ) {

                  var resultado     = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                  var mensajeError  = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                  if ( resultado < 0 ) {  this.aoToastGral.error   ( mensajeError , "Error!", { positionClass:'toast-bottom-right' }); return; }

                  if ( resultado > 0 ) {  //this._Id = resultado;

                                          this.aoToastGral.success ( "Add Authorizer succesfully!", "Save Authorizer", { positionClass:'toast-bottom-right' });

                                          this.LimpiarCampos();

                                          this.GetAuthorizers();

                                          return; }

                  this.aoToastGral.error ( "Error adding Authorizer" , "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

              this.aoToastGral.error( "Error adding Authorizer" , "Network Error!", { positionClass:'toast-bottom-right' });

            });

      }

}
