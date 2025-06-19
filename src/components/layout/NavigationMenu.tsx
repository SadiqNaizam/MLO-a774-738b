import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import { Menu, Search, ShoppingCart, UserCircle } from 'lucide-react';

interface NavigationMenuProps {
  cartItemCount?: number;
  onSearch?: (searchTerm: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ cartItemCount = 0, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("Rendering NavigationMenu, cart items:", cartItemCount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      console.log("Search submitted:", searchTerm);
      onSearch(searchTerm.trim());
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/offers', label: 'Offers' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-500 mr-6">
              FoodApp
            </Link>
            <div className="hidden md:flex space-x-4">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - more prominent on desktop */}
          <div className="hidden md:flex flex-grow max-w-xs lg:max-w-md items-center">
            <form onSubmit={handleSearchSubmit} className="w-full flex">
              <Input
                type="search"
                placeholder="Search restaurants or dishes..."
                className="rounded-r-none focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="outline" className="rounded-l-none border-l-0">
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            </form>
          </div>

          {/* Icons and Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            <Link to="/cart" className="relative text-gray-600 hover:text-orange-500">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-orange-500">
              <UserCircle className="h-6 w-6" />
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <div className="p-4">
                    <Link to="/" className="text-2xl font-bold text-orange-500 mb-6 block" onClick={() => setIsMobileMenuOpen(false)}>
                      FoodApp
                    </Link>
                    {/* Mobile Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="mb-6 flex">
                       <Input
                        type="search"
                        placeholder="Search..."
                        className="rounded-r-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button type="submit" variant="outline" className="rounded-l-none border-l-0">
                        <Search className="h-5 w-5 text-gray-500" />
                      </Button>
                    </form>
                    <nav className="flex flex-col space-y-3">
                      {navLinks.map(link => (
                        <Link
                          key={link.label}
                          to={link.href}
                          className="text-gray-700 hover:text-orange-500 py-2 text-base font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;