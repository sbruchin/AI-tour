
import React from 'react';
import { translations } from '../translations';

interface LoadingSpinnerProps {
    t: typeof translations.ja;
    progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ t, progress = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 px-4">
        <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 mt-6">{t.loadingTitle}</h3>
        <p className="text-slate-500 mt-2 whitespace-pre-wrap">{t.loadingSubtitle}</p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md mt-6">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${Math.round(progress)}%` }}
                ></div>
            </div>
        </div>
    </div>
  );
};

export default LoadingSpinner;
