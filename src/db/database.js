import fs from 'fs';
import path from 'path';
import { initialData } from './seedData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'smart_farm_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = JSON.parse(JSON.stringify(initialData));
      this.persist();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading DB file, re-initializing with seed data:', err.message);
        this.data = JSON.parse(JSON.stringify(initialData));
        this.persist();
      }
    }
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err.message);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.persist();
    return this.data;
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  // Farms
  getFarms() {
    return this.data.farms;
  }

  getFarmById(id) {
    return this.data.farms.find(f => f.id === id);
  }

  getFarmByOwnerId(ownerId) {
    return this.data.farms.find(f => f.ownerId === ownerId);
  }

  updateFarm(id, updates) {
    const idx = this.data.farms.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.data.farms[idx] = { ...this.data.farms[idx], ...updates };
    this.persist();
    return this.data.farms[idx];
  }

  // Crops
  getCrops(farmerId = null) {
    if (farmerId) {
      return this.data.crops.filter(c => c.farmerId === farmerId);
    }
    return this.data.crops;
  }

  getCropById(id) {
    return this.data.crops.find(c => c.id === id);
  }

  addCrop(cropData) {
    const newCrop = {
      id: `crop-${Date.now()}`,
      healthStatus: 'Optimal',
      stage: 'Seeding',
      ...cropData
    };
    this.data.crops.unshift(newCrop);
    this.persist();
    return newCrop;
  }

  updateCrop(id, updates) {
    const idx = this.data.crops.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.crops[idx] = { ...this.data.crops[idx], ...updates };
    this.persist();
    return this.data.crops[idx];
  }

  deleteCrop(id) {
    const idx = this.data.crops.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.crops.splice(idx, 1);
    this.persist();
    return true;
  }

  // Products
  getProducts(filter = {}) {
    let result = [...this.data.products];
    if (filter.farmerId) {
      result = result.filter(p => p.farmerId === filter.farmerId);
    }
    if (filter.category && filter.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status) {
      result = result.filter(p => p.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.farmName.toLowerCase().includes(q));
    }
    return result;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      status: 'approved',
      rating: 5.0,
      reviewCount: 0,
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock)
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.persist();
    return true;
  }

  // Expenses
  getExpenses(farmerId = null) {
    if (farmerId) {
      return this.data.expenses.filter(e => e.farmerId === farmerId);
    }
    return this.data.expenses;
  }

  addExpense(expenseData) {
    const newExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...expenseData,
      amount: Number(expenseData.amount)
    };
    this.data.expenses.unshift(newExpense);
    this.persist();
    return newExpense;
  }

  deleteExpense(id) {
    const idx = this.data.expenses.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.expenses.splice(idx, 1);
    this.persist();
    return true;
  }

  // Orders
  getOrders(filter = {}) {
    let result = [...this.data.orders];
    if (filter.customerId) {
      result = result.filter(o => o.customerId === filter.customerId);
    }
    if (filter.farmerId) {
      result = result.filter(o => o.items && o.items.some(item => item.farmerId === filter.farmerId));
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(o => o.orderStatus.toLowerCase() === filter.status.toLowerCase());
    }
    return result;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(orderData) {
    const id = `ord-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      paymentStatus: 'paid',
      ...orderData
    };

    // Deduct stock for each item
    for (const item of newOrder.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date().toISOString();
      order.paymentStatus = 'paid';
    }
    this.persist();
    return order;
  }

  // Reviews
  getReviews(productId = null) {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...reviewData,
      rating: Number(reviewData.rating)
    };
    this.data.reviews.unshift(newReview);

    // Recalculate average rating on product
    const productReviews = this.data.reviews.filter(r => r.productId === reviewData.productId);
    const avgRating = (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1);
    const product = this.getProductById(reviewData.productId);
    if (product) {
      product.rating = Number(avgRating);
      product.reviewCount = productReviews.length;
    }

    this.persist();
    return newReview;
  }

  // Analytics & Summary metrics
  getFarmerMetrics(farmerId) {
    const crops = this.getCrops(farmerId);
    const products = this.getProducts({ farmerId });
    const expenses = this.getExpenses(farmerId);
    const farmerOrders = this.data.orders.filter(o => 
      o.items && o.items.some(item => item.farmerId === farmerId)
    );

    let totalSales = 0;
    farmerOrders.forEach(o => {
      o.items.forEach(item => {
        if (item.farmerId === farmerId) {
          totalSales += Number(item.subtotal || (item.price * item.quantity));
        }
      });
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netProfit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;

    return {
      totalSales: Number(totalSales.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      profitMargin: Number(profitMargin),
      activeCropsCount: crops.filter(c => c.stage !== 'Harvested').length,
      harvestedCropsCount: crops.filter(c => c.stage === 'Harvested').length,
      productsCount: products.length,
      ordersCount: farmerOrders.length,
      pendingOrdersCount: farmerOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length
    };
  }

  getAdminMetrics() {
    const users = this.data.users;
    const farmers = users.filter(u => u.role === 'farmer');
    const customers = users.filter(u => u.role === 'customer');
    const products = this.data.products;
    const orders = this.data.orders;

    const totalGrossMerchandiseValue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const totalPlatformCommission = orders.reduce((sum, o) => sum + (Number(o.platformFee) || 0), 0);

    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

    return {
      totalRevenue: Number(totalGrossMerchandiseValue.toFixed(2)),
      platformRevenue: Number(totalPlatformCommission.toFixed(2)),
      totalOrders: orders.length,
      completedOrders,
      totalFarmers: farmers.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      activeFarms: this.data.farms.length
    };
  }
}

export const db = new Database();
