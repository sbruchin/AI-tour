
import React from 'react';
import { TravelPlan as TravelPlanType, Language } from '../types';
import LocationCard from './LocationCard';
import AccommodationSuggestions from './AccommodationSuggestions';
import PackingList from './PackingList';
import { translations } from '../translations';

interface TravelPlanProps {
  plan: TravelPlanType;
  images: Record<string, string>;
  onLikeToggle?: (dayIndex: number, activityIndex: number) => void;
  onRegenerate?: () => void;
  onSelectHotel?: (hotelName: string) => void;
  t: typeof translations.ja;
  language?: Language;
  startDate?: string;
}

const TravelPlan: React.FC<TravelPlanProps> = ({ plan, images, onLikeToggle, onRegenerate, onSelectHotel, t, language = 'ja', startDate }) => {
  const hasLikes = plan.plan.some(day => day.activities.some(act => act.isLiked));

  const getFormattedDate = (dayOffset: number) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    
    // Check if valid date
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString(language, { 
        month: 'short', 
        day: 'numeric', 
        weekday: 'short' 
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="inline-block px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                    {plan.transportationMode || t.planTitle}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
                  {plan.origin} -> {plan.destination}
                </h2>
            </div>
            <div className="text-right">
                <p className="text-lg text-slate-600">{plan.durationInDays} {t.duration}</p>
                {plan.totalEstimatedCost && (
                    <p className="text-xl font-bold text-emerald-600 mt-1">
                        {t.totalBudget}: {plan.totalEstimatedCost}
                    </p>
                )}
            </div>
        </div>
      </div>
      
      {plan.mainTransportationDetails && (
        <div className="mb-10 bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.transportHeader}
          </h3>
          <p className="text-slate-600">{plan.mainTransportationDetails}</p>
        </div>
      )}

      {plan.plan.map((dailyPlan, dayIndex) => {
        // 宿泊が発生するかどうかを判定（最終日以外は宿泊とみなす）
        const isStayNight = dailyPlan.day < plan.durationInDays;
        
        // Calculate date string
        const dateString = getFormattedDate(dailyPlan.day - 1);

        return (
          <div key={dailyPlan.day} className="mb-12">
            <div className="sticky top-24 z-10 bg-white/95 backdrop-blur py-4 border-b border-slate-100 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {dailyPlan.day}
                      </div>
                      <div>
                          <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                              {dailyPlan.day}{t.day}
                              {dateString && <span className="ml-2 text-slate-500 font-medium text-lg">({dateString})</span>}
                              ：{dailyPlan.theme}
                          </h3>
                      </div>
                    </div>
                    {dailyPlan.dailyEstimatedCost && (
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500">{t.dayBudget}</p>
                            <p className="text-md font-bold text-slate-700">{dailyPlan.dailyEstimatedCost}</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-6 border-l-2 border-blue-100 ml-5 pl-8 pb-4 relative">
              {dailyPlan.activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="relative group">
                  {/* 前の場所からの移動手段・時間をタイムライン上に表示 */}
                  {(activity.transportDetails || activity.travelDuration) && (
                    <div className="mb-6 -ml-2">
                        <div className="flex items-start">
                             {/* Timeline Connector Dot */}
                             <div className="absolute -left-[39px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-200 border-2 border-white"></div>
                             
                             <div className="bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm w-full transition-colors">
                                
                                {/* Detailed Departure Information */}
                                {activity.transportDepartureTime && (
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                                        <div className="flex items-center font-bold text-slate-800">
                                            <span className="text-lg mr-2 font-mono">{activity.transportDepartureTime}</span>
                                            <span>{activity.transportDepartureStation || 'Origin'}</span>
                                            <span className="ml-1 text-xs text-slate-500 font-normal bg-slate-200 px-1 rounded">{t.departure}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Transport Method Details */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                                        <div className="flex items-center">
                                          <svg className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                          </svg>
                                          <span className="font-bold text-slate-700 mr-2">{activity.transportDetails}</span>
                                        </div>
                                        {activity.transportDirection && (
                                          <span className="text-xs text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-full sm:ml-1 mt-1 sm:mt-0 self-start sm:self-auto">
                                            {activity.transportDirection}
                                          </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-7 sm:ml-0">
                                        {activity.travelDuration && (
                                            <span className="bg-white px-2 py-1 rounded border border-slate-200 font-bold text-slate-800 text-xs whitespace-nowrap">
                                            ⏱ {activity.travelDuration}
                                            </span>
                                        )}
                                        {activity.transportationCost && (
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 text-xs font-bold whitespace-nowrap">
                                            {activity.transportationCost}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Detailed Arrival Information */}
                                {activity.transportArrivalTime && (
                                    <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2">
                                         <div className="flex items-center font-bold text-slate-800">
                                            <span className="text-lg mr-2 font-mono">{activity.transportArrivalTime}</span>
                                            <span>{activity.transportArrivalStation || 'Dest'}</span>
                                            <span className="ml-1 text-xs text-slate-500 font-normal bg-slate-200 px-1 rounded">{t.arrival}</span>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                  )}

                  <div className="relative">
                     {/* 滞在時間を表示 */}
                     {activity.activityDuration && (
                        <div className="absolute -top-3 left-4 z-20">
                            <span className="bg-white text-slate-600 border border-slate-200 text-xs px-2 py-0.5 rounded-full shadow-sm flex items-center font-medium">
                                <svg className="w-3 h-3 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.stay}: {activity.activityDuration}
                            </span>
                        </div>
                     )}
                     <LocationCard 
                        activity={activity} 
                        image={images[activity.placeName]} 
                        destination={plan.destination}
                        onLikeToggle={onLikeToggle ? () => onLikeToggle(dayIndex, activityIndex) : undefined}
                        t={t}
                      />
                  </div>
                </div>
              ))}

              {/* 宿泊がある日の最後に宿泊先候補を表示 */}
              {isStayNight && plan.accommodations && plan.accommodations.length > 0 && (
                <div className="mt-12 pt-6 relative">
                  <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10"></div>
                  <AccommodationSuggestions 
                    accommodations={plan.accommodations} 
                    destination={plan.destination}
                    title={`🌙 ${dailyPlan.day}${t.day}${t.hotelSuggestion} (${plan.destination})`}
                    className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100"
                    onSelectHotel={onSelectHotel}
                    t={t}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Packing Suggestions */}
      {plan.packingTips && (
          <PackingList tips={plan.packingTips} t={t} />
      )}
      
      {/* プラン再生成ボタン */}
      {onRegenerate && (
        <div className="mt-12 mb-20 text-center">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {hasLikes 
                        ? t.regenerateTitle
                        : t.regenerateTitleNoLikes
                    }
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                    {hasLikes
                        ? t.regenerateDesc
                        : t.regenerateDescNoLikes
                    }
                </p>
                <button
                    onClick={onRegenerate}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {hasLikes ? t.regenerateButton : t.regenerateButtonNoLikes}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TravelPlan;