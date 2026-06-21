import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Food from '../models/Food.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

dotenv.config();

connectDB();

const categoriesData = [
  {
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    description: 'Freshly baked artisanal pizzas with premium toppings.',
  },
  {
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    description: 'Juicy, gourmet flame-grilled burgers on toasted brioche buns.',
  },
  {
    name: 'Pasta',
    image: 'https://smithakalluraya.com/wp-content/uploads/2024/07/white-sauce-pasta.jpg',
    description: 'Authentic Italian pastas tossed in hand-crafted sauces.',
  },
  {
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    description: 'Refreshing shakes, mocktails, and premium brewed coffee.',
  },
  {
    name: 'Desserts',
    image: 'https://www.kingarthurbaking.com/sites/default/files/2023-03/Tiramisu_1426.jpg',
    description: 'Indulgent, sweet delicacies to complete your meal.',
  },
  {
    name: 'Combos',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    description: 'Value pack combinations for dates and group parties.',
  },
];

const menuData = [
  {
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Classic delight with 100% real mozzarella cheese.",
    price: 399,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800",
    isSpecial: false,
    isBOGOEligible: true,
    isVeg: true,
  },
  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    description: "Loaded with double pepperoni & extra cheese.",
    price: 399,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
    isSpecial: false,
    isBOGOEligible: true,
    isVeg: false,
  },
  {
    name: "Truffle Mushroom Burger",
    category: "Burgers",
    description: "Angus beef, truffle mayo, swiss cheese.",
    price: 180,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    isSpecial: true,
    isBOGOEligible: false,
    isVeg: false,
  },
  {
    name: "Spicy Chicken Burger",
    category: "Burgers",
    description: "Crispy chicken, spicy slaw, brioche bun.",
    price: 150,
    image: "https://burgerrecipes.sfo3.digitaloceanspaces.com/wp-content/uploads/2025/07/22023848/Homemade-McSpicy-Chicken-Sandwich2.png",
    isSpecial: false,
    isBOGOEligible: false,
    isVeg: false,
  },
  {
    name: "White Sauce Pasta",
    category: "Pasta",
    description: "Creamy parmesan sauce with grilled chicken.",
    price: 160,
    image: "https://smithakalluraya.com/wp-content/uploads/2024/07/white-sauce-pasta.jpg",
    isSpecial: false,
    isBOGOEligible: false,
    isVeg: false,
  },
  {
    name: "Red Sauce Pasta",
    category: "Pasta",
    description: "Spicy Red Sauce Creamy Pasta.",
    price: 160,
    image: "https://www.funfoodfrolic.com/wp-content/uploads/2020/09/Tomato-Pasta-Thumbnail.jpg",
    isSpecial: false,
    isBOGOEligible: false,
    isVeg: true,
  },
  {
    name: "Iced Oreo Shake",
    category: "Beverages",
    description: "Espresso, vanilla syrup, milk, caramel drizzle.",
    price: 90,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
    isSpecial: false,
    isBOGOEligible: false,
    isVeg: true,
  },
  {
    name: "Strawberry Shake",
    category: "Beverages",
    description: "Premium ceremonial grade shake with low fat milk.",
    price: 90,
    image: "https://www.butteredsideupblog.com/wp-content/uploads/2023/06/How-to-Make-a-Strawberry-Milkshake-Without-Ice-Cream-17-scaled.jpg",
    isSpecial: false,
    isBOGOEligible: false,
    isVeg: true,
  },
  {
    name: "Tiramisu",
    category: "Desserts",
    description: "Classic Italian dessert with espresso and mascarpone.",
    price: 200,
    image: "https://www.kingarthurbaking.com/sites/default/files/2023-03/Tiramisu_1426.jpg",
    isSpecial: true,
    isBOGOEligible: false,
    isVeg: true,
  },
  {
    name: "Baklava",
    category: "Desserts",
    description: "Classic sweet honey layer dessert pastry.",
    price: 200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb4s4QLqQs9zwFhGkGlofGqqZZXJfz1dKtoQ&s",
    isSpecial: true,
    isBOGOEligible: false,
    isVeg: true,
  },
  {
    name: "Date Night Combo",
    category: "Combos",
    description: "Chicken Tandoori, Pastas, Spicy Mac n Cheese Burgers, Drinks, 1 Dessert to share.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    isSpecial: true,
    isBOGOEligible: false,
    isVeg: false,
  },
  {
    name: "Party Combo",
    category: "Combos",
    description: "Pizzas, Fries, Pastas, Burgers, Drinks.",
    price: 1999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSENLT2gfpRQ8w0Rt5dAFJeMTTXm3XPQSlPuQ&s",
    isSpecial: true,
    isBOGOEligible: false,
    isVeg: false,
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await Food.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log('Database cleared.');

    // Seed Categories
    await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    // Seed Foods
    await Food.insertMany(menuData);
    console.log('Food items seeded.');

    // Seed Users (Admin & Customer)
    const salt = await mongoose.model('User').schema.methods.matchPassword; // To trigger encrypt hook

    await User.create({
      name: 'Admin User',
      email: 'admin@procafe.com',
      password: 'password123',
      phone: '+91 99999 99999',
      address: 'Pakwara, Moradabad 244102',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+91 88888 88888',
      address: 'Pakwara, Moradabad 244102',
      role: 'customer',
    });

    console.log('Users seeded (admin@procafe.com / john@example.com, password: password123).');
    console.log('Data seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
