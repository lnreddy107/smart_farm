export const initialData = {
  users: [
    {
      id: "user-farmer-1",
      name: "Ramesh Patel",
      email: "ramesh.patel@kisanagro.in",
      role: "farmer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      phone: "+91 98230 45678",
      status: "active",
      verified: true,
      farmId: "farm-1",
      joinedAt: "2025-03-15"
    },
    {
      id: "user-farmer-2",
      name: "Gurpreet Singh",
      email: "gurpreet@punjabharkisan.in",
      role: "farmer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      phone: "+91 98765 43210",
      status: "active",
      verified: true,
      farmId: "farm-2",
      joinedAt: "2025-06-20"
    },
    {
      id: "user-customer-1",
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      role: "customer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      phone: "+91 98112 34567",
      address: "Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038",
      status: "active",
      joinedAt: "2025-08-10"
    },
    {
      id: "user-admin-1",
      name: "Dr. Radhika Iyer",
      email: "admin@smartkisan.in",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      phone: "+91 99001 22334",
      status: "active",
      joinedAt: "2025-01-01"
    }
  ],
  farms: [
    {
      id: "farm-1",
      ownerId: "user-farmer-1",
      name: "Kisan Vikas Organic Farms",
      location: "Nashik, Maharashtra",
      sizeAcres: 15,
      soilType: "Black Cotton Soil (Regur)",
      irrigationType: "Drip Irrigation & Canal Water",
      organicCertified: true,
      description: "Jaivik certified organic farm in the fertile Sahyadri foothills. We grow native heirloom vegetables, Mahabaleshwar strawberries, and cold-pressed oilseeds using zero chemical pesticides.",
      establishedYear: 2017,
      weather: {
        temp: "27°C",
        condition: "Pleasant & Sunny",
        humidity: "54%",
        soilMoisture: "68%"
      }
    },
    {
      id: "farm-2",
      ownerId: "user-farmer-2",
      name: "Amrit Dhara Agro Estate",
      location: "Ludhiana, Punjab",
      sizeAcres: 28,
      soilType: "Alluvial Soil (Indo-Gangetic)",
      irrigationType: "Tube-well & Micro-Sprinkler",
      organicCertified: true,
      description: "Leading producer of premium Sharbati wheat, sweet golden corn, and pure Desi Gir cow A2 dairy.",
      establishedYear: 2014,
      weather: {
        temp: "25°C",
        condition: "Clear Sky",
        humidity: "48%",
        soilMoisture: "62%"
      }
    }
  ],
  crops: [
    {
      id: "crop-1",
      farmId: "farm-1",
      farmerId: "user-farmer-1",
      name: "Desi Tamatar (Native Tomatoes)",
      variety: "Pusa Ruby Heirloom",
      plot: "Field Plot 1 (Godavari Canal Side)",
      acreage: 4,
      plantingDate: "2026-08-10",
      expectedHarvestDate: "2026-10-25",
      stage: "Flowering",
      healthStatus: "Optimal",
      notes: "Jeevamrut organic bio-fertilizer applied last week. High flower set observed."
    },
    {
      id: "crop-2",
      farmId: "farm-1",
      farmerId: "user-farmer-1",
      name: "Mahabaleshwar Sweet Strawberries",
      variety: "Winter Dawn & Sweet Charlie",
      plot: "Polyhouse Section A",
      acreage: 2,
      plantingDate: "2026-07-15",
      expectedHarvestDate: "2026-10-18",
      stage: "Ready for Harvest",
      healthStatus: "Optimal",
      notes: "Natural mulch covering preserved moisture. Berries deeply red and sweet."
    },
    {
      id: "crop-3",
      farmId: "farm-1",
      farmerId: "user-farmer-1",
      name: "Desi Gajar (Red Winter Carrots)",
      variety: "Pusa Rudhira",
      plot: "East Bed Sector 2",
      acreage: 3,
      plantingDate: "2026-09-01",
      expectedHarvestDate: "2026-11-20",
      stage: "Vegetative",
      healthStatus: "Optimal",
      notes: "Rich in lycopene and sweetness. Root expansion progressing well."
    },
    {
      id: "crop-4",
      farmId: "farm-1",
      farmerId: "user-farmer-1",
      name: "Shimla Mirch (Capsicum)",
      variety: "Bharat Hybrid Green",
      plot: "West Shaded Plot",
      acreage: 3,
      plantingDate: "2026-09-25",
      expectedHarvestDate: "2026-12-15",
      stage: "Seeding",
      healthStatus: "Needs Attention",
      notes: "Minor whitefly presence detected. Organic neem oil solution sprayed."
    },
    {
      id: "crop-5",
      farmId: "farm-2",
      farmerId: "user-farmer-2",
      name: "Golden Desi Makka (Sweet Corn)",
      variety: "Madhuri Sweet Gold",
      plot: "Canal Sector North",
      acreage: 8,
      plantingDate: "2026-06-10",
      expectedHarvestDate: "2026-09-28",
      stage: "Harvested",
      healthStatus: "Optimal",
      notes: "Bumper harvest achieved with 22 quintals yield per acre."
    }
  ],
  products: [
    {
      id: "prod-1",
      farmerId: "user-farmer-1",
      farmName: "Kisan Vikas Organic Farms",
      name: "Fresh Desi Organic Tomatoes",
      category: "Vegetables",
      price: 45,
      unit: "kg",
      stock: 250,
      organic: true,
      description: "Naturally vine-ripened farm fresh Desi tomatoes with natural tang and sweetness. Grown without chemicals.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 38,
      status: "approved"
    },
    {
      id: "prod-2",
      farmerId: "user-farmer-1",
      farmName: "Kisan Vikas Organic Farms",
      name: "Mahabaleshwar Fresh Strawberries",
      category: "Fruits",
      price: 140,
      unit: "box (500g)",
      stock: 80,
      organic: true,
      description: "Directly hand-plucked from Sahyadri mountain slopes. Exceptionally juicy, sweet, and fragrant.",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80",
      rating: 5.0,
      reviewCount: 52,
      status: "approved"
    },
    {
      id: "prod-3",
      farmerId: "user-farmer-1",
      farmName: "Kisan Vikas Organic Farms",
      name: "Crisp Red Winter Carrots (Gajar)",
      category: "Vegetables",
      price: 50,
      unit: "kg",
      stock: 180,
      organic: true,
      description: "Sweet, juicy deep red organic carrots ideal for crunchy salads and traditional Gajar Halwa.",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewCount: 24,
      status: "approved"
    },
    {
      id: "prod-4",
      farmerId: "user-farmer-2",
      farmName: "Amrit Dhara Agro Estate",
      name: "Tender Golden Sweet Corn (Bhutta)",
      category: "Grains",
      price: 25,
      unit: "piece",
      stock: 400,
      organic: false,
      description: "Freshly plucked sweet Punjab corn. Tender milky kernels, excellent for roasting and boiling.",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80",
      rating: 4.7,
      reviewCount: 45,
      status: "approved"
    },
    {
      id: "prod-5",
      farmerId: "user-farmer-2",
      farmName: "Amrit Dhara Agro Estate",
      name: "Pure Desi Gir Cow A2 Whole Milk",
      category: "Dairy",
      price: 75,
      unit: "liter",
      stock: 120,
      organic: true,
      description: "Raw unadulterated A2 milk from free-range indigenous Gir cows. Rich in natural nutrients and cream.",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 88,
      status: "approved"
    },
    {
      id: "prod-6",
      farmerId: "user-farmer-1",
      farmName: "Kisan Vikas Organic Farms",
      name: "Pure Raw Wild Forest Honey (Madhu)",
      category: "Organic Herbs",
      price: 360,
      unit: "jar (500g)",
      stock: 65,
      organic: true,
      description: "Unpasteurized natural forest bee honey gathered from Western Ghats flora. No artificial sugar syrup.",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
      rating: 4.95,
      reviewCount: 64,
      status: "approved"
    }
  ],
  expenses: [
    {
      id: "exp-1",
      farmerId: "user-farmer-1",
      category: "Equipment & Irrigation",
      title: "Drip Irrigation Pipes & Emitter Filters",
      amount: 4500,
      date: "2026-09-12",
      notes: "Installed 400m Jain drip lateral line for tomato plots."
    },
    {
      id: "exp-2",
      farmerId: "user-farmer-1",
      category: "Fertilizers & Nutrients",
      title: "Vermicompost & Neem Khali Cake (500kg)",
      amount: 6800,
      date: "2026-09-20",
      notes: "Organic manure delivery from local cooperative gaushala."
    },
    {
      id: "exp-3",
      farmerId: "user-farmer-1",
      category: "Seeds & Saplings",
      title: "Certified Heirloom Vegetable Seeds",
      amount: 3200,
      date: "2026-08-05",
      notes: "Pusa certified non-hybrid desi tomato and carrot seeds."
    },
    {
      id: "exp-4",
      farmerId: "user-farmer-1",
      category: "Labor",
      title: "Field Weeding & Mulching Labor Wages",
      amount: 8500,
      date: "2026-09-30",
      notes: "Weekly wages paid to 5 farm workers for polyhouse care."
    },
    {
      id: "exp-5",
      farmerId: "user-farmer-1",
      category: "Machinery & Fuel",
      title: "Tractor Diesel & Rotavator Servicing",
      amount: 2800,
      date: "2026-10-04",
      notes: "Tiller maintenance and 30L diesel for field preparation."
    },
    {
      id: "exp-6",
      farmerId: "user-farmer-1",
      category: "Packaging & Logistics",
      title: "Eco-Friendly Jute Bags & Crates",
      amount: 2100,
      date: "2026-10-08",
      notes: "Recyclable punnets and ventilated vegetable delivery crates."
    }
  ],
  orders: [
    {
      id: "ord-099",
      customerId: "user-customer-2",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram.malhotra@gmail.com",
      shippingAddress: "B-12, Green Park Avenue, Pune, Maharashtra - 411001",
      items: [
        {
          productId: "prod-1",
          name: "Fresh Desi Organic Tomatoes",
          price: 45,
          quantity: 400,
          unit: "kg",
          farmerId: "user-farmer-1",
          subtotal: 18000
        }
      ],
      subtotal: 18000,
      deliveryFee: 150,
      platformFee: 900,
      totalAmount: 18150,
      paymentMethod: "UPI / NetBanking",
      paymentStatus: "paid",
      orderStatus: "Delivered",
      createdAt: "2026-09-24T10:00:00.000Z",
      deliveredAt: "2026-09-26T14:30:00.000Z"
    },
    {
      id: "ord-100",
      customerId: "user-customer-2",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram.malhotra@gmail.com",
      shippingAddress: "B-12, Green Park Avenue, Pune, Maharashtra - 411001",
      items: [
        {
          productId: "prod-2",
          name: "Mahabaleshwar Fresh Strawberries",
          price: 140,
          quantity: 150,
          unit: "box (500g)",
          farmerId: "user-farmer-1",
          subtotal: 21000
        }
      ],
      subtotal: 21000,
      deliveryFee: 150,
      platformFee: 1050,
      totalAmount: 21150,
      paymentMethod: "UPI / GPay",
      paymentStatus: "paid",
      orderStatus: "Delivered",
      createdAt: "2026-10-02T08:30:00.000Z",
      deliveredAt: "2026-10-04T12:00:00.000Z"
    },
    {
      id: "ord-101",
      customerId: "user-customer-1",
      customerName: "Priya Sharma",
      customerEmail: "priya.sharma@gmail.com",
      shippingAddress: "Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038",
      items: [
        {
          productId: "prod-1",
          name: "Fresh Desi Organic Tomatoes",
          price: 45,
          quantity: 4,
          unit: "kg",
          farmerId: "user-farmer-1",
          subtotal: 180
        },
        {
          productId: "prod-2",
          name: "Mahabaleshwar Fresh Strawberries",
          price: 140,
          quantity: 2,
          unit: "box (500g)",
          farmerId: "user-farmer-1",
          subtotal: 280
        }
      ],
      subtotal: 460,
      deliveryFee: 40,
      platformFee: 23,
      totalAmount: 500,
      paymentMethod: "UPI / PhonePe",
      paymentStatus: "paid",
      orderStatus: "Delivered",
      createdAt: "2026-10-08T14:22:00.000Z",
      deliveredAt: "2026-10-10T11:00:00.000Z"
    },
    {
      id: "ord-102",
      customerId: "user-customer-1",
      customerName: "Priya Sharma",
      customerEmail: "priya.sharma@gmail.com",
      shippingAddress: "Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038",
      items: [
        {
          productId: "prod-3",
          name: "Crisp Red Winter Carrots (Gajar)",
          price: 50,
          quantity: 3,
          unit: "kg",
          farmerId: "user-farmer-1",
          subtotal: 150
        },
        {
          productId: "prod-6",
          name: "Pure Raw Wild Forest Honey (Madhu)",
          price: 360,
          quantity: 1,
          unit: "jar (500g)",
          farmerId: "user-farmer-1",
          subtotal: 360
        }
      ],
      subtotal: 510,
      deliveryFee: 40,
      platformFee: 25.5,
      totalAmount: 550,
      paymentMethod: "UPI / Google Pay",
      paymentStatus: "paid",
      orderStatus: "Shipped",
      createdAt: "2026-10-11T09:15:00.000Z"
    },
    {
      id: "ord-103",
      customerId: "user-customer-1",
      customerName: "Priya Sharma",
      customerEmail: "priya.sharma@gmail.com",
      shippingAddress: "Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038",
      items: [
        {
          productId: "prod-2",
          name: "Mahabaleshwar Fresh Strawberries",
          price: 140,
          quantity: 3,
          unit: "box (500g)",
          farmerId: "user-farmer-1",
          subtotal: 420
        }
      ],
      subtotal: 420,
      deliveryFee: 40,
      platformFee: 21,
      totalAmount: 460,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "pending",
      orderStatus: "Confirmed",
      createdAt: "2026-10-12T16:40:00.000Z"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      productId: "prod-1",
      customerId: "user-customer-1",
      customerName: "Priya Sharma",
      rating: 5,
      comment: "Bilkul fresh desi tamatar! Very flavorful and aromatic, perfect for authentic Indian curries and rasam.",
      date: "2026-10-10"
    },
    {
      id: "rev-2",
      productId: "prod-2",
      customerId: "user-customer-1",
      customerName: "Priya Sharma",
      rating: 5,
      comment: "The strawberries from Mahabaleshwar are so fresh and sweet. Arrived neatly packed without any damage.",
      date: "2026-10-10"
    },
    {
      id: "rev-3",
      productId: "prod-4",
      customerId: "user-customer-2",
      customerName: "Vikram Malhotra",
      rating: 5,
      comment: "Juicy sweet corn, grilled it with nimbu and chaat masala. Outstanding farm fresh taste!",
      date: "2026-10-04"
    }
  ]
};
