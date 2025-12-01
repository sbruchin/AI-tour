
import React from 'react';
import { translations } from '../translations';

interface LoadingSpinnerProps {
    t: typeof translations.ja;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ t }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16">
        <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 mt-6">{t.loadingTitle}</h3>
        <p className="text-slate-500 mt-2 whitespace-pre-wrap">{t.loadingSubtitle}</p>
    </div>
  );
};

export default LoadingSpinner;
