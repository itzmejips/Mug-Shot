const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const menuData = [
  // Rice Meals
  { name: 'Chicken Ala-King', description: 'Chicken breast fillet drenched in a creamy ala king sauce', price: 175, category: 'Rice Meals' },
  { name: 'Sweet Braised Pork', description: 'Sweet cubed cut pork topped with sesame seeds', price: 180, category: 'Rice Meals' },
  { name: 'Chicken Gravy', description: 'Breaded Chicken Breast fillet + Gravy sauce', price: 170, category: 'Rice Meals' },
  { name: 'Mama\'s Boy', description: 'Pure beef burger steak + fries + gravy + rice', price: 190, category: 'Rice Meals' },
  { name: 'Supreme Hungarian', description: 'Cheesy Hungarian sausage and let\'s not talk about the size', price: 150, category: 'Rice Meals' },
  { name: 'Corn Silog', description: 'a whole can of corned beef for you to enjoy', price: 165, category: 'Rice Meals' },

  // Pasta and Appetizers
  { name: 'Spaghetti', description: 'Crossed FiLian combination of spaghetti', price: 165, category: 'Pasta and Appetizers' },
  { name: 'Pesto Pasta', description: 'herby flavor garlicky kick and a creamy, cheesy finish', price: 165, category: 'Pasta and Appetizers' },
  { name: 'Spicy Sardines', description: 'rich, salty, and oily with a sharp, fiery kick from the chili', price: 140, category: 'Pasta and Appetizers' },
  { name: 'Combo', description: 'Chinggers + Fries (real fries)', price: 150, category: 'Pasta and Appetizers' },
  { name: 'Fries Solo', description: 'Just Fries', price: 90, category: 'Pasta and Appetizers' },
  { name: 'Chinggers Solo', description: 'Just Chicken Tenders', price: 110, category: 'Pasta and Appetizers' },
  { name: 'Chicken Sandwich', description: 'Chicken+lettuce+Cheese+Mayo n Ketch+Cucumber', price: 130, category: 'Pasta and Appetizers' },

  // Waffle and Sweets
  { name: 'Caramel Waffle', description: '', price: 125, category: 'Waffle and Sweets' },
  { name: 'Chocolate Waffle', description: '', price: 125, category: 'Waffle and Sweets' },
  { name: 'Blueberry Waffle', description: '', price: 125, category: 'Waffle and Sweets' },
  { name: 'Strawberry Waffle', description: '', price: 125, category: 'Waffle and Sweets' },
  { name: 'Cinnamon Waffle', description: '', price: 125, category: 'Waffle and Sweets' },

  // Signature Coffee
  { name: 'Long Black', description: 'Water + two shot espresso (Hot/Iced)', price: 105, category: 'Signature Coffee' },
  { name: 'Latte Cappuccino', description: 'Two shot espresso + milk + thin layer foam (Hot/Iced)', price: 125, category: 'Signature Coffee' },
  { name: 'Cappucinno', description: 'Two shot espresso + milk + foamy milk (Hot/Iced)', price: 120, category: 'Signature Coffee' },
  { name: 'Togo\'s Cup', description: 'Sweet wild honey milk topped with espresso (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'YJ\'s Cup', description: 'Reese\'s chocolate inspired coffee (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'Mason\'s Cup', description: 'cinnamon explosion topped with espresso (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'Tony\'s Cup', description: 'Customized seasalt latte (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'Fiona\'s Cup', description: 'Ube cheesecake latte (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'Aiyi\'s Cup', description: 'Trifecta blends of syrups and sauces (Iced)', price: 170, category: 'Signature Coffee' },
  { name: 'Kana-Free Cup', description: 'Dubai chocolate inspired kanaf spiked with espresso (Iced)', price: 170, category: 'Signature Coffee' },

  // Coffee Lattes
  { name: 'Mocha', description: 'Chocolate sauce + Double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'White Chocolate', description: 'White chocolate sauce + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Spanish', description: 'sweet condensed milk + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Salted Caramel', description: 'salted caramel sauce + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Butterscotch', description: 'Butterscotch sauce + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'French Vanilla', description: 'French vanilla syrup + Double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'White cafe mocha', description: 'white sauce + mocha sauce + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Roasted Almonds', description: 'roasted almond syrup + brown sugar + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Car-Mac', description: 'caramel sauce + vanilla syrup + double shot (Hot/Iced)', price: 150, category: 'Coffee Lattes' },
  { name: 'Viet Coffee', description: 'Espresso + Condensed Milk + Water (Iced)', price: 130, category: 'Coffee Lattes' },
  { name: 'Thai Coffee', description: 'Thai authentic grounds + milk + condensed milk (Iced)', price: 140, category: 'Coffee Lattes' },

  // Specialty Refreshments
  { name: 'Milk Chocolate', description: 'Mocha + Cocoa + Milk + Whipping (Hot/Iced)', price: 120, category: 'Specialty Refreshments' },
  { name: 'Berry Milk', description: 'Strawberry Jam + Milk + Pink Sauce + Whipping (Iced)', price: 120, category: 'Specialty Refreshments' },
  { name: 'Strawcho', description: 'Strawberry Jam + Milk + Pink Sauce + Cocoa + Whipping (Hot/Iced)', price: 140, category: 'Specialty Refreshments' },
  { name: 'Red Velvet', description: 'Red velvet sauce + white chocolate + dark choco bread + whipping (Iced)', price: 150, category: 'Specialty Refreshments' },
  { name: 'Matcha', description: 'Ceremonial Matcha + Oat Milk + Condensed Milk (Hot/Iced/Dirty)', price: 145, category: 'Specialty Refreshments' },
  { name: 'Horchata', description: 'Home made horchata rice milk (Iced/Dirty)', price: 120, category: 'Specialty Refreshments' },
  { name: 'Chai Tea', description: 'Authentic chai tea leaves + water + sugar (Hot/Iced)', price: 100, category: 'Specialty Refreshments' },
  { name: 'Berry Matcha', description: 'Strawberry jam + pink sauce + milk + matcha + whipping (Iced)', price: 150, category: 'Specialty Refreshments' },
  { name: 'Chai Milk Tea', description: 'chai tea + half and half + sweetener + optional tapioca (Hot/Iced/Dirty)', price: 140, category: 'Specialty Refreshments' },
  { name: 'Berry Horchata', description: 'Horchata mix + strawberry milk + sweetener + cinnamon (Iced)', price: 130, category: 'Specialty Refreshments' },
  { name: 'Butterfly Peaches', description: 'Butterfly Pea tea + Lemon Soda + Peach Jam', price: 120, category: 'Specialty Refreshments' },
  { name: 'Citron Hibiscus', description: 'Hibiscus tea + Lemon soda + sweetener + citron jam', price: 120, category: 'Specialty Refreshments' },
  { name: 'Monolithic Sunset', description: 'Combination of the 2 tea into one + passion fruit jam + lemon soda', price: 130, category: 'Specialty Refreshments' },
  { name: 'Soda Yakult', description: 'Green apple, peach, blueberry, strawberry, blueberry peach, peach lychee, lychee', price: 120, category: 'Specialty Refreshments' },
  { name: 'Espresso', description: '', price: 70, category: 'Specialty Refreshments' },
  { name: 'Syrup', description: '', price: 40, category: 'Specialty Refreshments' },
  { name: 'Sub Oat', description: '', price: 50, category: 'Specialty Refreshments' }
];

const importData = async () => {
  try {
    await MenuItem.deleteMany();
    await User.deleteMany();

    await MenuItem.insertMany(menuData);
    
    // Create default admin
    await User.create({ username: 'admin', password: 'password123' });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
