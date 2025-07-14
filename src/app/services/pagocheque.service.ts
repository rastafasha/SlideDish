import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagochequeService {

  public url;
    
    constructor(
      private _http : HttpClient
    ){
      this.url = environment.baseUrl;
    }

    get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }
  
    registro(data:any){
      return this._http.post<any>(`${this.url}/pagocheque/store`,data);
    }
  
    listar(){
      return this._http.get<any>(`${this.url}/pagocheque`);
    }
     updateStatus(trasnferencia:any){
        const url = `${this.url}/pagocheque/statusupdate/${trasnferencia._id}`;
        return this._http.put(url, trasnferencia, this.headers);
      }
}
