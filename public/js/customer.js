import { API } from './api.js';

export const CustomerModule = {
  currentCustomerId: 'user-customer-1',
  customerName: 'Priya Sharma',
  cart: [], // array of { product, quantity }
  activeCategory: 'All',
  searchQuery: '',
  activeTab: 'marketplace', // 'marketplace' or 'orders'

  async init(user) {
    if (user && user.id) {
      this.currentCustomerId = user.id;
      this.customerName = user.name || 'Priya Sharma';
    }
    this.loadCartFromStorage();
    this.renderLayout();
    this.updateCartBadge();
    await this.loadActiveTab();
  },

  loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('smartfarm_cart');
      this.cart = saved ? JSON.parse(saved) : [];
    } catch {
      this.cart = [];
    }
  },

  saveCartToStorage() {
    try {
      localStorage.setItem('smartfarm_cart', JSON.stringify(this.cart));
      this.updateCartBadge();
    } catch (e) {
      console.error(e);
    }
  },

  updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
      const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.innerText = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  },

  renderLayout() {
    const container = document.getElementById('portal-content');
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Customer Banner & Navigation -->
        <div class="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 mb-3 border border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span> Khet Se Seedha Ghar Tak (Farm Direct)
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">Support Local Kisans. Eat Fresh & Jaivik Organic.</h1>
            <p class="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
              Harvested directly by verified Indian sustainable farmers and delivered fresh to your doorstep. Zero middleman markups.
            </p>

            <div class="flex items-center space-x-3 mt-6">
              <button id="nav-btn-marketplace" class="px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${this.activeTab === 'marketplace' ? 'bg-white text-emerald-900 font-bold shadow-md' : 'bg-emerald-900/60 text-white hover:bg-emerald-900'}">
                🛒 Browse Market (Mandi)
              </button>
              <button id="nav-btn-customer-orders" class="px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${this.activeTab === 'orders' ? 'bg-white text-emerald-900 font-bold shadow-md' : 'bg-emerald-900/60 text-white hover:bg-emerald-900'}">
                📦 My Orders & Tracking
              </button>
            </div>
          </div>

          <!-- Abstract background leaves decoration -->
          <div class="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-9xl">
            🌾
          </div>
        </div>

        <!-- Dynamic Content (Marketplace or Orders) -->
        <div id="customer-tab-content"></div>
      </div>
    `;

    document.getElementById('nav-btn-marketplace')?.addEventListener('click', () => {
      this.activeTab = 'marketplace';
      this.renderLayout();
      this.loadActiveTab();
    });

    document.getElementById('nav-btn-customer-orders')?.addEventListener('click', () => {
      this.activeTab = 'orders';
      this.renderLayout();
      this.loadActiveTab();
    });
  },

  async loadActiveTab() {
    const content = document.getElementById('customer-tab-content');
    if (!content) return;

    if (this.activeTab === 'marketplace') {
      await this.renderMarketplace(content);
    } else {
      await this.renderOrders(content);
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 1. Marketplace View
  async renderMarketplace(container) {
    container.innerHTML = `
      <div class="space-y-6 fade-in">
        <!-- Search, Filter & Categories Bar -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative flex-1 max-w-md">
            <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input id="input-prod-search" type="text" placeholder="Search Desi vegetables, fruits, crops, or farm..." value="${this.searchQuery}" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <!-- Category Pills -->
          <div class="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            ${['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic Herbs'].map(cat => `
              <button data-cat-filter="${cat}" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${this.activeCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Products Grid Container -->
        <div id="products-catalog-grid" class="min-h-[300px]">
          <div class="flex items-center justify-center p-12 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    `;

    this.bindMarketplaceFilters();
    await this.fetchAndRenderProducts();
  },

  bindMarketplaceFilters() {
    const searchInput = document.getElementById('input-prod-search');
    let debounceTimer;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.searchQuery = e.target.value.trim();
        this.fetchAndRenderProducts();
      }, 300);
    });

    document.querySelectorAll('[data-cat-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-cat-filter');
        this.activeCategory = cat;
        document.querySelectorAll('[data-cat-filter]').forEach(b => {
          b.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition bg-gray-100 text-gray-600 hover:bg-gray-200';
        });
        e.currentTarget.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition bg-emerald-600 text-white';
        this.fetchAndRenderProducts();
      });
    });
  },

  async fetchAndRenderProducts() {
    const grid = document.getElementById('products-catalog-grid');
    if (!grid) return;

    try {
      const res = await API.products.getAll({
        category: this.activeCategory,
        search: this.searchQuery
      });

      const products = res.products || [];

      if (products.length === 0) {
        grid.innerHTML = `
          <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <i data-lucide="package-search" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
            <p class="text-base font-semibold text-gray-600">No produce matching your criteria.</p>
            <p class="text-xs text-gray-400 mt-1">Try selecting another category or clear your search term.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      grid.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${products.map(p => this.renderProductCard(p)).join('')}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      this.bindProductCardButtons(products);
    } catch (err) {
      grid.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load marketplace: ${err.message}</div>`;
    }
  },

  renderProductCard(p) {
    const isOutOfStock = p.stock <= 0;

    return `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
        <div>
          <!-- Image with overlays -->
          <div class="relative h-48 w-full bg-gray-100 overflow-hidden">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur text-gray-800 shadow-sm">
              ${p.category}
            </span>
            ${p.organic ? `
              <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 mr-1"></i> Jaivik
              </span>
            ` : ''}

            ${isOutOfStock ? `
              <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-sm">
                Sold Out
              </div>
            ` : ''}
          </div>

          <!-- Content Details -->
          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span class="flex items-center">
                <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i> ${p.farmName}
              </span>
              <div class="flex items-center text-amber-500 font-bold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 mr-1"></i> ${p.rating} <span class="text-gray-400 font-normal ml-0.5">(${p.reviewCount})</span>
              </div>
            </div>

            <h3 class="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition">
              ${p.name}
            </h3>

            <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              ${p.description}
            </p>
          </div>
        </div>

        <!-- Footer / Pricing & Cart Trigger -->
        <div class="p-4 pt-0">
          <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div class="text-xl font-extrabold text-emerald-700">
                ₹${p.price.toFixed(2)}
                <span class="text-xs font-normal text-gray-400">/${p.unit}</span>
              </div>
              <div class="text-[11px] text-gray-400">
                ${isOutOfStock ? 'Currently out of stock' : `${p.stock} ${p.unit} available`}
              </div>
            </div>

            <div class="flex items-center space-x-1.5">
              <button data-view-reviews="${p.id}" title="Reviews & Details" class="p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition border border-gray-200">
                <i data-lucide="message-square" class="w-4 h-4"></i>
              </button>
              <button data-add-to-cart="${p.id}" ${isOutOfStock ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center transition ${
                isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30'
              }">
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5 mr-1.5"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindProductCardButtons(products) {
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-add-to-cart');
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        this.addToCart(prod);
      });
    });

    document.querySelectorAll('[data-view-reviews]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-view-reviews');
        const prod = products.find(p => p.id === id);
        if (prod) this.showProductDetailsModal(prod);
      });
    });
  },

  addToCart(product, qty = 1) {
    const existing = this.cart.find(i => i.product.id === product.id);
    if (existing) {
      if (existing.quantity + qty > product.stock) {
        window.showToast?.(`Cannot add more. Only ${product.stock} units available.`, 'info');
        return;
      }
      existing.quantity += qty;
    } else {
      this.cart.push({ product, quantity: qty });
    }

    this.saveCartToStorage();
    window.showToast?.(`Added "${product.name}" to cart!`, 'success');
  },

  // 2. Orders View
  async renderOrders(container) {
    try {
      const res = await API.orders.getAll({ customerId: this.currentCustomerId });
      const orders = res.orders || [];

      container.innerHTML = `
        <div class="space-y-4 fade-in">
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Your Farm Orders</h2>
              <p class="text-xs text-gray-500">Live order tracking directly from local Indian farms</p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
              ${orders.length} Placed Orders
            </span>
          </div>

          ${orders.length === 0 ? `
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <i data-lucide="package-open" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
              <p class="text-base font-semibold text-gray-600">You haven't placed any orders yet.</p>
              <p class="text-xs text-gray-400 mt-1">Browse our farm marketplace and order fresh desi produce!</p>
            </div>
          ` : `
            <div class="space-y-4">
              ${orders.map(o => this.renderOrderCard(o)).join('')}
            </div>
          `}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load orders: ${err.message}</div>`;
    }
  },

  renderOrderCard(order) {
    const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIdx = steps.indexOf(order.orderStatus);

    return `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-bold text-gray-900 text-base">Order #${order.id}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }">
                ${order.orderStatus}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">Placed on ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>

          <div class="text-right">
            <div class="text-lg font-extrabold text-emerald-600">₹${order.totalAmount.toFixed(2)}</div>
            <div class="text-xs text-gray-400">${order.paymentMethod} • ${order.paymentStatus.toUpperCase()}</div>
          </div>
        </div>

        <!-- Visual Tracking Stepper -->
        <div class="py-2">
          <div class="grid grid-cols-4 gap-2 text-center">
            ${steps.map((s, idx) => {
              const isPassed = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;
              return `
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition ${
                    isCurrent ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                    isPassed ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }">
                    ${isPassed ? '✓' : idx + 1}
                  </div>
                  <span class="text-[11px] font-semibold ${isPassed ? 'text-gray-900' : 'text-gray-400'}">${s}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Items breakdown -->
        <div class="bg-gray-50 rounded-xl p-3.5 space-y-2 border border-gray-100 text-xs">
          ${order.items.map(item => `
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-800">${item.quantity}x ${item.name} (${item.unit})</span>
              <span class="font-semibold text-gray-900">₹${(item.subtotal || item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="pt-2 border-t border-gray-200/80 flex justify-between text-gray-500">
            <span>Eco-Delivery: ₹${order.deliveryFee?.toFixed(2) || '40.00'}</span>
            <span class="font-bold text-gray-800">Total: ₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // Slide-out Cart Drawer
  showCartDrawer() {
    const existing = document.getElementById('cart-drawer-container');
    if (existing) existing.remove();

    const subtotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = this.cart.length > 0 ? 40.00 : 0;
    const total = subtotal + deliveryFee;

    const drawerHtml = `
      <div id="cart-drawer-container" class="fixed inset-0 z-50 overflow-hidden fade-in">
        <div id="cart-drawer-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
        <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i data-lucide="shopping-bag" class="w-5 h-5 text-emerald-600"></i>
                <h2 class="text-lg font-bold text-gray-900">Your Fresh Cart (Thali)</h2>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  ${this.cart.reduce((sum, i) => sum + i.quantity, 0)} Items
                </span>
              </div>
              <button id="btn-close-cart" class="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <!-- Items Scrollable List -->
            <div class="p-6 flex-1 overflow-y-auto space-y-4">
              ${this.cart.length === 0 ? `
                <div class="text-center py-16 text-gray-400">
                  <i data-lucide="shopping-cart" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
                  <p class="font-semibold text-gray-600">Your basket is currently empty.</p>
                  <p class="text-xs text-gray-400 mt-1">Add fresh items from our local Indian farmers.</p>
                </div>
              ` : `
                ${this.cart.map((item, idx) => `
                  <div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <img src="${item.product.image}" alt="${item.product.name}" class="w-14 h-14 rounded-lg object-cover">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800 text-sm leading-snug">${item.product.name}</h4>
                      <div class="text-xs text-gray-500">₹${item.product.price.toFixed(2)} / ${item.product.unit}</div>
                    </div>

                    <!-- Quantity counter -->
                    <div class="flex items-center space-x-1.5 bg-white border border-gray-200 rounded-lg p-1">
                      <button data-cart-minus="${idx}" class="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold">-</button>
                      <span class="text-xs font-bold px-1.5">${item.quantity}</span>
                      <button data-cart-plus="${idx}" class="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold">+</button>
                    </div>

                    <div class="text-right">
                      <div class="font-bold text-gray-900 text-sm">₹${(item.product.price * item.quantity).toFixed(2)}</div>
                      <button data-cart-remove="${idx}" class="text-[11px] text-rose-500 hover:underline">Remove</button>
                    </div>
                  </div>
                `).join('')}
              `}
            </div>

            <!-- Footer & Checkout Trigger -->
            <div class="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <div class="space-y-1.5 text-xs text-gray-600">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="font-semibold text-gray-900">₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span>Flat Delivery Fee</span>
                  <span class="font-semibold text-gray-900">₹${deliveryFee.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span class="text-emerald-700">₹${total.toFixed(2)}</span>
                </div>
              </div>

              <button id="btn-proceed-checkout" ${this.cart.length === 0 ? 'disabled' : ''} class="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition ${
                this.cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
              }">
                Proceed to Secure Checkout ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeCart = () => document.getElementById('cart-drawer-container')?.remove();
    document.getElementById('btn-close-cart')?.addEventListener('click', closeCart);
    document.getElementById('cart-drawer-backdrop')?.addEventListener('click', closeCart);

    // Cart actions
    document.querySelectorAll('[data-cart-plus]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-cart-plus'));
        if (this.cart[idx]) {
          if (this.cart[idx].quantity < this.cart[idx].product.stock) {
            this.cart[idx].quantity += 1;
            this.saveCartToStorage();
            this.showCartDrawer();
          } else {
            window.showToast?.('Maximum available stock reached', 'info');
          }
        }
      });
    });

    document.querySelectorAll('[data-cart-minus]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-cart-minus'));
        if (this.cart[idx]) {
          if (this.cart[idx].quantity > 1) {
            this.cart[idx].quantity -= 1;
          } else {
            this.cart.splice(idx, 1);
          }
          this.saveCartToStorage();
          this.showCartDrawer();
        }
      });
    });

    document.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-cart-remove'));
        this.cart.splice(idx, 1);
        this.saveCartToStorage();
        this.showCartDrawer();
      });
    });

    document.getElementById('btn-proceed-checkout')?.addEventListener('click', () => {
      closeCart();
      this.showCheckoutModal(total, subtotal);
    });
  },

  // Checkout & Payment Simulation Modal
  showCheckoutModal(total, subtotal) {
    const modalHtml = `
      <div id="checkout-modal-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">💳</span>
              <h3 class="text-xl font-bold text-gray-900">Payment & Delivery</h3>
            </div>
            <button id="checkout-close" class="text-gray-400 hover:text-gray-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="form-checkout" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Shipping & Delivery Address</label>
              <textarea name="shippingAddress" rows="2" required class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038</textarea>
            </div>

            <!-- Payment Method Radio Selector -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2">Select Indian Payment Option</label>
              <div class="grid grid-cols-3 gap-3">
                <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition text-center space-y-1 payment-opt-label border-emerald-600 bg-emerald-50/50">
                  <input type="radio" name="paymentMethod" value="UPI / PhonePe / GPay" checked class="hidden">
                  <i data-lucide="smartphone" class="w-5 h-5 text-emerald-600"></i>
                  <span class="text-xs font-semibold text-gray-800">UPI / QR</span>
                </label>
                <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition text-center space-y-1 payment-opt-label border-gray-200">
                  <input type="radio" name="paymentMethod" value="RuPay / Debit & Credit Card" class="hidden">
                  <i data-lucide="credit-card" class="w-5 h-5 text-emerald-600"></i>
                  <span class="text-xs font-semibold text-gray-800">RuPay / Card</span>
                </label>
                <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition text-center space-y-1 payment-opt-label border-gray-200">
                  <input type="radio" name="paymentMethod" value="Cash on Delivery (COD)" class="hidden">
                  <i data-lucide="banknote" class="w-5 h-5 text-emerald-600"></i>
                  <span class="text-xs font-semibold text-gray-800">Cash (COD)</span>
                </label>
              </div>
            </div>

            <!-- UPI Simulation note -->
            <div id="card-sim-fields" class="p-3 bg-emerald-50/60 rounded-xl space-y-2 border border-emerald-100 text-xs">
              <div class="flex items-center text-emerald-800 font-semibold">
                <i data-lucide="check-circle" class="w-4 h-4 mr-1.5 text-emerald-600"></i> Instant UPI Pay (PhonePe, Google Pay, Paytm)
              </div>
              <input type="text" placeholder="Enter UPI ID (e.g. priya@okhdfcbank)" value="priya.sharma@okaxis" class="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white">
            </div>

            <!-- Order Total Pill -->
            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div class="text-xs text-emerald-800 font-semibold">Total Amount Payable</div>
                <div class="text-xs text-gray-500">${this.cart.length} produce items + Eco-Delivery (₹40)</div>
              </div>
              <div class="text-2xl font-black text-emerald-700">
                ₹${total.toFixed(2)}
              </div>
            </div>

            <div class="pt-2 flex justify-end space-x-2">
              <button type="button" id="checkout-cancel" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" id="btn-submit-order" class="px-6 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30">
                Confirm & Pay ₹${total.toFixed(2)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => document.getElementById('checkout-modal-backdrop')?.remove();
    document.getElementById('checkout-close')?.addEventListener('click', closeModal);
    document.getElementById('checkout-cancel')?.addEventListener('click', closeModal);

    // Radio style toggles
    document.querySelectorAll('.payment-opt-label').forEach(lbl => {
      lbl.addEventListener('click', (e) => {
        document.querySelectorAll('.payment-opt-label').forEach(l => {
          l.className = 'border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition text-center space-y-1 payment-opt-label border-gray-200';
        });
        lbl.className = 'border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition text-center space-y-1 payment-opt-label border-emerald-600 bg-emerald-50/50';
      });
    });

    document.getElementById('form-checkout')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const shippingAddress = fd.get('shippingAddress');
      const paymentMethod = fd.get('paymentMethod');

      const items = this.cart.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }));

      const submitBtn = document.getElementById('btn-submit-order');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Processing Order...';
      }

      try {
        const res = await API.orders.create({
          items,
          customerId: this.currentCustomerId,
          customerName: this.customerName,
          shippingAddress,
          paymentMethod
        });

        // Clear cart
        this.cart = [];
        this.saveCartToStorage();
        closeModal();

        window.showToast?.('🎉 Order placed successfully! Dhanyawad.', 'success');
        this.activeTab = 'orders';
        this.renderLayout();
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Try Again';
        }
      }
    });
  },

  // Details & Reviews Modal
  async showProductDetailsModal(product) {
    try {
      const res = await API.reviews.getAll(product.id);
      const reviews = res.reviews || [];

      const modalHtml = `
        <div id="product-detail-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative fade-in max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 class="text-lg font-bold text-gray-900">${product.name}</h3>
              <button id="detail-modal-close" class="text-gray-400 hover:text-gray-600 p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-6">
              <img src="${product.image}" alt="${product.name}" class="w-full sm:w-44 h-44 object-cover rounded-2xl">
              <div class="flex-1 space-y-2">
                <div class="text-xs font-semibold text-emerald-700">${product.farmName}</div>
                <div class="text-2xl font-black text-emerald-800">₹${product.price.toFixed(2)} / ${product.unit}</div>
                <div class="flex items-center text-amber-500 font-bold text-sm">
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400 mr-1"></i> ${product.rating} (${reviews.length} reviews)
                </div>
                <p class="text-xs text-gray-500 leading-relaxed">${product.description}</p>
                <div class="pt-2">
                  <button id="modal-btn-add-cart" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <!-- Customer Reviews Section -->
            <div class="border-t border-gray-100 pt-4 space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-gray-900 text-sm">Customer Feedback & Ratings</h4>
                <button id="btn-write-review" class="text-xs font-semibold text-emerald-600 hover:underline">
                  + Write a Review
                </button>
              </div>

              <!-- Write Review Box -->
              <div id="box-write-review" class="hidden bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <h5 class="text-xs font-bold text-gray-800">Submit Your Review</h5>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-600 font-medium">Rating:</span>
                  <select id="review-rating-select" class="text-xs border rounded-lg px-2 py-1 bg-white">
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
                <textarea id="review-comment-input" rows="2" placeholder="Write about freshness, taste, organic aroma, and packaging..." class="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"></textarea>
                <button id="btn-submit-review" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition">
                  Publish Review
                </button>
              </div>

              <!-- Reviews List -->
              <div class="space-y-3">
                ${reviews.length === 0 ? `
                  <p class="text-xs text-gray-400 italic">No reviews yet for this produce. Be the first to review!</p>
                ` : `
                  ${reviews.map(r => `
                    <div class="p-3 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                      <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-gray-800">${r.customerName}</span>
                        <div class="text-amber-500">
                          ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p class="text-xs text-gray-600">${r.comment}</p>
                      <div class="text-[10px] text-gray-400">${r.date}</div>
                    </div>
                  `).join('')}
                `}
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      if (window.lucide) window.lucide.createIcons();

      const closeModal = () => document.getElementById('product-detail-backdrop')?.remove();
      document.getElementById('detail-modal-close')?.addEventListener('click', closeModal);

      document.getElementById('modal-btn-add-cart')?.addEventListener('click', () => {
        this.addToCart(product);
        closeModal();
      });

      document.getElementById('btn-write-review')?.addEventListener('click', () => {
        const box = document.getElementById('box-write-review');
        box?.classList.toggle('hidden');
      });

      document.getElementById('btn-submit-review')?.addEventListener('click', async () => {
        const rating = document.getElementById('review-rating-select').value;
        const comment = document.getElementById('review-comment-input').value.trim();

        if (!comment) {
          window.showToast?.('Please write a review comment', 'info');
          return;
        }

        try {
          await API.reviews.create({
            productId: product.id,
            rating: Number(rating),
            comment,
            customerId: this.currentCustomerId,
            customerName: this.customerName
          });

          closeModal();
          window.showToast?.('Review published! Dhanyawad.', 'success');
          this.fetchAndRenderProducts();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    } catch (err) {
      window.showToast?.(err.message, 'error');
    }
  }
};
