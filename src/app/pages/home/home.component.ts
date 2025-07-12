import { Component } from '@angular/core';
import { SliderproductsComponent } from "../../components/sliderproducts/sliderproducts.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BandejaComponent } from "../../components/bandeja/bandeja.component";
import { ModalproductComponent } from '../../components/modalproduct/modalproduct.component';

@Component({
  selector: 'app-home',
  imports: [
    SliderproductsComponent, HeroComponent,
    HeaderComponent, CommonModule,
    BandejaComponent,
    ModalproductComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  bandejaList: any[] = [];

  constructor() {
    this.loadBandejaListFromLocalStorage();
  }

  onProductDropped(product: any) {
    // Add the dropped product to bandejaItems if not already present
    if (!this.bandejaList.find(item => item.id === product.id)) {
      this.bandejaList.push(product);
      this.saveBandejaListToLocalStorage();
    }
  }

  onItemsChange(items: any[]) {
    this.bandejaList = items;
    this.saveBandejaListToLocalStorage();
  }

  onItemRemoved(item: any) {
    this.bandejaList = this.bandejaList.filter(i => i.id !== item.id);

   localStorage.removeItem('bandejaItems');
    this.saveBandejaListToLocalStorage();
  }

  loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
    }
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }
}
