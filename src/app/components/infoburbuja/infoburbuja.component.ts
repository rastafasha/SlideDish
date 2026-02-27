
import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { Producto } from '../../models/product';
import { CommonModule, NgIf } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-infoburbuja',
  imports: [
    NgIf, CommonModule
  ],
  templateUrl: './infoburbuja.component.html',
  styleUrls: ['./infoburbuja.component.scss']
})
export class InfoburbujaComponent implements OnInit {
  @Input() itemSelected!: Producto;
  @Input() items: Producto[] = [];
  bandejaList: Producto[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      try {
        this.items = JSON.parse(storedItems);
        this.itemsChange.emit(this.items);
      } catch (e) {
        console.error('Error parsing bandejaItems from localStorage', e);
      }
    }
  }

  onRemoveItem(item: any) {
    const index = this.items.findIndex(i => i._id === item._id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.itemsChange.emit(this.items);
      this.itemRemoved.emit(item);
      this.saveItemsToLocalStorage();
      this.removeMostrarinfo();
    }
  }

  saveItemsToLocalStorage(): void {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
  }

  removeMostrarinfo() {
    const bandejaItemInfo = document.querySelector('.bandeja-item-info');
    bandejaItemInfo?.classList.remove('bandeja-item-info');
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }

}