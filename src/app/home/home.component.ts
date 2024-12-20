import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import $ from 'jquery';
import { Session } from '../common/Session';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

      // DATOS DE PAGINA HOME PARA SECCION FOOTER
      public aiYear           : number = new Date().getFullYear();

      public asURL_HvacMirage : string = "https://hvacmirage.us/";
      public asURL_DuVentus   : string = "https://duventus.com/";

      constructor ( private aoRouter            : Router,
                    private route               : ActivatedRoute ) { }


      // LOADER AL INICIO, LOGO Y TEXTO MOSTRANDO CARGA DE PAGINA.
      ngOnInit(): void {

        $('.loader_main' ).fadeOut ( 'slow' );

      }

}
