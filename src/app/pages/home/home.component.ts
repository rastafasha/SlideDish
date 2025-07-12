import { Component, Input, input, ViewChild, ElementRef } from '@angular/core';
import { SliderproductsComponent } from "../../components/sliderproducts/sliderproducts.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BandejaComponent } from "../../components/bandeja/bandeja.component";
import { ModalproductComponent } from '../../components/modalproduct/modalproduct.component';
import { OnInit } from '@angular/core';
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


export class HomeComponent implements OnInit {
  bandejaList: { items: any[] }[] = [];
  @Input() showEmptyTray:boolean=false;
  @Input()showCarousel:boolean = false;
  @Input() product:any;

  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef<HTMLDivElement>;

  constructor() {
    this.loadBandejaListFromLocalStorage();
    this.updateShowEmptyTray();
    window.scroll(0,0);
  }

  ngOnInit(): void {
    this.loadBandejaListFromLocalStorage();
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
    this.updateShowEmptyTray();
  }

  onItemsChange(items: any[], trayIndex: number) {
    this.bandejaList[trayIndex].items = items;
    this.saveBandejaListToLocalStorage();
    this.updateShowEmptyTray();
  }

  onItemRemoved(item: any, trayIndex: number) {
    const tray = this.bandejaList[trayIndex];
    tray.items = tray.items.filter(i => i.id !== item.id);
    this.saveBandejaListToLocalStorage();
    this.updateShowEmptyTray();
  }

  onAddTray(showEmptyTray?: boolean) {
    if (typeof showEmptyTray === 'boolean') {
      this.showEmptyTray = showEmptyTray;
    }
    // this.bandejaList.push({ items: [] });
    // this.saveBandejaListToLocalStorage();
    // this.updateShowEmptyTray();
    this.showEmptyTray = false;
  }

  loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems && storedItems !== "undefined") {
      const parsed = JSON.parse(storedItems);
      if (Array.isArray(parsed)) {
        this.bandejaList = parsed;
        console.log(this.bandejaList);
      } else {
        this.bandejaList = [{ items: parsed }];
        console.log(this.bandejaList);
      }
    } else {
      this.bandejaList = [{ items: [] }];
    }
    // this.updateShowEmptyTray();
  }


  //   loadBandejaListFromLocalStorage() {
  //   const storedItems = localStorage.getItem('bandejaItems');
  //   console.log(storedItems);
  //   if (storedItems) {
  //     this.bandejaList = JSON.parse(storedItems);
  //   }
  // }

  

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }

  updateShowEmptyTray() {
    this.showEmptyTray = !this.bandejaList || this.bandejaList.length === 0 || this.bandejaList.every(tray => !tray || !tray.items || tray.items.length === 0);
  }

  scrollCarousel(direction: 'prev' | 'next') {
    const container = this.carouselTrack.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    if (direction === 'prev') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
