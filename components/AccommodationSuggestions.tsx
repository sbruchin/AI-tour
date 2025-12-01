
import React from 'react';
import { Accommodation } from '../types';
import AccommodationCard from './AccommodationCard';
import { translations } from '../translations';

interface AccommodationSuggestionsProps {
  accommodations: Accommodation[];
  destination: string;
  className?: string;
  title?: string;
  onSelectHotel?: (hotelName: string) => void;
  t: typeof translations.ja;
}

const AccommodationSuggestions: React.FC<AccommodationSuggestionsProps> = ({ 
  accommodations, 
  destination, 
  className = "", 
  title,
  onSelectHotel,
  t
}) => {
  return (
    <div className={className}>
      <h3 className="text-2xl font-bold text-slate-800 mb-4">
        {title || t.hotelSuggestion}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {accommodations.map((hotel, index) => (
          <AccommodationCard 
            key={index} 
            accommodation={hotel} 
            destination={destination} 
            onSelect={onSelectHotel}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

export default AccommodationSuggestions;
