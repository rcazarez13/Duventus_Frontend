import { Component, Inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  msj: string;
}

  @Injectable({
    providedIn: 'root'
  })

  @Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.css'
  })

export class LoadingComponent {

    public _Title : string = "Titulo";
    public _Msj   : string = "Mensaje secundario";

    constructor ( @Inject ( MAT_DIALOG_DATA ) public data: DialogData ) {

      this.Show ( data.title, data.msj );

    }

    public Show ( psTitle : string, psMsj : string ): void {

      this._Title = psTitle;
      this._Msj   = psMsj;

      $( '.loading' ).fadeIn ( 'slow' );

    }

    public Close(): void {

      $( '.loading' ).fadeOut ( 'slow' );

    }

}
