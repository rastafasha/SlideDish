import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Producto } from '../../models/product';

@Component({
  selector: 'app-modalproduct',
  imports: [
    CommonModule
  ],
  templateUrl: './modalproduct.component.html',
  styleUrl: './modalproduct.component.scss'
})
export class ModalproductComponent {
  @Input() product!:Producto|null;
}
