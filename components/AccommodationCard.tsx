
import React from 'react';
import { Accommodation } from '../types';
import { translations } from '../translations';

interface AccommodationCardProps {
  accommodation: Accommodation;
  destination: string;
  onSelect?: (hotelName: string) => void;
  t: typeof translations.ja;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, destination, onSelect, t }) => {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(accommodation.name + ' ' + destination)}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-slate-200 transform transition-transform duration-300 hover:scale-105 h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h4 className="text-xl font-bold text-slate-900 mb-2">{accommodation.name}</h4>
          <p className="text-emerald-600 font-semibold mb-3">{accommodation.estimatedPrice}</p>
          <p className="text-slate-600 leading-relaxed mb-4">{accommodation.description}</p>
        </div>
        <div className="mt-auto pt-4 space-y-3">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            {t.viewOnSite}
            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {onSelect && (
            <button
                onClick={() => onSelect(accommodation.name)}
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors shadow-sm"
            >
                {t.selectHotel}
                <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
