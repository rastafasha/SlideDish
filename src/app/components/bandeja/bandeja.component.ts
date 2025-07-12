import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';

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
    }
  }

  saveItemsToLocalStorage(): void {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
  }
}
