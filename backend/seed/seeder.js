require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Seller = require('../models/Seller');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const connectDB = require('../config/db');

// ─── Fake Image URLs (Picsum Photos) ─────────────────────────────────────────
const fakeImages = {
  electronics: [
    'https://picsum.photos/seed/phone1/600/600',
    'https://picsum.photos/seed/laptop1/600/600',
    'https://picsum.photos/seed/tablet1/600/600',
    'https://picsum.photos/seed/earbuds/600/600',
  ],
  fashion: [
    'https://picsum.photos/seed/shirt1/600/600',
    'https://picsum.photos/seed/jeans1/600/600',
    'https://picsum.photos/seed/shoes1/600/600',
    'https://picsum.photos/seed/dress1/600/600',
  ],
  home: [
    'https://picsum.photos/seed/sofa1/600/600',
    'https://picsum.photos/seed/lamp1/600/600',
    'https://picsum.photos/seed/cushion1/600/600',
  ],
  sports: [
    'https://picsum.photos/seed/cricket1/600/600',
    'https://picsum.photos/seed/dumbell/600/600',
    'https://picsum.photos/seed/yoga1/600/600',
  ],
};

const categoryImages = {
  electronics: 'https://picsum.photos/seed/elec_cat/300/200',
  fashion: 'https://picsum.photos/seed/fashion_cat/300/200',
  home: 'https://picsum.photos/seed/home_cat/300/200',
  sports: 'https://picsum.photos/seed/sports_cat/300/200',
  phones: 'https://picsum.photos/seed/phones_cat/300/200',
  laptops: 'https://picsum.photos/seed/laptops_cat/300/200',
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

const destroyData = async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await Seller.deleteMany();
  await Coupon.deleteMany();
  await Review.deleteMany();
  console.log('🗑️  All data destroyed');
};

