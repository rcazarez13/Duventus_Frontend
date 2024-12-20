import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvConfigUsersService {

    private aoURL         : any;
    private aoURLRaiz     : any = '/users';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ user      : "",
                                          status    : 0,
                                          statusDes : "",
                                          columnsort: "",
                                          ordersort : 0,

                                          FirstName     : "",
                                          LastName      : "",
                                          GPUser        : "",
                                          GPSLPRSNID    : "",
                                          Email         : "",
                                          Telephone     : "",
                                          Registeruser  : "",

                                          roles         : "",
                                          locations     : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetUsers() { this.aoMetodo = '/GetUsers';

                        var varBody   = { user          : this.fbDatos.value.user,
                                          status        : this.fbDatos.value.status,
                                          statusDes     : this.fbDatos.value.statusDes,
                                          columnsort    : this.fbDatos.value.columnsort,
                                          ordersort     : this.fbDatos.value.ordersort };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetUser() { this.aoMetodo = '/GetUser';

                        var varBody   = { user          : this.fbDatos.value.user };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetUser() { this.aoMetodo = '/SetUser';

                        var varBody   = { user          : this.fbDatos.value.user,
                                          FirstName     : this.fbDatos.value.FirstName,
                                          LastName      : this.fbDatos.value.LastName,
                                          GPUser        : this.fbDatos.value.GPUser,
                                          GPSLPRSNID    : this.fbDatos.value.GPSLPRSNID,
                                          Email         : this.fbDatos.value.Email,
                                          Telephone     : this.fbDatos.value.Telephone,
                                          Registeruser  : this.fbDatos.value.Registeruser};

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetUserDelete() { this.aoMetodo = '/SetUserDelete';

                              var varBody   = { user          : this.fbDatos.value.user,
                                                statusDes     : this.fbDatos.value.statusDes,
                                                Registeruser  : this.fbDatos.value.Registeruser };

                              return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public AddUser() { this.aoMetodo = '/AddUser';

                        var varBody   = { user          : this.fbDatos.value.user,
                                          FirstName     : this.fbDatos.value.FirstName,
                                          LastName      : this.fbDatos.value.LastName,
                                          GPUser        : this.fbDatos.value.GPUser,
                                          GPSLPRSNID    : this.fbDatos.value.GPSLPRSNID,
                                          Email         : this.fbDatos.value.Email,
                                          Telephone     : this.fbDatos.value.Telephone,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetRoles() { this.aoMetodo = '/GetRoles';

                        var varBody   = { user          : this.fbDatos.value.user };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetRoles() { this.aoMetodo = '/SetRoles';

                        var varBody   = { user          : this.fbDatos.value.user,
                                          roles         : this.fbDatos.value.roles,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetLocations() { this.aoMetodo = '/GetLocations';

                        var varBody   = { user          : this.fbDatos.value.user };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetLocations() { this.aoMetodo = '/SetLocations';

                        var varBody   = { user          : this.fbDatos.value.user,
                                          locations     : this.fbDatos.value.locations,
                                          Registeruser  : this.fbDatos.value.Registeruser };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
