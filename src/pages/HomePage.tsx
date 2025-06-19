import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Carousel, { CarouselSlide } from '@/components/Carousel';
import RestaurantCard from '@/components/RestaurantCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';

const placeholderRestaurants = [
  { id: '1', name: 'The Great Eatery', imageUrl: 'https://source.unsplash.com/random/400x300?food,restaurant', rating: 4.5, reviewCount: 1200, cuisineTypes: ['Italian', 'Pizza'], deliveryTime: '25-35 min', deliveryFee: 'Free' },
  { id: '2', name: 'Burger Bliss', imageUrl: 'https://source.unsplash.com/random/400x300?burger', rating: 4.2, reviewCount: 850, cuisineTypes: ['Burgers', 'Fast Food'], deliveryTime: '20-30 min', deliveryFee: '$1.99' },
  { id: '3', name: 'Sushi Central', imageUrl: 'https://source.unsplash.com/random/400x300?sushi', rating: 4.8, reviewCount: 950, cuisineTypes: ['Japanese', 'Sushi'], deliveryTime: '30-40 min', deliveryFee: 'Free' },
  { id: '4', name: 'Taco Town', imageUrl: 'https://source.unsplash.com/random/400x300?tacos', rating: 4.3, reviewCount: 700, cuisineTypes: ['Mexican', 'Tacos'], deliveryTime: '20-25 min', deliveryFee: '$0.99' },
];

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    altText: 'Special Offer 1',
    content: (
      <div className="relative w-full h-64 md:h-96">
        <img src="https://source.unsplash.com/random/1200x400?food,deal" alt="Special Offer 1" className="w-full h-full object-cover rounded-lg" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Weekend Feast Deals!</h2>
          <p className="text-lg mb-4">Get 20% off on all orders above $50.</p>
          <Button size="lg">Order Now</Button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    altText: 'New Restaurants Added',
    content: (
       <div className="relative w-full h-64 md:h-96">
        <img src="https://source.unsplash.com/random/1200x400?restaurant,interior" alt="New Restaurants" className="w-full h-full object-cover rounded-lg" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Explore New Restaurants!</h2>
          <p className="text-lg mb-4">Discover fresh tastes in your neighborhood.</p>
          <Button size="lg" variant="outline">Discover</Button>
        </div>
      </div>
    ),
  },
];

const foodCategories = ['Pizza', 'Burgers', 'Sushi', 'Indian', 'Chinese', 'Desserts'];

const HomePage = () => {
  console.log('HomePage loaded');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (term: string) => {
    console.log('HomePage search initiated for:', term);
    // Navigate to restaurant listing page with search term
    // e.g., navigate(`/restaurants?search=${term}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={0} onSearch={handleSearch} />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          {/* Hero Carousel Section */}
          <section className="mb-12">
            <Carousel slides={carouselSlides} autoplayDelay={5000} />
          </section>

          {/* Search Section */}
          <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Find Your Next Meal
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Search for your favorite restaurants or dishes.
            </p>
            <div className="max-w-2xl mx-auto flex">
              <Input
                type="search"
                placeholder="Search restaurants, cuisines, dishes..."
                className="text-lg p-4 rounded-l-md border-r-0 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              />
              <Button
                type="button"
                size="lg"
                className="rounded-l-none text-lg p-4"
                onClick={() => handleSearch(searchTerm)}
              >
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
          </section>

          {/* Categories Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {foodCategories.map(category => (
                <Button key={category} variant="outline" className="py-6 text-md hover:bg-orange-500 hover:text-white transition-colors">
                  {category}
                </Button>
              ))}
            </div>
          </section>

          {/* Featured Restaurants Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Featured Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {placeholderRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </section>
        </main>
      </ScrollArea>
      {/* Footer could be added here if available */}
    </div>
  );
};

export default HomePage;