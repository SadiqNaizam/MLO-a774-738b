import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Sidebar, { SidebarContent } from '@/components/layout/Sidebar';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Filter, Search, ListFilter } from 'lucide-react';

const allRestaurants = [
  { id: '1', name: 'Nonna\'s Italian Kitchen', imageUrl: 'https://source.unsplash.com/random/400x300?italian,food', rating: 4.7, reviewCount: 1500, cuisineTypes: ['Italian', 'Pasta'], deliveryTime: '30-40 min', deliveryFee: '$2.99' },
  { id: '2', name: 'Quick Bites Burgers', imageUrl: 'https://source.unsplash.com/random/400x300?burger,fries', rating: 4.1, reviewCount: 750, cuisineTypes: ['Burgers', 'American'], deliveryTime: '20-30 min', deliveryFee: 'Free' },
  { id: '3', name: 'Tokyo Sushi House', imageUrl: 'https://source.unsplash.com/random/400x300?sushi,japan', rating: 4.9, reviewCount: 1200, cuisineTypes: ['Japanese', 'Sushi'], deliveryTime: '35-45 min', deliveryFee: '$3.50' },
  { id: '4', name: 'Curry Palace', imageUrl: 'https://source.unsplash.com/random/400x300?indian,curry', rating: 4.4, reviewCount: 900, cuisineTypes: ['Indian', 'Curry'], deliveryTime: '40-50 min', deliveryFee: '$1.00' },
  { id: '5', name: 'Vegan Delights', imageUrl: 'https://source.unsplash.com/random/400x300?vegan,salad', rating: 4.6, reviewCount: 600, cuisineTypes: ['Vegan', 'Healthy'], deliveryTime: '25-35 min', deliveryFee: 'Free' },
  { id: '6', name: 'Pizza Heaven', imageUrl: 'https://source.unsplash.com/random/400x300?pizza', rating: 4.3, reviewCount: 2000, cuisineTypes: ['Pizza', 'Italian'], deliveryTime: '25-35 min', deliveryFee: '$1.50' },
];

const ITEMS_PER_PAGE = 4;

const RestaurantListingPage = () => {
  console.log('RestaurantListingPage loaded');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDeliveryTime: 60, // minutes
    freeDelivery: false,
    cuisine: '',
  });
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleSearch = (term: string) => {
    console.log('RestaurantListingPage search for:', term);
    setSearchTerm(term);
    navigate(`/restaurants?search=${encodeURIComponent(term)}`);
  };
  
  const filteredRestaurants = allRestaurants
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())))
    .filter(r => r.rating >= filters.minRating)
    .filter(r => parseInt(r.deliveryTime.split('-')[0]) <= filters.maxDeliveryTime)
    .filter(r => filters.freeDelivery ? r.deliveryFee === 'Free' : true)
    // .filter(r => filters.cuisine ? r.cuisineTypes.includes(filters.cuisine) : true) // Add cuisine filter if UI exists
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'deliveryTime') return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
      return 0;
    });

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const FilterOptions = ({ inSheet = false }: { inSheet?: boolean}) => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="minRating" className="text-sm font-medium">Min. Rating: {filters.minRating.toFixed(1)} stars</Label>
          <Slider
            id="minRating"
            min={0} max={5} step={0.1}
            defaultValue={[filters.minRating]}
            onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="maxDeliveryTime" className="text-sm font-medium">Max Delivery: {filters.maxDeliveryTime} min</Label>
          <Slider
            id="maxDeliveryTime"
            min={10} max={90} step={5}
            defaultValue={[filters.maxDeliveryTime]}
            onValueChange={(value) => setFilters(prev => ({ ...prev, maxDeliveryTime: value[0] }))}
            className="mt-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="freeDelivery"
            checked={filters.freeDelivery}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, freeDelivery: !!checked }))}
          />
          <Label htmlFor="freeDelivery" className="text-sm font-medium">Free Delivery</Label>
        </div>
      </div>
      <div className="mt-6">
        <Label className="text-sm font-medium block mb-2">Sort By</Label>
        <RadioGroup defaultValue={sortBy} onValueChange={setSortBy}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rating" id="r-rating" />
            <Label htmlFor="r-rating">Rating</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="deliveryTime" id="r-deliveryTime" />
            <Label htmlFor="r-deliveryTime">Delivery Time</Label>
          </div>
        </RadioGroup>
      </div>
      {inSheet && <Button className="w-full mt-6" onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={0} onSearch={(term) => { setSearchTerm(term); setCurrentPage(1); }} />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {initialSearchTerm ? `Results for "${initialSearchTerm}"` : "All Restaurants"}
            </h1>
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                    <SidebarContent title="Filter & Sort" onClose={() => setIsMobileFiltersOpen(false)}>
                       <FilterOptions inSheet={true} />
                    </SidebarContent>
                </SheetContent>
            </Sheet>
          </div>
           <div className="mt-4 relative md:hidden"> {/* Search bar visible on mobile, hidden on md+ because nav has one */}
            <Input
              type="search"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <Sidebar title="Filter & Sort" className="hidden md:block w-72 lg:w-80 flex-shrink-0">
             <FilterOptions />
          </Sidebar>

          {/* Main content - Restaurant List */}
          <div className="flex-grow">
            {paginatedRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ListFilter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No Restaurants Found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} aria-disabled={currentPage === 1} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                     <PaginationItem key={i}>
                       <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }} isActive={currentPage === i + 1}>
                         {i + 1}
                       </PaginationLink>
                     </PaginationItem>
                  ))}
                  {/* Add PaginationEllipsis logic if many pages */}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} aria-disabled={currentPage === totalPages}/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
      {/* Footer could be added here */}
    </div>
  );
};

export default RestaurantListingPage;