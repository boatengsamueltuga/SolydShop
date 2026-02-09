/**
 * @file Application-wide static data: banner slides and admin/seller sidebar navigation.
 *
 * @description
 * - `bannerLists`        — Hero carousel slide data (id, image, title, subtitle, description).
 * - `adminNavigation`    — Sidebar links for ROLE_ADMIN (5 items: Dashboard, Orders, Products, Categories, Seller).
 * - `sellerNavigation`   — Sidebar links for ROLE_SELLER (2 items: Orders, Products).
 * - `aboutUsImage`       — Re-exported from `constant.js` for convenience.
 *
 * @usage HeroBanner.jsx   — iterates `bannerLists` to render Swiper slides.
 *        Sidebar.jsx      — renders `adminNavigation` or `sellerNavigation` based on user role.
 *        About.jsx        — imports `aboutUsImage`.
 */
import { FaBoxOpen, FaHome, FaShoppingCart, FaStore, FaThList } from "react-icons/fa";
import {
  bannerImageOne,
  bannerImageTwo,
  bannerImageThree,
  aboutUsImage
} from "./constant";

export const bannerLists = [
  {
    id: 1,
    image: bannerImageOne,
    title: "Home Comfort",
    subtitle: "Living Room",
    description: "Upgrade your space with cozy and stylish sofas",
  },
  {
    id: 2,
    image: bannerImageTwo,
    title: "Entertainment Hub",
    subtitle: "Smart TV",
    description: "Experience the latest in home entertainment",
  },
  {
    id: 3,
    image: bannerImageThree,
    title: "Playful Picks",
    subtitle: "Kids' Clothing",
    description: "Bright and fun styles for kids, up to 20% off",
  },
];

// KEEP aboutUsImage AVAILABLE — just NOT in bannerLists
export { aboutUsImage };

export const adminNavigation = [
  { 
    name: "Dashboard", 
    href: "/admin",
    icon: FaHome, 
    current:true
  },
  { 
    name: "Orders", 
    href: "/admin/orders",
    icon: FaShoppingCart, 
  },
  { 
    name: "Products", 
    href: "/admin/products",
    icon: FaBoxOpen
    
  },
  { 
    name: "Categories", 
    href: "/admin/categories",
    icon: FaThList
  },
  { 
    name: "Seller", 
    href: "/admin/sellers",
    icon: FaStore 
    
  }
];

export const sellerNavigation = [
  
  { 
    name: "Orders", 
    href: "/admin/orders",
    icon: FaShoppingCart, 
  },
  { 
    name: "Products", 
    href: "/admin/products",
    icon: FaBoxOpen
    
  }
  
];

