import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SrvUrlService {
  
  //public _UrlBase : string = "http://localhost:51482/api";              // NORMAL LOCALHOST
  //public _UrlBase : string = "https://localhost:44313/api";             // NORMAL LOCALHOST SSL

  //public _UrlBase: string   = "http://localhost/HVACMirage.API/api";    // DESARROLLO LOCALHOST
  //public _UrlBase: string = "http://192.168.12.144:4201/api";           // PRUEBAS    RED LOCAL

  public _UrlBase: string = "https://hvacmirageapi-test-bwcpf2ghfda6g4b4.southcentralus-01.azurewebsites.net/api"; // PRUEBAS PRODUCCION


  constructor() { }

}
