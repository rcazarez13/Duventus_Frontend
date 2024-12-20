import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvRmasRequestsService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/rmasrequests';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ id              : 0,
                                          idRMA           : 0,
                                          ticket          : "",
                                          customer        : "",
                                          returnwarehouse : "",
                                          comments        : "",
                                          status          : 0,

                                          columnsort      : "",
                                          ordersort       : 0,

                                          Registeruser    : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetCustomers()         { this.aoMetodo = '/GetCustomers';

                                    var varBody   = { customer      : this.fbDatos.value.customer };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetReturnWareHouse()   { this.aoMetodo = '/GetReturnWareHouse';

                                    var varBody   = { returnwarehouse      : this.fbDatos.value.returnwarehouse };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }
        
    public GetRequests()          { this.aoMetodo = '/GetRequests';

                                    var varBody   = { id          : this.fbDatos.value.id,
                                                      columnsort  : this.fbDatos.value.columnsort,
                                                      ordersort   : this.fbDatos.value.ordersort };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetRequestDelete()  { this.aoMetodo = '/SetRequestDelete';

                                    var varBody   = { id            : this.fbDatos.value.id,
                                                      Registeruser  : this.fbDatos.value.Registeruser };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public AddRequest()           { this.aoMetodo = '/AddRequest';

                                    var varBody   = { id              : this.fbDatos.value.id,
                                                      customer        : this.fbDatos.value.customer,
                                                      returnwarehouse : this.fbDatos.value.returnwarehouse,                                                      
                                                      status          : this.fbDatos.value.status,
                                                      Registeruser    : this.fbDatos.value.Registeruser };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
