import { API } from './api.js';

export const AdminModule = {
  activeTab: 'overview', // 'overview', 'users', 'products', 'orders', 'reports'
  categoryChart: null,
  topProductsChart: null,

  async init(user) {
    this.renderLayout();
    this.bindSubNav();
    await this.loadActiveTab();
  },

  renderLayout() {
    const container = document.getElementById('portal-content');
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Admin Header -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div class="flex items-center space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-md text-2xl font-bold">
                👨💼
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Platform Command Center</h1>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    <span class="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full animate-ping"></span> Live Ops India
                  </span>
                </div>
                <p class="text-sm text-gray-500">Kisan Agro Director: Dr. Radhika Iyer • National Operations</p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button id="btn-reset-db" class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5 mr-1.5"></i> Reset Demo Database
              </button>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <nav class="flex space-x-2 sm:space-x-4 mt-4 overflow-x-auto pt-1 pb-1">
            <button data-admin-tab="overview" class="admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📊 Platform Overview
            </button>
            <button data-admin-tab="users" class="admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              👥 Kisans & Customers
            </button>
            <button data-admin-tab="products" class="admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📦 Produce Moderation
            </button>
            <button data-admin-tab="orders" class="admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📋 All Orders
            </button>
            <button data-admin-tab="reports" class="admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition ${this.activeTab === 'reports' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}">
              📈 Reports & Analytics
            </button>
          </nav>
        </div>

        <!-- Dynamic Content -->
        <div id="admin-tab-content" class="min-h-[400px]">
          <div class="flex items-center justify-center p-12 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindHeaderActions();
  },

  bindHeaderActions() {
    document.getElementById('btn-reset-db')?.addEventListener('click', async () => {
      if (!confirm('Reset database back to initial Indian demo seeds?')) return;
      try {
        await API.admin.resetDb();
        window.showToast?.('Database restored to fresh Indian demo state!', 'success');
        this.loadActiveTab();
      } catch (err) {
        window.showToast?.(err.message, 'error');
      }
    });
  },

  bindSubNav() {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-admin-tab');
        if (tab && tab !== this.activeTab) {
          this.activeTab = tab;
          document.querySelectorAll('.admin-nav-btn').forEach(b => {
            b.className = 'admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition text-gray-600 hover:bg-gray-100';
          });
          e.currentTarget.className = 'admin-nav-btn px-4 py-2 text-sm font-semibold rounded-xl transition bg-slate-900 text-white';
          this.loadActiveTab();
        }
      });
    });
  },

  async loadActiveTab() {
    const content = document.getElementById('admin-tab-content');
    if (!content) return;

    switch (this.activeTab) {
      case 'overview':
        await this.renderOverviewTab(content);
        break;
      case 'users':
        await this.renderUsersTab(content);
        break;
      case 'products':
        await this.renderProductsTab(content);
        break;
      case 'orders':
        await this.renderOrdersTab(content);
        break;
      case 'reports':
        await this.renderReportsTab(content);
        break;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 1. Overview Tab
  async renderOverviewTab(container) {
    try {
      const res = await API.admin.getMetrics();
      const m = res.metrics || {};

      container.innerHTML = `
        <div class="space-y-6 fade-in">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-400 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Gross Platform GMV</span>
                <span class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">₹</span>
              </div>
              <div class="text-2xl font-black text-gray-900">₹${m.totalRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
              <p class="text-xs text-emerald-600 font-semibold mt-1">Total customer transactions</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-400 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Platform Take (5%)</span>
                <span class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">₹</span>
              </div>
              <div class="text-2xl font-black text-blue-600">₹${m.platformRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
              <p class="text-xs text-gray-500 mt-1">Platform service fee</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-400 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                <i data-lucide="shopping-bag" class="w-5 h-5 text-purple-600"></i>
              </div>
              <div class="text-2xl font-black text-gray-900">${m.totalOrders || 0}</div>
              <p class="text-xs text-emerald-600 font-semibold mt-1">${m.completedOrders || 0} delivered successfully</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between text-gray-400 mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider">Active Ecosystem</span>
                <i data-lucide="users" class="w-5 h-5 text-amber-600"></i>
              </div>
              <div class="text-2xl font-black text-gray-900">${(m.totalFarmers || 0) + (m.totalCustomers || 0)} Users</div>
              <p class="text-xs text-gray-500 mt-1">${m.totalFarmers} Kisans • ${m.totalCustomers} Customers</p>
            </div>
          </div>

          <!-- Quick System Health Panel -->
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 class="text-base font-bold text-gray-900 flex items-center">
              <i data-lucide="server" class="w-4 h-4 mr-2 text-slate-700"></i> Smart Farming Platform Services Health
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div class="text-xs font-bold text-gray-800">REST API Engine</div>
                  <div class="text-[11px] text-gray-400">Node.js Express v4 • 100% Uptime</div>
                </div>
              </div>
              <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div class="text-xs font-bold text-gray-800">Database Layer</div>
                  <div class="text-[11px] text-gray-400">Persistent JSON Engine • Healthy</div>
                </div>
              </div>
              <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div class="text-xs font-bold text-gray-800">Payment Gateway Mock</div>
                  <div class="text-[11px] text-gray-400">UPI / RuPay / COD Sim • Operational</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load admin overview: ${err.message}</div>`;
    }
  },

  // 2. Users Tab
  async renderUsersTab(container) {
    try {
      const res = await API.admin.getUsers();
      const users = res.users || [];

      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Platform Users Directory</h2>
              <p class="text-xs text-gray-500">Manage Kisan verifications and account permissions</p>
            </div>
            <span class="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
              ${users.length} Registered Accounts
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4">User & Contact</th>
                  <th class="px-6 py-4">Role</th>
                  <th class="px-6 py-4">Verification</th>
                  <th class="px-6 py-4">Account Status</th>
                  <th class="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${users.map(u => `
                  <tr class="hover:bg-gray-50/50 transition">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <img src="${u.avatar}" alt="${u.name}" class="w-9 h-9 rounded-full object-cover">
                        <div>
                          <div class="font-bold text-gray-900">${u.name}</div>
                          <div class="text-xs text-gray-400">${u.email} • ${u.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }">
                        ${u.role === 'farmer' ? 'KISAN' : u.role.toUpperCase()}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${u.role === 'farmer' ? `
                        <button data-toggle-verify="${u.id}" data-current-val="${u.verified ? 'true' : 'false'}" class="text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          u.verified ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }">
                          ${u.verified ? '✓ Verified Kisan' : '⏳ Pending'}
                        </button>
                      ` : '<span class="text-xs text-gray-400">N/A</span>'}
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }">
                        <span class="w-1.5 h-1.5 rounded-full mr-1.5 ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                        ${u.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button data-toggle-status="${u.id}" data-current-val="${u.status}" class="text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition">
                        Toggle ${u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.bindUserActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load users: ${err.message}</div>`;
    }
  },

  bindUserActions() {
    document.querySelectorAll('[data-toggle-verify]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-toggle-verify');
        const currentVal = e.currentTarget.getAttribute('data-current-val') === 'true';
        try {
          await API.admin.updateUser(id, { verified: !currentVal });
          window.showToast?.(`Farmer verification updated`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('[data-toggle-status]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-toggle-status');
        const currentVal = e.currentTarget.getAttribute('data-current-val');
        const nextVal = currentVal === 'active' ? 'suspended' : 'active';
        try {
          await API.admin.updateUser(id, { status: nextVal });
          window.showToast?.(`User status updated to ${nextVal}`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 3. Products Moderation Tab
  async renderProductsTab(container) {
    try {
      const res = await API.products.getAll();
      const products = res.products || [];

      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Produce Listings Moderation</h2>
              <p class="text-xs text-gray-500">Inspect product quality, organic certificates, and inventory</p>
            </div>
            <span class="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
              ${products.length} Listed Items
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4">Produce</th>
                  <th class="px-6 py-4">Farm Origin</th>
                  <th class="px-6 py-4">Price / Stock</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${products.map(p => `
                  <tr class="hover:bg-gray-50/50 transition">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover">
                        <div>
                          <div class="font-bold text-gray-900">${p.name}</div>
                          <div class="text-xs text-gray-400">${p.category} ${p.organic ? '• Jaivik Organic' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-800">
                      ${p.farmName}
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-bold text-emerald-700">₹${p.price.toFixed(2)} / ${p.unit}</div>
                      <div class="text-xs text-gray-400">${p.stock} in stock</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'flagged' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }">
                        ${p.status || 'approved'}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button data-prod-flag-toggle="${p.id}" data-current-status="${p.status || 'approved'}" class="text-xs font-semibold px-3 py-1 rounded-lg border transition ${
                        p.status === 'flagged' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }">
                        ${p.status === 'flagged' ? 'Approve Listing' : 'Flag Listing'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.bindProductModerationActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load products: ${err.message}</div>`;
    }
  },

  bindProductModerationActions() {
    document.querySelectorAll('[data-prod-flag-toggle]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-prod-flag-toggle');
        const current = e.currentTarget.getAttribute('data-current-status');
        const next = current === 'flagged' ? 'approved' : 'flagged';

        try {
          await API.products.update(id, { status: next });
          window.showToast?.(`Product marked as ${next}`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 4. Global Orders Tab
  async renderOrdersTab(container) {
    try {
      const res = await API.orders.getAll();
      const orders = res.orders || [];

      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Global Platform Orders Stream</h2>
              <p class="text-xs text-gray-500">Monitor all transactions and logistics progression</p>
            </div>
            <span class="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
              ${orders.length} Total Orders
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4">Order ID & Date</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Amount & Cut</th>
                  <th class="px-6 py-4">Payment</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${orders.map(o => `
                  <tr class="hover:bg-gray-50/50 transition">
                    <td class="px-6 py-4 font-bold text-gray-900">
                      ${o.id}
                      <div class="text-xs text-gray-400 font-normal">${new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-semibold text-gray-800">${o.customerName}</div>
                      <div class="text-xs text-gray-400">${o.customerEmail}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-bold text-gray-900">₹${o.totalAmount.toFixed(2)}</div>
                      <div class="text-xs text-blue-600">Fee: ₹${o.platformFee?.toFixed(2) || '0.00'}</div>
                    </td>
                    <td class="px-6 py-4 text-xs">
                      <div class="font-medium text-gray-700">${o.paymentMethod}</div>
                      <div class="text-emerald-600 font-bold uppercase">${o.paymentStatus}</div>
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
                    <td class="px-6 py-4 text-right">
                      <select data-admin-order-status="${o.id}" class="text-xs border rounded-lg px-2 py-1 bg-white font-medium">
                        <option value="" disabled selected>Update</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.bindOrderSelectActions();
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load orders: ${err.message}</div>`;
    }
  },

  bindOrderSelectActions() {
    document.querySelectorAll('[data-admin-order-status]').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = e.currentTarget.getAttribute('data-admin-order-status');
        const status = e.currentTarget.value;
        if (!status) return;

        try {
          await API.orders.updateStatus(id, status);
          window.showToast?.(`Order ${id} status updated to ${status}`, 'success');
          this.loadActiveTab();
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  },

  // 5. Reports & Analytics Tab
  async renderReportsTab(container) {
    try {
      const res = await API.admin.getReports();
      const r = res.reports || {};

      container.innerHTML = `
        <div class="space-y-6 fade-in">
          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Category Distribution Chart -->
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Sales by Produce Category (₹)</h3>
                <p class="text-xs text-gray-500 mb-4">Volume breakdown across fresh market categories</p>
              </div>
              <div class="relative h-64 flex items-center justify-center">
                <canvas id="chart-categories"></canvas>
              </div>
            </div>

            <!-- Top Products Chart -->
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Top Selling Farm Products</h3>
                <p class="text-xs text-gray-500 mb-4">Ranked by total quantity units fulfilled</p>
              </div>
              <div class="relative h-64 flex items-center justify-center">
                <canvas id="chart-top-products"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Performers Table -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h3 class="font-bold text-gray-900 text-base mb-3">High Yield Farm Products Summary</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-600">
                <thead class="bg-gray-50/80 text-xs uppercase font-semibold text-gray-400">
                  <tr>
                    <th class="px-4 py-3">Produce</th>
                    <th class="px-4 py-3">Category</th>
                    <th class="px-4 py-3">Units Sold</th>
                    <th class="px-4 py-3">Gross Revenue (₹)</th>
                    <th class="px-4 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  ${(r.topProducts || []).map(p => `
                    <tr>
                      <td class="px-4 py-3 font-semibold text-gray-900">${p.name}</td>
                      <td class="px-4 py-3 text-xs">${p.category}</td>
                      <td class="px-4 py-3 font-bold text-gray-800">${p.unitsSold} units</td>
                      <td class="px-4 py-3 font-bold text-emerald-600">₹${p.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td class="px-4 py-3 text-amber-500 font-bold">★ ${p.rating}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      this.initCharts(r);
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-rose-500">Failed to load reports: ${err.message}</div>`;
    }
  },

  initCharts(reports) {
    if (!window.Chart) return;

    // Categories Chart
    const catCanvas = document.getElementById('chart-categories');
    if (catCanvas) {
      const catData = reports.categorySales || {};
      const labels = Object.keys(catData);
      const data = Object.values(catData);

      if (this.categoryChart) this.categoryChart.destroy();
      this.categoryChart = new window.Chart(catCanvas, {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['Vegetables', 'Fruits', 'Grains'],
          datasets: [{
            data: data.length ? data : [45, 30, 25],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // Top Products Chart
    const prodCanvas = document.getElementById('chart-top-products');
    if (prodCanvas) {
      const topProds = reports.topProducts || [];
      const labels = topProds.map(p => p.name.substring(0, 15) + '..');
      const data = topProds.map(p => p.unitsSold);

      if (this.topProductsChart) this.topProductsChart.destroy();
      this.topProductsChart = new window.Chart(prodCanvas, {
        type: 'bar',
        data: {
          labels: labels.length ? labels : ['Desi Tamatar', 'Strawberries', 'Carrots'],
          datasets: [{
            label: 'Units Sold',
            data: data.length ? data : [12, 8, 5],
            backgroundColor: '#059669',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }
};
