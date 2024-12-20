import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SrvAccountService {

  
    private aoURL         : any;
    private aoURLRaiz     : any = '/account';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ email       : "",
                                          password    : "",
                                          rememberMe  : false,

                                          isauth      : false,

                                          code            : "",
                                          confirmPassword : ""
                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetGral() {  this.aoMetodo = '/GetLogin';

                        this.asParametros = '';
                        this.asParametros = '/' + this.fbDatos.value.email;
                        this.asParametros = '/' + this.fbDatos.value.password;
                        this.asParametros = '/' + this.fbDatos.value.rememberMe;

                        return this.loHttp.get ( this.aoURL + this.aoMetodo + this.asParametros );

    }

    public GetLogin() { this.aoMetodo = '/GetLogin';

                        var varBody   = { email       : this.fbDatos.value.email,
                                          password    : this.fbDatos.value.password,
                                          rememberMe  : this.fbDatos.value.rememberMe,
                                          isauth      : this.fbDatos.value.isauth };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetForgotPassword() {  this.aoMetodo = '/GetForgotPassword';

                                  var varBody   = { email : this.fbDatos.value.email };

                                  return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetResetPassword() { this.aoMetodo = '/GetResetPassword';

                                var varBody   = { email           : this.fbDatos.value.email,
                                                  password        : this.fbDatos.value.password,
                                                  confirmPassword : this.fbDatos.value.confirmPassword,
                                                  code            : this.fbDatos.value.code };

                                return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetCodigoResetPassword() { this.aoMetodo = '/GetCodigoResetPassword';

                                      var varBody   = { email : this.fbDatos.value.email };

                                      return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetMenus() { this.aoMetodo = '/GetMenus';

                        var varBody   = { email           : this.fbDatos.value.email };

                        return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetLogOut() {  this.aoMetodo = '/GetLogOut';

                          var varBody   = { };

                          return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
