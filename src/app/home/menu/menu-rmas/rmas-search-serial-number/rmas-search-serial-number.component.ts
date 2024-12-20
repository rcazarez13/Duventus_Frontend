import { Component, ViewChild } from '@angular/core';
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
import { SrvRmasSearchSerialNumberService } from '../../../../servicios/srv-rmas-search-serial-number';

@Component({
  selector: 'app-rmas-search-serial-number',
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
    MatInputModule
  ],
  templateUrl: './rmas-search-serial-number.component.html',
  styleUrl: './rmas-search-serial-number.component.css'
})
export class RmasSearchSerialNumberComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public  _SerialNumber     : string = "";

    public  _SerialNo         : string = "";
    public  _Model            : string = "";
    public  _Invoice          : string = "";
    public  _InvoiceDate      : string = "";
    public  _Customer         : string = "";
    public  _Location         : string = "";
    public  _LastMovement     : string = "";

    // ATRIBUTOS PARA ORDENAMIENTO DE REGISTROS | DEFAULT: Columna 'Invoice' en ASC
    //public  _ColumnSort       : string = "Invoice";
    public  _ColumnSort       : string = "";
    public  _OrderSort        : number = 0; // 0: ASC | 1: DESC

    // ATRIBUTOS PARA PAGINACION DE REGISTROS
    public  aiPageSize        : number = 10;
    public  aiCurrentPage     : number = 0;
    public  aiTotalSize       : number = 0;

    public  sortedData        : any;

    // ATRIBUTOS PARA BUSQUEDA | Default 0: Gral
    public _BusquedaPlaceHolder : string = "";
    public _Busqueda            : string = ""; 

    //---------------------------------

    @ViewChild ( MatPaginator ) paginator : MatPaginator;
    @ViewChild ( MatSort      ) sort      : MatSort;

    constructor ( private aoSrvRmasSearchSerialNumberService  : SrvRmasSearchSerialNumberService,
                  private aoToastGral                         : ToastrService,
                  private aoRouter                            : Router,
                  private route                               : ActivatedRoute,
                  private aoLoading                           : MatDialog,
                  private aoDialog                            : MatDialog ) {  }

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

        this.GetSerialNumberMovimientos();

      }

      public  txtSerialNumber_Enter ( poEvent   : KeyboardEvent ) : void {          

          if ( poEvent.key === "Enter" ){

              if ( this.ValidarCampos() ) {

                  this.GetSerialNumberMovimientos();

              }

          }          

      }

      public  btnSearch_Click() : void {

          if ( this.ValidarCampos() ) {

              this.GetSerialNumberMovimientos();

          }

      }

      public  ValidarCampos()   : boolean {

          var lsTitulo;
          var lsError;

          // Serial Number
          this._SerialNumber = this._SerialNumber.trimStart().trimEnd();
          console.log("_SerialNumber" + this._SerialNumber);
          if (( this._SerialNumber == "" ) || ( this._SerialNumber == null ))
          {

            lsError   = "Serial Number Empty!";
            lsTitulo  = "Please write a Serial Number";

            this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right' });

            return false;

          }

          return true;

      }

      private LimpiarCampos(): void {

          this._SerialNo      = "";
          this._Model         = "";
          this._Invoice       = "";
          this._InvoiceDate   = "";
          this._Customer      = "";
          this._Location      = "";
          this._LastMovement  = "";

          this.dtDatos    = null;

      }

      public  txtBuscar_OnKeyDown() : void {

        this.dtDatosFilter.filter = this._Busqueda;

        this.dtDatos.paginator  = this.paginator;
        this.dtPagina           = this.dtDatosFilter.filteredData;
        this.aiTotalSize        = this.dtPagina.length;

        this.PageIterator();

      }

    //---------------------------------
    // CONSULTA

      public GetSerialNumberMovimientos() {

          //console.log ( "Loading Serial Numbers ..." );

          this.aoLoading.open ( LoadingComponent, { data: { title:  "Searching ...",
                                                            msj:    "Searching Serial Number"
                                                          }
                                                    });

          this.aoSrvRmasSearchSerialNumberService.fbDatos.value.serialnumber  = this._SerialNumber;

          this.aoSrvRmasSearchSerialNumberService.fbDatos.value.columnsort    = this._ColumnSort;
          this.aoSrvRmasSearchSerialNumberService.fbDatos.value.ordersort     = this._OrderSort

          this.aoSrvRmasSearchSerialNumberService.GetSerialNumberMovimientos()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                this.aoLoading.closeAll();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {    // CARGAR SERIAL NUMBERS....
                      const ultimoMovimiento = this.dtResultado.slice(-1)[0]; // Obtener el último registro

                      this._SerialNo      = ultimoMovimiento["RES_SERIAL_NUMBER"];
                      this._Model         = ultimoMovimiento["RES_MODEL"];
                      this._Invoice       = ultimoMovimiento["RES_INVOICE"];
                      this._InvoiceDate   = ultimoMovimiento["RES_INVOICEDATE"];
                      this._Customer      = ultimoMovimiento["RES_CUSTOMER"];
                      this._Location      = ultimoMovimiento["RES_LOCATION"]; // Última ubicación
                      this._LastMovement  = ultimoMovimiento["RES_LASTMOV"]; // Último movimiento

                      this.dtDatos        = new MatTableDataSource < Element > ( this.dtResultado );

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

                    this.aoToastGral.error ( "Error searching serial numbers.", "Error!", { positionClass:'toast-bottom-right' });

                    this.LimpiarCampos();

                    return;

                  }

                  this.aoToastGral.error ( "Error searching serial numbers.", "Network Error!", { positionClass:'toast-bottom-right' });

              });

      }

}
