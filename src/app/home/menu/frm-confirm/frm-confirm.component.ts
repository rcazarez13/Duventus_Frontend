import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
export interface DialogData {

  title : string;
  msj   : string;

}

@Component({
  selector: 'app-frm-confirm',
  standalone: true,
  imports: [ CommonModule,
            MatCardModule,
            MatButtonModule,
            MatTooltipModule
          ],
  templateUrl: './frm-confirm.component.html',
  styleUrl: './frm-confirm.component.css'
})

export class FrmConfirmComponent {

    public  _Titulo     : string  = "";
    public  _Texto      : string  = "";

    private _Respuesta  : boolean = false;

    constructor ( public aoDialogRef                    : MatDialogRef < FrmConfirmComponent >,
                  @Inject(MAT_DIALOG_DATA) public data  : DialogData ) {

        this._Titulo  = data.title;
        this._Texto   = data.msj;

        this.Show();

    }

    //---------------------------------
    // EVENTOS

    public Show()               : void {

      $( '.loading' ).fadeIn ( 'slow' );

    }

    public Close()              : void {     

        //console.log("close..");

        $('.loading').fadeOut('slow');

        this.aoDialogRef.close ( this._Respuesta );      

    }

    public BtnOk_OnClick()      : void {

        this._Respuesta = true;

        this.Close(); 

    }

    public BtnCancel_OnClick()  : void {

        this._Respuesta = false;

        this.Close();

    }

}
