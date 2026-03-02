import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Marca } from '../models/marca.model';
import { Producto } from '../models/product';

import { Tienda } from '../models/tienda.model';
import { Categoria } from '../models/categoria.model';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private trasnformarUsuarios(resultados: any[]): Usuario[]{
    return resultados;
    // return resultados.map(
    //   user => new Usuario( user.first_name, user.last_name,user.telefono, user.pais, user.numdoc, user.email, '', user.img, user.google, user.role, user.uid)
    // )
  }

  private trasnformarProductos(resultados: any[]): Producto[]{
    return resultados;
  }
  private trasnformarMarcas(resultados: any[]): Marca[]{
    return resultados;
  }
  
  private trasnformarTiendas(resultados: any[]): Tienda[]{
    return resultados;
  }
  
 
  private trasnformarCategoria(resultados: any[]): Categoria[]{
    return resultados;
  }
  


  buscar(tipo: 'usuarios'|'categorias' |'marcas' |'productos'|'blogs'|
    'pages'|'sliders'|'cursos'
    | 'tiendas'| 'trasnferencias'
    | 'pagoecheques'| 'pagoefectivos'|'promocions'
    ,
        termino: string
        ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch(tipo) {
              case 'usuarios':
                return this.trasnformarUsuarios(resp.resultados)

              case 'productos':
                return this.trasnformarProductos(resp.resultados)
                case 'categorias':
                return this.trasnformarCategoria(resp.resultados)
                
              default:
                return[];
          }
        })
      )
  }
  


  searchGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers)
  }
}
