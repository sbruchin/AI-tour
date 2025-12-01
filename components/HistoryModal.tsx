
import React from 'react';
import { HistoryItem, Language } from '../types';
import HistoryList from './HistoryList';
import { translations } from '../translations';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  language: Language;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, language }) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-5xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100" 
        onClick={e => e.stopPropagation()}
      >
         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <h3 className="text-xl font-bold text-slate-700 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.historyTitle}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
         </div>
         <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
            {history.length > 0 ? (
                 <HistoryList history={history} onSelect={(item) => { onSelect(item); onClose(); }} language={language} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                     <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <p className="text-lg">No history yet.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default HistoryModal;
