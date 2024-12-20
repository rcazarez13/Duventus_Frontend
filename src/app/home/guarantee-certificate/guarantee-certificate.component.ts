import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SrvGuaranteeCertificate } from '../../servicios/srv-guarantee-certificate';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Session } from '../../common/Session';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guarantee-certificate',
  standalone: true,
  imports: [ CommonModule,
             RouterOutlet,
             MatInputModule,
             FormsModule
          ],
  templateUrl: './guarantee-certificate.component.html',
  styleUrl: './guarantee-certificate.component.css'
})
export class GuaranteeCertificateComponent {

    private dtResultado       : any;
    public  dtStates          : any;

    public _Tipo                    : number = 0;
    public _TipoDescripcion         : string = ""; 

    public _OutdoorUnitSerialNumber : string = "";
    public _IndoorUnitSerialNumber  : string = ""; 
    public _MultiZoneIndoor_1       : string = "";
    public _MultiZoneIndoor_2       : string = "";
    public _MultiZoneIndoor_3       : string = "";
    public _MultiZoneIndoor_4       : string = "";
    public _MultiZoneIndoor_5       : string = ""; 

    public _Customer_FirstName      : string = "";
    public _Customer_LastName       : string = "";
    public _Customer_Address_1      : string = "";
    public _Customer_Address_2      : string = "";
    public _Customer_ZipCode        : string = "";
    public _Customer_State          : string = "";
    public _Customer_City           : string = "";
    public _Customer_EmailAddress   : string = "";
    public _Customer_PhoneNumber    : string = "";

    public _Dealer_DateInstalled            : string = "";
    public _Dealer_PurchaseDate             : string = "";
    public _Dealer_ContractorName           : string = "";
    public _Dealer_TechnicianInstallerName  : string = "";
    public _Dealer_HVACLicense              : string = "";
    public _Dealer_InstallerEmailAddress    : string = "";
    public _Dealer_InstallerPhone           : string = "";

    private aiCertificateId                 : number = 0;
    public IsExistCertificate               : boolean = false;
    public IsResendCertificate              : boolean = false;
    public _Resend_EmailResend              : string  = "";

    public asInputId          : string|undefined = "";
    public asTextVal          : string|undefined = "";
    private abValidatorError  : boolean = false;

    public aiMaxLength        : number = 10;

    public asError_Required   : string;
    public asError_Serial     : string;
    public asError_MaxLength  : string;
    public asError_Email      : string;
    public asError_Phone      : string;

    public asSerieValidacion_Unidad : string = "";
    public asSerieValidacion_Serie  : string = "";

    private arrValidators : any[] = []; 
    private arrErrores    : any[] = []; 

  constructor ( private aoSrvGuaranteeCertificateService: SrvGuaranteeCertificate ) {}

    ngOnInit(): void { this.optRadio_Click(0); this.LoadStates(); this.LoadInputErrorMessages(); }

    //---------------------------------
    // EVENTOS

      public  optRadio_Click    ( piValue       : number  ) : void {

            switch ( piValue ) {

              case 0:

                this._Tipo            = 0;
                this._TipoDescripcion = "MiniSplit";

                break;

              case 1:

                this._Tipo            = 1;
                this._TipoDescripcion = "Multizone";

                break;

              case 2:

                this._Tipo            = 2;
                this._TipoDescripcion = "Alpha";

                break;

            }

        //console.log("_Tipo: " + this._Tipo );
        //console.log("_TipoDescripcion: " + this._TipoDescripcion );

      }

      public  btnEnviar_OnClick() {

        if ( this.ValidarCampos() ){

          this.AddGuaranteeCertificate();

        }
      
      }

      public  btnReenviar_OnClick() {

          if ( this.ValidarCampos_Reenviar() ){

            this.SetResendCertificate();

          }
      
      }

