import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { SrvConfigUsersService } from '../../../../servicios/srv-config-users.service';
import { Session } from '../../../../common/Session';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { UserDataComponent } from './user-data/user-data.component';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FrmConfirmComponent } from '../../frm-confirm/frm-confirm.component';

// INTERFAZ PARA FILTRADO DE REGISTROS
export interface SearchFilter {

  UserId          : number;
  Email           : string;
  FirstName       : string;
  LastName        : string;
  LastLoginDatee  : string;
  Status          : string;

}

@Component({
  selector: 'app-config-users',
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
    MatSelectModule,
    MatInputModule
  ],

  templateUrl: './config-users.component.html',
  styleUrl: './config-users.component.css'

})
export class ConfigUsersComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public _Email             : string = "";
    public _Status            : number = 0;
    public _StatusDescripcion : string = "";  

    public _EmailSelected             : string = "";
    public _StatusDescripcionSelected : string = "";  

    // ATRIBUTOS PARA ORDENAMIENTO DE REGISTROS | DEFAULT: Columna 'No' en ASC
    public _ColumnSort        : string = "No";
    public _OrderSort         : number = 0; // 0: ASC | 1: DESC

    // ATRIBUTOS PARA PAGINACION DE REGISTROS
    public aiPageSize         : number = 5;
    public aiCurrentPage      : number = 0;
    public aiTotalSize        : number = 0;

    public sortedData         : any;

    // ATRIBUTOS PARA BUSQUEDA | Default 0: Gral
    public _TipoBusqueda        : number = 0; // Gral
    public _BusquedaPlaceHolder : string = "";
    public _Busqueda            : string = "";  

    //---------------------------------

    @ViewChild ( MatPaginator ) paginator : MatPaginator;
    @ViewChild ( MatSort      ) sort      : MatSort;

    constructor ( private aoSrvConfigUsersService : SrvConfigUsersService,
                  private aoToastGral             : ToastrService,
                  private aoRouter                : Router,
                  private route                   : ActivatedRoute,
                  private aoLoading               : MatDialog,
                  private aoDialog                : MatDialog ) {  }

    ngOnInit(): void { this.optRadio_Click ( 0 );  this.GetUsers();  }

    //---------------------------------
    // EVENTOS

    private PaginatorInit(){

      this.dtDatos.paginator  = this.paginator;
      this.dtPagina           = this.dtResultado;
      this.aiTotalSize        = this.dtPagina.length;

      this.PageIterator();

    }

    public  matPage_Change      ( e         : any     )  {

      this.aiCurrentPage  = e.pageIndex;
      this.aiPageSize     = e.pageSize;

      this.PageIterator();

    }

    private PageIterator() {

      const end     = ( this.aiCurrentPage + 1 )  * this.aiPageSize;
      const start   = this.aiCurrentPage          * this.aiPageSize;
      const part    = this.dtPagina.slice ( start, end );

      this.dtDatos = part;

    }

    public  SortingTable        ( sort      : Sort    ) {

      this._ColumnSort = sort.active;

      if ( sort.direction == 'asc' )
        this._OrderSort = 0;
      else
        this._OrderSort = 1;

      this.GetUsers();

    }
        
    public  btnActions_Click    ( piOption  : number, psEmailSelect: string, psStatusSelect: string ): void {
        /*
          0 : Nuevo Usuario
          1 : Ver Usuario
          2 : Editar Usuario
          3 : Eliminar Usuario
        */

        var liOption = piOption;
        var lsEmailSelect   = psEmailSelect;
        var lsStatusSelect  = psStatusSelect;

        if ( liOption != 3 ) {    

            let dlgConfirmRef = this.aoDialog.open ( UserDataComponent, {
              data: {
                title: "Loading ...",
                msj: "Loading Users",

                acciontipo: liOption,

                email: lsEmailSelect

              },
              width: '672px',
              height: '492px'
            });

            var lbResultado = false;
            dlgConfirmRef.afterClosed().subscribe ( result => {

              lbResultado = result;

              if ( lbResultado )
                this.GetUsers();

            });

        }

        if ( liOption == 3 ){

            this._EmailSelected = lsEmailSelect;
            this._StatusDescripcionSelected = lsStatusSelect;

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
                                                                
                                                            });

        }

    }
        
    public  txtBuscar_OnKeyDown() : void {

      this.dtDatosFilter.filter = this._Busqueda;

      // PARA FILTRAR SEGUN EL PARAMETRO SELECCIONADO 
      switch ( this._TipoBusqueda ) {

        // FILTRO POR NOMBRE: NAME
        case 1:

          this.dtDatosFilter.filterPredicate = ( data: SearchFilter, filter: string ) => {

              var lsNombreCompleto = data.FirstName.toLowerCase() + " " + data.LastName.toLowerCase();

              return lsNombreCompleto.includes ( filter )

          };

          break;

        // FILTRO POR CORREO: EMAIL
        case 2:

           this.dtDatosFilter.filterPredicate = ( data: SearchFilter, filter: string ) => {

              return data.Email.includes ( filter )

          };

          break;

      }      

      this.dtDatos.paginator  = this.paginator;
      this.dtPagina           = this.dtDatosFilter.filteredData;
      this.aiTotalSize        = this.dtPagina.length;

      this.PageIterator();

    }

    public  optBuscar_Click     ( piValue   : number  ) {

          switch ( piValue ) {

            case 1:

              this._TipoBusqueda        = 1;
              this._BusquedaPlaceHolder = " by Name";

              break;

            case 2:

              this._TipoBusqueda        = 2;
              this._BusquedaPlaceHolder = "by Email";

              break;

          }

          this._Busqueda = "";

          this.txtBuscar_OnKeyDown();

        }

    public  optRadio_Click      ( piValue   : number  ) {

          switch ( piValue ) {

            case 0:

              this._Status            = 0;
              this._StatusDescripcion = "Active";

              break;

            case 1:

              this._Status            = 1;
              this._StatusDescripcion = "Delete";

              break;

            case 2:

              this._Status            = 2;
              this._StatusDescripcion = "Alls";

              break;

          }

          //this._TipoBusqueda        = 0; // Name
          //this._BusquedaPlaceHolder = "Name";
          this._Busqueda            = ""; 

          this.GetUsers();

        }

    public  cbxStatus_OnChange() {

      if ( this._Status == 0 ){ this._Status = 0;
                                this._StatusDescripcion = "Active"; }

      if ( this._Status == 1 ){ this._Status = 1;
                                this._StatusDescripcion = "Delete"; }

      if ( this._Status == 2 ){ this._Status = 2;
                                this._StatusDescripcion = "Alls"; }

      //this._TipoBusqueda        = 0; // Name
      //this._BusquedaPlaceHolder = "Name";
      this._Busqueda = "";

      this.GetUsers();

    }

    //---------------------------------
    // CONSULTA

      public  GetUsers() {

        console.log ( "Loading users ..." );

        this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                          msj:    "Loading Users"
                                                        }
                                                  });

        this.aoSrvConfigUsersService.fbDatos.value.user       = Session.getEmail();
        this.aoSrvConfigUsersService.fbDatos.value.status     = this._Status;
        this.aoSrvConfigUsersService.fbDatos.value.statusDes  = this._StatusDescripcion;

        this.aoSrvConfigUsersService.fbDatos.value.columnsort = this._ColumnSort;
        this.aoSrvConfigUsersService.fbDatos.value.ordersort  = this._OrderSort

        this.aoSrvConfigUsersService.GetUsers()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

              this.aoLoading.closeAll();

                if ( this.dtResultado != null ) {

                  var resultado = this.dtResultado [ 0 ][ "UserId" ];

                  if ( resultado > 0 ) {    // CARGAR USERS....

                                            this.dtDatos        = new MatTableDataSource < Element > ( this.dtResultado );

                                            // DATATABLE PARA FILTRADO DE DATOS
                                            this.dtDatosFilter  = new MatTableDataSource < Element > ( this.dtResultado );

                                            this.PaginatorInit();

                                            return;
                                       }

                  this.aoToastGral.error ( "Error loading users.", "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

                this.aoToastGral.error ( "Error loading users.", "Network Error!", { positionClass:'toast-bottom-right' });

            });

      }

    //ELIMINADO

      public  SetUserDelete() {

          //console.log ( "Loading users ..." );

          let dlgLoadingRef = this.aoLoading.open ( LoadingComponent, { data: { title : "Deleting...",
                                                                                msj   : "Deleting User"                                                        
                                                                              }
                                                                      });

          this.aoSrvConfigUsersService.fbDatos.value.user         = this._EmailSelected;
          this.aoSrvConfigUsersService.fbDatos.value.statusDes    = this._StatusDescripcionSelected;
          this.aoSrvConfigUsersService.fbDatos.value.Registeruser = Session.getEmail();

          this.aoSrvConfigUsersService.SetUserDelete()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  dlgLoadingRef.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "UserId" ];

                    if ( resultado > 0 ) {  this.aoToastGral.success ( "Delete User succesfully!", "Delete User", { positionClass:'toast-bottom-right' });

                                            this.GetUsers();

                                            return; }

                    this.aoToastGral.error ( "Error deleting user" , "Error!", { positionClass:'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error deleting user" , "Network Error!", { positionClass:'toast-bottom-right' });

              });

        }

}
