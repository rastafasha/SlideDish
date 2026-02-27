import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, inject, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalproductComponent } from '../modalproduct/modalproduct.component';
// import { ProductoService } from '../../services/producto.service'; // solo para probar
import { CategoryService } from '../../services/category.service';
import { Categoria } from '../../models/categoria.model';
import { Producto } from '../../models/product';
import { ProductoService } from '../../services/product.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TiendaService } from '../../services/tienda.service';
import { Tienda } from '../../models/tienda.model';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-sliderproducts',
  imports: [
    NgFor,
    ProductItemComponent,
    CdkDropList, CdkDrag,
    ModalproductComponent,
    LoadingComponent, NgIf
  ],
  templateUrl: './sliderproducts.component.html',
  styleUrls: ['./sliderproducts.component.scss']
})
export class SliderproductsComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() productsList: Producto[] = [];
  tiendaSelected: Tienda | null = null;
  @Output() productDropped: EventEmitter<Producto> = new EventEmitter<Producto>();
  @Output() addToBandeja: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;
  isLoading: boolean = false;

  selectedProduct: Producto | null = null;
  categories: Categoria[] = [];
  subcategories: any[] = [];
  products: Producto[] = [];
  activeCategory: string = 'Panadería';
  todo: Producto[] = [];
  catname!: string;
  private tiendaSubscription: Subscription | undefined;

  public colores: any = [];
  public color_to_cart!: string;
  public productoId!: any;

  private _colorService = inject(ColorService);
  private carritoService = inject(CarritoService);

  private productoService = inject(ProductoService);
  private tiendasService = inject(TiendaService);


  constructor() {
    this.products = this.products || [];
    this.todo = this.products.slice();
  }

  ngOnInit() {
    this.tiendaSubscription = this.tiendasService.selectedTiendaObservable$.subscribe(tienda => {
      this.tiendaSelected = tienda;
      this.updateTodo();
      this.getProductosCatName();
    });
  }



  ngAfterViewInit() {
    this.getProductosCatName();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productsList'] && this.productsList) {
      this.products = this.productsList;
      this.updateTodo();
    }
  }

  ngOnDestroy() {
    if (this.tiendaSubscription) {
      this.tiendaSubscription.unsubscribe();
    }
  }

  getProductosCatName() {
    this.catname = this.tiendaSelected?.subcategoria ?? 'Panadería'
    this.isLoading = true
    this.productoService.findProducto_by_Categorynombre(this.catname).subscribe(
      (resp: any) => {
        this.products = resp.productos || [];
        //obtenemos las subcategorias de los productos
        //filtramos los productos donde sea igual a la categoria Panaderia
        const productos = (resp.productos || []).filter((producto: any) => producto.categoria?.nombre === this.catname);
        //extraemos el campo subcategoria
        const subcategorias = productos.map((producto: any) => producto.subcategoria);
        //eliminamos los duplicados
        const subcategoriasUnicas = [...new Set(subcategorias)];
        //creamos un arreglo de objetos con el nombre de la subcategoria y el arreglo de productos
        const categorias = subcategoriasUnicas.map((subcategoria: any) => ({
          nombre: subcategoria,
          products: productos.filter((product: any) => product.subcategoria === subcategoria),
        }));
        this.subcategories = categorias || [];

        
        this.updateTodo();
        // console.log(this.products)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }
  

  selectCategory(category: string) {
    // console.log('selectCategory called with:', category);
    this.activeCategory = category;
    this.updateTodo();
  }

  updateTodo() {
    // console.log('updateTodo called. activeCategory:', this.activeCategory, 'products:', this.products, 'subcategories:', this.subcategories);
    this.isLoading = true
    if (this.activeCategory === 'Panadería') {
      this.todo = this.products ? this.products.slice() : [];
    } else {
      const selectedCategory = this.subcategories ? this.subcategories.find(subcat => subcat.nombre === this.activeCategory) : null;
      this.todo = selectedCategory ? selectedCategory.products : [];
    }
    // console.log('todo updated:', this.todo);
    this.isLoading = false
  }



  scrollLeft() {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  drop(event: CdkDragDrop<Producto[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      const product = event.previousContainer.data[event.previousIndex];
      this.productDropped.emit(product);
      // Optionally remove the product from todo if you want it to move rather than copy
      // event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }

  openModal(product: Producto) {
    this.selectedProduct = product;
    // Use Bootstrap's modal method to show modal programmatically
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onAddToBandeja(product: Producto) {
    this.productoId = product._id;

    // this._colorService.colorByProduct(this.productoId).subscribe(
    //   response => {
    //     this.colores = response;
    //     this.color_to_cart = this.colores[0]?.color || '#333333';
    //     console.log('color_to_cart: ', this.color_to_cart);

    //     // Create product with color included
    //     let data = {
    //       ...product,
    //       color: this.color_to_cart
    //     };

    //     // Emit product with color to bandeja
    //     this.addToBandeja.emit(data);

    //     // Also add to cart service
    //     this.carritoService.addItem(data);
    //   },
    //   error => {
    //     // If color service fails, emit product without color
    //     console.error('Error getting color:', error);
    //     this.addToBandeja.emit(product);
    //     this.carritoService.addItem(product);
    //   }
    // );

  }




}
