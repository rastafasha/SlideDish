import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalproductComponent } from '../modalproduct/modalproduct.component';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductoService } from '../../services/producto.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-sliderproducts',
  imports:[
    NgFor,
    ProductItemComponent,
    CdkDropList, CdkDrag,
    ModalproductComponent
  ],
  templateUrl: './sliderproducts.component.html',
  styleUrls: ['./sliderproducts.component.scss']
})
export class SliderproductsComponent implements AfterViewInit, OnChanges {
  @Input() productsList: Product[] = [];

  selectedProduct: Product | null = null;

  categories: Category[] = [];

  products: Product[] = [];

  activeCategory: string = 'all';

  todo: Product[] = [];

  @Output() productDropped: EventEmitter<Product> = new EventEmitter<Product>();

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  private productoService = inject(ProductoService);
  private categoryService = inject(CategoryService);

  constructor() {
    this.todo = this.products.slice();
  }

  ngAfterViewInit() {
    this.getProductos();
    this.getCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productsList']) {
      this.updateTodoFromInput();
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

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }

  selectCategory(categoryId: string) {
    this.activeCategory = categoryId;
    this.updateTodo();
  }

  updateTodo() {
    if (this.activeCategory === 'all') {
      this.todo = this.products.slice();
    } else {
      this.todo = this.products.filter(product => product.category === this.activeCategory);
    }
  }

  updateTodoFromInput() {
    if (this.activeCategory === 'all') {
      this.todo = this.productsList.slice();
    } else {
      this.todo = this.productsList.filter(product => product.category === this.activeCategory);
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

  drop(event:CdkDragDrop<Product[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    }else{
      const product = event.previousContainer.data[event.previousIndex];
      this.productDropped.emit(product);
      // Optionally remove the product from todo if you want it to move rather than copy
      // event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    // Use Bootstrap's modal method to show modal programmatically
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
