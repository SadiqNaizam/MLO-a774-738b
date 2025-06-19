import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"; // useFormField is not typically directly used, but Form components are
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'paypal', 'cod'], { required_error: "Please select a payment method" }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'card') {
        return !!data.cardNumber && !!data.expiryDate && !!data.cvv;
    }
    return true;
}, {
    message: "Card details are required for card payment",
    path: ["cardNumber"], // Path to show error, can be adjusted
});


const checkoutFormSchema = addressSchema.merge(paymentSchema);

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Mock cart total for summary
const MOCK_ORDER_TOTAL = 58.76;

const CheckoutPage = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      paymentMethod: undefined, // Ensure RadioGroup has a default state
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  function onSubmit(data: CheckoutFormValues) {
    console.log('Checkout form submitted:', data);
    setIsConfirmDialogOpen(true);
    // In a real app, API call to process order
  }

  const handleOrderConfirmed = () => {
    setIsConfirmDialogOpen(false);
    console.log("Order placed!");
    // Navigate to an order confirmation/success page
    // navigate('/order-success'); // Example
    navigate('/'); // For now, back to home
    // Potentially show a success toast
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={0} /> {/* Assuming cart count is handled globally or passed */}
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
              {/* Left Side: Address & Payment Forms */}
              <div className="lg:w-2/3 space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl><Input placeholder="CA" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl><Input placeholder="90210" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl><Input type="tel" placeholder="+1 555-123-4567" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="card" /></FormControl>
                                <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="cod" /></FormControl>
                                <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 mt-4 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl><Input placeholder="123" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                     {paymentMethod === 'paypal' && (
                        <p className="mt-4 pt-4 border-t text-sm text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Side: Order Summary */}
              <div className="lg:w-1/3">
                <Card className="shadow-lg sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order before placing it.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {/* Simple summary. In a real app, fetch cart items */}
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${(MOCK_ORDER_TOTAL - 5 - 2.99).toFixed(2)}</span> {/* Example breakdown */}
                    </div>
                     <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>$2.99</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Taxes</span>
                        <span>$5.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${MOCK_ORDER_TOTAL.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" size="lg" className="w-full">
                      Place Order
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </Form>
        </main>
      </ScrollArea>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order? Total amount: ${MOCK_ORDER_TOTAL.toFixed(2)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleOrderConfirmed}>Confirm & Place Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CheckoutPage;