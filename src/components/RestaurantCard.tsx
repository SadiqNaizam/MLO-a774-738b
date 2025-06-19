import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Bike } from 'lucide-react'; // Icons for rating, time, delivery fee

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  rating: number; // e.g., 4.5
  reviewCount?: number; // e.g., 500+ reviews
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  deliveryTime: string; // e.g., "25-35 min"
  deliveryFee?: string; // e.g., "Free" or "$2.99"
  // Could add a link prop or assume it's /restaurants/:id
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  reviewCount,
  cuisineTypes,
  deliveryTime,
  deliveryFee,
}) => {
  console.log("Rendering RestaurantCard:", name);

  return (
    <Link to={`/restaurants/${id}`} className="block group">
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="aspect-[16/9] bg-gray-100">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold truncate group-hover:text-orange-600">{name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span>{rating.toFixed(1)}</span>
            {reviewCount && <span className="ml-1">({reviewCount > 1000 ? `${(reviewCount/1000).toFixed(1)}k` : reviewCount} reviews)</span>}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {cuisineTypes.join(', ')}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>{deliveryTime}</span>
          </div>
          {deliveryFee && (
            <div className="flex items-center">
              <Bike className="h-4 w-4 mr-1 text-gray-400" />
              <span>{deliveryFee}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RestaurantCard;