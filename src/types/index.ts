/**
 * Global TypeScript Type Definitions
 * All interfaces and types used across the application
 */

// ============================================================
// User & Auth
// ============================================================
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  dateOfBirth?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  role: 'customer' | 'staff' | 'manager' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  addresses?: Address[];
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  newsletter: boolean;
  smsAlerts: boolean;
  whatsappAlerts: boolean;
  pushNotifications: boolean;
  language: string;
  currency: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ============================================================
// Product
// ============================================================
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category | string;
  subcategory?: Category | string;
  tags: string[];
  brand?: string;
  images: ProductImage[];
  thumbnail: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;  hasVariants: boolean;
  variants?: ProductVariant[];
  type: 'plant' | 'seed' | 'tool' | 'accessory' | 'fertilizer' | 'pot' | 'soil' | 'other';
  plantInfo?: PlantInfo;
  shipping?: ShippingInfo;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  views: number;
  totalSales: number;
  totalRevenue: number;
  seo?: SEOData;
  additionalInfo?: Array<{ key: string; value: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  _id: string;
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
  isActive: boolean;
}

export interface PlantInfo {
  botanicalName?: string;
  commonNames?: string[];
  difficulty?: 'easy' | 'moderate' | 'hard';
  wateringFrequency?: string;
  sunlight?: 'full-sun' | 'partial-sun' | 'shade' | 'indirect-light';
  growthRate?: 'slow' | 'moderate' | 'fast';
  matureHeight?: string;
  toxicity?: 'non-toxic' | 'toxic-to-pets' | 'toxic-to-humans' | 'toxic-to-all';
  origin?: string;
  climate?: 'tropical' | 'temperate' | 'arid' | 'mediterranean';
  temperature?: string;
  humidity?: string;
  soilType?: string;
  fertilizer?: string;
  benefits?: string[];
  careInstructions?: string;
}

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  isFreeShipping: boolean;
  shippingClass: string;
}

// ============================================================
// Category
// ============================================================
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
    alt?: string;
  };
  icon?: string;
  color?: string;
  parent?: string | Category;
  level: number;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  showInMenu: boolean;
  showOnHome: boolean;
  productCount: number;
  children?: Category[];
  seo?: SEOData;
}

// ============================================================
// Cart & Wishlist
// ============================================================
export interface CartItem {
  _id: string;
  product: Product;
  variant?: string;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
  notifyOnSale: boolean;
  notifyOnBackInStock: boolean;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  itemCount: number;
}

// ============================================================
// Order
// ============================================================
export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  payment: PaymentInfo;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  shipping?: ShippingDetails;
  customerNote?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  category?: string;
}

export interface PaymentInfo {
  method: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
  paidAt?: string;
}

export interface ShippingDetails {
  courier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
}

export interface StatusHistoryItem {
  _id: string;
  status: string;
  note?: string;
  timestamp: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'refunded';

// ============================================================
// Review
// ============================================================
export interface Review {
  _id: string;
  product: string | Product;
  user: User;
  rating: number;
  title?: string;
  comment: string;
  images?: { url: string; publicId: string }[];
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  response?: {
    text: string;
    respondedAt: string;
  };
  createdAt: string;
}

// ============================================================
// Service
// ============================================================
export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  images: { url: string; title?: string }[];
  thumbnail: string;
  icon?: string;
  pricingType: 'fixed' | 'tiered' | 'custom' | 'per_sqft';
  basePrice?: number;
  pricingTiers?: PricingTier[];
  pricePerSqFt?: number;
  duration?: string;
  includedFeatures?: string[];
  process?: ProcessStep[];
  isActive: boolean;
  isFeatured: boolean;
  isBookable: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  bookingCount: number;
  seo?: SEOData;
}

export interface PricingTier {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  features?: string[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

// ============================================================
// Blog
// ============================================================
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage: {
    url: string;
    publicId: string;
    alt?: string;
  };
  author: User;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string;
  views: number;
  likes: number;
  readingTime: number;
  isFeatured: boolean;
  relatedPosts?: Blog[];
  seo?: SEOData;
  createdAt: string;
}

// ============================================================
// Common
// ============================================================
export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Settings {
  [key: string]: any;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: string;
  position: string;
  image: {
    desktop?: { url: string };
    mobile?: { url: string };
  };
  cta?: Array<{
    label: string;
    link: string;
    variant: string;
  }>;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  customer: {
    name: string;
    designation?: string;
    company?: string;
    location?: string;
    avatar?: { url: string };
  };
  rating: number;
  title?: string;
  content: string;
  project?: string;
  images?: { url: string; caption?: string }[];
  isFeatured: boolean;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  type: 'image' | 'video';
  image?: { url: string; thumbnail?: string };
  video?: { url: string; thumbnail?: string };
  category: string;
  tags: string[];
  isBeforeAfter: boolean;
  beforeImage?: { url: string };
  afterImage?: { url: string };
  isFeatured: boolean;
}

// ============================================================
// Forms
// ============================================================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  serviceType?: string;
  propertyType?: string;
}

export interface CheckoutFormData {
  shippingAddress: Address;
  billingAddress?: Address;
  sameAsBilling: boolean;
  paymentMethod: 'razorpay' | 'cod';
  customerNote?: string;
}
