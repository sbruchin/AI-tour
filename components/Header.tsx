
import React from 'react';
import { translations } from '../translations';

interface HeaderProps {
    t: typeof translations.ja;
    onShowHistory: () => void;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ t, onShowHistory, onBack }) => {
  return (
    <header className="relative text-center mb-8">
      {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100/80 backdrop-blur-sm"
            title={t.backToTop}
          >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             </svg>
          </button>
      )}

      <button 
        onClick={onShowHistory}
        className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100/80 backdrop-blur-sm"
        title={t.viewHistory}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 pt-2 sm:pt-0">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
          {t.appTitle}
        </span>
      </h1>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        {t.appSubtitle}
      </p>
    </header>
  );
};

export default Header;
