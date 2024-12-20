import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvRmasAuthorizersService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/rmasauthorizers';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ id            : 0,
                                          location      : 0,
                                          user          : 0,
                                          status        : 0,

                                          columnsort    : "",
                                          ordersort     : 0,

                                          Registeruser  : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetLocations()         { this.aoMetodo = '/GetLocations';

                                    var varBody   = { location      : this.fbDatos.value.location };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetUsers()             { this.aoMetodo = '/GetUsers';

                                    var varBody   = { location      : this.fbDatos.value.location };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetAuthorizers()       { this.aoMetodo = '/GetAuthorizers';

                                    var varBody   = { id          : this.fbDatos.value.id,
                                                      columnsort  : this.fbDatos.value.columnsort,
                                                      ordersort   : this.fbDatos.value.ordersort };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetAuthorizerDelete()  { this.aoMetodo = '/SetAuthorizerDelete';

                                    var varBody   = { id            : this.fbDatos.value.id,
                                                      Registeruser  : this.fbDatos.value.Registeruser };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public AddAuthorizer()        { this.aoMetodo = '/AddAuthorizer';

                                    var varBody   = { id            : this.fbDatos.value.id,
                                                      location      : this.fbDatos.value.location,
                                                      user          : this.fbDatos.value.user,
                                                      status        : this.fbDatos.value.status,
                                                      Registeruser  : this.fbDatos.value.Registeruser };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
