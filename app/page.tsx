import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div>
      {/* Header Component */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Categories Section */}
      <Categories />
      {/* Featured Products Section */}
      <FeaturedProducts />
      {/* Testimonials Section */}
      <Testimonials />

    </div>
  );
}
