import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvRmasInventoryService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/rmasinventory';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ location      : "",
                                          type          : "",
                                          itemnumber    : "",
                                          sparepart     : "",
                                          columnsort    : "",
                                          ordersort     : 0,

                                          Registeruser  : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetLocations() { this.aoMetodo = '/GetLocations';

                            var varBody   = { Registeruser    : this.fbDatos.value.Registeruser };

                            return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetTypes() { this.aoMetodo = '/GetTypes';

                        var varBody   = { type    : this.fbDatos.value.location };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetSpareParts() { this.aoMetodo = '/GetSpareParts';

                              var varBody   = { sparepart   : this.fbDatos.value.sparepart,
                                                columnsort  : this.fbDatos.value.columnsort,
                                                ordersort   : this.fbDatos.value.ordersort };

                              return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetInventory() { this.aoMetodo = '/GetInventory';

                            var varBody   = { location      : this.fbDatos.value.location,
                                              type          : this.fbDatos.value.type,
                                              itemnumber    : this.fbDatos.value.itemnumber,

                                              columnsort    : this.fbDatos.value.columnsort,
                                              ordersort     : this.fbDatos.value.ordersort,

                                              Registeruser  : this.fbDatos.value.Registeruser };

                            return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
