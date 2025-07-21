import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Producto } from '../../models/product';
import { ImagenPipe } from '../../pipes/imagen-pipe.pipe';
import { InfoburbujaComponent } from '../infoburbuja/infoburbuja.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Usuario } from '../../models/usuario.model';
import { CarritoService } from '../../services/carrito.service';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-bandeja',
  imports: [
    RouterModule,
    CdkDropList, CdkDrag,
    CommonModule, NgFor,
    ImagenPipe, InfoburbujaComponent,
    LoadingComponent, NgIf
  ],
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent {
  @Input() items: Producto[] = [];
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  itemSelected!:Producto;
  isLoading:boolean= false;
  public identity!:Usuario;
  public msm_error_review='';
  public msm_error = false;
  public msm_success_fav = false;
  public msm_success = false;
  public cantidad_to_cart = 1;
  public precio_to_cart:any;
  public color_to_cart = '#16537e';
  public selector_to_cart = ' ';
  public err_stock ='';
  producto: any = [];
  public selector_error = false;

  private _carritoService = inject(CarritoService)
  private webSocketService = inject(WebSocketService)

  ngOnInit(){
    let USER = localStorage.getItem('user');
      if(USER){
        this.identity = JSON.parse(USER);
        // console.log(this.identity);
      }

  }



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
    // const index = this.items.findIndex(i => i._id === item._id);
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this.itemsChange.emit(this.items);
      this.itemRemoved.emit(item);
      this.saveItemsToLocalStorage();
      this.removeMostrarinfo()
    }
  }

  saveItemsToLocalStorage(): void {debugger
    this.isLoading=true
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
      // Add each product to cart
      this.items.forEach(product => {
        this.addProductToCart(product);
      });
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
    this.isLoading=false;
  }

  addProductToCart(product: Producto) {
    if(!this.identity || !this.identity.uid){
      this.msm_error = true;
      this.err_stock = 'Debe iniciar sesión para agregar al carrito.';
      return;
    }
    if(this.cantidad_to_cart > product.stock){
      this.err_stock = 'La cantidad no debe superar al stock';
      return;
    }
    if(this.cantidad_to_cart <= 0){
      this.err_stock = 'La cantidad no puede ser un valor negativo';
      return;
    }
    let selector_to_cart = 'unico';
    // Removed check for product.nombre_selector as it does not exist
    let color_to_cart = '#16537e';
    if(product.subcategoria === 'Delicateses' || product.subcategoria === 'Dulces Secos' ||
       product.subcategoria === 'Sandwich' || product.subcategoria === 'Alimentos' ||
       product.subcategoria === 'Comida Rápida' || product.subcategoria === 'De Lujo'){
      color_to_cart = '#16537e';
    }
    let data = {
      user: this.identity.uid,
      producto: product._id,
      cantidad: this.cantidad_to_cart,
      color: color_to_cart,
      selector: selector_to_cart,
      precio: product.precio_ahora
    };
    this._carritoService.registro(data).subscribe(
      response => {
        this.webSocketService.emit('save-carrito', {new:true});
        this.msm_success = true;
        setTimeout(() => {
          this.close_alert();
        }, 2500);
      },
      error => {
        // Handle error if needed
      }
    );
  }

close_alert(){
  this.msm_error = false;
  this.msm_error_review = '';
  this.msm_success_fav = false;
  this.msm_success = false;
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
    // console.log('object', this.items);
    localStorage.removeItem('bandejaItems');
    this.saveBandejaListToLocalStorage();
    // this.ngOnInit();
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }
}
