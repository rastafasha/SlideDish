import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Congeneral } from '../models/congeneral.model';
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CongeneralService {
  getConfiguracion(arg0: string) {
    throw new Error('Method not implemented.');
  }

  public congeneral!: Congeneral;

  constructor(
    private http: HttpClient
  ) { }

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


  cargarCongenerals(){

    const url = `${base_url}/congenerals`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, congenerals: Congeneral[]}) => resp.congenerals)
      )

  }


  getCongeneralById(_id: string){
    // const url = `${base_url}/congenerals/62290a4e1e142231c0ea8c9c`;
    const url = `${base_url}/congenerals/5f25bd8015655fee54a89691`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, congeneral: Congeneral}) => resp.congeneral)
        );


  }


  crearCongeneral(congeneral: Congeneral){
    const url = `${base_url}/congenerals`;
    return this.http.post(url, congeneral, this.headers);
  }

  actualizarCongeneral(congeneral: Congeneral){
    const url = `${base_url}/congenerals/${congeneral._id}`;
    return this.http.put(url, congeneral, this.headers);
  }

  borrarCongeneral(_id:string){
    const url = `${base_url}/congenerals/${_id}`;
    return this.http.delete(url, this.headers);
  }

  get_data():Observable<any>{
    const url = `${base_url}/congenerals/obtener`;
    return this.http.get(url, this.headers);
  }





}
