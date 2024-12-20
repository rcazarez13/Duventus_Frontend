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

  acciontipo      : number;

  modelo          : string;

  dtModeloSeries  : any; 

}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-model-data',
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
  templateUrl: './model-data.component.html',
  styleUrl: './model-data.component.css',
})

export class ModelDataComponent {

    private dtResultado       : any;
    public  dtDatos           : any;

    public _AccionTipo        : number = 0;
    public _Modelo            : string = "";

    public _Serie             : string = "";
    public _IsBtnEliminar     : boolean = false;

    public _IsBtnAniadir      : boolean = false;
    public _IsBtnLimpiar      : boolean = false;

    public _IsBtnGuardar      : boolean = false;

    public _IsEnabledFields   : boolean = false;

    constructor ( public aoDialogRef                    : MatDialogRef < ModelDataComponent >,
                  @Inject(MAT_DIALOG_DATA) public data  : DialogData,

                  private aoLoading                     : MatDialog,
                  private aoToastGral                   : ToastrService,
                  private aoDialog                      : MatDialog,

                  private aoSrvConfigUsersService       : SrvConfigUsersService ) {        

        this._AccionTipo  = data.acciontipo;
        this._Modelo      = data.modelo;

        this.dtDatos      = data.dtModeloSeries;

        this.Show();

        //console.log(this._AccionTipo + " | " + this._RolSelect);

    }

    ngOnInit()                  : void { this.GetSeries(); }

    //---------------------------------
    // EVENTOS
    //---------------------------------

      public Show()                 : void {

          $( '.loading' ).fadeIn ( 'slow' );

          this.BtnsAccionTipo();

      }

      public Close()                : void {     

          //console.log("close..");
          var lbResultado = false;

          this.aoDialogRef.close ( lbResultado );

          $( '.loading' ).fadeOut ( 'slow' );

      }

      public BtnsAccionTipo()       : void {

          //console.log("_AccionTipo > " + this._AccionTipo);

          switch ( this._AccionTipo ) {

            // VER REGISTRO
            case 1: 

              this._IsEnabledFields = false;
              //console.log("_IsEnabledFields > " + this._IsEnabledFields);
              this._IsBtnAniadir  = false;
              this._IsBtnLimpiar  = false;

              this._IsBtnEliminar = false;

              this._IsBtnGuardar  = false;

              break;

            // EDITAR REGISTRO
            case 2: 

              this._IsEnabledFields = true;
              //console.log("_IsEnabledFields > " + this._IsEnabledFields);
              this._IsBtnAniadir  = true;
              this._IsBtnLimpiar  = true;

              this._IsBtnEliminar = true;

              this._IsBtnGuardar  = true;

              break;

          }

      }

      public BtnAniadir_OnClick()   : void {

          if ( this.ValidarCampos()) {

              // GUARDAR: NUEVO REGISTRO
              this.AddSerie();

          }

      }

      public ValidarCampos()        : boolean {

          var lsTitulo;
          var lsError;

          // Serie
          this._Serie = this._Serie.trimStart().trimEnd();
          console.log("Serie" + this._Serie);
          if (( this._Serie == "" ) || ( this._Serie == null ))
          {

            lsError   = "Serial Number Empty!";
            lsTitulo  = "Please write a Serial Number";

            this.aoToastGral.error ( lsTitulo, lsError, { positionClass:'toast-bottom-right_inside' });

            return false;

          }

          return true;

      }

      public BtnEliminar_OnClick ( psSerie : string = "prueba" )  : void {

          var lbResultado = false;

          let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Delete Serie ?",
                                                                                  msj   : "Serie: " + psSerie
                                                                                },
                                                                          width   : '373px',
                                                                          height  : '204px'
                                                                        });

          dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                              if ( lbResultado )
                                                                this.DeleteSerie();
                                                            });

      }

      public BtnGuardar_OnClick()   : void {

          //console.log("close..");
          var lbResultado = true;

          this.aoDialogRef.close ( lbResultado );

          $( '.loading' ).fadeOut ( 'slow' );

      }

      public BtnBorrarSeries_OnClick()  : void {

          var lbResultado = false;

          let dlgConfirmRef = this.aoDialog.open ( FrmConfirmComponent, { data: { title : "¿ Do You Wish to Delete All Series Captured?",
                                                                                  msj   : ""
                                                                                },
                                                                          width   : '370px',
                                                                          height  : '204px'
                                                                        });

          dlgConfirmRef.afterClosed().subscribe ( result => { lbResultado = result;

                                                              if ( lbResultado )
                                                                this.DeleteAllSerie();
                                                            });

      }


    //---------------------------------
    // SECCION: SERIES
    //---------------------------------

        //CONSULTA
        public  GetSeries() {



        }

        //ELIMINACION
        public  DeleteSerie() {



        }

        //ELIMINACION TODAS LAS SERIES
        public  DeleteAllSerie() {



        }

        //ADICION
        public  AddSerie() {



        }

}
