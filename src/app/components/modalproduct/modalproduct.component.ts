import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modalproduct',
  imports: [
    CommonModule
  ],
  templateUrl: './modalproduct.component.html',
  styleUrl: './modalproduct.component.scss'
})
export class ModalproductComponent {
  @Input() product:any;
  @Output() productSelected: EventEmitter<any> = new EventEmitter<any>();

  onAddButtonClick(): void {
    this.productSelected.emit(this.product);
  }
}
