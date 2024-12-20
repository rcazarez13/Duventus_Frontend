import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvConfigRolesService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/roles';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ rol           : "",
                                          rolName       : "",
                                          rolId         : "",
                                          columnsort    : "",
                                          ordersort     : 0,

                                          Registeruser  : "",

                                          permissions   : "",
                                          requests      : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetRoles() { this.aoMetodo = '/GetRoles';

                        var varBody   = { columnsort    : this.fbDatos.value.columnsort,
                                          ordersort     : this.fbDatos.value.ordersort };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetRol() { this.aoMetodo = '/GetRol';

                        var varBody   = { rol          : this.fbDatos.value.rol };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetRol() { this.aoMetodo = '/SetRol';

                        var varBody   = { rol           : this.fbDatos.value.rol,
                                          rolName       : this.fbDatos.value.rolName,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetRolDelete() { this.aoMetodo = '/SetRolDelete';

                              var varBody   = { rol           : this.fbDatos.value.rol,
                                                Registeruser  : this.fbDatos.value.Registeruser };

                              return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public AddRol() { this.aoMetodo = '/AddRol';

                        var varBody   = { rol           : this.fbDatos.value.rol,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetPermissions() { this.aoMetodo = '/GetPermissions';

                        var varBody   = { rol   : this.fbDatos.value.rol,
                                          rolId : this.fbDatos.value.rolId  };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetPermissions() { this.aoMetodo = '/SetPermissions';

                        var varBody   = { rol           : this.fbDatos.value.rol,
                                          rolId         : this.fbDatos.value.rolId,
                                          permissions   : this.fbDatos.value.permissions,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetRequests() { this.aoMetodo = '/GetRequests';

                        var varBody   = { rol     : this.fbDatos.value.rol,
                                          rolId   : this.fbDatos.value.rolId   };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetRequests() { this.aoMetodo = '/SetRequests';

                        var varBody   = { rol           : this.fbDatos.value.rol,
                                          rolId         : this.fbDatos.value.rolId,
                                          requests      : this.fbDatos.value.requests,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