      public  ValidarCampos() : boolean {

            var lsTitulo;
            var lsError;

            // VERIFICAMOS QUE NO HALLAN ERRORES EN INPUTS
            this.CheckValidatorsErrors();

            if (( this._TipoDescripcion == 'MiniSplit' || this._TipoDescripcion == 'Alpha' ||
                  this._TipoDescripcion == 'Multizone') && (  this._OutdoorUnitSerialNumber == '' )) {

                lsTitulo  = "Outoor serial number is required";
                lsError   = "You must provide an outdoor serial number";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }

            if (( this._TipoDescripcion == 'MiniSplit' || this._TipoDescripcion == 'Alpha' )
            && (  this._IndoorUnitSerialNumber == '' )) {

                lsTitulo  = "Indoor serial number is required";
                lsError   = "You must provide an indoor serial number";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }
                        
            if ( this._TipoDescripcion == 'Multizone' && (  this._MultiZoneIndoor_1 == '' &&
                                                            this._MultiZoneIndoor_2 == '' &&
                                                            this._MultiZoneIndoor_3 == '' &&
                                                            this._MultiZoneIndoor_4 == '' &&
                                                            this._MultiZoneIndoor_5 == '' )) {

                lsTitulo  = "Multi Zone Indoor serial number is required";
                lsError   = "You must provide an indoor serial number";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }

            let dtCurrentDate: Date = new Date();
            let dtPurchaseDate = this.parseDateString ( this._Dealer_PurchaseDate);

            if ( dtPurchaseDate > dtCurrentDate ) {

                lsTitulo  = "Ivalid purchase date";
                lsError   = "Please provide a date less than or equal to the current date";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }

            let dtDateInstalled  : Date = this.parseDateString ( this._Dealer_DateInstalled );

            if ( dtDateInstalled > dtCurrentDate ) {

                lsTitulo  = "Invalid installation date";
                lsError   = "Please provide a date less than or equal to the current date";

                Swal.fire ( lsTitulo, lsError, "error" );
                
                return false;

            }

            if ( dtPurchaseDate > dtDateInstalled ) {

                lsTitulo  = "Wrong dates";
                lsError   = "Purchase date cannot be greater than installation date";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }

            // SE VERIFICA CON VARIABLE GENERAL DE ERRORES, SI EXISTE UN ERROR APARTE...
            // VARIABLE SE SETEEA EN CheckErrors();
            if ( this.abValidatorError )
              return false;

            return true;

        }

      public  ValidarCampos_Reenviar() : boolean {

            var lsTitulo;
            var lsError;

            // VERIFICAMOS QUE NO HALLAN ERRORES EN INPUTS
            this.CheckValidatorsErrors();

            if (  this._Resend_EmailResend == '' ) {

                lsTitulo  = "Email to Resend is required";
                lsError   = "You must provide an Email to Resend";

                Swal.fire ( lsTitulo, lsError, "error" );

                return false;

            }

            // SE VERIFICA CON VARIABLE GENERAL DE ERRORES, SI EXISTE UN ERROR APARTE...
            // VARIABLE SE SETEEA EN CheckErrors();
            if ( this.abValidatorError )
              return false;

            return true;

        }

      private CheckValidatorsErrors() {

          // -------------------------------------------
          // FILA: PRODUCT INFO
          // -------------------------------------------

            this.arrValidators.push({ ElementId: 'OutdoorUnitSerialNumber' });
            this.arrValidators.push({ ElementId: 'IndoorUnitSerialNumber' });
            this.arrValidators.push({ ElementId: 'MultiZoneIndoor_1' });
            this.arrValidators.push({ ElementId: 'MultiZoneIndoor_2' });
            this.arrValidators.push({ ElementId: 'MultiZoneIndoor_3' });
            this.arrValidators.push({ ElementId: 'MultiZoneIndoor_4' });
            this.arrValidators.push({ ElementId: 'MultiZoneIndoor_5' });

          // -------------------------------------------
          // FILA: Campos Customer Info
          // -------------------------------------------

            this.arrValidators.push ({ ElementId: 'Customer_FirstName' });
            this.arrValidators.push ({ ElementId: 'Customer_Address_1' });
            this.arrValidators.push ({ ElementId: 'Customer_Address_2' });
            this.arrValidators.push ({ ElementId: 'Customer_State' });
            this.arrValidators.push ({ ElementId: 'Customer_EmailAddress' });
            this.arrValidators.push ({ ElementId: 'Customer_LastName' });
            this.arrValidators.push ({ ElementId: 'Customer_ZipCode' });
            this.arrValidators.push ({ ElementId: 'Customer_City' });
            this.arrValidators.push ({ ElementId: 'Customer_PhoneNumber' });

          // -------------------------------------------
          // FILA: Campos Dealer Info
          // -------------------------------------------

            this.arrValidators.push ({ ElementId: 'Dealer_DateInstalled' });
            this.arrValidators.push ({ ElementId: 'Dealer_ContractorName' });
            this.arrValidators.push ({ ElementId: 'Dealer_PurchaseDate' });
            this.arrValidators.push ({ ElementId: 'Dealer_TechnicianInstallerName' });
            this.arrValidators.push ({ ElementId: 'Dealer_InstallerEmailAddress' });
            this.arrValidators.push ({ ElementId: 'Dealer_HVACLicense' });
            this.arrValidators.push ({ ElementId: 'Dealer_InstallerPhone' });

          // -------------------------------------------
          // FILA: Campos Reenvio de Certificado
          // -------------------------------------------

            this.arrValidators.push ({ ElementId: 'Resend_EmailResend' });

            // RECORREMOS ARREGLO DE VALIDADORES Y EMULAMOS EN CADA UNO EL EVENTOS
            // PARA QUE SE INGRESE AUTOMATICAMENTE CADA CAMPO INPUT EN VALIDACIONES
            for ( const actualRow of this.arrValidators ) {

                let lsElementId: string = actualRow.ElementId;

                if ( lsElementId != null ) {

                    var loElemento = document.getElementById ( lsElementId );

                    loElemento?.focus();
                    loElemento?.blur();
                    loElemento?.click();

                }

            }

      }

