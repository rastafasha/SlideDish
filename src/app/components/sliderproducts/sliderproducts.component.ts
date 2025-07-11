import { NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';

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
    ProductItemComponent
  ],
  templateUrl: './sliderproducts.component.html',
  styleUrls: ['./sliderproducts.component.scss']
})
export class SliderproductsComponent implements AfterViewInit {
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

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngAfterViewInit() {
    // Any initialization after view is ready
  }

  selectCategory(categoryId: string) {
    this.activeCategory = categoryId;
  }

  get filteredProducts(): Product[] {
    if (this.activeCategory === 'all') {
      return this.products;
    }
    return this.products.filter(product => product.category === this.activeCategory);
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
}
