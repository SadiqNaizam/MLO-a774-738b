import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, PlusCircle, MinusCircle, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 14.00, quantity: 1, imageUrl: 'https://source.unsplash.com/random/100x100?margherita,pizza' },
  { id: 'a2', name: 'Caprese Salad', price: 10.50, quantity: 2, imageUrl: 'https://source.unsplash.com/random/100x100?caprese,salad' },
  { id: 'd1', name: 'Coca-Cola', price: 2.50, quantity: 4, imageUrl: 'https://source.unsplash.com/random/100x100?coke,can' },
];

const CartPage = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0; // Example delivery fee
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + deliveryFee + taxes;
  const totalCartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  const handleProceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", cartItems);
    navigate('/checkout');
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavigationMenu cartItemCount={0} />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h1 className="text-3xl font-semibold text-gray-700 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild size="lg">
            <Link to="/">Start Shopping</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={totalCartItemsCount} />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Review Your Items ({totalCartItemsCount})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">
                            <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <Input type="number" value={item.quantity} readOnly className="w-12 h-8 text-center hide-arrows" />
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-1/3">
              <Card className="shadow-lg sticky top-24"> {/* Sticky summary for long cart lists */}
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (est.)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="pt-2">
                    <Label htmlFor="promo" className="mb-1 block text-sm font-medium">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input id="promo" placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                      <Button variant="outline" onClick={() => console.log("Applied promo:", promoCode)}>Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default CartPage;