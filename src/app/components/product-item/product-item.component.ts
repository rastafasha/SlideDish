import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalproductComponent } from '../modalproduct/modalproduct.component';

@Component({
  selector: 'app-product-item',
  imports: [
    CommonModule,
    ModalproductComponent
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {

  @Input() product: any;
  selectedStudentProfile:any;

  openPaymentsModal(product: any): void {
      this.selectedStudentProfile = product;
    }

    

}
