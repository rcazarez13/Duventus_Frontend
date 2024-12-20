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
import { SrvRmasRequestsService } from '../../../../servicios/srv-rmas-requests';
import { Session } from '../../../../common/Session';
import { FrmConfirmComponent } from '../../frm-confirm/frm-confirm.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModelDataComponent } from './model-data/model-data.component';

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
  templateUrl: './rmas-requests.component.html',
  styleUrl: './rmas-requests.component.css'
})
export class RmasRequestsComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public  dtCustomer        : any;
    public  dtReturnWareHouse : any;    
    public  dtModels          : any;  

    public  dtModeloSeries    : any; 
    public  dtModelNewData    : any;  

    public  _Id               : number = 0;
    public  _IdRMA            : number = 0;
    public  _Ticket           : string = "";
    public  _Customer         : string = "";
    public  _ReturnWareHouse  : string = "";

    public  _Comments         : string = "";
    public  _StatusDescription: string = "New Request";
    public  _Status           : number = 0;

    public _IsNewCapture      : boolean = false;

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

    constructor ( private aoSrvRmasRequestsService    : SrvRmasRequestsService,
                  private aoToastGral                 : ToastrService,
                  private aoLoading                   : MatDialog,
                  private aoDialog                    : MatDialog ) { this.PruebaCargaModelosSeries();  }

    ngOnInit(): void { this.GetCustomers(); this.GetReturnWareHouse(); this.GetRequests(); }

    //---------------------------------
    // EVENTOS

      private PruebaCargaModelosSeries() : void {

        // -----------------------------------------------------
        // CREAMOS LISTA DE STRINGS
        // -----------------------------------------------------
          var lstModelos: object[] = [];

          var lstSeries: object[] = [];
          lstSeries.push ({ RES_SERIE: 'SERIE123456_1' });
          lstSeries.push ({ RES_SERIE: 'SERIE123456_2' });
          lstSeries.push ({ RES_SERIE: 'SERIE123456_3' });
          lstSeries.push ({ RES_SERIE: 'SERIE123456_4' });

          let loModel_1 = { RES_MODEL: 'MODELO_1', RES_QUANTITY: 23, RES_SERIES: lstSeries };
          let loModel_2 = { RES_MODEL: 'MODELO_2', RES_QUANTITY: 41, RES_SERIES: lstSeries };
          let loModel_3 = { RES_MODEL: 'MODELO_3', RES_QUANTITY: 45, RES_SERIES: lstSeries };
          let loModel_4 = { RES_MODEL: 'MODELO_4', RES_QUANTITY: 13, RES_SERIES: lstSeries };

          lstModelos.push ( loModel_1 );
          lstModelos.push ( loModel_2 );
          lstModelos.push ( loModel_3 );
          lstModelos.push ( loModel_4 );

          //var lsModelos = JSON.stringify ( lstModelos );

          this.dtModeloSeries = lstModelos;
        // -----------------------------------------------------

      }

      private PaginatorInit(){

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtResultado;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

      public  matPage_Change              ( e         : any     )  {

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

      public  SortingTable                ( sort      : Sort    ) {

        this._ColumnSort = sort.active;

        if ( sort.direction == 'asc' )
          this._OrderSort = 0;
        else
          this._OrderSort = 1;

        this.GetRequests();

      }

      public  btnCreate_Click()           : void {

          if ( this.ValidarCampos() ) {

              var lbResultado = false;

              let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿Do You Wish to Create Request?",
                                                                                      msj   : ""
                                                                                    },
                                                                              width   : '370px',
                                                                              height  : '201px'
                                                                            });

              dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                                  if ( lbResultado )
                                                                    this.AddRequest();

                                                                });

          }

      }

      public  ValidarCampos()             : boolean {

          var lsTitulo;
          var lsError;

          // Customer
          //this._User = this._User.trimStart().trimEnd();
          console.log("_Customer" + this._Customer);
          if (( this._Customer == "" ) || ( this._Customer == null ))
          {

            lsError   = "Customer Empty!";
            lsTitulo  = "Please select an Customer";

            this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right' } );

            return false;

          }

          // Return Warehouse
          //this._ReturnWareHouse = this._ReturnWareHouse.trimStart().trimEnd();          
          console.log("_ReturnWareHouse" + this._ReturnWareHouse);
          if (( this._ReturnWareHouse == "" ) || ( this._ReturnWareHouse == null ))
          {

            lsError   = "Return Warehouse Empty!";
            lsTitulo  = "Please select a Return Warehouse";

            this.aoToastGral.error ( lsTitulo, lsError );

            return false;

          }          
                    
          return true;

      }

      public  BtnLimpiar_OnClick ()       : void {

        this.LimpiarCampos();

      }

      private LimpiarCampos()             : void {

          this._Id              = 0;
          this._IdRMA           = 0;
          this._Ticket          = "";
          this._Customer        = "";
          this._ReturnWareHouse = "";
          this._Comments        = "";
          this._Status          = 0;

      }
            
      public  btnModelSeriesCapture_Click ( piAccion : number )  : void {         

          // ACCION 0: BOTON NUEVA CAPTURA
          if ( piAccion == 0 ){

            if ( this._IsNewCapture )
              this._IsNewCapture = false;
            else
              this._IsNewCapture = true;

          }

          // ACCION 1: BOTON AGREGAR SERIES EN NUEVA CAPTURA
          if ( piAccion == 1 ){
            /* ModelDataComponent > acciontipo
              1: Visualizar Datos, campos inactivos
              2: Editar datos... Campos activos
            */

            this.aoDialog.open ( ModelDataComponent, {  data: { acciontipo  : 2,
                                                                modelo      : "Modelo Ok"
                                                              },
                                                        width: '450px',
                                                        height: '440px'
                                                      });

          }

          // ACCION 2: VISUALIZAR SERIES DE NUEVA CAPTURA
          if ( piAccion == 2 ){
            /* ModelDataComponent > acciontipo
              1: Visualizar Datos, campos inactivos
              2: Editar datos... Campos activos
            */

            var lstModeloSeries: object[] = [];

            for ( const actualRow of this.dtModeloSeries ) {

              var lsModel = actualRow [ "RES_MODEL"      ];

              if ( lsModel == '' ){

                let loModel = actualRow;

                lstModeloSeries.push ( loModel );

                break;

              }

            }

            this.aoDialog.open ( ModelDataComponent, {  data: { acciontipo      : 2,
                                                                modelo          : "Modelo Ok",
                                                                dtModeloSeries  : lstModeloSeries
                                                              },
                                                        width: '450px',
                                                        height: '440px'
                                                      });

          }

          // ACCION 2: BOTON AGREGAR NUEVA CAPTURA EN LISTADO DE MODELOS CAPTURADOS
          if ( piAccion == 3 ){



          }

      }

      public  BtnEliminar_OnClick         ( piId : number ) : void {

          var lbResultado = false;

          let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿Do You Wish to Delete Request?",
                                                                                  msj   : ""
                                                                                },
                                                                          width   : '370px',
                                                                          height  : '204px'
                                                                        });

          dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                              if ( lbResultado )
                                                                this.SetRequestDelete ( piId );

                                                            });

      }
      
      public  txtBuscar_OnKeyDown() : void {

        this.dtDatosFilter.filter = this._Busqueda;

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtDatosFilter.filteredData;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

    //---------------------------------
    // SECCION: REQUESTS
    //---------------------------------

      // CONSULTA: CLIENTES
      public  GetCustomers() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Customers"
                                                          }
                                                    });

          this.aoSrvRmasRequestsService.GetCustomers()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR CLIENTES....

                                              this.dtCustomer = this.dtResultado;

                                              return;
                                          }

                    this.aoToastGral.error ( "Error loading Customers.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error loading Customers.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      // CONSULTA: RETURN WAREHOUSE
      public  GetReturnWareHouse() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Returns Warehouse"
                                                          }
          });

          this.aoSrvRmasRequestsService.fbDatos.value.returnwarehouse = "";

          this.aoSrvRmasRequestsService.GetReturnWareHouse()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR RETURN WAREHOUSE....

                                              this.dtReturnWareHouse = this.dtResultado

                                              //this._ReturnWareHouse = this.dtResultado [ 0 ][ "RES_LOCATION_ID" ];

                                              //this.GetCustomers();

                                              return;
                                          }

                    this.aoToastGral.error ( "Error Loading Returns Warehouse.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error Loading Returns Warehouse.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }
            
      // CONSULTA: REQUESTS
      public  GetRequests() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Searching ...",
                                                            msj:    "Searching Requests"
                                                          }
                                                    });

          this.aoSrvRmasRequestsService.fbDatos.value.id           = this._Id;
          this.aoSrvRmasRequestsService.fbDatos.value.columnsort   = this._ColumnSort;
          this.aoSrvRmasRequestsService.fbDatos.value.ordersort    = this._OrderSort

          this.aoSrvRmasRequestsService.GetRequests()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR REQUESTS....

                                              this.dtDatos            = new MatTableDataSource < Element > ( this.dtResultado );

                                              // DATATABLE PARA FILTRADO DE DATOS
                                              this.dtDatosFilter  = new MatTableDataSource < Element > ( this.dtResultado );


                                              this.PaginatorInit();

                                              return;
                                          }

                    this.aoToastGral.error ( "Error searching Requests.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error searching Requests.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      // ELIMINADO: REQUEST
      public  SetRequestDelete ( piId : number ) {

        //console.log ( "Loading users ..." );

        let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Deleting...",
                                                                              msj   : "Deleting Request"                                                        
                                                                            }
                                                                    });

        this.aoSrvRmasRequestsService.fbDatos.value.id           = piId;
        this.aoSrvRmasRequestsService.fbDatos.value.Registeruser = Session.getEmail();

        this.aoSrvRmasRequestsService.SetRequestDelete()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                dlgLoadingRef.close();

                if ( this.dtResultado != null ) {

                  var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                  if ( resultado > 0 ) { //try {  this._Status      = this.dtResultado [ 0 ][ "RES_STATUS"  ].toString(); } catch { this._Status  = 0; }
                  
                                          this.aoToastGral.success ( "Delete Request succesfully!", "Delete Request", { positionClass:'toast-bottom-right' });

                                          this.GetRequests();

                                          return; }

                  this.aoToastGral.error ( "Error deleting Request" , "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

                this.aoToastGral.error ( "Error deleting Request" , "Network Error!", { positionClass:'toast-bottom-right' });

            });

      }

      // ADICION: REQUEST
      public  AddRequest() {

        //console.log ( "Loading users ..." );

        let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Adding ...",
                                                                              msj   : "Adding Request"                                                        
                                                                            }
                                                                    });

        this.aoSrvRmasRequestsService.fbDatos.value.id              = this._Id;
        this.aoSrvRmasRequestsService.fbDatos.value.returnwarehouse = this._ReturnWareHouse;
        this.aoSrvRmasRequestsService.fbDatos.value.customer        = this._Customer;        
        this.aoSrvRmasRequestsService.fbDatos.value.status          = 1;//this._Status;

        this.aoSrvRmasRequestsService.fbDatos.value.Registeruser = Session.getEmail();

        this.aoSrvRmasRequestsService.AddRequest()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                dlgLoadingRef.close();

                if ( this.dtResultado != null ) {

                  var resultado     = this.dtResultado [ 0 ][ "RES_RESULTADO" ];
                  var mensajeError  = this.dtResultado [ 0 ][ "RES_MENSAJE"   ];

                  if ( resultado < 0 ) {  this.aoToastGral.error   ( mensajeError , "Error!", { positionClass:'toast-bottom-right' }); return; }

                  if ( resultado > 0 ) {  //this._Id = resultado;

                                          this.aoToastGral.success ( "Add Request succesfully!", "Save Request", { positionClass:'toast-bottom-right' });

                                          this.LimpiarCampos();

                                          this.GetRequests();

                                          return; }

                  this.aoToastGral.error ( "Error adding Request" , "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

              this.aoToastGral.error( "Error adding Request" , "Network Error!", { positionClass:'toast-bottom-right' });

            });

      }

}
