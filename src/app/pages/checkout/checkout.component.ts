import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [
    HeaderComponent, CommonModule, RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  bandejaList: any[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  randomNum:number = 0;
  isbandejaList:boolean = false;

  refferalBonouses:number = 2.00;
  iva:number = 12;
  
    constructor() {
      window.scrollTo(0,0);
    }
    ngOnInit(){
      this.loadBandejaListFromLocalStorage();
      // this.geneardorOrdeneNumero();

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

  total() {
    const total = this.bandejaList.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
  );
  return total;
  }

  totalWithIva() {
    const baseTotal = this.total();
    const ivaAmount = baseTotal * this.iva / 100;
    return baseTotal + ivaAmount;
  }

}
