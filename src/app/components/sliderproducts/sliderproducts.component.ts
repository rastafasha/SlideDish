import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-sliderproducts',
  imports:[
    NgFor,
    ProductItemComponent,
    CdkDropList, CdkDrag
  ],
  templateUrl: './sliderproducts.component.html',
  styleUrls: ['./sliderproducts.component.scss']
})
export class SliderproductsComponent implements AfterViewInit, OnChanges {
  @Input() productsList: Product[] = [];

  categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'classic', name: 'Classic Breads' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'special', name: 'Special Breads' }
  ];

  products: Product[] = [
    { id: 1, name: 'Baguette', price: 4.5, category: 'classic', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'Croissant', price: 3.5, category: 'pastries', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'Sourdough Bread', price: 6.0, category: 'classic', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, name: 'Cinnamon Roll', price: 3.5, category: 'pastries', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop' },
    { id: 5, name: 'Brioche Bun', price: 3.0, category: 'special', image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop' },
    { id: 6, name: 'Sweet Pie', price: 5.0, category: 'pastries', image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop' },
    { id: 7, name: 'Cinnamon Roll', price: 3.5, category: 'pastries', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop' },
    { id: 8, name: 'Brioche Bun', price: 3.0, category: 'special', image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop' },
    { id: 9, name: 'Sweet Pie', price: 5.0, category: 'pastries', image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop' }
  ];

  activeCategory: string = 'all';

  todo: Product[] = [];

  @Output() productDropped: EventEmitter<Product> = new EventEmitter<Product>();

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  constructor() {
    this.todo = this.products.slice();
  }

  ngAfterViewInit() {
    // Any initialization after view is ready
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productsList']) {
      this.updateTodoFromInput();
    }
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
  }
