
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { translations } from '../translations';

interface SearchBarProps {
  t: typeof translations.ja;
  origin: string;
  setOrigin: (origin: string) => void;
  destination: string;
  setDestination: (destination: string) => void;
  nights: number;
  setNights: (nights: number) => void;
  departureTime: string;
  setDepartureTime: (time: string) => void;
  transportation: string;
  setTransportation: (transportation: string) => void;
  budget: string;
  setBudget: (budget: string) => void;
  wishlistPlaces: string;
  setWishlistPlaces: (places: string) => void;
  interests: string;
  setInterests: (interests: string) => void;
  isPackLight: boolean;
  setIsPackLight: (isPackLight: boolean) => void;
  onGenerate: () => void;
  onStop?: () => void;
  isLoading: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const RANDOM_DESTINATIONS = [
  "北海道", "札幌", "函館", "富良野", "仙台", "日光", "東京", "横浜", "鎌倉", "箱根", "熱海",
  "金沢", "白川郷", "名古屋", "伊勢", "京都", "大阪", "神戸", "奈良", "広島", "出雲",
  "福岡", "長崎", "別府", "湯布院", "熊本", "屋久島", "沖縄", "石垣島", "宮古島",
  "ソウル", "台北", "バンコク", "シンガポール", "バリ島", "セブ島", "ハワイ", "グアム",
  "パリ", "ロンドン", "ローマ", "フィレンツェ", "ベネチア", "バルセロナ", "ウィーン",
  "ニューヨーク", "ロサンゼルス", "ラスベガス", "バンクーバー", "シドニー", "メルボルン", "ドバイ"
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  t,
  origin, setOrigin,
  destination, setDestination, 
  nights, setNights,
  departureTime, setDepartureTime,
  transportation, setTransportation,
  budget, setBudget,
  wishlistPlaces, setWishlistPlaces,
  interests, setInterests,
  isPackLight, setIsPackLight,
  onGenerate, onStop, isLoading,
  isCollapsed = false,
  onToggleCollapse,
  startDate, setStartDate,
  endDate, setEndDate
}) => {
  
  // Double enter logic state
  const [enterPressCount, setEnterPressCount] = useState(0);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEnterHint, setShowEnterHint] = useState(false);

  // Date Change Handlers
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    
    // Automatically adjust end date if it's before new start date
    if (endDate && new Date(newStart) >= new Date(endDate)) {
       const d = new Date(newStart);
       d.setDate(d.getDate() + 1);
       setEndDate(d.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
  };
  
  // Calculate nights whenever start or end date changes
  useEffect(() => {
      if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          // Ensure at least 1 night
          setNights(diffDays > 0 ? diffDays : 1);
      }
  }, [startDate, endDate, setNights]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      if (enterPressCount === 0) {
          // First press
          setEnterPressCount(1);
          setShowEnterHint(true);
          
          // Clear previous timeout if exists
          if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);

          // Reset count after 2 seconds
          enterTimeoutRef.current = setTimeout(() => {
              setEnterPressCount(0);
              setShowEnterHint(false);
          }, 2000);
      } else {
          // Second press within time limit
          setEnterPressCount(0);
          setShowEnterHint(false);
          if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
          onGenerate();
      }
    } else {
        // Reset if other key pressed
        setEnterPressCount(0);
        setShowEnterHint(false);
    }
  };

  const handleRandomDestination = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_DESTINATIONS.length);
    setDestination(RANDOM_DESTINATIONS[randomIndex]);
  }, [setDestination]);

  const handleReset = useCallback(() => {
    setOrigin('');
    setDestination('');
    // Reset dates to tomorrow -> day after tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3); // Default 2 nights

    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(dayAfter.toISOString().split('T')[0]);
    setNights(2);

    setDepartureTime('');
    setTransportation('');
    setBudget('');
    setWishlistPlaces('');
    setInterests('');
    setIsPackLight(false);
  }, [setOrigin, setDestination, setStartDate, setEndDate, setNights, setDepartureTime, setTransportation, setBudget, setWishlistPlaces, setInterests, setIsPackLight]);

  // Transportation Dropdown State
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const transportRef = useRef<HTMLDivElement>(null);
  const [selectedTransports, setSelectedTransports] = useState<string[]>([]);
  const [otherTransportText, setOtherTransportText] = useState<string>('');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (transportRef.current && !transportRef.current.contains(event.target as Node)) {
        setIsTransportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset local state if parent clears transportation (e.g. new search context)
  useEffect(() => {
    if (transportation === '') {
        setSelectedTransports([]);
        setOtherTransportText('');
    }
  }, [transportation]);

  const updateTransportationString = (selected: string[], otherText: string) => {
    const normalOptions = selected.filter(opt => opt !== t.otherTransport);
    let result = normalOptions.join('・');
    if (selected.includes(t.otherTransport)) {
        const otherStr = otherText.trim() ? `${t.otherTransport}(${otherText.trim()})` : t.otherTransport;
        result = result ? `${result}・${otherStr}` : otherStr;
    }
    setTransportation(result);
  };

  const toggleTransport = (option: string) => {
    let newSelected;
    if (selectedTransports.includes(option)) {
        newSelected = selectedTransports.filter(item => item !== option);
    } else {
        newSelected = [...selectedTransports, option];
    }
    setSelectedTransports(newSelected);
    updateTransportationString(newSelected, otherTransportText);
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setOtherTransportText(text);
    updateTransportationString(selectedTransports, text);
  };
  
  const inputBaseClasses = "w-full h-12 pl-12 pr-4 text-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg placeholder-slate-400 transition";

  return (
    <div className="sticky top-4 z-20 bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 transition-all duration-300">
      {/* Header / Toggle Section */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggleCollapse}>
        <h2 className="text-lg font-bold text-slate-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isCollapsed ? t.searchTitleCollapsed : t.searchTitle}
        </h2>
        {onToggleCollapse && (
          <button className="text-slate-500 hover:text-blue-600 transition-colors p-1">
            <svg className={`w-6 h-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Origin Input */}
            <div className="relative w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12M6 12l5-5m-5 5l5 5" />
                </svg>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.origin} className={inputBaseClasses} disabled={isLoading} />
            </div>

            {/* Destination Input */}
            <div className="relative w-full z-20">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder={t.destination} 
                  className={`${inputBaseClasses} pr-12`} 
                  disabled={isLoading} 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
                  <button
                    type="button"
                    onClick={handleRandomDestination}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-50"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    </svg>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block z-50">
                     <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap relative">
                        {t.randomTooltip}
                        <div className="absolute bottom-full right-3 border-4 border-transparent border-b-slate-800"></div>
                     </div>
                  </div>
                </div>
            </div>

            {/* Departure Time Input */}
            <div className="relative w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input 
                  type="time" 
                  value={departureTime} 
                  onChange={(e) => setDepartureTime(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  className={inputBaseClasses} 
                  disabled={isLoading} 
                />
            </div>
            
            {/* Date Range Selection (Nights Calculation) */}
            <div className="flex gap-2 w-full">
                {/* Start Date */}
                <div className="relative w-1/2">
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={handleStartDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-12 pl-3 pr-2 text-sm sm:text-base bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg text-slate-700 transition" 
                      disabled={isLoading}
                      title={t.startDate}
                    />
                    <label className="absolute -top-1.5 left-2 bg-slate-100 px-1 text-[10px] text-slate-500 rounded">{t.startDate}</label>
                </div>
                
                {/* End Date */}
                 <div className="relative w-1/2">
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={handleEndDateChange}
                      min={startDate}
                      className="w-full h-12 pl-3 pr-2 text-sm sm:text-base bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg text-slate-700 transition" 
                      disabled={isLoading}
                      title={t.endDate}
                    />
                    <label className="absolute -top-1.5 left-2 bg-slate-100 px-1 text-[10px] text-slate-500 rounded">{t.endDate}</label>
                </div>
            </div>

            {/* Read-only Nights Display (for clarity) */}
            <div className="relative w-full flex items-center bg-slate-50 rounded-lg px-4 border border-slate-200 text-slate-500 select-none">
                 <svg className="h-5 w-5 text-slate-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-bold text-slate-800">{nights}</span>
                <span className="ml-1 text-sm">{t.nightsSuffix}</span>
            </div>

            {/* Transportation Input (Dropdown) */}
            <div className="relative w-full" ref={transportRef}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                 <div 
                    className={`${inputBaseClasses} flex items-center overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer select-none ${!transportation ? 'text-slate-400' : 'text-slate-800'}`}
                    onClick={() => !isLoading && setIsTransportOpen(!isTransportOpen)}
                >
                    {transportation || t.transportation}
                </div>
                
                {isTransportOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {t.transportOptions.map(option => (
                                <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedTransports.includes(option)}
                                        onChange={() => toggleTransport(option)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-sm text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                        {selectedTransports.includes(t.otherTransport) && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <input
                                    type="text"
                                    value={otherTransportText}
                                    onChange={handleOtherTextChange}
                                    placeholder={t.otherTransportPlaceholder}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                                    onClick={(e) => e.stopPropagation()} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            onGenerate();
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Budget Input */}
            <div className="relative w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.328zM11.567 9.182c.158.103.346.196.567.267V7.843a2.5 2.5 0 00-1.162.328v1.011z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.732-4.062c.312.083.624.12.918.12.264 0 .517-.026.756-.076v-1.684a3.5 3.5 0 00-1.456.322l-.218.087-.003.002-.002.002-.001.001a.5.5 0 01-.15.248l-.22.185-.01.008-.002.001zM10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8.567 6.843a3.5 3.5 0 00-1.456-.322l-.218-.087-.003-.002-.002-.002-.001-.001a.5.5 0 01.15-.248l.22-.185.01-.008.002-.001V4.076c-.24.05-.493.076-.756.076-.294 0-.606-.037-.918-.12C5.353 3.84 4.059 4.4 4.059 5.5v3c0 1.1 1.294 1.66 2.59 1.88V11.5c-.312-.083-.624-.12-.918-.12-.264 0-.517.026-.756.076v1.684a3.5 3.5 0 001.456-.322l.218-.087.003-.002.002-.002.001-.001a.5.5 0 01.15-.248l.22-.185.01-.008.002-.001z" clipRule="evenodd" />
                </svg>
                 <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.budget} className={inputBaseClasses} disabled={isLoading} />
            </div>

            {/* Interests Input */}
            <div className="relative w-full lg:col-span-1">
                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.interests} className={inputBaseClasses} disabled={isLoading} />
            </div>

            {/* Wishlist Input */}
            <div className="relative w-full lg:col-span-2">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <input type="text" value={wishlistPlaces} onChange={(e) => setWishlistPlaces(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.wishlist} className={inputBaseClasses} disabled={isLoading} />
                
                {/* Double Enter Hint */}
                {showEnterHint && (
                   <div className="absolute top-full left-0 mt-2 bg-slate-800 text-white text-xs px-3 py-1 rounded shadow-lg animate-bounce z-50">
                      {t.pressEnterAgain}
                      <div className="absolute bottom-full left-4 border-4 border-transparent border-b-slate-800"></div>
                   </div>
                )}
            </div>

            {/* Pack Light Toggle (New) */}
            <div className="relative w-full lg:col-span-3 flex items-center bg-slate-50 rounded-lg p-2 border border-slate-200">
               <label className="flex items-center cursor-pointer w-full group">
                  <div className="relative">
                     <input 
                        type="checkbox" 
                        checked={isPackLight} 
                        onChange={(e) => setIsPackLight(e.target.checked)} 
                        className="sr-only" 
                        disabled={isLoading}
                     />
                     <div className={`block w-14 h-8 rounded-full transition-colors ${isPackLight ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                     <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPackLight ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div className="ml-3">
                     <span className="text-slate-700 font-bold block">{t.packLight}</span>
                     <span className="text-slate-500 text-xs block">{t.packLightDesc}</span>
                  </div>
               </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            {!isLoading && (
                 <button 
                    onClick={handleReset}
                    className="px-6 h-12 rounded-lg text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 font-semibold transition-colors whitespace-nowrap"
                    title={t.reset}
                 >
                    {t.reset}
                 </button>
            )}
             {isLoading ? (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if(onStop) onStop();
                    }}
                    className="flex-1 h-12 px-8 flex items-center justify-center font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t.stopGeneration}
                </button>
             ) : (
                <button
                  onClick={onGenerate}
                  disabled={!origin || !destination}
                  className="flex-1 h-12 px-8 flex items-center justify-center font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {t.generateButton}
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
