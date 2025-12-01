
import React, { useState } from 'react';
import { Activity } from '../types';
import { translations } from '../translations';

interface LocationCardProps {
  activity: Activity;
  image: string | undefined;
  destination: string;
  onLikeToggle?: () => void;
  t: typeof translations.ja;
}

const LocationCard: React.FC<LocationCardProps> = ({ activity, image, destination, onLikeToggle, t }) => {
  const [showMap, setShowMap] = useState(false);
  
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activity.placeName + ', ' + destination)}&output=embed&z=17&t=k`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName + ', ' + destination)}`;
  const detailsUrl = `https://www.google.com/search?q=${encodeURIComponent(activity.placeName + ' ' + destination + ' official')}`;

  return (
    <div className="relative transform transition-transform duration-300 hover:scale-[1.02]">
        <div className="absolute -left-[49px] top-6 z-10 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row border border-slate-200 relative">
          
          {onLikeToggle && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onLikeToggle();
                }}
                className="absolute top-2 right-2 z-20 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all group"
                title="Like"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 transition-colors duration-300 ${activity.isLiked ? 'text-pink-500 fill-pink-500' : 'text-slate-400 group-hover:text-pink-400'}`}
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={activity.isLiked ? 0 : 2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
          )}

          <div className="md:w-1/3 h-56 md:h-auto">
            {image ? (
              <img src={image} alt={activity.placeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-6 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1 pr-8">
                <p className="text-lg font-bold text-blue-600">{activity.time}</p>
                {activity.estimatedCost && (
                  <p className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                    {activity.estimatedCost}
                  </p>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{activity.placeName}</h4>
              <p className="text-slate-600 leading-relaxed mb-4">{activity.description}</p>

              {activity.suggestedRestaurants && activity.suggestedRestaurants.length > 0 && (
                <div className="mb-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold text-orange-800">{t.restaurantSuggestion}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activity.suggestedRestaurants.map((restaurant, idx) => (
                      <a 
                        key={idx}
                        href={`https://www.google.com/search?q=${encodeURIComponent(restaurant + ' ' + destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-white text-orange-700 border border-orange-200 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors"
                      >
                        {restaurant}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-4">
               <div className="flex flex-wrap items-center gap-3">
                 <button
                  onClick={() => setShowMap(!showMap)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {showMap ? t.mapHide : t.mapShow}
                </button>
                
                <a
                  href={detailsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.officialSite}
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors ml-auto"
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t.googleMap}
                </a>
              </div>
               {showMap && (
                 <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 transition-all duration-500 ease-in-out">
                    <iframe
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedMapUrl}
                    ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default LocationCard;
