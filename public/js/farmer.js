import { API } from './api.js';

export const FarmerModule = {
  currentFarmerId: 'user-farmer-1',
  activeTab: 'overview', // 'overview', 'crops', 'products', 'sales', 'expenses'

  async init(user) {
    if (user && user.id) {
      this.currentFarmerId = user.id;
    }
    this.renderLayout();
    this.bindSubNav();
    await this.loadActiveTab();
  },

  renderLayout() {
    const container = document.getElementById('portal-content');
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Farmer Sub-Header & Navigation Tabs -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div class="flex items-center space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-2xl font-bold">
                👨🌾
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900" id="farmer-farm-title">Kisan Vikas Organic Farms</h1>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <span class="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span> Jaivik Bharat Certified
                  </span>
                </div>
                <p class="text-sm text-gray-500" id="farmer-profile-subtitle">Kisan: Ramesh Patel • Nashik, Maharashtra</p>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap items-center gap-2">
              <button id="btn-add-crop-modal" class="inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-sm">
                <i data-lucide="sprout" class="w-4 h-4 mr-1.5"></i> Add Crop
              </button>
              <button id="btn-add-prod-modal" class="inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20">
                <i data-lucide="plus-circle" class="w-4 h-4 mr-1.5"></i> List Produce
              </button>
              <button id="btn-add-expense-modal" class="inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition shadow-sm">
                <i data-lucide="receipt" class="w-4 h-4 mr-1.5"></i> Log Expense
              </button>
            </div>
          </div>

          <!-- Tab Navigation -->
          <nav class="flex space-x-2 sm:space-x-4 mt-4 overflow-x-auto pt-1 pb-1">
            <button data-farmer-tab="overview" class="farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              🏡 Farm Overview
            </button>
            <button data-farmer-tab="crops" class="farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'crops' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              🌱 Manage Crops
            </button>
            <button data-farmer-tab="products" class="farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'products' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📦 Products & Inventory
            </button>
            <button data-farmer-tab="sales" class="farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'sales' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📈 Track Sales
            </button>
            <button data-farmer-tab="expenses" class="farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'expenses' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              💰 Expenses & P&L
            </button>
          </nav>
        </div>

        <!-- Dynamic Farmer Tab Content -->
        <div id="farmer-tab-content" class="min-h-[400px]">
          <div class="flex items-center justify-center p-12 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindHeaderActions();
  },

  bindHeaderActions() {
    document.getElementById('btn-add-crop-modal')?.addEventListener('click', () => this.showAddCropModal());
    document.getElementById('btn-add-prod-modal')?.addEventListener('click', () => this.showAddProductModal());
    document.getElementById('btn-add-expense-modal')?.addEventListener('click', () => this.showAddExpenseModal());
  },

  bindSubNav() {
    document.querySelectorAll('.farmer-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-farmer-tab');
        if (tab && tab !== this.activeTab) {
          this.activeTab = tab;
          document.querySelectorAll('.farmer-nav-btn').forEach(b => {
            b.className = 'farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition text-gray-600 hover:bg-gray-100';
          });
          e.currentTarget.className = 'farmer-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition bg-emerald-600 text-white';
          this.loadActiveTab();
        }
      });
    });
  },

  async loadActiveTab() {
    const content = document.getElementById('farmer-tab-content');
    if (!content) return;

    switch (this.activeTab) {
      case 'overview':
        await this.renderOverviewTab(content);
        break;
      case 'crops':
        await this.renderCropsTab(content);
        break;
      case 'products':
        await this.renderProductsTab(content);
        break;
      case 'sales':
        await this.renderSalesTab(content);
        break;
      case 'expenses':
        await this.renderExpensesTab(content);
        break;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 1. Overview Tab
  async renderOverviewTab(container) {
    try {
      const [farmRes, metricsRes] = await Promise.all([
        API.farm.getProfile(this.currentFarmerId),
        API.farm.getMetrics(this.currentFarmerId)
      ]);

      const farm = farmRes.farm || {};
      const m = metricsRes.metrics || {};

      const titleEl = document.getElementById('farmer-farm-title');
      const subtitleEl = document.getElementById('farmer-profile-subtitle');
      if (titleEl) titleEl.innerText = farm.name || 'Kisan Farm';
      if (subtitleEl) subtitleEl.innerText = `Location: ${farm.location || 'Nashik, Maharashtra'} • ${farm.sizeAcres || 0} Acres`;

      container.innerHTML = `
        <div class="space-y-6 fade-in">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-500 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm">
                  ₹
                </div>
              </div>
              <div class="text-2xl font-bold text-gray-900">₹${m.totalSales?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
              <p class="text-xs text-emerald-600 font-medium mt-1">From fulfilled customer orders</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-500 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
                <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-sm">
                  ₹
                </div>
              </div>
              <div class="text-2xl font-bold text-gray-900">₹${m.totalExpenses?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
              <p class="text-xs text-gray-500 mt-1">Seeds, bio-fertilizers & labor</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-500 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Net Profit</span>
                <div class="w-8 h-8 rounded-lg ${m.netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} font-bold flex items-center justify-center text-sm">
                  ₹
                </div>
              </div>
              <div class="text-2xl font-bold ${m.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                ₹${m.netProfit?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <p class="text-xs font-medium ${m.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'} mt-1">
                Margin: ${m.profitMargin || 0}%
              </p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-500 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Active Crops</span>
                <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <i data-lucide="leaf" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="text-2xl font-bold text-gray-900">${m.activeCropsCount || 0} Crops</div>
              <p class="text-xs text-amber-600 font-medium mt-1">${m.harvestedCropsCount || 0} harvested this season</p>
            </div>
          </div>

          <!-- Farm Specs & Sensor Weather telemetry -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Farm Details Card -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900 flex items-center">
                  <i data-lucide="map-pin" class="w-5 h-5 mr-2 text-emerald-600"></i> Farm Specification & Profile
                </h3>
                <button id="btn-edit-farm" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">
                  Edit Specifications
                </button>
              </div>

              <p class="text-gray-600 text-sm leading-relaxed mb-6">
                ${farm.description || 'No farm description provided.'}
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <div>
                  <div class="text-xs text-gray-400 font-medium uppercase">Farm Area</div>
                  <div class="text-base font-bold text-gray-800 mt-1">${farm.sizeAcres || 0} Acres</div>
                </div>
                <div>
                  <div class="text-xs text-gray-400 font-medium uppercase">Soil Composition</div>
                  <div class="text-base font-bold text-gray-800 mt-1">${farm.soilType || 'Black Cotton Soil'}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-400 font-medium uppercase">Irrigation System</div>
                  <div class="text-base font-bold text-gray-800 mt-1">${farm.irrigationType || 'Drip Irrigation'}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-400 font-medium uppercase">Established</div>
                  <div class="text-base font-bold text-gray-800 mt-1">${farm.establishedYear || 2017}</div>
                </div>
              </div>
            </div>

            <!-- Smart Telemetry / Weather Station -->
            <div class="bg-gradient-to-br from-emerald-900 to-green-950 text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs uppercase tracking-widest text-emerald-300 font-bold">IoT Kisan Sensor</span>
                  <span class="inline-flex items-center text-xs text-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span> Live Feed
                  </span>
                </div>
                <div class="text-3xl font-extrabold mb-1">${farm.weather?.temp || '27°C'}</div>
                <div class="text-sm text-emerald-200">${farm.weather?.condition || 'Pleasant & Sunny'}</div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-emerald-800/80">
                <div class="bg-emerald-800/40 p-3 rounded-xl">
                  <div class="text-xs text-emerald-300 font-medium">Soil Moisture</div>
                  <div class="text-lg font-bold mt-0.5">${farm.weather?.soilMoisture || '68%'}</div>
                  <div class="text-[10px] text-emerald-300">Optimal Root Zone</div>
                </div>
                <div class="bg-emerald-800/40 p-3 rounded-xl">
                  <div class="text-xs text-emerald-300 font-medium">Ambient Humidity</div>
                  <div class="text-lg font-bold mt-0.5">${farm.weather?.humidity || '54%'}</div>
                  <div class="text-[10px] text-emerald-300">Safe Fungal Index</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-edit-farm')?.addEventListener('click', () => this.showEditFarmModal(farm));
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load overview: ${err.message}</div>`;
    }
  },

  // 2. Manage Crops Tab
  async renderCropsTab(container) {
    try {
      const res = await API.crops.getAll(this.currentFarmerId);
      const crops = res.crops || [];

      container.innerHTML = `
        <div class="space-y-4 fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Registered Field Crops</h2>
              <p class="text-xs text-gray-500">Monitor plant growth cycles, field plots, and health conditions</p>
            </div>
            <button id="btn-add-crop-in-tab" class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition">
              <i data-lucide="plus" class="w-4 h-4 mr-1"></i> Register New Crop
            </button>
          </div>

          ${crops.length === 0 ? `
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <i data-lucide="sprout" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
              <p class="text-base font-semibold text-gray-600">No active crops registered yet.</p>
              <p class="text-xs text-gray-400 mt-1">Click above to record your first crop planting cycle.</p>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${crops.map(c => this.renderCropCard(c)).join('')}
            </div>
          `}
        </div>
      `;

      document.getElementById('btn-add-crop-in-tab')?.addEventListener('click', () => this.showAddCropModal());
      this.bindCropCardActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load crops: ${err.message}</div>`;
    }
  },

  renderCropCard(crop) {
    const stageColors = {
      'Seeding': 'bg-blue-50 text-blue-700 border-blue-200',
      'Vegetative': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Flowering': 'bg-purple-50 text-purple-700 border-purple-200',
      'Ready for Harvest': 'bg-amber-50 text-amber-700 border-amber-200',
      'Harvested': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const healthBadge = crop.healthStatus === 'Optimal' 
      ? '<span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center"><span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>Optimal</span>'
      : '<span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>' + crop.healthStatus + '</span>';

    return `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 class="font-bold text-gray-900 text-base">${crop.name}</h3>
              <p class="text-xs text-gray-500">${crop.variety} • ${crop.plot}</p>
            </div>
            <span class="border px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[crop.stage] || 'bg-gray-50 text-gray-700'}">
              ${crop.stage}
            </span>
          </div>

          <div class="flex items-center justify-between my-3 py-2 border-y border-gray-50 text-xs text-gray-600">
            <div><strong>Area:</strong> ${crop.acreage} Acres</div>
            <div>${healthBadge}</div>
          </div>

          <div class="space-y-1.5 text-xs text-gray-500">
            <div class="flex justify-between">
              <span>Planted:</span>
              <span class="font-medium text-gray-800">${crop.plantingDate}</span>
            </div>
            <div class="flex justify-between">
              <span>Expected Harvest:</span>
              <span class="font-medium text-gray-800">${crop.expectedHarvestDate || 'TBD'}</span>
            </div>
          </div>

          ${crop.notes ? `
            <div class="mt-3 p-2.5 rounded-xl bg-gray-50 text-xs text-gray-600 border border-gray-100">
              <span class="font-semibold text-gray-700">Agronomist Note:</span> ${crop.notes}
            </div>
          ` : ''}
        </div>

        <div class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100">
          <button data-crop-advance="${crop.id}" data-current-stage="${crop.stage}" class="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">
            Advance Stage ➔
          </button>
          <button data-crop-delete="${crop.id}" class="text-xs text-gray-400 hover:text-rose-600 p-1.5 transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  bindCropCardActions() {
    document.querySelectorAll('[data-crop-advance]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-crop-advance');
        const currentStage = e.currentTarget.getAttribute('data-current-stage');
        const stages = ['Seeding', 'Vegetative', 'Flowering', 'Ready for Harvest', 'Harvested'];
        const currentIdx = stages.indexOf(currentStage);
        const nextStage = stages[Math.min(currentIdx + 1, stages.length - 1)];

        if (nextStage === currentStage) {
          window.showToast?.('Crop is already harvested!', 'info');
          return;
        }

        try {
          await API.crops.update(id, { stage: nextStage });
          window.showToast?.(`Crop advanced to ${nextStage}`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('[data-crop-delete]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Are you sure you want to remove this crop record?')) return;
        const id = e.currentTarget.getAttribute('data-crop-delete');
        try {
          await API.crops.delete(id);
          window.showToast?.('Crop record deleted', 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 3. Products Tab
  async renderProductsTab(container) {
    try {
      const res = await API.products.getAll({ farmerId: this.currentFarmerId });
      const products = res.products || [];

      container.innerHTML = `
        <div class="space-y-4 fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Marketplace Produce Listings</h2>
              <p class="text-xs text-gray-500">Sell farm fresh produce directly to registered customers</p>
            </div>
            <button id="btn-add-prod-in-tab" class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition">
              <i data-lucide="plus" class="w-4 h-4 mr-1"></i> List New Produce
            </button>
          </div>

          ${products.length === 0 ? `
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
              <p class="text-base font-semibold text-gray-600">No active products listed.</p>
              <p class="text-xs text-gray-400 mt-1">List your fresh harvest to start receiving customer orders.</p>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${products.map(p => this.renderProductFarmerCard(p)).join('')}
            </div>
          `}
        </div>
      `;

      document.getElementById('btn-add-prod-in-tab')?.addEventListener('click', () => this.showAddProductModal());
      this.bindProductCardActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load products: ${err.message}</div>`;
    }
  },

  renderProductFarmerCard(p) {
    return `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div class="relative h-44 w-full bg-gray-100 overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur text-emerald-800 shadow-sm">
            ${p.category}
          </span>
          ${p.organic ? `
            <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              Jaivik Organic
            </span>
          ` : ''}
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-gray-900 text-base">${p.name}</h3>
              <div class="text-base font-extrabold text-emerald-600">₹${p.price.toFixed(2)}<span class="text-xs font-normal text-gray-500">/${p.unit}</span></div>
            </div>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3">${p.description}</p>
          </div>

          <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-gray-400">Stock:</span>
              <span class="font-bold ${p.stock > 10 ? 'text-gray-800' : 'text-rose-600'}">${p.stock} ${p.unit}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button data-prod-stock-add="${p.id}" class="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition">
                + Stock
              </button>
              <button data-prod-delete="${p.id}" class="text-gray-400 hover:text-rose-600 p-1 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindProductCardActions() {
    document.querySelectorAll('[data-prod-stock-add]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-prod-stock-add');
        const added = prompt('How many units would you like to add to stock?', '25');
        if (!added || isNaN(added) || Number(added) <= 0) return;

        try {
          const prodRes = await API.products.getById(id);
          const currentStock = prodRes.product.stock || 0;
          await API.products.update(id, { stock: currentStock + Number(added) });
          window.showToast?.(`Added ${added} units to inventory!`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('[data-prod-delete]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Are you sure you want to delete this product listing?')) return;
        const id = e.currentTarget.getAttribute('data-prod-delete');
        try {
          await API.products.delete(id);
          window.showToast?.('Product listing removed', 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 4. Sales Tracker Tab
  async renderSalesTab(container) {
    try {
      const res = await API.orders.getAll({ farmerId: this.currentFarmerId });
      const orders = res.orders || [];

      container.innerHTML = `
        <div class="space-y-4 fade-in">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Direct Customer Orders</h2>
              <p class="text-xs text-gray-500">Track and fulfill incoming produce shipments</p>
            </div>
            <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
              ${orders.length} Total Orders
            </span>
          </div>

          ${orders.length === 0 ? `
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <i data-lucide="package" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
              <p class="text-base font-semibold text-gray-600">No customer orders yet.</p>
              <p class="text-xs text-gray-400 mt-1">Orders placed by customers will appear here for fulfillment.</p>
            </div>
          ` : `
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-600">
                  <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
                    <tr>
                      <th class="px-6 py-4">Order ID & Date</th>
                      <th class="px-6 py-4">Customer</th>
                      <th class="px-6 py-4">Items Ordered</th>
                      <th class="px-6 py-4">Farmer Subtotal</th>
                      <th class="px-6 py-4">Status</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    ${orders.map(o => {
                      const farmerItems = o.items.filter(i => i.farmerId === this.currentFarmerId);
                      const farmerSubtotal = farmerItems.reduce((sum, i) => sum + (i.subtotal || i.price * i.quantity), 0);
                      return `
                        <tr class="hover:bg-gray-50/50 transition">
                          <td class="px-6 py-4 font-semibold text-gray-900">
                            ${o.id}
                            <div class="text-xs text-gray-400 font-normal">${new Date(o.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="font-medium text-gray-800">${o.customerName}</div>
                            <div class="text-xs text-gray-400">${o.shippingAddress || 'Direct delivery'}</div>
                          </td>
                          <td class="px-6 py-4 text-xs">
                            ${farmerItems.map(i => `<span class="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1 mb-1 font-medium">${i.quantity}x ${i.name}</span>`).join('')}
                          </td>
                          <td class="px-6 py-4 font-bold text-emerald-600">
                            ₹${farmerSubtotal.toFixed(2)}
                          </td>
                          <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              o.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }">
                              ${o.orderStatus}
                            </span>
                          </td>
                          <td class="px-6 py-4 text-right space-x-1">
                            ${o.orderStatus !== 'Delivered' ? `
                              <select data-order-status-change="${o.id}" class="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium">
                                <option value="" disabled selected>Update Status</option>
                                <option value="Processing">Mark Processing</option>
                                <option value="Shipped">Mark Shipped</option>
                                <option value="Delivered">Mark Delivered</option>
                              </select>
                            ` : '<span class="text-xs text-gray-400">Completed</span>'}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `}
        </div>
      `;

      this.bindSalesActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load sales: ${err.message}</div>`;
    }
  },

  bindSalesActions() {
    document.querySelectorAll('[data-order-status-change]').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = e.currentTarget.getAttribute('data-order-status-change');
        const status = e.currentTarget.value;
        if (!status) return;

        try {
          await API.orders.updateStatus(id, status);
          window.showToast?.(`Order ${id} marked as ${status}`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 5. Expenses Tab
  async renderExpensesTab(container) {
    try {
      const [expRes, metricsRes] = await Promise.all([
        API.expenses.getAll(this.currentFarmerId),
        API.farm.getMetrics(this.currentFarmerId)
      ]);

      const expenses = expRes.expenses || [];
      const m = metricsRes.metrics || {};

      container.innerHTML = `
        <div class="space-y-4 fade-in">
          <!-- Profit & Loss Summary Card -->
          <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Farm Financial Statement</span>
                <h2 class="text-xl font-bold mt-0.5">Net Profit & Loss Analysis (₹)</h2>
              </div>
              <button id="btn-add-exp-in-tab" class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm">
                <i data-lucide="plus" class="w-4 h-4 mr-1"></i> Record New Expense
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-700/80 pt-4">
              <div>
                <div class="text-xs text-gray-400 font-medium">Gross Revenue (Sales)</div>
                <div class="text-2xl font-bold text-emerald-400 mt-1">₹${m.totalSales?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
              </div>
              <div>
                <div class="text-xs text-gray-400 font-medium">Operational Expenses</div>
                <div class="text-2xl font-bold text-rose-400 mt-1">₹${m.totalExpenses?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
              </div>
              <div>
                <div class="text-xs text-gray-400 font-medium">Net Profit</div>
                <div class="text-2xl font-bold ${m.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'} mt-1">
                  ₹${m.netProfit?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                  <span class="text-xs font-medium text-gray-300 ml-1">(${m.profitMargin || 0}%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Expenses Table -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-900 text-base">Expense Log (Kharcha)</h3>
              <span class="text-xs text-gray-400">${expenses.length} Records</span>
            </div>

            ${expenses.length === 0 ? `
              <div class="p-10 text-center text-gray-400">
                <p class="text-sm">No expenses recorded yet.</p>
              </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-600">
                  <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
                    <tr>
                      <th class="px-6 py-3.5">Expense Item</th>
                      <th class="px-6 py-3.5">Category</th>
                      <th class="px-6 py-3.5">Date</th>
                      <th class="px-6 py-3.5">Notes</th>
                      <th class="px-6 py-3.5">Amount (₹)</th>
                      <th class="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    ${expenses.map(e => `
                      <tr class="hover:bg-gray-50/50 transition">
                        <td class="px-6 py-3.5 font-semibold text-gray-800">${e.title}</td>
                        <td class="px-6 py-3.5">
                          <span class="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            ${e.category}
                          </span>
                        </td>
                        <td class="px-6 py-3.5 text-xs text-gray-500">${e.date}</td>
                        <td class="px-6 py-3.5 text-xs text-gray-500">${e.notes || '-'}</td>
                        <td class="px-6 py-3.5 font-bold text-rose-600">
                          ₹${Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td class="px-6 py-3.5 text-right">
                          <button data-expense-delete="${e.id}" class="text-gray-400 hover:text-rose-600 p-1 transition">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `;

      document.getElementById('btn-add-exp-in-tab')?.addEventListener('click', () => this.showAddExpenseModal());
      this.bindExpenseActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load expenses: ${err.message}</div>`;
    }
  },

  bindExpenseActions() {
    document.querySelectorAll('[data-expense-delete]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Are you sure you want to delete this expense entry?')) return;
        const id = e.currentTarget.getAttribute('data-expense-delete');
        try {
          await API.expenses.delete(id);
          window.showToast?.('Expense deleted', 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // Modals
  showAddCropModal() {
    const modalHtml = `
      <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 class="text-lg font-bold text-gray-900">Register New Crop</h3>
            <button id="modal-close" class="text-gray-400 hover:text-gray-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="form-add-crop" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Crop Name *</label>
                <input type="text" name="name" required placeholder="e.g. Desi Tamatar / Basmati" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Variety</label>
                <input type="text" name="variety" placeholder="e.g. Pusa Ruby Heirloom" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Plot / Polyhouse</label>
                <input type="text" name="plot" placeholder="e.g. North Plot Canal Side" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Acreage</label>
                <input type="number" step="0.5" name="acreage" value="2" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Planting Date *</label>
                <input type="date" name="plantingDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Expected Harvest Date</label>
                <input type="date" name="expectedHarvestDate" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Initial Stage</label>
                <select name="stage" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  <option value="Seeding">Seeding</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Ready for Harvest">Ready for Harvest</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Health Status</label>
                <select name="healthStatus" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  <option value="Optimal">Optimal</option>
                  <option value="Needs Attention">Needs Attention</option>
                  <option value="Pest Alert">Pest Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Agronomic Notes</label>
              <textarea name="notes" rows="2" placeholder="Bio-fertilizers, organic sprays, Jeevamrut notes..." class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
            </div>

            <div class="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button type="button" id="modal-cancel" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" class="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition">Register Crop</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => document.getElementById('modal-backdrop')?.remove();
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('form-add-crop')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      data.farmerId = this.currentFarmerId;

      try {
        await API.crops.create(data);
        closeModal();
        window.showToast?.('Crop recorded successfully!', 'success');
        this.activeTab = 'crops';
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
      }
    });
  },

  showAddProductModal() {
    const modalHtml = `
      <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 class="text-lg font-bold text-gray-900">List Produce on Marketplace</h3>
            <button id="modal-close" class="text-gray-400 hover:text-gray-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="form-add-prod" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
              <input type="text" name="name" required placeholder="e.g. Fresh Desi Organic Tomatoes" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select name="category" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Organic Herbs">Organic Herbs</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Unit Type</label>
                <input type="text" name="unit" value="kg" placeholder="e.g. kg, box, liter, piece" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Price per Unit (₹) *</label>
                <input type="number" step="1" name="price" required placeholder="40" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Stock Available *</label>
                <input type="number" name="stock" required placeholder="100" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Product Image URL</label>
              <input type="url" name="image" value="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="2" placeholder="Naturally grown, chemical-free farm fresh harvest..." class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
            </div>

            <div class="flex items-center space-x-2">
              <input type="checkbox" name="organic" id="prod-organic-chk" value="true" checked class="w-4 h-4 text-emerald-600 rounded">
              <label for="prod-organic-chk" class="text-xs text-gray-700 font-semibold">100% Certified Jaivik Organic</label>
            </div>

            <div class="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button type="button" id="modal-cancel" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" class="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition">Publish Product</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => document.getElementById('modal-backdrop')?.remove();
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('form-add-prod')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      data.farmerId = this.currentFarmerId;
      data.organic = fd.get('organic') === 'true';

      try {
        await API.products.create(data);
        closeModal();
        window.showToast?.('Produce listed on marketplace!', 'success');
        this.activeTab = 'products';
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
      }
    });
  },

  showAddExpenseModal() {
    const modalHtml = `
      <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 class="text-lg font-bold text-gray-900">Record Farm Expense (Kharcha)</h3>
            <button id="modal-close" class="text-gray-400 hover:text-gray-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="form-add-exp" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Expense Title *</label>
              <input type="text" name="title" required placeholder="e.g. Vermicompost & Bio-Fertilizer 200kg" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select name="category" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  <option value="Seeds & Saplings">Seeds & Saplings</option>
                  <option value="Fertilizers & Nutrients">Fertilizers & Nutrients</option>
                  <option value="Equipment & Irrigation">Equipment & Irrigation</option>
                  <option value="Labor">Labor (Mazdoor)</option>
                  <option value="Machinery & Fuel">Machinery & Diesel</option>
                  <option value="Packaging & Logistics">Packaging & Logistics</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                <input type="number" step="1" name="amount" required placeholder="3500" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Date</label>
              <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Notes / Bill Receipt No.</label>
              <textarea name="notes" rows="2" placeholder="Local mandi receipt, UPI transaction ID..." class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
            </div>

            <div class="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button type="button" id="modal-cancel" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" class="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition">Record Expense</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => document.getElementById('modal-backdrop')?.remove();
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('form-add-exp')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      data.farmerId = this.currentFarmerId;

      try {
        await API.expenses.create(data);
        closeModal();
        window.showToast?.('Expense logged successfully!', 'success');
        this.activeTab = 'expenses';
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
      }
    });
  },

  showEditFarmModal(farm) {
    const modalHtml = `
      <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative fade-in">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 class="text-lg font-bold text-gray-900">Update Farm Details</h3>
            <button id="modal-close" class="text-gray-400 hover:text-gray-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form id="form-edit-farm" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
              <input type="text" name="name" value="${farm.name || 'Kisan Vikas Organic Farms'}" required class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value="${farm.location || 'Nashik, Maharashtra'}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Area (Acres)</label>
                <input type="number" name="sizeAcres" value="${farm.sizeAcres || 15}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Soil Type</label>
                <input type="text" name="soilType" value="${farm.soilType || 'Black Cotton Soil (Regur)'}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Irrigation Method</label>
                <input type="text" name="irrigationType" value="${farm.irrigationType || 'Drip Irrigation & Canal Water'}" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Farm Bio / Jaivik Certification</label>
              <textarea name="description" rows="3" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">${farm.description || ''}</textarea>
            </div>

            <div class="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button type="button" id="modal-cancel" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
              <button type="submit" class="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => document.getElementById('modal-backdrop')?.remove();
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('form-edit-farm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      data.sizeAcres = Number(data.sizeAcres);

      try {
        await API.farm.updateProfile(farm.id, data);
        closeModal();
        window.showToast?.('Farm profile updated!', 'success');
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
      }
    });
  }
};
