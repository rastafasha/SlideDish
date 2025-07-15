import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
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

@Component({
  selector: 'app-sliderproducts',
  imports:[
    NgFor,
    ProductItemComponent,
    CdkDropList, CdkDrag,
    ModalproductComponent,
    LoadingComponent, NgIf
  ],
  templateUrl: './sliderproducts.component.html',
  styleUrls: ['./sliderproducts.component.scss']
})
export class SliderproductsComponent implements AfterViewInit, OnChanges {
  @Input() productsList: Producto[] = [];
  isLoading:boolean = false;
  
  selectedProduct: Producto | null = null;

  categories: Categoria[] = [];
  subcategories: any[] = [];

  products: Producto[] = [];

  activeCategory: string = 'all';

  todo: Producto[] = [];
  

  @Output() productDropped: EventEmitter<Producto> = new EventEmitter<Producto>();

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  private productoService = inject(ProductoService);
  private categoryService = inject(CategoryService);

  catname:string = 'Panaderia'

  constructor() {
    this.todo = this.products.slice();
  }

  ngAfterViewInit() {
    // this.getProductos();
    this.getProductosCatName();
    this.getCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productsList']) {
      this.updateTodo();
    }
  }

  getProductos() {
    this.productoService.getProductos().subscribe(
      (productos) => {
        this.products = productos;
        this.updateTodo();
      },
      (error) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }
  getProductosCatName() {
    this.isLoading = true
    this.categoryService.find_by_nombre(this.catname).subscribe(
      (resp:any) => {
        this.products = resp.productos;
        this.updateTodo();
        this.isLoading = false
      },
      (error) => {
        console.error('Error al obtener los productos', error);
      }
    );
  }
  //obtenemos las subcategorias de los productos
  getCategories() {
    this.productoService.getProductosActivos().subscribe((resp:any)=>{
      //filtramos los productos donde sea igual a la categoria Panaderia
      const productos = resp.filter((producto: any) => producto.categoria.nombre ===  this.catname);
      //extraemos el campo subcategoria
      const subcategorias = productos.map((producto: any) => producto.subcategoria);
      //eliminamos los duplicados
      const subcategoriasUnicas = [...new Set(subcategorias)];
      //creamos un arreglo de objetos con el nombre de la subcategoria y el arreglo de productos
      const categorias = subcategoriasUnicas.map((subcategoria: any) => ({
        nombre: subcategoria,
        products: productos.filter((product: any) => product.subcategoria === subcategoria),
        }));
        this.subcategories = categorias;
    })
  }

  selectCategory(category: string) {
    this.activeCategory = category;
    this.updateTodo();
  }

  updateTodo() {
    if (this.activeCategory === 'all') {
      this.todo = this.products.slice();
    } else {
      const selectedCategory = this.subcategories.find(subcat => subcat.nombre === this.activeCategory);
      this.todo = selectedCategory ? selectedCategory.products : [];
    }
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

  drop(event:CdkDragDrop<Producto[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    }else{
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
}
