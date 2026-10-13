import { API } from './api.js';
import { FarmerModule } from './farmer.js';
import { CustomerModule } from './customer.js';
import { AdminModule } from './admin.js';

class SmartFarmApp {
  constructor() {
    this.currentUser = null;
    this.currentRole = 'farmer'; // default
  }

  async init() {
    this.setupToasts();
    await this.fetchCurrentUser();
    this.setupRoleSwitcher();
    this.setupGlobalEvents();
    this.handleRouting();
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  setupToasts() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    window.showToast = (message, type = 'info') => {
      const colors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        info: 'bg-slate-900 text-white',
        warning: 'bg-amber-500 text-white'
      };

      const toast = document.createElement('div');
      toast.className = `toast px-4 py-3 rounded-2xl text-xs font-semibold shadow-xl flex items-center space-x-2 ${colors[type] || colors.info} fade-in`;
      toast.innerHTML = `<span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    };
  }

  async fetchCurrentUser() {
    try {
      const res = await API.auth.getCurrent();
      this.currentUser = res.user;
      this.currentRole = this.currentUser.role;
      this.updateNavbarUserBadge();
    } catch (err) {
      console.error('Failed to load current user:', err);
    }
  }

  updateNavbarUserBadge() {
    const avatar = document.getElementById('nav-user-avatar');
    const name = document.getElementById('nav-user-name');
    const roleTag = document.getElementById('nav-user-role-tag');

    if (this.currentUser) {
      if (avatar) avatar.src = this.currentUser.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80';
      if (name) name.innerText = this.currentUser.name;
      if (roleTag) {
        roleTag.innerText = this.currentUser.role.toUpperCase();
        roleTag.className = `px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
          this.currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          this.currentUser.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
          'bg-blue-100 text-blue-800'
        }`;
      }
    }

    // Update active role switcher buttons
    document.querySelectorAll('[data-switch-role]').forEach(btn => {
      const role = btn.getAttribute('data-switch-role');
      if (role === this.currentRole) {
        btn.className = 'role-switch-btn flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm bg-emerald-600 text-white';
      } else {
        btn.className = 'role-switch-btn flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition text-gray-600 hover:bg-gray-100';
      }
    });
  }

  setupRoleSwitcher() {
    document.querySelectorAll('[data-switch-role]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const role = e.currentTarget.getAttribute('data-switch-role');
        if (role === this.currentRole) return;

        try {
          const res = await API.auth.switchRole(role);
          this.currentUser = res.user;
          this.currentRole = res.user.role;
          window.location.hash = `#${role}`;
          this.updateNavbarUserBadge();
          window.showToast?.(`Switched to ${res.user.name} (${res.user.role})`, 'info');
          this.loadModuleForRole(this.currentRole);
        } catch (err) {
          window.showToast?.(err.message, 'error');
        }
      });
    });
  }

  setupGlobalEvents() {
    // Open Cart Drawer
    document.getElementById('nav-cart-btn')?.addEventListener('click', () => {
      CustomerModule.showCartDrawer();
    });
  }

  handleRouting() {
    let hash = window.location.hash.replace('#', '').toLowerCase();
    if (!['farmer', 'customer', 'admin'].includes(hash)) {
      hash = this.currentRole || 'farmer';
      window.location.hash = `#${hash}`;
    }

    if (hash !== this.currentRole) {
      API.auth.switchRole(hash).then(res => {
        this.currentUser = res.user;
        this.currentRole = res.user.role;
        this.updateNavbarUserBadge();
        this.loadModuleForRole(hash);
      }).catch(() => {
        this.loadModuleForRole(hash);
      });
    } else {
      this.loadModuleForRole(hash);
    }
  }

  async loadModuleForRole(role) {
    // Control Cart button visibility in navbar (most relevant for customer, but available)
    const cartBtn = document.getElementById('nav-cart-btn');
    if (cartBtn) {
      cartBtn.style.display = 'inline-flex';
    }

    if (role === 'farmer') {
      await FarmerModule.init(this.currentUser);
    } else if (role === 'customer') {
      await CustomerModule.init(this.currentUser);
    } else if (role === 'admin') {
      await AdminModule.init(this.currentUser);
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new SmartFarmApp();
  app.init();
});
