import { Component, Input, input } from '@angular/core';
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
    // ModalproductComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  bandejaList: { items: any[] }[] = [];
  showEmptyTray:boolean=false;
  @Input() product:any;

  constructor() {
    this.loadBandejaListFromLocalStorage();
    window.scroll(0,0);
  }

  onProductDropped(product: any) {
    if (this.bandejaList.length === 0) {
      this.bandejaList.push({ items: [] });
    }
    const firstTray = this.bandejaList[0];
    if (!firstTray.items.find(item => item.id === product.id)) {
      firstTray.items.push(product);
      this.saveBandejaListToLocalStorage();
    }
  }

  onItemsChange(items: any[], trayIndex: number) {
    this.bandejaList[trayIndex].items = items;
    this.saveBandejaListToLocalStorage();
  }

  onItemRemoved(item: any, trayIndex: number) {
    const tray = this.bandejaList[trayIndex];
    tray.items = tray.items.filter(i => i.id !== item.id);
    this.saveBandejaListToLocalStorage();
  }

  onAddTray() {
    this.bandejaList.push({ items: [] });
    this.saveBandejaListToLocalStorage();
  }

  loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      const parsed = JSON.parse(storedItems);
      if (Array.isArray(parsed)) {
        this.bandejaList = parsed;
      } else {
        this.bandejaList = [{ items: parsed }];
      }
    } else {
      this.bandejaList = [{ items: [] }];
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
