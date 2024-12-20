import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SrvUrlService } from './srv-url.service';

@Injectable({
  providedIn: 'root'
})
export class SrvGuaranteeCertificate {

    private aoURL         : any;
    private aoURLRaiz     : any = '/guaranteecertificate';
    private aoMetodo      : any;

    private asParametros  : string = ''

    public fbDatos = this.loForm.group ({ tipo                    : 0,
                                          tipodescripcion         : "", 

                                          outdoorunitserialnumber : "",
                                          indoorunitserialnumber  : "", 
                                          multizoneindoor_1       : "",
                                          multizoneindoor_2       : "",
                                          multizoneindoor_3       : "",
                                          multizoneindoor_4       : "",
                                          multizoneindoor_5       : "", 

                                          customer_firstname      : "",
                                          customer_lastname       : "",
                                          customer_address_1      : "",
                                          customer_address_2      : "",
                                          customer_zipcode        : "",
                                          customer_state          : "",
                                          customer_city           : "",
                                          customer_emailaddress   : "",
                                          customer_phonenumber    : "",

                                          dealer_dateinstalled            : "",
                                          dealer_purchasedate             : "",
                                          dealer_contractorname           : "",
                                          dealer_technicianinstallername  : "",
                                          dealer_hvaclicense              : "",
                                          dealer_installeremailaddress    : "",
                                          dealer_installerphone           : "",

                                          columnsort                      : "",
                                          ordersort                       : 0,

                                          Registeruser                    : "",

                                          serievalidacion_unidad          : "",
                                          serievalidacion_serie           : "",

                                          certificateid                   : 0,
                                          resendemailaddress              : ""

                                        });

    constructor ( private loHttp    : HttpClient,
                  private loURL     : SrvUrlService,
                  private loForm    : FormBuilder ) { this.aoURL = this.loURL._UrlBase + this.aoURLRaiz; }

    public GetGuaranteeCertificates() {  this.aoMetodo = '/GetGuaranteeCertificates';

                                var varBody   = { columnsort    : this.fbDatos.value.columnsort,
                                                  ordersort     : this.fbDatos.value.ordersort };

                                return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public GetNomenclatureValidation() {  this.aoMetodo = '/GetNomenclatureValidation';

                                var varBody   = { tipodescripcion         : this.fbDatos.value.tipodescripcion,
                                                  serievalidacion_unidad  : this.fbDatos.value.serievalidacion_unidad,
                                                  serievalidacion_serie   : this.fbDatos.value.serievalidacion_serie };

                                return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public AddGuaranteeCertificate() {  this.aoMetodo = '/AddGuaranteeCertificate';

                                var varBody   = { tipo                    : this.fbDatos.value.tipo,
                                                  tipodescripcion         : this.fbDatos.value.tipodescripcion, 

                                                  outdoorunitserialnumber : this.fbDatos.value.outdoorunitserialnumber,
                                                  indoorunitserialnumber  : this.fbDatos.value.indoorunitserialnumber, 
                                                  multizoneindoor_1       : this.fbDatos.value.multizoneindoor_1,
                                                  multizoneindoor_2       : this.fbDatos.value.multizoneindoor_2,
                                                  multizoneindoor_3       : this.fbDatos.value.multizoneindoor_3,
                                                  multizoneindoor_4       : this.fbDatos.value.multizoneindoor_4,
                                                  multizoneindoor_5       : this.fbDatos.value.multizoneindoor_5, 

                                                  customer_firstname      : this.fbDatos.value.customer_firstname,
                                                  customer_lastname       : this.fbDatos.value.customer_lastname,
                                                  customer_address_1      : this.fbDatos.value.customer_address_1,
                                                  customer_address_2      : this.fbDatos.value.customer_address_2,
                                                  customer_zipcode        : this.fbDatos.value.customer_zipcode,
                                                  customer_state          : this.fbDatos.value.customer_state,
                                                  customer_city           : this.fbDatos.value.customer_city,
                                                  customer_emailaddress   : this.fbDatos.value.customer_emailaddress,
                                                  customer_phonenumber    : this.fbDatos.value.customer_phonenumber,

                                                  dealer_dateinstalled            : this.fbDatos.value.dealer_dateinstalled,
                                                  dealer_purchasedate             : this.fbDatos.value.dealer_purchasedate,
                                                  dealer_contractorname           : this.fbDatos.value.dealer_contractorname,
                                                  dealer_technicianinstallername  : this.fbDatos.value.dealer_technicianinstallername,
                                                  dealer_hvaclicense              : this.fbDatos.value.dealer_hvaclicense,
                                                  dealer_installeremailaddress    : this.fbDatos.value.dealer_installeremailaddress,
                                                  dealer_installerphone           : this.fbDatos.value.dealer_installerphone,

                                                  Registeruser                    : this.fbDatos.value.Registeruser };

                                return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

    public SetResendCertificate() { this.aoMetodo = '/SetResendCertificate';

                                    var varBody   = { tipodescripcion         : this.fbDatos.value.tipodescripcion, 

                                                      outdoorunitserialnumber : this.fbDatos.value.outdoorunitserialnumber,
                                                      indoorunitserialnumber  : this.fbDatos.value.indoorunitserialnumber, 
                                                      multizoneindoor_1       : this.fbDatos.value.multizoneindoor_1,
                                                      multizoneindoor_2       : this.fbDatos.value.multizoneindoor_2,
                                                      multizoneindoor_3       : this.fbDatos.value.multizoneindoor_3,
                                                      multizoneindoor_4       : this.fbDatos.value.multizoneindoor_4,
                                                      multizoneindoor_5       : this.fbDatos.value.multizoneindoor_5,

                                                      resendemailaddress      : this.fbDatos.value.resendemailaddress,

                                                      Registeruser            : this.fbDatos.value.Registeruser };

                                    return this.loHttp.post ( this.aoURL + this.aoMetodo, varBody );

    }

}
