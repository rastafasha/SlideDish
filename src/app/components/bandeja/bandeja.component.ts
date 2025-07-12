import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-bandeja',
  imports: [
    RouterModule,
    CdkDropList, CdkDrag,
    CommonModule, NgFor
  ],
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent {
  @Input() items: any[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  itemSelected!:Product;


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
    this.saveItemsToLocalStorage();
  }

  removeItem(item: any) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this.itemsChange.emit(this.items);
      this.itemRemoved.emit(item);
      this.saveItemsToLocalStorage();
      this.removeMostrarinfo()
    }
  }

  saveItemsToLocalStorage(): void {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
  }


  mostrarinfo(item:Product){
    console.log(item);
    this.itemSelected =item;
    //mostramos la info del producto cambiando el nombre de la clase bandeja-item-info-hide por bandeja-item-info
    //si pulso la cambio entre bandeja-item-info-hide y bandeja-item-info
    const bandejaItemInfo = document.querySelector('.bandeja-item-info-hide');
    bandejaItemInfo?.classList.toggle('bandeja-item-info');

    
  }

  removeMostrarinfo(){
    //mostramos la info del producto cambiando el nombre de la clase bandeja-item-info-hide por bandeja-item-info
    //si pulso la cambio entre bandeja-item-info-hide y bandeja-item-info
    const bandejaItemInfo = document.querySelector('.bandeja-item-info');
    bandejaItemInfo?.classList.remove('bandeja-item-info');

    
  }
}
