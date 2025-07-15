import { CdkDropList, CdkDrag, transferArrayItem, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ModalproductComponent } from '../modalproduct/modalproduct.component';
import { ProductItemComponent } from '../product-item/product-item.component';
import { BandejaComponent } from '../bandeja/bandeja.component';
import { Producto } from '../../models/product';
import { BandejaAdicionalComponent } from "../bandeja-adicional/bandeja-adicional.component";

@Component({
  selector: 'app-bandeja-slider',
  imports: [
    NgFor,
    CdkDropList, CdkDrag, NgIf,
    BandejaComponent,
    BandejaAdicionalComponent,
],
  templateUrl: './bandeja-slider.component.html',
  styleUrl: './bandeja-slider.component.scss'
})
export class BandejaSliderComponent {
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  @Input() items: Producto[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();

  isLoading: boolean = false;

  bandejas: { items: Producto[] }[] = [];
  bandejaItems: Producto[] = [];
  bandejaList: Producto[] = [];

  connectedDropListsIds: string[][] = [];

  ngOnInit() {
    this.loadBandejaItemsFromLocalStorage();
    this.loadBandejasFromLocalStorage();
    if (this.bandejas.length === 0) {
      this.bandejas = [{ items: [] }];
    }
    this.updateConnectedDropListsIds();
  }

  loadBandejasFromLocalStorage() {
    const storedBandejas = localStorage.getItem('bandejas');
    if (storedBandejas) {
      try {
        this.bandejas = JSON.parse(storedBandejas);
      } catch (e) {
        console.error('Error parsing bandejas from localStorage', e);
        this.bandejas = [{ items: [] }];
      }
    } else {
      this.bandejas = [{ items: [] }];
    }
  }

  loadBandejaItemsFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      
    }
  }

  saveBandejasToLocalStorage() {
    try {
      localStorage.setItem('bandejas', JSON.stringify(this.bandejas));
    } catch (e) {
      console.error('Error saving bandejas to localStorage', e);
    }
    this.updateConnectedDropListsIds();
  }

  saveBandejaItemsToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaItems));
    } catch (e) {
      console.error('Error saving bandejaItems to localStorage', e);
    }
  }

  addBandeja() {
    // Add new empty bandeja at the start of the array
    this.bandejas.unshift({ items: [] });
    this.saveBandejasToLocalStorage();
    this.updateCartInLocalStorage();
    this.updateConnectedDropListsIds();
  }

  deleteBandeja(index: any) {
    this.bandejas.splice(index, 1);
    this.saveBandejasToLocalStorage();
    this.updateCartInLocalStorage();
    this.updateConnectedDropListsIds();
  }

  onItemsChange(items: Producto[], index: number) {
    this.bandejas[index].items = items;
    this.saveBandejasToLocalStorage();
    this.updateCartInLocalStorage();
  }

  onItemRemoved(item: Producto, index: number) {
    this.bandejas[index].items = this.bandejas[index].items.filter(i => i._id !== item._id);
    this.saveBandejasToLocalStorage();
    this.updateCartInLocalStorage();
  }

  drop1(event: CdkDragDrop<any[]>, index: any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.onItemsChange(event.container.data, index);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.onItemsChange(event.container.data, index);
    }
    this.saveBandejasToLocalStorage();
  }

  drop(event:CdkDragDrop<any[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.itemsChange.emit(this.items);
    }else{
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.itemsChange.emit(this.items);
    }
    this.saveBandejasToLocalStorage();
  }

  scrollLeft(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  updateConnectedDropListsIds() {
    this.connectedDropListsIds = this.bandejas.map((_, idx) =>
      this.bandejas
        .map((__, jdx) => 'bandejaList' + jdx)
        .filter(id => id !== 'bandejaList' + idx)
    );
  }

  updateCartInLocalStorage() {
    const combinedItems = [...this.bandejaItems];
    this.bandejas.forEach(bandeja => {
      combinedItems.push(...bandeja.items);
    });
    try {
      localStorage.setItem('carrito', JSON.stringify(combinedItems));
    } catch (e) {
      console.error('Error saving carrito to localStorage', e);
    }
  }

  scrollRight(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}
