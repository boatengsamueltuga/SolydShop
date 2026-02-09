/**
 * @file About — Static about page for SolydShop.
 * @description
 * - Displays company mission statement and a team hero image.
 * - Renders 4 hardcoded ProductCard items in "about" mode (no cart/modal interactions).
 * - Uses aboutUsImage from static assets for the hero section.
 * - Responsive layout: stacked on mobile, side-by-side on large screens.
 * @usage App.jsx — route `/about`.
 */
import aboutUsImage from "../assets/sliders/team-business.jpg";
import ProductCard from "./shared/ProductCard";

const products = [
  
  {
    productName: "Wireless Bluetooth Headphones",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    description: "Wireless Bluetooth Headphones with noise cancellation.",
    price: 120.0,
    specialPrice: 89.5,
  },
  {
    productName: "Minimalist Wooden Desk Organizer",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=800",
    description: "Minimalist Wooden Desk Organizer for office or home.",
    price: 40.0,
    specialPrice: 25.0,
  },
  {
    productName: "Fresh Sneakers",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    description: "Fresh Sneakers designed for style, durability & comfort.",
    price: 180.0,
    specialPrice: 129.99,
  },
  {
    productName: "DSLR Camera Lens",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    description: "Professional DSLR Camera Lens for cinematic photography.",
    price: 650.0,
    specialPrice: 499.0,
  },
];



const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-slate-800 text-4xl font-bold text-center mb-12">
    About Us
  </h1>

  <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
    
    <div className="lg:w-1/2 w-full">
      <p className="text-lg mb-4 text-justify">
        SolydShop is a modern e-commerce platform built to simplify online shopping for everyone.
        We connect buyers with high-quality products through a fast, secure, and user-friendly experience.
        Our mission is to make digital commerce accessible, reliable, and enjoyable, whether you’re shopping
        for daily essentials or the latest trends. At SolydShop, every customer matters — and every order
        is handled with care.
      </p>
    </div>

    {/* Add spacing here */}
    <div className="lg:w-1/2 w-full lg:ml-10 mt-6 lg:mt-0">
      <img
  src={aboutUsImage}
  alt="Team Business"
  className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
/>

    </div>
    
  </div>
  <div  className="py-7 space-y-8">
    <h1 className="text-slate-800 text-4xl font-bold text-center">Our Products</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) =>(
        <ProductCard
        key={index}
        image={product.image}
        description={product.description}
        specialPrice={product.specialPrice}
        price={product.price}
        about/>
        ))
    }
        </div>
  </div>
</div>

  );
};

export default About;
