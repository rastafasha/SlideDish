import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/product';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { InfoburbujaComponent } from '../infoburbuja/infoburbuja.component';

@Component({
  selector: 'app-bandeja-adicional',
  imports: [
    RouterModule,
    CdkDropList, CdkDrag,
    CommonModule, NgFor,
    ImagenPipe, InfoburbujaComponent,
    LoadingComponent, NgIf
  ],
  templateUrl: './bandeja-adicional.component.html',
  styleUrl: './bandeja-adicional.component.scss'
})
export class BandejaAdicionalComponent {

  @Input() items: Producto[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  itemSelected!:Producto;
  isLoading:boolean= false;


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
  }

  removeItem(item: any) {
    // const index = this.items.findIndex(i => i._id === item._id);
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this.itemsChange.emit(this.items);
      this.itemRemoved.emit(item);
      this.removeMostrarinfo()
    }
  }

  saveItemsToLocalStorage(): void {
    this.isLoading=true
    try {
      localStorage.setItem('bandejas', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
    this.isLoading=false;
  }

  



  mostrarinfo(item:Producto){
  // console.log(item);
  this.itemSelected =item;
  const bandejaItemInfo = document.querySelector('.bandeja-item-info-hide');
  bandejaItemInfo?.classList.toggle('bandeja-item-info');

  
}

removeMostrarinfo(){
  const bandejaItemInfo = document.querySelector('.bandeja-item-info');
  bandejaItemInfo?.classList.remove('bandeja-item-info');

  
}

  onItemRemoved(item: any) {
    // Fix id property name to match item._id
    this.items = this.items.filter(i => i._id !== item._id);
    console.log('object', this.items);
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejas', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }
}
