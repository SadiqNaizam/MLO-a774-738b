import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Using shadcn Card for item consistency
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CarouselSlide {
  id: string | number;
  content: React.ReactNode; // Allow any valid React node as slide content
  altText?: string; // For accessibility if content is an image
}

interface CarouselProps {
  slides: CarouselSlide[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayDelay?: number;
}

const Carousel: React.FC<CarouselProps> = ({ slides, options, autoplayDelay = 4000 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', ...options },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
  );

  console.log("Rendering Carousel with", slides.length, "slides.");

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!slides || slides.length === 0) {
    return <div className="text-center py-8">No items to display in carousel.</div>;
  }

  return (
    <div className="relative w-full group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div className="flex-[0_0_100%] min-w-0" key={slide.id}>
              {/* Assuming slide.content is already structured, otherwise wrap in Card */}
              {/* For example, if slide.content is just an image URL: */}
              {/* <Card className="m-1"> <CardContent className="p-0 aspect-[16/7] flex items-center justify-center"> <img src={slide.content as string} alt={slide.altText || `Slide ${slide.id}`} className="w-full h-full object-cover" /> </CardContent> </Card> */}
              {/* If slide.content is a complex ReactNode, it might already include its own Card or styling */}
              <div className="p-1">{slide.content}</div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default Carousel;