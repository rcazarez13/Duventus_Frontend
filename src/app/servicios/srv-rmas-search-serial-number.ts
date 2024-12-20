import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvRmasSearchSerialNumberService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/rmassearchserialnumber';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ serialnumber  : "",
                                          columnsort    : "",
                                          ordersort     : 0,

                                          Registeruser  : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetSerialNumber() {  this.aoMetodo = '/GetSerialNumber';

                                var varBody   = { serialnumber  : this.fbDatos.value.serialnumber,
                                                  columnsort    : this.fbDatos.value.columnsort,
                                                  ordersort     : this.fbDatos.value.ordersort };

                                return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetSerialNumberMovimientos() { this.aoMetodo = '/GetSerialNumberMovimientos';

                                          var varBody   = { serialnumber  : this.fbDatos.value.serialnumber,
                                                            columnsort    : this.fbDatos.value.columnsort,
                                                            ordersort     : this.fbDatos.value.ordersort };

                                          return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
