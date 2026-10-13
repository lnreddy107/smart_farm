# 🌾 SMART FARMING PORTAL (KISAN SETU)

A full-stack, direct-to-consumer agriculture and smart farm management platform built for the Indian agricultural ecosystem using **Node.js, Express, and modern JavaScript/Tailwind CSS** with all prices in **Indian Rupees (₹)**.

---

## 🏛️ System Architecture

```text
                    SMART FARMING PORTAL
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       👨🌾 FARMER (KISAN) 🛒 CUSTOMER      👨💼 ADMIN
          │                │                │
     Manage Farm       Buy Products     Manage Platform
     Add Products      Cart             Users
     Manage Crops      Orders           Products
     Track Sales       Payments         Orders
     Expenses          Reviews           Reports
          │                │                │
          └────────────────┼────────────────┘
                           │
                      DATABASE
                           │
                    BACKEND / APIs
```

---

## ✨ Features by Role (Indian Context & ₹ Pricing)

### 👨🌾 1. FARMER PORTAL (Kisan: Ramesh Patel • Nashik, Maharashtra)
- **Manage Farm**: Farm specifications card (*15 Acres, Black Cotton Soil / Regur, Drip Irrigation & Canal Water*) and simulated live IoT Kisan sensor telemetry (*Temperature, Humidity, Soil Moisture*).
- **Manage Crops**: Crop lifecycle tracking through 5 growth stages (*Seeding ➔ Vegetative ➔ Flowering ➔ Ready for Harvest ➔ Harvested*), featuring Indian crops (*Desi Tamatar, Mahabaleshwar Strawberries, Pusa Gajar, Shimla Mirch*).
- **Add Products**: Direct Mandi listing manager to sell harvest produce directly with unit pricing in **₹ (Rupees)** (*e.g., ₹45/kg, ₹140/box, ₹75/liter*), stock levels, and **Jaivik Bharat Certified Organic** tags.
- **Track Sales**: Live fulfillment board for customer orders, showing ordered items, delivery addresses (*Bengaluru, Pune, etc.*), and order progression status (*Processing ➔ Shipped ➔ Delivered*).
- **Expenses & P&L (Kharcha)**: Farm accounting module tracking drip pipes, vermicompost & neem khali, seeds, field labor wages, tractor diesel, and packaging in **₹**. Automatically calculates **Gross Sales vs Expenses = Net Profit (₹) & Margin %**.

---

### 🛒 2. CUSTOMER PORTAL (Customer: Priya Sharma • Bengaluru, Karnataka)
- **Buy Products (Mandi)**: Browse farm-fresh produce with category filters (*Vegetables, Fruits, Grains, Dairy, Organic Herbs*), instant search, and verified farm origins.
- **Cart (Thali)**: Slide-out basket drawer with live inventory validation, item counters, and flat eco-delivery fee (**₹40.00**).
- **Checkout & Payments**: Indian digital and cash payment options:
  - 📱 **UPI / QR** (Instant Google Pay, PhonePe, Paytm, BHIM)
  - 💳 **RuPay / Debit & Credit Card**
  - 💵 **Cash on Delivery (COD)**
- **Orders**: Live tracking timeline (*Confirmed ➔ Processing ➔ Shipped ➔ Delivered*), order history, and itemized receipts in ₹.
- **Reviews**: Customer reviews and 5-star ratings in authentic Indian context.

---

### 👨💼 3. ADMIN CONSOLE (Director: Dr. Radhika Iyer • National Platform Ops)
- **Manage Platform**: Executive dashboard displaying platform KPIs:
  - Gross Merchandise Value (**GMV in ₹**)
  - Platform Commission Revenue (**5% take in ₹**)
  - Total Order Volume & Delivery Success Rate
  - Registered Kisans and Customers Directory
- **Users**: Directory of all Kisans, Customers, and Administrators with one-click toggles for **Kisan Verification Badges** and **Account Status (Active / Suspended)**.
- **Products**: Global catalog moderation table with ability to approve or flag listings.
- **Orders**: Platform-wide transaction stream with order status management and dispute oversight.
- **Reports & Analytics**: Visual charts powered by Chart.js:
  - 🍩 Produce Category Revenue Breakdown in ₹ (Doughnut Chart)
  - 📊 Top Selling Farm Products by Volume (Bar Chart)
- **Database Reset**: Instant reset button to refresh the database with sample demo records.

---

## 🛠️ Tech Stack & Directory Structure

- **Backend**: Node.js (v24+), Express.js (REST API, CORS, JSON routing)
- **Database**: Persistent JSON data storage engine (`data/smart_farm_db.json`) with auto-seeding
- **Frontend**: Single Page Application (SPA) with responsive Tailwind CSS, Lucide icons, and Chart.js
- **Currency**: Indian Rupee (₹) everywhere

```text
smart_farm/
├── data/
│   └── smart_farm_db.json          # Persistent database storage
├── src/
│   ├── config/
│   │   └── index.js                # App config & 5% platform commission
│   ├── db/
│   │   ├── database.js             # DB query engine & CRUD operations
│   │   └── seedData.js             # Indian farmers, customers, crops & orders
│   ├── middleware/
│   │   └── errorHandler.js         # Centralized error handler
│   └── routes/
│       ├── auth.routes.js          # Authentication & persona switching
│       ├── farm.routes.js          # Farm profiles & weather telemetry
│       ├── crops.routes.js         # Crop lifecycle management
│       ├── products.routes.js      # Produce catalog & inventory
│       ├── orders.routes.js        # Checkout & order status
│       ├── expenses.routes.js      # Farm expense & P&L logs
│       ├── reviews.routes.js       # Customer ratings & feedback
│       └── admin.routes.js         # Platform KPIs, moderation & reports
├── public/
│   ├── index.html                  # Responsive SPA layout shell
│   ├── css/
│   │   └── styles.css              # Custom styling & animations
│   └── js/
│       ├── api.js                  # Frontend API client
│       ├── farmer.js               # Farmer dashboard module (INR)
│       ├── customer.js             # Customer marketplace & UPI checkout
│       ├── admin.js                # Admin console & analytics charts (INR)
│       └── app.js                  # App bootstrap & routing
├── server.js                       # Express server entry point
├── package.json                    # Project metadata & dependencies
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### 1. Start the Server
```powershell
node server.js
```

### 2. Access the Application
Open your web browser and navigate to:
- **Main Portal**: [http://localhost:3000](http://localhost:3000)
- **👨🌾 Farmer View**: [http://localhost:3000#farmer](http://localhost:3000#farmer)
- **🛒 Customer View**: [http://localhost:3000#customer](http://localhost:3000#customer)
- **👨💼 Admin View**: [http://localhost:3000#admin](http://localhost:3000#admin)
