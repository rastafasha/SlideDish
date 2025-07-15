
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Producto } from '../../models/product';
import { CommonModule, NgIf } from '@angular/common';

@Component({
    selector: 'app-infoburbuja',
    imports:[
        NgIf, CommonModule
    ],
    templateUrl: './infoburbuja.component.html',
    styleUrls: ['./infoburbuja.component.scss']
})
export class InfoburbujaComponent implements OnInit {
    @Input() itemSelected!:Producto;
    @Input() items: Producto[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
    constructor () {}

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
      // console.log('object', item);
      // const index = this.items.indexOf(item);
      const index = this.items.findIndex(i => i._id === item._id);
      if (index > -1) {
        this.items.splice(index, 1);
        this.itemsChange.emit(this.items);
        this.itemRemoved.emit(item);
        this.saveItemsToLocalStorage();
        this.removeMostrarinfo()
        this.ngOnInit();
      }
  }

  saveItemsToLocalStorage(): void {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
  }

  removeMostrarinfo(){
    //mostramos la info del producto cambiando el nombre de la clase bandeja-item-info-hide por bandeja-item-info
    //si pulso la cambio entre bandeja-item-info-hide y bandeja-item-info
    const bandejaItemInfo = document.querySelector('.bandeja-item-info');
    bandejaItemInfo?.classList.remove('bandeja-item-info');

    
  }

}