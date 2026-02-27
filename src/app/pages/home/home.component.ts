import { Component, Input, input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { SliderproductsComponent } from "../../components/sliderproducts/sliderproducts.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BandejaComponent } from "../../components/bandeja/bandeja.component";
import { ModalproductComponent } from '../../components/modalproduct/modalproduct.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MenuComponent } from "../../shared/menu/menu.component";
import { ColorService } from '../../services/color.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  imports: [
    SliderproductsComponent, HeroComponent,
    HeaderComponent, CommonModule,
    BandejaComponent,
    // ModalproductComponent,
    RouterModule,
    LoadingComponent,
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  bandejaList: any[] = [];
  isbandejaList:boolean= false;
  @Input() product:any;
  isLoading:boolean=false;

  private colorService = inject(ColorService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);

 @Output() tiendaSelected: string = 'Panadería'

  constructor() {
    this.loadBandejaListFromLocalStorage();
    window.scroll(0,0);
  }

  onProductDropped(product: any) {
    // Add the dropped product to bandejaItems if not already present
    // Check for both id and _id to ensure compatibility
    const existingItem = this.bandejaList.find(item => item._id === product._id || item.id === product.id);
    if (!existingItem) {
      // Get color from ColorService and add to product
      this.colorService.colorByProduct(product._id).subscribe({
        next: (color) => {
          // Add color to product
          const productWithColor = {
            ...product,
            color: color?.color || color || null
          };
          console.log('Product added to bandeja with color:', productWithColor);
          this.bandejaList.push(productWithColor);
          this.saveBandejaListToLocalStorage();
          // Trigger change detection
          this.cdr.detectChanges();
        },
        error: (err) => {
          // If color service fails, add product without color
          console.error('Error getting color:', err);
          this.bandejaList.push(product);
          this.saveBandejaListToLocalStorage();
          // Trigger change detection
          this.cdr.detectChanges();
        }
      });
    }
  }

  onItemsChange(items: any[]) {
    this.bandejaList = items;
    this.saveBandejaListToLocalStorage();
  }

  onItemRemoved(item: any) {
    this.bandejaList = this.bandejaList.filter(i => i._id !== item._id);
    localStorage.removeItem('bandejaItems');
    this.carritoService.removeItem(item);
    this.saveBandejaListToLocalStorage();
    
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if(this.bandejaList.length > 0){
        this.isbandejaList = true;
      } else {
        this.isbandejaList = false;
      }
    });
  }

  loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      
    }
    if(this.bandejaList.length > 0){
      this.isbandejaList = true;
    }
    if(this.bandejaList.length = 0){
      this.isbandejaList = false;
      this.saveBandejaListToLocalStorage();
      this.carritoService.clearCart();
    }
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }
}
