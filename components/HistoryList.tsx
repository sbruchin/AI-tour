
import React from 'react';
import { HistoryItem, Language } from '../types';
import { translations } from '../translations';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  language: Language;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, language }) => {
  const t = translations[language];
  
  if (history.length === 0) return null;

  return (
    <div className="animate-fade-in w-full">
      <h3 className="text-lg font-bold text-slate-700 mb-4 px-2 border-l-4 border-blue-500 flex items-center sticky top-0 bg-transparent">
         <svg className="w-5 h-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
         {t.historyTitle}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 hover:scale-105 transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
                <div className="flex items-center text-xs text-slate-500 mb-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                        {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                </div>
                <div className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.inputs.destination}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <span className="truncate max-w-[80px]">{item.inputs.origin}</span>
                    <span>→</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                     <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                        {item.inputs.nights}{t.nightsSuffix}
                     </span>
                     {item.inputs.budget && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                            {item.inputs.budget}
                        </span>
                     )}
                </div>
            </div>
            <button className="w-full mt-2 text-xs font-bold text-blue-600 bg-blue-50 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                {t.historyRestore}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
