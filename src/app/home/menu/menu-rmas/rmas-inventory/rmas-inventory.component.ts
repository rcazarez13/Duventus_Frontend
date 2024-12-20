import { Component, Query, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { SrvRmasInventoryService } from '../../../../servicios/srv-rmas-inventory';
import { MatSelectModule } from '@angular/material/select';
import { Session } from '../../../../common/Session';

@Component({
  selector: 'app-rmas-inventory',
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
  templateUrl: './rmas-inventory.component.html',
  styleUrl: './rmas-inventory.component.css'
})
export class RmasInventoryComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public  dtLocations       : any;
    public  dtTypes           : any;

    public  _Location         : string = "All";
    public  _Type             : string = "All";
    public  _ItemNumber       : string = "";

    // ATRIBUTOS PARA ORDENAMIENTO DE REGISTROS | DEFAULT: Columna 'Model' en ASC
    public  _ColumnSort       : string = "InPicking";
    public  _OrderSort        : number = 1; // 0: ASC | 1: DESC

    // ATRIBUTOS PARA PAGINACION DE REGISTROS
    public  aiPageSize        : number = 20;
    public  aiCurrentPage     : number = 0;
    public  aiTotalSize       : number = 0;

    public  sortedData        : any;

    // ATRIBUTOS PARA BUSQUEDA | Default 0: Gral
    public _BusquedaPlaceHolder : string = "";
    public _Busqueda            : string = ""; 

    //---------------------------------

    @ViewChild ( MatPaginator ) paginator : MatPaginator;
    @ViewChild ( MatSort      ) sort      : MatSort;

    constructor ( private aoSrvRmasInventoryService   : SrvRmasInventoryService,
                  private aoToastGral                 : ToastrService,
                  private aoRouter                    : Router,
                  private route                       : ActivatedRoute,
                  private aoLoading                   : MatDialog,
                  private aoDialog                    : MatDialog ) { }

    ngOnInit(): void { this.GetLocations(); this.GetTypes(); this.GetInventory(); }


    //---------------------------------
    // EVENTOS

      private PaginatorInit(){

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtResultado;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

      public  matPage_Change        ( e         : any     )  {

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

      public  SortingTable          ( sort      : Sort    ) {

        this._ColumnSort = sort.active;

        if ( sort.direction == 'asc' )
          this._OrderSort = 0;
        else
          this._OrderSort = 1;

        this.GetInventory();

      }

      public  txtSerialNumber_Enter ( poEvent   : KeyboardEvent ) : void {          

          if ( poEvent.key === "Enter" ){

              if ( this.ValidarCampos() ) {

                  this.GetInventory();

              }

          }          

      }

      public  btnSearch_Click()     : void {

          if ( this.ValidarCampos() ) {

              this.GetInventory();

          }

      }

      public  ValidarCampos()       : boolean {

          var lsTitulo;
          var lsError;
          
          // Spare Part
          /*
          this._ItemNumber = this._ItemNumber.trimStart().trimEnd();
          console.log("_ItemNumber" + this._ItemNumber);
          if (( this._ItemNumber == "" ) || ( this._ItemNumber == null ))
          {

            lsError   = "Item Number Empty!";
            lsTitulo  = "Please write a Item Number";

            this.aoToastGral.error ( lsTitulo, lsError );

            return false;

          }
          */

          return true;

      }

      private LimpiarCampos()       : void {

          this.dtDatos        = null;

          this.dtDatosFilter  = null;

      }

      public  txtBuscar_OnKeyDown() : void {

        this.dtDatosFilter.filter = this._Busqueda;

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtDatosFilter.filteredData;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

      public  cbxOnChange(): void {

          this.GetInventory();

      }

    //---------------------------------
    // CONSULTA

      public GetLocations() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Locations"
                                                          }
                                                    });

          this.aoSrvRmasInventoryService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvRmasInventoryService.GetLocations()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR LOCATIONS....

                                              this.dtLocations = this.dtResultado;

                                              return;
                                         }

                    this.aoToastGral.error ( "Error loading Locations.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error loading Locations.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      public GetTypes() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                            msj:    "Loading Types"
                                                          }
                                                    });

          this.aoSrvRmasInventoryService.GetTypes()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR TYPES....

                                              this.dtTypes = this.dtResultado;

                                              return;
                                         }

                    this.aoToastGral.error ( "Error loading Types.", "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error loading Types.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

      public GetInventory() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Searching ...",
                                                            msj:    "Searching Inventory"
                                                          }
                                                    });

          this.aoSrvRmasInventoryService.fbDatos.value.location     = this._Location;
          this.aoSrvRmasInventoryService.fbDatos.value.type         = this._Type;
          this.aoSrvRmasInventoryService.fbDatos.value.itemnumber   = this._ItemNumber;

          this.aoSrvRmasInventoryService.fbDatos.value.columnsort   = this._ColumnSort;
          this.aoSrvRmasInventoryService.fbDatos.value.ordersort    = this._OrderSort

          this.aoSrvRmasInventoryService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvRmasInventoryService.GetInventory()
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

                    if ( resultado == -2 ) {  let lsError : string = this.dtResultado [ 0 ][ "RES_ERROR" ];

                                              this.aoToastGral.error ( lsError, "Error!", { positionClass:'toast-bottom-right' });

                                              this.LimpiarCampos();

                                              return;
                                           }

                    this.aoToastGral.error ( "Error searching Inventory", "Error!", { positionClass:'toast-bottom-right' });

                    this.LimpiarCampos();

                    return;

                  }

                  this.aoToastGral.error ( "Error searching inventory.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

}

 
