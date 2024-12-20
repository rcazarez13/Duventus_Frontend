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
import { SrvConfigRolesService } from '../../../../servicios/srv-config-roles.service';
import { RolDataComponent } from './rol-data/rol-data.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FrmConfirmComponent } from '../../frm-confirm/frm-confirm.component';
import { Session } from '../../../../common/Session';


@Component({
  selector: 'app-config-roles',
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
  templateUrl: './config-roles.component.html',
  styleUrl: './config-roles.component.css'
})
export class ConfigRolesComponent {

    private dtResultado       : any;
    public  dtDatos           : any;
    public  dtPagina          : any;
    private dtDatosFilter     : any;

    public _Email             : string = "";
    public _RolSelect         : string = "";

    // ATRIBUTOS PARA ORDENAMIENTO DE REGISTROS | DEFAULT: Columna 'No' en ASC
    public _ColumnSort        : string = "Name";
    public _OrderSort         : number = 0; // 0: ASC | 1: DESC

    // ATRIBUTOS PARA PAGINACION DE REGISTROS
    public aiPageSize         : number = 5;
    public aiCurrentPage      : number = 0;
    public aiTotalSize        : number = 0;

    public sortedData         : any;

    // ATRIBUTOS PARA BUSQUEDA | Default 0: Gral
    public _BusquedaPlaceHolder : string = "";
    public _Busqueda            : string = ""; 

    //---------------------------------

    @ViewChild ( MatPaginator ) paginator : MatPaginator;
    @ViewChild ( MatSort      ) sort      : MatSort;

    constructor ( private aoSrvConfigRolesService : SrvConfigRolesService,
                  private aoToastGral             : ToastrService,
                  private aoRouter                : Router,
                  private route                   : ActivatedRoute,
                  private aoLoading               : MatDialog,
                  private aoDialog                : MatDialog ) {  }

    ngOnInit(): void { this.GetRoles(); }

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

      this.GetRoles();

    }

    public  btnActions_Click  ( piOption  : number, psRolSelect : string, psRolId : string  ): void {
      /*
        0 : Nuevo Rol
        1 : Ver Rol
        2 : Editar Rol
        3 : Eliminar Rol
      */
      var liOption      = piOption;
      var lsRolSelect   = psRolSelect;
      var lsRolId       = psRolId;

      if ( liOption != 3 ) {

          let dlgConfirmRef = this.aoDialog.open ( RolDataComponent, { data:  { title       : "Loading ...",
                                                                                msj         : "Loading Roles",

                                                                                acciontipo  : liOption,

                                                                                rol         : lsRolSelect,
                                                                                rolId       : lsRolId

                                                                              },
                                                                    width   : '672px',
                                                                    height  : '492px'
                                                                  });

          var lbResultado = false;
          dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                              if ( lbResultado )
                                                                this.GetRoles();

                                                            });


      }

      if ( liOption == 3 ) {

        this._RolSelect = lsRolSelect;

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
                                                            
                                                          });

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
    // CONSULTA
      public  GetRoles() {

        console.log ( "Loading Roles ..." );

        this.aoLoading.open ( LoadingComponent, { data: { title:  "Loading ...",
                                                          msj:    "Loading Roles"
                                                        }
                                                  });

        this.aoSrvConfigRolesService.fbDatos.value.columnsort = this._ColumnSort;
        this.aoSrvConfigRolesService.fbDatos.value.ordersort  = this._OrderSort

        this.aoSrvConfigRolesService.GetRoles()
            .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

              this.aoLoading.closeAll();

                if ( this.dtResultado != null ) {

                  var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                  if ( resultado > 0 ) {    // CARGAR ROLES....

                                            this.dtDatos        = new MatTableDataSource < Element > ( this.dtResultado );

                                            // DATATABLE PARA FILTRADO DE DATOS
                                            this.dtDatosFilter  = new MatTableDataSource < Element > ( this.dtResultado );

                                            this.PaginatorInit();

                                            return;
                                       }

                  this.aoToastGral.error ( "Error loading roles." , "Error!", { positionClass:'toast-bottom-right' });

                  return;

                }

                this.aoToastGral.error ( "Error loading roles." , "Network Error!", { positionClass:'toast-bottom-right' });

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

                    if ( resultado > 0 ) {  this.aoToastGral.success ( "Delete Rol succesfully!", "Delete User", { positionClass: 'toast-bottom-right' });

                                            this.GetRoles();

                                            return; }

                    this.aoToastGral.error ( "Error deleting Rol" , "Error!", { positionClass: 'toast-bottom-right' });

                    return;

                  }

                  this.aoToastGral.error ( "Error deleting Rol" , "Network Error!", { positionClass: 'toast-bottom-right' });

              });

        }

}