const importData = async () => {
  // ── Categories ──────────────────────────────────────────────────────────
  const electronics = await Category.create({
    name: 'Electronics',
    slug: 'electronics',
    image: categoryImages.electronics,
    level: 1,
    isFeatured: true,
    order: 1,
  });

  const fashion = await Category.create({
    name: 'Fashion',
    slug: 'fashion',
    image: categoryImages.fashion,
    level: 1,
    isFeatured: true,
    order: 2,
  });

  const homeCategory = await Category.create({
    name: 'Home & Living',
    slug: 'home-living',
    image: categoryImages.home,
    level: 1,
    isFeatured: true,
    order: 3,
  });

  const sports = await Category.create({
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    image: categoryImages.sports,
    level: 1,
    order: 4,
  });

  // Sub-categories
  const phones = await Category.create({
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    parent: electronics._id,
    image: categoryImages.phones,
    level: 2,
  });

  const laptops = await Category.create({
    name: 'Laptops',
    slug: 'laptops',
    parent: electronics._id,
    image: categoryImages.laptops,
    level: 2,
  });

  const menClothing = await Category.create({
    name: "Men's Clothing",
    slug: 'mens-clothing',
    parent: fashion._id,
    level: 2,
  });

  const womenClothing = await Category.create({
    name: "Women's Clothing",
    slug: 'womens-clothing',
    parent: fashion._id,
    level: 2,
  });

  console.log('✅ Categories seeded');

  // ── Users ────────────────────────────────────────────────────────────────
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@shopnow.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
    avatar: 'https://picsum.photos/seed/admin/150/150',
  });

  const sellerUser = await User.create({
    name: 'TechStore PK',
    email: 'seller@shopnow.com',
    password: 'seller123',
    role: 'seller',
    isEmailVerified: true,
    avatar: 'https://picsum.photos/seed/seller1/150/150',
  });

  const sellerUser2 = await User.create({
    name: 'Fashion Hub',
    email: 'seller2@shopnow.com',
    password: 'seller123',
    role: 'seller',
    isEmailVerified: true,
    avatar: 'https://picsum.photos/seed/seller2/150/150',
  });

  const customerUser = await User.create({
    name: 'Ali Khan',
    email: 'customer@shopnow.com',
    password: 'customer123',
    role: 'customer',
    isEmailVerified: true,
    avatar: 'https://picsum.photos/seed/customer1/150/150',
    loyaltyPoints: 150,
    walletBalance: 500,
  });

  console.log('✅ Users seeded');

  // ── Sellers ──────────────────────────────────────────────────────────────
  const seller1 = await Seller.create({
    user: sellerUser._id,
    storeName: 'TechStore PK',
    storeSlug: 'techstore-pk',
    logo: 'https://picsum.photos/seed/logo1/150/150',
    description: 'Pakistan\'s leading electronics store with genuine products and fast delivery.',
    isVerified: true,
    totalSales: 250000,
    totalOrders: 450,
    totalProducts: 80,
    rating: 4.7,
    totalEarnings: 225000,
  });

  const seller2 = await Seller.create({
    user: sellerUser2._id,
    storeName: 'Fashion Hub',
    storeSlug: 'fashion-hub',
    logo: 'https://picsum.photos/seed/logo2/150/150',
    description: 'Trendy fashion for men and women at unbeatable prices.',
    isVerified: true,
    totalSales: 180000,
    totalOrders: 320,
    totalProducts: 120,
    rating: 4.5,
  });

  console.log('✅ Sellers seeded');

  // ── Products ─────────────────────────────────────────────────────────────
  const products = await Product.create([
    // Electronics — Phones
    {
      name: 'Samsung Galaxy S24 Ultra 5G',
      description: 'The ultimate Galaxy smartphone with built-in S Pen, 200MP camera, and powerful AI features. Experience the future of mobile photography.',
      shortDescription: '200MP Camera, S Pen, 5000mAh, 5G',
      brand: 'Samsung',
      price: 299999,
      discountPrice: 279999,
      images: [
        'https://picsum.photos/seed/samsung_s24_1/600/600',
        'https://picsum.photos/seed/samsung_s24_2/600/600',
        'https://picsum.photos/seed/samsung_s24_3/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/samsung_s24_1/600/600',
      category: phones._id,
      seller: sellerUser._id,
      stock: 50,
      rating: 4.8,
      numReviews: 124,
      sold: 89,
      isFeatured: true,
      isFlashSale: true,
      flashSalePrice: 259999,
      flashSaleEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      tags: ['samsung', '5g', 'flagship', 'camera'],
      variants: [{
        name: 'Storage',
        options: [
          { value: '256GB', stock: 20, priceModifier: 0 },
          { value: '512GB', stock: 20, priceModifier: 20000 },
          { value: '1TB', stock: 10, priceModifier: 50000 },
        ]
      }, {
        name: 'Color',
        options: [
          { value: 'Titanium Black', stock: 30 },
          { value: 'Titanium Gray', stock: 20 },
        ]
      }],
      hasVariants: true,
      specifications: [
        { key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'RAM', value: '12GB' },
        { key: 'Battery', value: '5000mAh' },
        { key: 'Camera', value: '200MP + 12MP + 10MP + 10MP' },
      ],
    },
    {
      name: 'iPhone 15 Pro Max',
      description: 'Apple\'s most powerful iPhone with titanium design, A17 Pro chip, and professional camera system with 5x optical zoom.',
      shortDescription: 'Titanium Design, A17 Pro, 5x Zoom',
      brand: 'Apple',
      price: 349999,
      discountPrice: 329999,
      images: [
        'https://picsum.photos/seed/iphone15_1/600/600',
        'https://picsum.photos/seed/iphone15_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/iphone15_1/600/600',
      category: phones._id,
      seller: sellerUser._id,
      stock: 35,
      rating: 4.9,
      numReviews: 245,
      sold: 145,
      isFeatured: true,
      tags: ['apple', 'iphone', 'flagship', '5g'],
      variants: [{
        name: 'Storage',
        options: [
          { value: '256GB', stock: 15 },
          { value: '512GB', stock: 12, priceModifier: 25000 },
          { value: '1TB', stock: 8, priceModifier: 55000 },
        ]
      }, {
        name: 'Color',
        options: [
          { value: 'Natural Titanium', stock: 15 },
          { value: 'Black Titanium', stock: 10 },
          { value: 'White Titanium', stock: 10 },
        ]
      }],
      hasVariants: true,
    },
    {
      name: 'OnePlus 12 5G',
      description: 'Flagship killer with Hasselblad camera, 100W SUPERVOOC fast charging, and premium Snapdragon 8 Gen 3 performance.',
      shortDescription: 'Hasselblad Camera, 100W Charging, 5G',
      brand: 'OnePlus',
      price: 159999,
      discountPrice: 149999,
      images: [
        'https://picsum.photos/seed/oneplus12_1/600/600',
        'https://picsum.photos/seed/oneplus12_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/oneplus12_1/600/600',
      category: phones._id,
      seller: sellerUser._id,
      stock: 60,
      rating: 4.6,
      numReviews: 89,
      sold: 67,
      tags: ['oneplus', '5g', 'fast-charging'],
    },
    // Electronics — Laptops
    {
      name: 'MacBook Pro 14" M3 Pro',
      description: 'Pro performance, all day. The M3 Pro chip delivers extraordinary power for complex workflows. With a stunning Liquid Retina XDR display.',
      shortDescription: 'M3 Pro Chip, 18GB RAM, Liquid Retina XDR',
      brand: 'Apple',
      price: 449999,
      discountPrice: 0,
      images: [
        'https://picsum.photos/seed/macbook_1/600/600',
        'https://picsum.photos/seed/macbook_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/macbook_1/600/600',
      category: laptops._id,
      seller: sellerUser._id,
      stock: 20,
      rating: 4.9,
      numReviews: 67,
      sold: 34,
      isFeatured: true,
      tags: ['apple', 'macbook', 'laptop', 'm3'],
    },
    {
      name: 'Dell XPS 15 OLED',
      description: 'Premium Windows laptop with breathtaking 3.5K OLED display, 13th Gen Intel Core i9, and NVIDIA RTX 4070 graphics.',
      shortDescription: '3.5K OLED, i9-13900H, RTX 4070, 32GB',
      brand: 'Dell',
      price: 379999,
      discountPrice: 349999,
      images: [
        'https://picsum.photos/seed/dell_xps_1/600/600',
        'https://picsum.photos/seed/dell_xps_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/dell_xps_1/600/600',
      category: laptops._id,
      seller: sellerUser._id,
      stock: 15,
      rating: 4.7,
      numReviews: 45,
      sold: 28,
      tags: ['dell', 'laptop', 'oled', 'gaming'],
    },
    // Fashion — Men's
    {
      name: 'Premium Slim Fit Casual Shirt',
      description: 'Classic slim-fit casual shirt made from 100% premium cotton. Perfect for both casual and semi-formal occasions.',
      shortDescription: '100% Premium Cotton, Slim Fit',
      brand: 'Outfitters',
      price: 2499,
      discountPrice: 1799,
      images: [
        'https://picsum.photos/seed/shirt_men_1/600/600',
        'https://picsum.photos/seed/shirt_men_2/600/600',
        'https://picsum.photos/seed/shirt_men_3/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/shirt_men_1/600/600',
      category: menClothing._id,
      seller: sellerUser2._id,
      stock: 200,
      rating: 4.3,
      numReviews: 156,
      sold: 320,
      isFeatured: true,
      tags: ['shirt', 'casual', 'cotton', 'slim-fit'],
      variants: [{
        name: 'Size',
        options: [
          { value: 'S', stock: 40 },
          { value: 'M', stock: 60 },
          { value: 'L', stock: 60 },
          { value: 'XL', stock: 40 },
        ]
      }, {
        name: 'Color',
        options: [
          { value: 'Sky Blue', stock: 80 },
          { value: 'White', stock: 80 },
          { value: 'Navy', stock: 40 },
        ]
      }],
      hasVariants: true,
    },
    {
      name: "Women's Floral Maxi Dress",
      description: 'Beautiful floral print maxi dress, perfect for summer occasions. Made with breathable chiffon fabric.',
      shortDescription: 'Chiffon Fabric, Floral Print, A-Line Cut',
      brand: 'Khaadi',
      price: 4999,
      discountPrice: 3499,
      images: [
        'https://picsum.photos/seed/dress_women_1/600/600',
        'https://picsum.photos/seed/dress_women_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/dress_women_1/600/600',
      category: womenClothing._id,
      seller: sellerUser2._id,
      stock: 150,
      rating: 4.5,
      numReviews: 203,
      sold: 445,
      isFeatured: true,
      isFlashSale: true,
      flashSalePrice: 2999,
      flashSaleEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      tags: ['dress', 'maxi', 'floral', 'summer'],
      variants: [{
        name: 'Size',
        options: [
          { value: 'XS', stock: 20 },
          { value: 'S', stock: 40 },
          { value: 'M', stock: 50 },
          { value: 'L', stock: 30 },
          { value: 'XL', stock: 10 },
        ]
      }],
      hasVariants: true,
    },
    // Home & Living
    {
      name: 'Scandinavian Floor Lamp',
      description: 'Modern Scandinavian design floor lamp with adjustable brightness. Perfect for living rooms and reading corners.',
      shortDescription: 'LED, Adjustable Brightness, 3 Color Modes',
      brand: 'IKEA',
      price: 8999,
      discountPrice: 6999,
      images: [
        'https://picsum.photos/seed/lamp_1/600/600',
        'https://picsum.photos/seed/lamp_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/lamp_1/600/600',
      category: homeCategory._id,
      seller: sellerUser._id,
      stock: 80,
      rating: 4.4,
      numReviews: 67,
      sold: 123,
      tags: ['lamp', 'floor-lamp', 'led', 'scandinavian'],
    },
    // Sports
    {
      name: 'Professional Cricket Bat — Kashmir Willow',
      description: 'Premium Kashmir Willow cricket bat with English handle. Ideal for club and professional level play.',
      shortDescription: 'Kashmir Willow, English Handle, Grade 1',
      brand: 'Gray-Nicolls',
      price: 7999,
      discountPrice: 5999,
      images: [
        'https://picsum.photos/seed/cricket_bat_1/600/600',
        'https://picsum.photos/seed/cricket_bat_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/cricket_bat_1/600/600',
      category: sports._id,
      seller: sellerUser._id,
      stock: 40,
      rating: 4.6,
      numReviews: 89,
      sold: 156,
      tags: ['cricket', 'bat', 'sport'],
    },
    {
      name: 'Noise-Cancelling Wireless Earbuds Pro',
      description: 'Premium true wireless earbuds with Active Noise Cancellation, 30-hour total battery life, and crystal-clear call quality.',
      shortDescription: 'ANC, 30hr Battery, IPX5 Waterproof',
      brand: 'Sony',
      price: 24999,
      discountPrice: 19999,
      images: [
        'https://picsum.photos/seed/earbuds_1/600/600',
        'https://picsum.photos/seed/earbuds_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/earbuds_1/600/600',
      category: electronics._id,
      seller: sellerUser._id,
      stock: 100,
      rating: 4.7,
      numReviews: 312,
      sold: 567,
      isFeatured: true,
      isFlashSale: true,
      flashSalePrice: 17999,
      flashSaleEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['earbuds', 'wireless', 'anc', 'sony'],
    },
    {
      name: 'Smart LED TV 55" 4K UHD',
      description: '55-inch 4K Ultra HD Smart TV with HDR10+, Dolby Atmos, and built-in streaming apps including Netflix, YouTube, and Amazon Prime.',
      shortDescription: '55" 4K UHD, HDR10+, Smart TV, Dolby Atmos',
      brand: 'TCL',
      price: 89999,
      discountPrice: 74999,
      images: [
        'https://picsum.photos/seed/tv_1/600/600',
        'https://picsum.photos/seed/tv_2/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/tv_1/600/600',
      category: electronics._id,
      seller: sellerUser._id,
      stock: 25,
      rating: 4.5,
      numReviews: 178,
      sold: 234,
      isFeatured: true,
      tags: ['tv', '4k', 'smart-tv', 'tcl'],
    },
    {
      name: "Men's Running Sneakers — Ultra Boost",
      description: 'Lightweight running shoes with responsive Boost cushioning, Primeknit upper, and Continental rubber outsole.',
      shortDescription: 'Boost Cushioning, Primeknit, Continental Rubber',
      brand: 'Adidas',
      price: 18999,
      discountPrice: 14999,
      images: [
        'https://picsum.photos/seed/shoes_1/600/600',
        'https://picsum.photos/seed/shoes_2/600/600',
        'https://picsum.photos/seed/shoes_3/600/600',
      ],
      thumbnail: 'https://picsum.photos/seed/shoes_1/600/600',
      category: menClothing._id,
      seller: sellerUser2._id,
      stock: 120,
      rating: 4.6,
      numReviews: 267,
      sold: 445,
      isFeatured: true,
      tags: ['shoes', 'running', 'adidas', 'sneakers'],
      variants: [{
        name: 'Size',
        options: [
          { value: '40', stock: 20 },
          { value: '41', stock: 30 },
          { value: '42', stock: 30 },
          { value: '43', stock: 25 },
          { value: '44', stock: 15 },
        ]
      }, {
        name: 'Color',
        options: [
          { value: 'Black/White', stock: 60 },
          { value: 'Navy/Orange', stock: 40 },
          { value: 'Grey/Red', stock: 20 },
        ]
      }],
      hasVariants: true,
    },
  ]);

  console.log(`✅ ${products.length} Products seeded`);

  // ── Coupons ──────────────────────────────────────────────────────────────
  await Coupon.create([
    {
      code: 'WELCOME20',
      type: 'percent',
      value: 20,
      minOrderValue: 1000,
      maxDiscount: 5000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'Welcome offer — 20% off your first order',
      usageLimit: 1000,
    },
    {
      code: 'SAVE500',
      type: 'fixed',
      value: 500,
      minOrderValue: 3000,
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      description: 'Flat Rs.500 off on orders above Rs.3000',
    },
    {
      code: 'FLASH50',
      type: 'percent',
      value: 50,
      minOrderValue: 5000,
      maxDiscount: 10000,
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      description: 'Flash sale — 50% off up to Rs.10,000',
      usageLimit: 200,
    },
  ]);

  console.log('✅ Coupons seeded');

  console.log('\n🎉 All seed data imported successfully!\n');
  console.log('📧 Login credentials:');
  console.log('   Admin:    admin@shopnow.com    / admin123');
  console.log('   Seller:   seller@shopnow.com   / seller123');
  console.log('   Seller2:  seller2@shopnow.com  / seller123');
  console.log('   Customer: customer@shopnow.com / customer123\n');
};

const run = async () => {
  await connectDB();

  if (process.argv[2] === '--destroy') {
    await destroyData();
  } else {
    await destroyData();
    await importData();
  }

  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});
