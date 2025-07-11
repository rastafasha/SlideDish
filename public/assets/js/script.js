// Data
const categories = [{
  id: 'all',
  name: 'All'
}, {
  id: 'classic',
  name: 'Classic Breads'
}, {
  id: 'pastries',
  name: 'Pastries'
}, {
  id: 'special',
  name: 'Special Breads'
}];
const products = [{
  id: 1,
  name: 'Baguette',
  price: 4.5,
  category: 'classic',
  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 2,
  name: 'Croissant',
  price: 3.5,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 3,
  name: 'Sourdough Bread',
  price: 6.0,
  category: 'classic',
  image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 4,
  name: 'Cinnamon Roll',
  price: 3.5,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 5,
  name: 'Brioche Bun',
  price: 3.0,
  category: 'special',
  image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 6,
  name: 'Sweet Pie',
  price: 5.0,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 2,
  name: 'Croissant',
  price: 3.5,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 3,
  name: 'Sourdough Bread',
  price: 6.0,
  category: 'classic',
  image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 7,
  name: 'Cinnamon Roll',
  price: 3.5,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 8,
  name: 'Brioche Bun',
  price: 3.0,
  category: 'special',
  image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop'
}, {
  id: 9,
  name: 'Sweet Pie',
  price: 5.0,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop'
}
];
// State
let activeCategory = 'all';

// Initialize category filter
function renderCategories(categoryFilterEl, renderProducts) {
  categoryFilterEl.innerHTML = '';
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-button ${activeCategory === category.id ? 'active' : ''}`;
    button.textContent = category.name;
    button.addEventListener('click', () => {
      activeCategory = category.id;
      renderCategories(categoryFilterEl, renderProducts);
      renderProducts();
    });
    categoryFilterEl.appendChild(button);
  });
}

// Initialize product carousel
function renderProducts(productCarouselEl) {
  productCarouselEl.innerHTML = '';
  const filteredProducts = activeCategory === 'all' ? products : products.filter(product => product.category === activeCategory);
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="add-button">
        <i data-lucide="plus" class="icon-small fa fa-plus"></i>
      </button>
    `;
    productCarouselEl.appendChild(productCard);
  });
  // Reinitialize Lucide icons for newly added elements
  lucide.createIcons();
}
// Carousel navigation

// Order button

// Checkout button

// logo button
function init() {
  const categoryFilterEl = document.getElementById('category-filter');
  const productCarouselEl = document.getElementById('product-carousel');

  renderCategories(categoryFilterEl, () => renderProducts(productCarouselEl));
  renderProducts(productCarouselEl);

  // Carousel navigation
  const carouselPrev = document.querySelector('.carousel-prev');
  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      const carousel = document.querySelector('.carousel-container');
      carousel.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    });
  }
  const carouselNext = document.querySelector('.carousel-next');
  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      const carousel = document.querySelector('.carousel-container');
      carousel.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    });
  }

  // Order button
  const orderButton = document.querySelector('.order-button');
  if (orderButton) {
    orderButton.addEventListener('click', () => {
      //   alert('Order review functionality would go here!');
      //aqui nos redigiremos a revieworder.html
      window.location.href = 'revieworder.html';
    });
  }

  // Checkout button
  const checkButton = document.querySelector('.check-button');
  if (checkButton) {
    checkButton.addEventListener('click', () => {
      //   alert('Order review functionality would go here!');
      //aqui nos redigiremos  a checkout.html
      window.location.href = 'checkout.html';
    });
  }

  // logo button
  const logoButton = document.querySelector('.logo');
  if (logoButton) {
    logoButton.addEventListener('click', () => {
      //   alert('Order review functionality would go here!');
      //aqui nos redigiremos a index.html
      window.location.href = 'index.html';
    });
  }
}
// Start the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
