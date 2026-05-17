const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

async function migrate() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mugshotcafe');
        console.log('Connected to MongoDB');

        const items = await MenuItem.find({});
        console.log(`Found ${items.length} items. Starting migration...`);

        const mapping = {
            'Rice Meals': 'Rice Meals',
            'Pasta': 'Pasta and Appetizers',
            'Appetizer': 'Pasta and Appetizers',
            'Waffles': 'Waffle and Sweets',
            'Classic': 'Signature Coffee',
            'Antukin': 'Signature Coffee',
            'Latte': 'Coffee Lattes',
            'Milky': 'Specialty Refreshments',
            'Mixed': 'Specialty Refreshments',
            'Tea': 'Specialty Refreshments',
            'Fizzy': 'Specialty Refreshments',
            'Xtra': 'Specialty Refreshments'
        };

        for (let item of items) {
            const newCat = mapping[item.category] || 'Specialty Refreshments';
            await MenuItem.updateOne({ _id: item._id }, { category: newCat });
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
