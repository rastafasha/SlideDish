import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent  implements OnInit{

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
      
    }
    ngOnInit(): void {
      this.getTiendas();
      this.setTiendaDefault();
    }

    loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      //contamos el total de items
      this.totalList = this.bandejaList.length;

    }
  }

  getTiendas(){
    this.tiendaService.cargarTiendas().subscribe((resp: Tienda[]) => {
      // Asignamos el array filtrado directamente
      this.tiendas = resp.filter((tienda: Tienda) => tienda.categoria && tienda.categoria.nombre=== 'Alimentos');
      // console.log(this.tiendas);

      this.setTiendaDefault();

    })
  }

 

  setTiendaDefault(){
    // Check if default tienda has already been set
    if (localStorage.getItem('defaultTiendaSet')) return;

    // Set default tiendaSelected to "Panaderia SlideDish" if not already set
    if (!this.tiendaSelected) {
      const defaultTienda = this.tiendas.find(tienda => tienda.nombre === 'SlideDish');
      if (defaultTienda) {
        this.tiendaSelected = defaultTienda;
        this.tiendaService.setSelectedTienda(this.tiendaSelected);
        localStorage.setItem('tiendaSelected', JSON.stringify(this.tiendaSelected.subcategoria));
        localStorage.setItem('defaultTiendaSet', 'true');
      }
    }
  }

  onSelectStore(tienda:any){
    this.tiendaSelected = tienda;
    this.tiendaService.setSelectedTienda(this.tiendaSelected);
    this.tiendaService.getTiendaById(this.tiendaSelected._id).subscribe((resp:any)=>{
      // console.log(this.tiendaSelected.subcategoria);
      localStorage.setItem('tiendaSelected', JSON.stringify(this.tiendaSelected.subcategoria));

    })
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
