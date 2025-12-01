
import React, { useState, useEffect } from 'react';
import { PackingTips } from '../types';
import { translations } from '../translations';

interface PackingListProps {
  tips: PackingTips;
  t: typeof translations.ja;
}

const PackingList: React.FC<PackingListProps> = ({ tips, t }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Reset checked items when the plan (tips) changes
  useEffect(() => {
    setCheckedItems({});
  }, [tips.preparations]);

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-12 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
             <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 15H5V8h14v10z"/>
          </svg>
       </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center relative z-10">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </span>
        {t.packingTitle}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Luggage Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t.luggageAdvice}
            </h4>
            <p className="text-sm text-slate-600 font-medium">{tips.luggageType}</p>
        </div>

        {/* Clothing Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t.clothingAdvice}
            </h4>
            <p className="text-sm text-slate-600 font-medium">{tips.clothing}</p>
        </div>

        {/* Essentials Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
             <h4 className="font-bold text-slate-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.essentialItems}
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
                {tips.essentials.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Amenities (Provided) Section */}
        {tips.amenitiesProvided && tips.amenitiesProvided.length > 0 && (
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.amenitiesProvided}
                </h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                    {tips.amenitiesProvided.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="mr-2 opacity-60">•</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>

      {/* Preparations / To-Do List Section */}
      {tips.preparations && tips.preparations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center text-lg">
                <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {t.preparationTitle}
            </h4>
            <div className="bg-slate-50/80 rounded-lg p-1">
                {tips.preparations.map((prep, idx) => (
                    <label key={idx} className="flex items-center p-3 hover:bg-white rounded-md transition-colors cursor-pointer border-b border-slate-100 last:border-0 group select-none">
                        <input 
                            type="checkbox" 
                            checked={!!checkedItems[idx]}
                            onChange={() => toggleCheck(idx)}
                            className="w-5 h-5 text-rose-500 rounded border-slate-300 focus:ring-rose-500 mr-3 cursor-pointer" 
                        />
                        <span className={`text-slate-700 group-hover:text-slate-900 transition-all ${checkedItems[idx] ? 'line-through opacity-50' : ''}`}>
                            {prep}
                        </span>
                    </label>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default PackingList;
