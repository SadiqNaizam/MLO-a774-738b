import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import MenuItemCard from '@/components/MenuItemCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Clock, Info, ShoppingCart } from 'lucide-react'; // Added Info icon

// Mock data - in a real app, this would come from an API based on restaurantId
const mockRestaurantData = {
  '1': { // Corresponds to 'The Great Eatery' from HomePage
    name: 'The Great Eatery',
    logoUrl: 'https://source.unsplash.com/random/100x100?logo,abstract',
    rating: 4.5,
    reviewCount: 1200,
    cuisineTypes: ['Italian', 'Pizza'],
    deliveryTime: '25-35 min',
    description: 'Authentic Italian cuisine and stone-baked pizzas in a cozy atmosphere. We use only the freshest ingredients.',
    menu: {
      'Appetizers': [
        { id: 'a1', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with olive oil and salt.', price: 8.99, imageUrl: 'https://source.unsplash.com/random/300x200?bruschetta', tags: ['Vegetarian'] },
        { id: 'a2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and sweet basil.', price: 10.50, imageUrl: 'https://source.unsplash.com/random/300x200?caprese,salad', tags: ['Vegetarian', 'Gluten-Free'] },
      ],
      'Pizzas': [
        { id: 'p1', name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and basil.', price: 14.00, imageUrl: 'https://source.unsplash.com/random/300x200?margherita,pizza', tags: ['Popular'] },
        { id: 'p2', name: 'Pepperoni Pizza', description: 'Spicy pepperoni with rich tomato sauce and mozzarella.', price: 16.50, imageUrl: 'https://source.unsplash.com/random/300x200?pepperoni,pizza' },
        { id: 'p3', name: 'Veggie Supreme', description: 'A mix of fresh vegetables on our signature crust.', price: 15.50, imageUrl: 'https://source.unsplash.com/random/300x200?veggie,pizza', tags: ['Vegetarian'] },
      ],
      'Drinks': [
        { id: 'd1', name: 'Coca-Cola', description: 'Classic Coke.', price: 2.50, imageUrl: 'https://source.unsplash.com/random/300x200?coke,can' },
        { id: 'd2', name: 'Sparkling Water', description: 'Refreshing sparkling water.', price: 3.00, imageUrl: 'https://source.unsplash.com/random/300x200?water,bottle' },
      ],
    }
  },
  // Add more mock restaurant data if needed for other IDs
};

type MenuItemType = { id: string | number; name: string; price: number; quantity: number };

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  console.log('RestaurantMenuPage loaded for restaurant ID:', restaurantId);

  const restaurant = restaurantId ? mockRestaurantData[restaurantId as keyof typeof mockRestaurantData] : null;

  const [cart, setCart] = useState<MenuItemType[]>([]);
  const [selectedItemForDialog, setSelectedItemForDialog] = useState<any>(null); // For item customization dialog

  const handleAddToCart = (item: MenuItemType) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
      }
      return [...prevCart, item];
    });
    console.log('Added to cart:', item);
    // In a real app, show a toast notification
  };
  
  const updateCartItemQuantity = (itemId: string | number, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== itemId);
      }
      return prevCart.map(item => item.id === itemId ? {...item, quantity: newQuantity} : item);
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Restaurant not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={totalCartItems} />
      <ScrollArea className="flex-grow">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-orange-500">
                <AvatarImage src={restaurant.logoUrl || `https://avatar.vercel.sh/${restaurant.name}`} alt={restaurant.name} />
                <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{restaurant.name}</h1>
                <p className="text-gray-600 mt-1">{restaurant.cuisineTypes.join(', ')}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500" /> {restaurant.rating} ({restaurant.reviewCount}+ reviews)</span>
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {restaurant.deliveryTime}</span>
                </div>
                {restaurant.description && <p className="text-sm text-gray-500 mt-2 max-w-2xl">{restaurant.description}</p>}
              </div>
              {/* Potentially add 'Order Now' or 'View Cart' button here if cart has items */}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue={Object.keys(restaurant.menu)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:w-auto mb-6 bg-white p-1 rounded-lg shadow">
              {Object.keys(restaurant.menu).map(category => (
                <TabsTrigger key={category} value={category} className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(restaurant.menu).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(items as any[]).map(item => {
                    const cartItem = cart.find(ci => ci.id === item.id);
                    return (
                      <MenuItemCard
                        key={item.id}
                        {...item}
                        onAddToCart={(cartItemData) => {
                          // Potentially open dialog for customization before adding
                          // For simplicity, directly adding here.
                          // setSelectedItemForDialog(item); // Example: trigger dialog
                          handleAddToCart(cartItemData);
                        }}
                        quantityInCart={cartItem ? cartItem.quantity : 0}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </ScrollArea>

      {selectedItemForDialog && (
        <Dialog open={!!selectedItemForDialog} onOpenChange={() => setSelectedItemForDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize {selectedItemForDialog.name}</DialogTitle>
              <DialogDescription>
                Make selections for your item. (This is a placeholder dialog)
              </DialogDescription>
            </DialogHeader>
            {/* Add form elements for customization here */}
            <p className="my-4">Customization options would go here...</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedItemForDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                handleAddToCart({ ...selectedItemForDialog, quantity: 1 }); // Add with selected options
                setSelectedItemForDialog(null);
              }}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantMenuPage;