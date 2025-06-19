import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';


interface SidebarProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  // Props for mobile sheet behavior if sidebar is part of a Sheet
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  title = "Filters",
  children,
  className = "",
  isOpen, // if used within a Sheet
  onClose, // if used within a Sheet
}) => {
  console.log("Rendering Sidebar, title:", title);

  const content = (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onClose && ( // Show close button only if onClose is provided (likely for mobile sheet)
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-4.5rem)]"> {/* Adjust height based on header */}
        <div className="p-4 space-y-6">
          {children ? children : <p className="text-gray-500">No filters available.</p>}
        </div>
      </ScrollArea>
    </>
  );

  // If isOpen and onClose are provided, assume it's for a mobile sheet integration.
  // Otherwise, render as a static sidebar for larger screens.
  // The parent component would handle the Sheet trigger and visibility for mobile.
  // This component provides the *content* for the sidebar.

  return (
    <aside className={`bg-white border-r ${className} md:block hidden w-72 lg:w-80 flex-shrink-0`}>
      {/* This is the desktop static sidebar */}
      {content}
    </aside>
    // For mobile, parent would use <Sheet><SheetTrigger>...</SheetTrigger><SheetContent><SidebarContentHere /></SheetContent></Sheet>
    // To make this component reusable for both, you might return only `content` and let parent wrap it.
    // Or, conditionally render the wrapping <aside> vs just returning content.
    // For simplicity now, assuming desktop static sidebar.
    // To make it truly responsive, one might pass a prop `isMobile` or handle Sheet logic outside.
  );
};

// You might also export a SidebarContent component for use within a ShadCN Sheet on mobile
export const SidebarContent: React.FC<Omit<SidebarProps, 'isOpen'>> = ({ title = "Filters", children, onClose }) => {
    console.log("Rendering SidebarContent for mobile sheet, title:", title);
    return (
        <div className="flex flex-col h-full">
             <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
                )}
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4 space-y-6">
                {children ? children : <p className="text-gray-500">No filters available.</p>}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <Button className="w-full" onClick={onClose}>Apply Filters</Button> {/* Example action */}
            </div>
        </div>
    );
}


export default Sidebar;