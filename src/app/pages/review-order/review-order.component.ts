import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BandejaComponent } from '../../components/bandeja/bandeja.component';
import { Producto } from '../../models/product';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';


@Component({
  selector: 'app-review-order',
  imports: [
    HeaderComponent,
    CommonModule,
    BandejaComponent,
    RouterModule,
    ImagenPipe

  ],
  templateUrl: './review-order.component.html',
  styleUrl: './review-order.component.scss'
})
export class ReviewOrderComponent {
  bandejaList: Producto[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  randomNum:number = 0;
  isbandejaList:boolean = false;
  
    constructor() {
      window.scrollTo(0,0);
    }
    ngOnInit(){
      this.loadBandejaListFromLocalStorage();
      this.geneardorOrdeneNumero();

    }

    loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      
    }
    if(this.bandejaList.length > 0){
      this.isbandejaList = true;
    }
  }
   onItemsChange(items: any[]) {
    this.bandejaList = items;
    this.saveBandejaListToLocalStorage();
  }

  onItemRemoved(item: any) {
    this.bandejaList = this.bandejaList.filter(i => i._id !== item.id);

   localStorage.removeItem('bandejaItems');
    this.saveBandejaListToLocalStorage();
    this.ngOnInit();
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }

  total() {
    const total = this.bandejaList.reduce((sum, item) => 
      sum + item.precio_ahora * item.cantidad, 0
  );
  return total;
  }

  addItem(item:Producto, index:any){
    if(this.bandejaList[index].cantidad){
      this.bandejaList[index].cantidad += 1;
    } else {
      this.bandejaList[index].cantidad = 1;
    }
    this.saveBandejaListToLocalStorage();

  }
removeItem(item:Producto, index:any){
  if(this.bandejaList[index].cantidad && this.bandejaList[index].cantidad > 1){
    this.bandejaList[index].cantidad -= 1;
  } else {
    this.bandejaList.splice(index, 1);
  }
  this.saveBandejaListToLocalStorage();

}

geneardorOrdeneNumero(){
  //creamos una suma de 1 a 1000 para ordenes nuevas
  const max = 1000;
  const min = 1;
  const random = Math.floor(Math.random() * (max - min + 1)) + min
  this.randomNum = random;
  // return random;
}

}