      private LimpiarCampos() : void {

          this.optRadio_Click ( 0 );

          this._OutdoorUnitSerialNumber = "";
          this._IndoorUnitSerialNumber  = ""; 
          this._MultiZoneIndoor_1       = "";
          this._MultiZoneIndoor_2       = "";
          this._MultiZoneIndoor_3       = "";
          this._MultiZoneIndoor_4       = "";
          this._MultiZoneIndoor_5       = ""; 

          this._Customer_FirstName      = "";
          this._Customer_LastName       = "";
          this._Customer_Address_1      = "";
          this._Customer_Address_2      = "";
          this._Customer_ZipCode        = "";
          this._Customer_State          = "";
          this._Customer_City           = "";
          this._Customer_EmailAddress   = "";
          this._Customer_PhoneNumber    = "";

          this._Dealer_DateInstalled            = "";
          this._Dealer_PurchaseDate             = "";
          this._Dealer_ContractorName           = "";
          this._Dealer_TechnicianInstallerName  = "";
          this._Dealer_HVACLicense              = "";
          this._Dealer_InstallerEmailAddress    = "";
          this._Dealer_InstallerPhone           = "";

          this.IsExistCertificate = false;
          this.aiCertificateId    = 0;

        }

      private parseDateString   ( psDateString  : string ) {

        const dateOnlyRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])))$/

        if ( dateOnlyRegex.test ( psDateString )) {

          const utcDate     = new Date ( psDateString );
          const localDate   = new Date ( utcDate.getTime() + utcDate.getTimezoneOffset() * 60000 );

          return localDate;

        }

        return new Date ( psDateString );

      }

      private LoadStates() {

          var lstStates     : object[] = [];

          lstStates.push ({ value: 'Alaska' });
          lstStates.push ({ value: 'Arizona' });
          lstStates.push ({ value: 'Arkansas' });
          lstStates.push ({ value: 'California' });
          lstStates.push ({ value: 'Colorado' });
          lstStates.push ({ value: 'Connecticut' });
          lstStates.push ({ value: 'Delaware' });
          lstStates.push ({ value: 'District Of Columbia' });
          lstStates.push ({ value: 'Florida' });
          lstStates.push ({ value: 'Georgia' });
          lstStates.push ({ value: 'Hawaii' });
          lstStates.push ({ value: 'Idaho' });
          lstStates.push ({ value: 'Illinois' });
          lstStates.push ({ value: 'Iowa' });
          lstStates.push ({ value: 'Kansas' });
          lstStates.push ({ value: 'Kentucky' });
          lstStates.push ({ value: 'Louisiana' });
          lstStates.push ({ value: 'Maine' });
          lstStates.push ({ value: 'Maryland' });
          lstStates.push ({ value: 'Massachusetts' });
          lstStates.push ({ value: 'Michigan' });
          lstStates.push ({ value: 'Minnesota' });
          lstStates.push ({ value: 'Mississippi' });
          lstStates.push ({ value: 'Missouri' });
          lstStates.push ({ value: 'Montana' });
          lstStates.push ({ value: 'Nebraska' });
          lstStates.push ({ value: 'Nevada' });
          lstStates.push ({ value: 'New Hampshire' });
          lstStates.push ({ value: 'New Jersey' });
          lstStates.push ({ value: 'New Mexico' });
          lstStates.push ({ value: 'New York' });
          lstStates.push ({ value: 'North Carolina' });
          lstStates.push ({ value: 'North Dakota' });
          lstStates.push ({ value: 'Ohio' });
          lstStates.push ({ value: 'Oklahoma' });
          lstStates.push ({ value: 'Oregon' });
          lstStates.push ({ value: 'Pennsylvania' });
          lstStates.push ({ value: 'Rhode Island' });
          lstStates.push ({ value: 'South Carolina' });
          lstStates.push ({ value: 'South Dakota' });
          lstStates.push ({ value: 'Tennessee' });
          lstStates.push ({ value: 'Texas' });
          lstStates.push ({ value: 'Utah' });
          lstStates.push ({ value: 'Vermont' });
          lstStates.push ({ value: 'Virginia' });
          lstStates.push ({ value: 'Washington' });
          lstStates.push ({ value: 'West Virginia' });
          lstStates.push ({ value: 'Wisconsin' });
          lstStates.push ({ value: 'Wyoming' });

        //var lsPermissions = JSON.stringify ( lstPermissions );

        this.dtStates = lstStates;

      }

      public  onCheckSerialError  ( event   : { target: any; srcElement: any; currentTarget: any; },
                                    psValId : string, psUnit : string ) : void {

          var target  = event.target || event.srcElement || event.currentTarget;
          var id      = target.id;
          var value   = target.value;

          let lsInputId : string = id;
          let lsValId   : string = psValId;
          let lsTextVal : string = value;
          let lsUnit    : string = psUnit;

          this.asSerieValidacion_Unidad = lsUnit;
          this.asSerieValidacion_Serie  = lsTextVal;

          var loInput     = document.getElementById ( lsInputId );
          var loValidator = document.getElementById ( lsValId   );

          if (( lsTextVal != "" ) && ( lsTextVal != null ))
          {            

              this.GetNomenclatureValidation ( loInput, loValidator, lsTextVal, lsUnit );      

              return;

          }

          if ( loValidator != null ){

              loValidator.style.display = "none";

              if ( loInput != null )
                  loInput.style.border = "";

              // ELIMINAMOS EL ERROR....
              this.CheckErrors ( lsValId, 'onCheckSerialError', 0 );

          }

      }

      public  onCheckRequried     ( event   : { target: any; srcElement: any; currentTarget: any; },
                                    psValId : string ) : void {

          var target  = event.target || event.srcElement || event.currentTarget;
          var id      = target.id;
          var value   = target.value;

          let lsInputId : string = id;
          let lsValId   : string = psValId;
          let lsTextVal : string = value;

          var loInput     = document.getElementById ( lsInputId );
          var loValidator = document.getElementById ( lsValId );

          if (( lsTextVal == "" ) || ( lsTextVal == null ))
          {            

              if ( loValidator != null ) {

                loValidator.style.display = "block";

                if ( loInput != null )
                  loInput.style.border = "1px solid #cc0000";

                // AGREGAMOS EL ERROR....
                this.CheckErrors ( lsValId, 'onCheckRequried', 1 );

                return;

              }

          }

          if ( loValidator != null ){

              loValidator.style.display = "none";

              if ( loInput != null )
                  loInput.style.border = "";

              // ELIMINAMOS EL ERROR....
              this.CheckErrors ( lsValId, 'onCheckRequried', 0 );

          }

      }

      public  onCheckMaxLength    ( event   : { target: any; srcElement: any; currentTarget: any; },
                                    psValId : string, piMaxLength : number ) : void {

          var target  = event.target || event.srcElement || event.currentTarget;
          var id      = target.id;
          var value   = target.value;

          let lsInputId : string = id;
          let lsValId   : string = psValId;
          let lsTextVal : string = value;

          var loInput     = document.getElementById ( lsInputId );
          var loValidator = document.getElementById ( lsValId );

          if (( lsTextVal != "" ) && ( lsTextVal != null )) {

              if ( lsTextVal.length > piMaxLength )
              {            

                  if ( loValidator != null ) {

                    this.asError_MaxLength = "The maximun length for this field is " + piMaxLength + " characters";

                    loValidator.style.display = "block";

                    if ( loInput != null )
                      loInput.style.border = "1px solid #cc0000";

                    // AGREGAMOS EL ERROR....
                    this.CheckErrors ( lsValId, 'onCheckMaxLength', 1 );

                    return;

                  }

              }
              else
              {

                  if ( loValidator != null ) {

                      loValidator.style.display = "none";

                      if ( loInput != null )
                          loInput.style.border = "";

                      // ELIMINAMOS EL ERROR....
                      this.CheckErrors ( lsValId, 'onCheckMaxLength', 0 );

                  }              

              }

          }

      }

      public  onCheckEmail        ( event   : { target: any; srcElement: any; currentTarget: any; },
                                    psValId : string ) : void {

          var target  = event.target || event.srcElement || event.currentTarget;
          var id      = target.id;
          var value   = target.value;

          let lsInputId : string = id;
          let lsValId   : string = psValId;
          let lsTextVal : string = value;

          var loInput     = document.getElementById ( lsInputId );
          var loValidator = document.getElementById ( lsValId );

          if (( lsTextVal != "" ) && ( lsTextVal != null )) {

              // REGEX PARA EMAILS
              var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

              if ( !regexp.test ( lsTextVal ))
              {            

                  if ( loValidator != null ) {

                    loValidator.style.display = "block";

                    if ( loInput != null )
                      loInput.style.border = "1px solid #cc0000";

                    // AGREGAMOS EL ERROR....
                    this.CheckErrors ( lsValId, 'onCheckEmail', 1 );

                    return;

                  }

              }
              else
              {

                  if ( loValidator != null ) {

                      loValidator.style.display = "none";

                      if ( loInput != null )
                          loInput.style.border = "";

                      // ELIMINAMOS EL ERROR....
                      this.CheckErrors ( lsValId, 'onCheckEmail', 0 );

                  }              

              }

          }

      }

      public  onCheckPhone        ( event   : { target: any; srcElement: any; currentTarget: any; },
                                    psValId : string ) : void {

          var target  = event.target || event.srcElement || event.currentTarget;
          var id      = target.id;
          var value   = target.value;

          let lsInputId : string = id;
          let lsValId   : string = psValId;
          let lsTextVal : string = value;

          var loInput     = document.getElementById ( lsInputId );
          var loValidator = document.getElementById ( lsValId );

          if (( lsTextVal != "" ) && ( lsTextVal != null )) {

              // REGEX PARA TELEFONOS
              var regexp = new RegExp(/^(1[ -]?)?\d{3}[ -]?\d{3}[ -]?\d{4}$/);

              if ( !regexp.test ( lsTextVal ))
              {            

                  if ( loValidator != null ) {

                    loValidator.style.display = "block";

                    if ( loInput != null )
                      loInput.style.border = "1px solid #cc0000";

                    // AGREGAMOS EL ERROR....
                    this.CheckErrors ( lsValId, 'onCheckPhone', 1 );

                    return;

                  }

              }
              else
              {

                  if ( loValidator != null ) {

                      loValidator.style.display = "none";

                      if ( loInput != null )
                          loInput.style.border = "";

                      // ELIMINAMOS EL ERROR....
                      this.CheckErrors ( lsValId, 'onCheckPhone', 0 );

                  }              

              }

          }

      }

      private LoadInputErrorMessages() {

          this.asError_Serial     = "Serial Error";
          this.asError_Required   = "Required";          
          this.asError_MaxLength  = "The maximun length for this field is " + this.aiMaxLength + " characters";
          this.asError_Email      = "Email must be example@domain.com";
          this.asError_Phone      = "Phone Incorrect format";

      }

      private CheckErrors       ( poElementId : string, psError : string, piType : number ) {

          // TIPO 1: PARA INGRESAR UN ERROR 
          if ( piType == 1 ){

              this.arrErrores.push ({ ElementId: poElementId, Error: psError });

              //return;

          }

          // TIPO 2: PARA BORRAR UN ERROR(es)
          if ( piType == 0 ){

              for ( const actualRow of this.arrErrores ) {

                  let lsElementId: string = actualRow.ElementId;

                  if ( lsElementId == poElementId ) {

                        actualRow.ElementId = null;
                        actualRow.Error     = null;

                  }

              }

              //return;

          }

          // RECORREMOS ARRAY DE ERRORES, SI HAY AL MENOS 1 ERROR
          // MARCAREMOS VARIABLE A TRUE, SINO HAY ERRORES SERA FALSE
          for ( const actualRow of this.arrErrores ) {

            let lsElementId: string = actualRow.ElementId;

            if ( lsElementId != null ) {

                this.abValidatorError = true;

                return;

            }

          }

          this.abValidatorError = false;

      }

      public  ShowResendView     ( pbIsResend : boolean ) : void{

          if ( pbIsResend ){
            /*
              let lsInputId   : string = 'contenedor_generator';

              var loInput     = document.getElementById ( lsInputId );

              if ( loInput != null )
                loInput.style.visibility = "false";
            */

            this.IsResendCertificate = true;

          }
          else {

              this.IsResendCertificate = false;

          }

      }

    //---------------------------------
    // CONSULTA

      public GetNomenclatureValidation ( loInput : HTMLElement|null, loValidator : HTMLElement|null, psUnit : string, psSerial : string ) {

          //console.log ( "Loading Serial Numbers ..." );

          //Swal.fire ({  title: 'Processing Data',
          //              html: '<div class="loader mx-auto"></div>' + 'Please wait...<br />while data is processing',
          //              showConfirmButton: false,
          //              allowOutsideClick: false });

          this.aoSrvGuaranteeCertificateService.fbDatos.value.tipodescripcion         =   this._TipoDescripcion;

          this.aoSrvGuaranteeCertificateService.fbDatos.value.serievalidacion_unidad  =   this.asSerieValidacion_Unidad;
          this.aoSrvGuaranteeCertificateService.fbDatos.value.serievalidacion_serie   =   this.asSerieValidacion_Serie;

          this.aoSrvGuaranteeCertificateService.GetNomenclatureValidation()
              .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                //Swal.close();

                  if ( this.dtResultado != null ) {

                    var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                    if ( resultado > 0 ) {  if ( loValidator != null ){ loValidator.style.display = "none";

                                                                        if ( loInput != null )
                                                                            loInput.style.border = "";

                                                                        this.abValidatorError = false;

                                                                        let lsValId : string = loValidator.id;

                                                                        // ELIMINAMOS EL ERROR....
                                                                        this.CheckErrors ( lsValId, 'onCheckSerialError', 0 );

                                                                      }

                                            return; }

                    if ( resultado < 0 ) {  let lsError   : string = this.dtResultado [ 0 ][ "RES_ERROR" ];

                                            if ( loValidator != null ) { loValidator.style.display = "block";

                                                                          if ( loInput != null )
                                                                            loInput.style.border = "1px solid #cc0000";

                                                                          this.abValidatorError = true;

                                                                          let lsValId : string = loValidator.id;

                                                                          // AGREGAMOS EL ERROR....
                                                                          this.CheckErrors ( lsValId, 'onCheckSerialError', 1 );

                                                                        }

                                            return; }

                    //Swal.fire ( "Error!",  "Error saving guarantee certificate", "error" );

                    return;

                  }

                  //Swal.fire ( "Network Error!",  "Error saving guarantee certificate", "error" );

              });

        }

      public AddGuaranteeCertificate() {

            //console.log ( "Loading Serial Numbers ..." );

            Swal.fire ({  title: 'Processing Data',
                          html: '<div class="loader mx-auto"></div>' + 'Please wait...<br />while data is processing',
                          showConfirmButton: false,
                          allowOutsideClick: false });

            this.aoSrvGuaranteeCertificateService.fbDatos.value.tipo                    =   this._Tipo;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.tipodescripcion         =   this._TipoDescripcion;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.outdoorunitserialnumber =   this._OutdoorUnitSerialNumber;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.indoorunitserialnumber  =   this._IndoorUnitSerialNumber;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_1       =   this._MultiZoneIndoor_1;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_2       =   this._MultiZoneIndoor_2;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_3       =   this._MultiZoneIndoor_3;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_4       =   this._MultiZoneIndoor_4;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_5       =   this._MultiZoneIndoor_5;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_firstname      =   this._Customer_FirstName;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_lastname       =   this._Customer_LastName;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_address_1      =   this._Customer_Address_1;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_address_2      =   this._Customer_Address_2;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_zipcode        =   this._Customer_ZipCode;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_state          =   this._Customer_State;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_city           =   this._Customer_City;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_emailaddress   =   this._Customer_EmailAddress;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.customer_phonenumber    =   this._Customer_PhoneNumber;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_dateinstalled            =   this._Dealer_DateInstalled;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_purchasedate             =   this._Dealer_PurchaseDate;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_contractorname 	        =   this._Dealer_ContractorName;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_technicianinstallername  =   this._Dealer_TechnicianInstallerName;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_hvaclicense              =   this._Dealer_HVACLicense;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_installeremailaddress    =   this._Dealer_InstallerEmailAddress;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.dealer_installerphone           =   this._Dealer_InstallerPhone;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.Registeruser                    = Session.getEmail();

            this.aoSrvGuaranteeCertificateService.AddGuaranteeCertificate()
                .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  Swal.close();

                    if ( this.dtResultado != null ) {

                      var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                      if ( resultado > 0 ) {    let lsTitulo  : string = this.dtResultado [ 0 ][ "RES_MENSAJE_TITULO"   ];
                                                let lsMensaje : string = this.dtResultado [ 0 ][ "RES_MENSAJE_DETALLE"  ];

                                                Swal.fire ( lsTitulo, lsMensaje, "success" );

                                                if ( resultado == 1 )
                                                    this.LimpiarCampos();

                                                if ( resultado != 1 ){

                                                    let liCertificateId : number = resultado;

                                                    this.IsExistCertificate = true;
                                                    this.aiCertificateId    = liCertificateId;

                                                }                                                    

                                                return;

                                           }

                      if ( resultado < 0 ) {    let lsTitulo  : string = this.dtResultado [ 0 ][ "RES_MENSAJE_TITULO"   ];
                                                let lsMensaje : string = this.dtResultado [ 0 ][ "RES_MENSAJE_DETALLE"  ];
                                                let lsError   : string = this.dtResultado [ 0 ][ "RES_ERROR" ];

                                                Swal.fire ( lsTitulo, lsMensaje + lsError, "error" );

                                                return;
                                             }

                      Swal.fire ( "Error!",  "Error saving guarantee certificate", "error" );

                      return;

                    }

                    Swal.fire ( "Network Error!",  "Error saving guarantee certificate", "error" );

                });

        }

      public SetResendCertificate() {

            //console.log ( "Loading Serial Numbers ..." );

            Swal.fire ({  title: 'Processing Data',
                          html: '<div class="loader mx-auto"></div>' + 'Please wait...<br />while data is processing',
                          showConfirmButton: false,
                          allowOutsideClick: false });

            this.aoSrvGuaranteeCertificateService.fbDatos.value.tipodescripcion         =   this._TipoDescripcion;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.outdoorunitserialnumber =   this._OutdoorUnitSerialNumber;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.indoorunitserialnumber  =   this._IndoorUnitSerialNumber;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_1       =   this._MultiZoneIndoor_1;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_2       =   this._MultiZoneIndoor_2;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_3       =   this._MultiZoneIndoor_3;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_4       =   this._MultiZoneIndoor_4;
            this.aoSrvGuaranteeCertificateService.fbDatos.value.multizoneindoor_5       =   this._MultiZoneIndoor_5;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.resendemailaddress      =   this._Resend_EmailResend;

            this.aoSrvGuaranteeCertificateService.fbDatos.value.Registeruser            =   Session.getEmail();

            this.aoSrvGuaranteeCertificateService.SetResendCertificate()
                .subscribe ( respuesta => { this.dtResultado  = JSON.parse ( respuesta.toString());

                  Swal.close();

                    if ( this.dtResultado != null ) {

                      var resultado = this.dtResultado [ 0 ][ "RES_RESULTADO" ];

                      if ( resultado > 0 ) {    let lsTitulo  : string = this.dtResultado [ 0 ][ "RES_MENSAJE_TITULO"   ];
                                                let lsMensaje : string = this.dtResultado [ 0 ][ "RES_MENSAJE_DETALLE"  ];

                                                Swal.fire ( lsTitulo, lsMensaje, "success" );                                            

                                                return;

                                           }

                      if ( resultado < 0 ) {    let lsTitulo  : string = this.dtResultado [ 0 ][ "RES_MENSAJE_TITULO"   ];
                                                let lsMensaje : string = this.dtResultado [ 0 ][ "RES_MENSAJE_DETALLE"  ];
                                                let lsError   : string = this.dtResultado [ 0 ][ "RES_ERROR" ];

                                                Swal.fire ( lsTitulo, lsMensaje + lsError, "error" );

                                                return;
                                             }

                      Swal.fire ( "Error!",  "Error sending guarantee certificate", "error" );

                      return;

                    }

                    Swal.fire ( "Network Error!",  "Error sending guarantee certificate", "error" );

                });

        }

}
