import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoEfectivoService {

  public url;
  
  constructor(
    private _http : HttpClient
  ){
    this.url = environment.baseUrl;
  }

  registro(data:any){
    return this._http.post<any>(`${this.url}/pagoefectivo/store`,data);
  }

  listar(){
    return this._http.get<any>(`${this.url}/pagoefectivo`);
  }
}
