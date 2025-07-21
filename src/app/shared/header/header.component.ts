import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { TiendaService } from '../../services/tienda.service';
import { Tienda } from '../../models/tienda.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, 
    MenuComponent, ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  bandejaList: any[] = [];
  // public bandejaList: number = 0;
  totalList : number = 0;
  tiendas: Tienda[] = [];
  tienda!:Tienda;
  tiendaSelected!:Tienda;

  constructor(
    private tiendaService: TiendaService,
  ) {
      this.loadBandejaListFromLocalStorage();
      this.loadTiendaFromLocalStorage();
      this.getTiendas();
    }

  loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      //contamos el total de items
      this.totalList = this.bandejaList.length;

    }
  }



   loadTiendaFromLocalStorage() {
    const store = localStorage.getItem('tiendaSelected');
    if (store) {
      let TIENDA = localStorage.getItem('tiendaSelected');
      if (TIENDA !== null) {
        this.tiendaSelected = JSON.parse(TIENDA);
        this.tiendaService.setSelectedTienda(this.tiendaSelected);
      }
    }
  }

  getTiendas(){
    this.tiendaService.cargarTiendas().subscribe((resp: Tienda[]) => {
      // Asignamos el array filtrado directamente
      this.tiendas = resp.filter((tienda: Tienda) => tienda.categoria && tienda.categoria.nombre=== 'Alimentos');
      // console.log(this.tiendas);
    })
  }

  onSelectStore(tienda:any){
    this.tiendaSelected = tienda;
    this.tiendaService.setSelectedTienda(this.tiendaSelected);
    
    this.tiendaService.getTiendaById(this.tiendaSelected._id).subscribe((resp:any)=>{
      // console.log(this.tiendaSelected);
      
    })
    //guardamos la tienda en el localstorage
    localStorage.setItem('tiendaSelected', JSON.stringify(this.tiendaSelected));
  }


  get iconBagColorClass(): string {
    const colors = ['icon-bag-red', 'icon-bag-black', 'icon-bag-yellow'];
    if(this.totalList > 0){
      return colors[this.totalList % colors.length];
    }
    return '';
  }

  openMenu() {
    const menuLateral = document.getElementsByClassName("sidemenu");
    for (let i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.add("active");
    }
  }

 

}
