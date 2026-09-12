/**
 * Application Constants
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Jaipur Plants Hub';

export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cart
export const MAX_CART_QUANTITY = 99;
export const MAX_CART_ITEMS = 50;

// Image placeholders
export const PLACEHOLDER_PRODUCT = '/images/plant-placeholder.svg';
export const PLACEHOLDER_AVATAR = '/images/plant-placeholder.svg';
export const PLACEHOLDER_BLOG = '/images/plant-placeholder.svg';

// Navigation
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Plants & Products',
    href: '/products',
    children: [
      { label: 'All Plants', href: '/products' },
      { label: 'Indoor Plants', href: '/categories/indoor-plants' },
      { label: 'Outdoor Plants', href: '/categories/outdoor-plants' },
      { label: 'Flowering Plants', href: '/categories/flowering-plants' },
      { label: 'Succulents & Cacti', href: '/categories/succulents-cacti' },
      { label: 'Fruit Plants', href: '/categories/fruit-plants' },
      { label: 'Herbal Plants', href: '/categories/herbal-medicinal' },
      { label: 'Seeds & Bulbs', href: '/categories/seeds-bulbs' },
      { label: 'Pots & Planters', href: '/categories/pots-planters' },
      { label: 'Fertilizers & Soil', href: '/categories/fertilizers-soil' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'Villa Garden Design', href: '/garden-design' },
      { label: 'Farmhouse Development', href: '/farmhouse-development' },
      { label: 'Terrace Garden', href: '/services/terrace-garden-setup' },
      { label: 'Vertical Garden', href: '/services' },
      { label: 'Garden Maintenance', href: '/services/garden-maintenance' },
      { label: 'Indoor Plants Setup', href: '/nursery' },
      { label: 'Book Consultation', href: '/query?type=consultation' },
    ],
  },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/about#team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blogs' },
  ],
  services: [
    { label: 'Garden Design', href: '/garden-design' },
    { label: 'Farmhouse Development', href: '/farmhouse-development' },
    { label: 'Terrace Gardens', href: '/services' },
    { label: 'Garden Maintenance', href: '/services' },
    { label: 'Book Consultation', href: '/query?type=consultation' },
  ],
  shop: [
    { label: 'All Plants', href: '/products' },
    { label: 'New Arrivals', href: '/products?isNewArrival=true' },
    { label: 'Best Sellers', href: '/products?isBestSeller=true' },
    { label: 'Sale', href: '/products?isOnSale=true' },
    { label: 'Gift Ideas', href: '/products?tags=gift' },
  ],
  support: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Track Order', href: '/account/orders' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

// Social Links
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/greenscapepro', icon: 'FaFacebook' },
  { label: 'Instagram', href: 'https://instagram.com/greenscapepro', icon: 'FaInstagram' },
  { label: 'Twitter', href: 'https://twitter.com/greenscapepro', icon: 'FaTwitter' },
  { label: 'YouTube', href: 'https://youtube.com/@greenscapepro', icon: 'FaYoutube' },
  { label: 'Pinterest', href: 'https://pinterest.com/greenscapepro', icon: 'FaPinterest' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/greenscapepro', icon: 'FaLinkedin' },
];

// Contact Info
export const CONTACT_INFO = {
  address: '123 Garden Street, Green City, Maharashtra - 400001',
  phone: '+91 98765 43210',
  email: 'info@greenscapepro.com',
  whatsapp: '+919876543210',
  hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...',
};

// Order Statuses
export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-orange-100 text-orange-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  return_picked: 'Return Picked',
  refunded: 'Refunded',
};

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
