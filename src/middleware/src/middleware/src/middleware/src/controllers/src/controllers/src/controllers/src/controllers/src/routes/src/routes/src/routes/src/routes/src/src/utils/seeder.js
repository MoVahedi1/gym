const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Program = require('../models/Program');

dotenv.config();

const products = [
  {
    name: "پروتئین وی ایزوله",
    description: "پروتئین وی ایزوله با بالاترین کیفیت و خلوص، مناسب برای عضله سازی و ریکاوری",
    category: "پروتئین",
    brand: "Optimum Nutrition",
    price: 350000,
    originalPrice: 420000,
    images: [
      {
        url: "/images/products/protein.jpg",
        alt: "پروتئین وی ایزوله"
      }
    ],
    features: ["خلوص بالا", "جذب سریع", "طعم عالی"],
    specifications: {
      weight: "2.27 kg",
      servings: 74,
      flavor: "شکلات",
      ingredients: ["پروتئین وی ایزوله", "لسیتین", "طعم دهنده طبیعی"],
      usage: "1 پیمانه با 250ml آب یا شیر"
    },
    inventory: {
      quantity: 50,
      lowStockThreshold: 10
    },
    rating: {
      average: 4.8,
      count: 124
    },
    tags: ["پروتئین", "عضله سازی", "ریکاوری"],
    isFeatured: true
  }
  // Add more products...
];

const programs = [
  {
    name: "برنامه چربی سوزی حرفه‌ای",
    description: "برنامه تخصصی کاهش وزن و چربی سوزی با تمرینات کاردیو و قدرتی",
    type: "fat-loss",
    level: "beginner",
    duration: {
      value: 12,
      unit: "weeks"
    },
    price: 290000,
    image: "/images/programs/fat-loss.jpg",
    features: [
      "برنامه تمرینی هفتگی",
      "برنامه غذایی اختصاصی",
      "پشتیبانی آنلاین",
      "ارزیابی پیشرفت"
    ],
    workouts: [
      {
        day: "saturday",
        type: "cardio",
        duration: "45 دقیقه",
        exercises: [
          {
            name: "دویدن",
            sets: 1,
            reps: "30-45 دقیقه",
            rest: "2 دقیقه",
            notes: "با سرعت متوسط"
          }
        ]
      }
    ],
    requirements: ["دسترسی به تردمیل یا فضای باز", "بطری آب"],
    goals: ["کاهش 5-8 کیلوگرم وزن", "کاهش 3-5% چربی بدن"]
  }
  // Add more programs...
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await Program.deleteMany();

    // Insert new data
    await Product.insertMany(products);
    await Program.insertMany(programs);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Program.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}