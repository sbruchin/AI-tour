
import React, { useState } from 'react';
import { translations } from '../translations';

interface LandingPageProps {
  onStart: () => void;
  onLanguageSelect: (lang: string) => void;
  t: typeof translations.ja;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLanguageSelect, t }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [mode, setMode] = useState<'language' | 'tutorial'>('language');

  const tutorialContent = {
    1: {
        title: t.step1Title,
        desc: t.step1BubbleDesc,
        label: t.step1ExampleLabel,
        example: t.step1Example
    },
    2: {
        title: t.step2Title,
        desc: t.step2BubbleDesc,
        label: t.step2ExampleLabel,
        example: t.step2Example
    },
    3: {
        title: t.step3Title,
        desc: t.step3BubbleDesc,
        label: t.step3ExampleLabel,
        example: t.step3Example
    }
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const closeBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep(null);
  };

  const handleLanguageClick = (lang: string) => {
      onLanguageSelect(lang);
      setMode('tutorial');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Visual Mockups for Tutorials ---
  
  const Step1Visual = () => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 w-full max-w-[280px] mx-auto transform scale-100 origin-top">
      <div className="flex items-center justify-between mb-2">
        <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-4 w-4 text-slate-400">
           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
             <div className="h-8 bg-slate-100 rounded border border-slate-200 flex items-center px-2 text-xs text-slate-500">Tokyo</div>
        </div>
        <div className="relative">
             <div className="h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-between px-2 text-xs text-slate-500">
                <span>Kyoto</span>
                <span className="text-rose-500 bg-rose-50 rounded-full p-0.5">🎯</span>
             </div>
        </div>
        <div className="flex gap-2">
            <div className="h-8 w-1/2 bg-slate-100 rounded border border-slate-200 flex items-center px-2 text-xs text-slate-500">2 nights</div>
            <div className="h-8 w-1/2 bg-slate-100 rounded border border-slate-200 flex items-center px-2 text-xs text-slate-500">Train</div>
        </div>
        <div className="h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mt-2 shadow-md">
            {t.generateButton}
        </div>
      </div>
    </div>
  );

  const Step2Visual = () => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 w-full max-w-[280px] mx-auto overflow-hidden">
       {/* Timeline Item 1 */}
       <div className="flex gap-2 mb-3 relative">
          <div className="flex flex-col items-center">
             <div className="w-6 h-6 bg-blue-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold z-10">1</div>
             <div className="w-0.5 h-full bg-blue-100 absolute top-6"></div>
          </div>
          <div className="flex-1">
             <div className="h-3 w-20 bg-slate-200 rounded mb-1"></div>
             {/* Card */}
             <div className="border border-slate-200 rounded bg-white p-2 shadow-sm flex gap-2">
                 <div className="w-10 h-10 bg-slate-300 rounded flex-shrink-0"></div>
                 <div className="flex-1 space-y-1">
                     <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                     <div className="h-2 w-full bg-slate-100 rounded"></div>
                 </div>
             </div>
          </div>
       </div>
       {/* Transport */}
       <div className="flex gap-2 mb-3 relative">
           <div className="w-6 flex justify-center"><div className="w-0.5 h-full bg-blue-100"></div></div>
           <div className="flex-1">
               <div className="bg-slate-50 border border-slate-200 rounded p-1.5 flex items-center gap-2">
                   <div className="w-3 h-3 text-blue-500"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4" /></svg></div>
                   <div className="h-1.5 w-16 bg-slate-300 rounded"></div>
                   <div className="h-3 w-10 bg-white border border-slate-200 rounded ml-auto"></div>
               </div>
           </div>
       </div>
        {/* Timeline Item 2 */}
       <div className="flex gap-2">
          <div className="flex flex-col items-center">
             <div className="w-3 h-3 bg-blue-200 border-2 border-white rounded-full z-10"></div>
          </div>
          <div className="flex-1">
             {/* Card */}
             <div className="border border-slate-200 rounded bg-white p-2 shadow-sm flex gap-2">
                 <div className="w-10 h-10 bg-orange-100 rounded flex-shrink-0 flex items-center justify-center text-[10px]">🍜</div>
                 <div className="flex-1 space-y-1">
                     <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                     <div className="flex gap-1">
                        <div className="h-3 w-8 bg-orange-50 border border-orange-100 rounded-full"></div>
                        <div className="h-3 w-8 bg-orange-50 border border-orange-100 rounded-full"></div>
                     </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const Step3Visual = () => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 w-full max-w-[280px] mx-auto">
       <div className="relative border-2 border-pink-100 rounded-lg bg-white p-2 shadow-sm mb-4">
           {/* Like Button Highlight */}
           <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-pink-100">
               <svg className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
           </div>
           <div className="flex gap-2 opacity-50">
               <div className="w-12 h-12 bg-slate-300 rounded flex-shrink-0"></div>
               <div className="flex-1 space-y-1">
                   <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                   <div className="h-2 w-full bg-slate-100 rounded"></div>
               </div>
           </div>
       </div>
       
       <div className="text-center pt-2 border-t border-slate-100">
           <div className="text-[10px] text-slate-400 mb-1">Scroll to bottom</div>
           <div className="h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {t.regenerateButton}
           </div>
       </div>
    </div>
  );

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop")' }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      {/* Home Button (Only in Tutorial Mode) */}
      {mode === 'tutorial' && (
          <button 
            onClick={() => setMode('language')}
            className="absolute left-4 top-4 sm:left-8 sm:top-8 z-20 p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-white/50 backdrop-blur-md"
            title={t.backToTop}
          >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             </svg>
          </button>
      )}

      <div className="max-w-4xl w-full space-y-12 animate-fade-in relative z-10">
        
        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
              {t.appTitle}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-700 font-medium">
            {t.appSubtitle}
          </p>
        </div>

        {/* STEP 1: Language Selection */}
        {mode === 'language' && (
            <div className="space-y-8 text-center animate-fade-in">
                <p className="text-slate-600 font-bold bg-white/50 inline-block px-6 py-2 rounded-full text-lg">{t.selectLang}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {/* Japanese */}
                    <button 
                        onClick={() => handleLanguageClick('ja')}
                        className="group relative px-8 py-6 bg-white/95 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 w-full sm:w-64 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-3xl mr-3">🇯🇵</span>
                            <div className="text-left">
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-blue-600">日本語</span>
                                <span className="block text-sm text-slate-500">Japanese</span>
                            </div>
                        </div>
                    </button>
                    
                    {/* English */}
                    <button 
                        onClick={() => handleLanguageClick('en')}
                        className="group relative px-8 py-6 bg-white/95 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 w-full sm:w-64 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-3xl mr-3">🇺🇸</span>
                            <div className="text-left">
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-blue-600">English</span>
                            </div>
                        </div>
                    </button>

                    {/* Korean */}
                    <button 
                        onClick={() => handleLanguageClick('ko')}
                        className="group relative px-8 py-6 bg-white/95 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 w-full sm:w-64 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-3xl mr-3">🇰🇷</span>
                            <div className="text-left">
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-blue-600">한국어</span>
                            </div>
                        </div>
                    </button>

                    {/* French */}
                    <button 
                        onClick={() => handleLanguageClick('fr')}
                        className="group relative px-8 py-6 bg-white/95 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 w-full sm:w-64 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-3xl mr-3">🇫🇷</span>
                            <div className="text-left">
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-blue-600">Français</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        )}

        {/* STEP 2: Tutorial & Start */}
        {mode === 'tutorial' && (
            <div className="animate-fade-in space-y-12">
                {/* Instructions Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Step 1 */}
                <div 
                    onClick={() => handleStepClick(1)}
                    className="bg-white/90 p-6 rounded-2xl border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 text-center group backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">1. {t.inputCondition}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                    {t.inputConditionDesc}<br/>{t.randomDest}
                    </p>
                </div>

                {/* Step 2 */}
                <div 
                    onClick={() => handleStepClick(2)}
                    className="bg-white/90 p-6 rounded-2xl border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 text-center group backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                >
                    <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">2. {t.generatePlan}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                    {t.generatePlanDesc}
                    </p>
                </div>

                {/* Step 3 */}
                <div 
                    onClick={() => handleStepClick(3)}
                    className="bg-white/90 p-6 rounded-2xl border border-white/50 shadow-md hover:shadow-xl transition-all duration-300 text-center group backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                >
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">3. {t.customize}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                    {t.customizeDesc}
                    </p>
                </div>
                </div>

                {/* AI Assistant Callout */}
                <div className="bg-gradient-to-r from-blue-100/90 to-indigo-100/90 border border-blue-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg backdrop-blur-sm">
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center justify-center md:justify-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            {t.trouble}
                        </h3>
                        <p className="text-blue-800 font-medium">
                            {t.troubleDesc}
                        </p>
                    </div>
                </div>

                {/* START BUTTON */}
                <div className="text-center pt-4">
                    <button 
                        onClick={onStart}
                        className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-subtle"
                    >
                        {t.startApp}
                        <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        )}

        {/* Tutorial Bubble Modal */}
        {activeStep && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeBubble}>
                <div 
                    className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative transform scale-100 animate-bounce-in flex flex-col md:flex-row gap-8" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={closeBubble}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 z-20"
                    >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left Side: Text Content */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-extrabold text-blue-600 mb-4 border-b pb-2 border-slate-100">
                            {tutorialContent[activeStep as 1|2|3].title}
                        </h3>
                        
                        <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                            {tutorialContent[activeStep as 1|2|3].desc}
                        </p>
                        
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                {tutorialContent[activeStep as 1|2|3].label}
                            </span>
                            <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm font-medium">
                                {tutorialContent[activeStep as 1|2|3].example}
                            </pre>
                        </div>
                    </div>

                    {/* Right Side: Visual Mockup */}
                    <div className="flex-1 flex flex-col justify-center items-center bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Screen Preview</div>
                        {activeStep === 1 && <Step1Visual />}
                        {activeStep === 2 && <Step2Visual />}
                        {activeStep === 3 && <Step3Visual />}
                    </div>

                    {/* Mobile Only Close Button (if needed for better UX on small screens) */}
                    <div className="md:hidden text-center mt-2">
                         <button 
                            onClick={closeBubble}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md w-full"
                        >
                            {t.close}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default LandingPage;
