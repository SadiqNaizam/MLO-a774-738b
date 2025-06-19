import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react'; // Icons

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string; // Optional image
  tags?: string[]; // e.g., "Spicy", "Vegetarian", "Popular"
  onAddToCart: (item: { id: string | number; name: string; price: number; quantity: number }) => void;
  // Optional: if quantity can be managed on the card itself
  quantityInCart?: number;
  onUpdateQuantity?: (itemId: string | number, newQuantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
  onAddToCart,
  quantityInCart = 0,
  onUpdateQuantity,
}) => {
  console.log("Rendering MenuItemCard:", name, "Qty in cart:", quantityInCart);

  const handlePrimaryAction = () => {
    if (quantityInCart > 0 && onUpdateQuantity) {
      onUpdateQuantity(id, quantityInCart + 1);
    } else {
      onAddToCart({ id, name, price, quantity: 1 });
    }
  };

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {imageUrl && (
        <div className="md:w-1/3 aspect-video md:aspect-auto flex-shrink-0 bg-gray-100">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <CardContent className="p-4 space-y-1 flex-grow">
          <CardTitle className="text-base md:text-lg font-semibold">{name}</CardTitle>
          {description && (
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 md:p-4 flex items-center justify-between bg-gray-50/30">
          <span className="text-base md:text-lg font-semibold text-orange-600">${price.toFixed(2)}</span>
          {onUpdateQuantity && quantityInCart > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(id, quantityInCart - 1)}
                aria-label="Decrease quantity"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-4 text-center">{quantityInCart}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(id, quantityInCart + 1)}
                aria-label="Increase quantity"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePrimaryAction}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;