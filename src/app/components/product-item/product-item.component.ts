import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';
import { CarritoService } from '../../services/carrito.service';
import { SelectorService } from '../../services/selector.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-item',
  imports: [
    CommonModule
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {

  @Input() product: any;
  @Output() productSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToBandeja: EventEmitter<any> = new EventEmitter<any>();

  public colores: any = [];
  public color_to_cart!: string;
  public productoId!: any;
  public selector!: any;

  private _colorService = inject(ColorService);
  private carritoService = inject(CarritoService);
  private selectorService = inject(SelectorService);

  openPaymentsModal(product: any): void {
    this.productSelected.emit(product);
  }

  addProductToBandeja(product: any, event: Event): void {
    event.stopPropagation();

    this.productoId = product._id;

    // Use forkJoin to wait for both selector and color API calls
    const selector$ = this.selectorService.selectorByProduct(this.productoId);
    const color$ = this._colorService.colorByProduct(this.productoId);

    forkJoin([selector$, color$]).subscribe(
      ([selectorResp, colorResp]: [any, any]) => {
        // Process color response
        this.colores = colorResp;
        this.color_to_cart = this.colores[0]?.color || '#333333';

        // Process selector response
        this.selector = selectorResp;

        // Create product with color and selector included
        let productWithColor = {
          ...product,
          color: this.colores[0] || null,
          selector: this.selector[0] || null
        };

        // Emit product with color and selector to bandeja so home component can update
        this.addToBandeja.emit(productWithColor);

        // Also add to cart service for backend sync
        this.carritoService.addItem(productWithColor);

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Artículo agregado a la bandeja',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error => {
        // If any service fails, emit product without color/selector
        console.error('Error getting selector or color:', error);

        let productBasic = {
          ...product,
          color: null,
          selector: null
        };

        this.addToBandeja.emit(productBasic);
        this.carritoService.addItem(productBasic);
      }
    );
  }
}
