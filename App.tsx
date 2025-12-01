
import React, { useState, useRef, useEffect } from 'react';
import { generateTravelPlan, generateImageForPlace, regenerateTravelPlan } from './services/geminiService';
import { TravelPlan as TravelPlanType, Language, HistoryItem } from './types';
import { translations } from './translations';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TravelPlan from './components/TravelPlan';
import LoadingSpinner from './components/LoadingSpinner';
import ChatWidget from './components/ChatWidget';
import LandingPage from './components/LandingPage';
import HistoryModal from './components/HistoryModal';

const App: React.FC = () => {
  // Application Flow State
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('ja');

  // Load translations for current language
  const t = translations[language];

  // Helper to get tomorrow's date string
  const getTomorrow = () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
  };

  // Helper to get date after N days
  const getDateAfterDays = (startDateStr: string, days: number) => {
     const date = new Date(startDateStr);
     date.setDate(date.getDate() + days);
     return date.toISOString().split('T')[0];
  };

  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [nights, setNights] = useState<number>(2);
  const [departureTime, setDepartureTime] = useState<string>('');
  
  // Date State
  const [startDate, setStartDate] = useState<string>(getTomorrow());
  const [endDate, setEndDate] = useState<string>(getDateAfterDays(getTomorrow(), 2));

  const [transportation, setTransportation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [wishlistPlaces, setWishlistPlaces] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [isPackLight, setIsPackLight] = useState<boolean>(false);
  
  const [travelPlans, setTravelPlans] = useState<TravelPlanType[] | null>(null);
  const [activePlanIndex, setActivePlanIndex] = useState<number>(0);
  
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0-100
  const [error, setError] = useState<string | null>(null);

  const [isSearchCollapsed, setIsSearchCollapsed] = useState<boolean>(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Abort Control
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load History from LocalStorage
  useEffect(() => {
    try {
        const savedHistory = localStorage.getItem('aiTourHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    } catch (e) {
        console.error("Failed to load history", e);
    }
  }, []);

  // Save History to LocalStorage
  useEffect(() => {
    try {
        localStorage.setItem('aiTourHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history", e);
    }
  }, [history]);

  const fetchImagesForPlans = async (plans: TravelPlanType[], existingImages: Record<string, string>) => {
    const allImageQueries = new Set<string>();
    const uniqueActivities: { placeName: string, imageQuery: string }[] = [];

    Object.keys(existingImages).forEach(key => allImageQueries.add(key));

    plans.forEach(plan => {
        if (!plan.plan) return;
        plan.plan.forEach(day => {
            if (!day.activities) return;
            day.activities.forEach(activity => {
                if (!allImageQueries.has(activity.placeName)) {
                    allImageQueries.add(activity.placeName);
                    uniqueActivities.push({
                        placeName: activity.placeName,
                        imageQuery: activity.imageQuery
                    });
                }
            });
        });
    });

    if (uniqueActivities.length === 0) return existingImages;

    // Process in small batches with larger delay to avoid 429 Rate Limit and ensure reliability
    const BATCH_SIZE = 2; // Reduced size for stability

    for (let i = 0; i < uniqueActivities.length; i += BATCH_SIZE) {
        // Stop if user cancelled
        if (abortControllerRef.current?.signal.aborted) break;

        const batch = uniqueActivities.slice(i, i + BATCH_SIZE);
        const promises = batch.map(activity =>
            generateImageForPlace(activity.imageQuery).then(imageData => ({
                key: activity.placeName,
                imageData
            }))
        );

        // Using Promise.all instead of allSettled for better compatibility
        // generateImageForPlace catches errors internally and returns undefined, so this is safe
        const results = await Promise.all(promises);
        let hasUpdates = false;
        const newImages: Record<string, string> = {};

        results.forEach(result => {
            if (result.imageData) {
                newImages[result.key] = result.imageData;
                hasUpdates = true;
            }
        });

        if (hasUpdates) {
            setGeneratedImages(prev => ({ ...prev, ...newImages }));
        }

        // Increased delay between batches to prevent resource exhaustion
        if (i + BATCH_SIZE < uniqueActivities.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
  };

  const startProgressSimulator = () => {
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    // Simulate progress up to 95% (leaving the last 5% for actual completion)
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        
        // Use a decelerating curve: moves fast initially, then slows down
        // Calculate remaining distance to 95
        const remaining = 95 - prev;
        // Move a fraction of the remaining distance, but ensure minimum speed
        const increment = Math.max(0.1, remaining * 0.05);
        
        return prev + increment;
      });
    }, 100); // Update every 100ms for smoothness
  };

  const stopProgressSimulator = () => {
      if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
      }
  };

  const handleGenerate = async () => {
     if (!origin || !destination) return;
     
     setIsLoading(true);
     startProgressSimulator();
     setError(null);
     setTravelPlans(null);
     setGeneratedImages({});
     setIsSearchCollapsed(true);
     setActivePlanIndex(0);

     // Setup AbortController
     if (abortControllerRef.current) {
         abortControllerRef.current.abort();
     }
     abortControllerRef.current = new AbortController();

     try {
         const plans = await generateTravelPlan(
             origin, destination, nights, transportation, budget, wishlistPlaces, departureTime, interests, language, isPackLight, startDate
         );

         if (abortControllerRef.current.signal.aborted) return;
         
         // Stop simulator and force to 100%
         stopProgressSimulator();
         setProgress(100);

         // Crucial: Wait a bit to let the user see 100% completion before switching
         await new Promise(resolve => setTimeout(resolve, 800));

         setTravelPlans(plans);
         
         // Add to history
         const newHistoryItem: HistoryItem = {
             id: Date.now().toString(),
             timestamp: Date.now(),
             inputs: {
                 origin, destination, nights, budget, transportation, departureTime, wishlistPlaces, interests, isPackLight, startDate
             },
             plans
         };
         setHistory(prev => [newHistoryItem, ...prev].slice(0, 50)); // Keep last 50

         // Start fetching images in background
         fetchImagesForPlans(plans, {});

     } catch (err) {
         if (abortControllerRef.current.signal.aborted) return;
         setError(t.chatError); // Using general error message
         setIsSearchCollapsed(false);
         stopProgressSimulator();
     } finally {
         if (!abortControllerRef.current.signal.aborted) {
             setIsLoading(false);
             stopProgressSimulator();
         }
     }
  };

  const handleStop = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setIsLoading(false);
          stopProgressSimulator();
          setError("Generation stopped by user.");
      }
  };

  const handleLikeToggle = (dayIndex: number, activityIndex: number) => {
      if (!travelPlans) return;
      
      const updatedPlans = [...travelPlans];
      const currentPlan = updatedPlans[activePlanIndex];
      
      if (currentPlan.plan[dayIndex] && currentPlan.plan[dayIndex].activities[activityIndex]) {
          const activity = currentPlan.plan[dayIndex].activities[activityIndex];
          activity.isLiked = !activity.isLiked;
          setTravelPlans(updatedPlans);
      }
  };

  const handleRegenerate = async () => {
      if (!travelPlans) return;
      const currentPlan = travelPlans[activePlanIndex];
      
      setIsLoading(true);
      startProgressSimulator();
      
       // Setup AbortController
      if (abortControllerRef.current) {
         abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
          // Collect liked places
          const likedPlaces: string[] = [];
          currentPlan.plan.forEach(day => {
              day.activities.forEach(act => {
                  if (act.isLiked) {
                      likedPlaces.push(act.placeName + " (" + act.time + ")");
                  }
              });
          });

          const newPlan = await regenerateTravelPlan(currentPlan, likedPlaces, wishlistPlaces, interests, language);
          
          if (abortControllerRef.current.signal.aborted) return;
          
          // Stop simulator and force to 100%
          stopProgressSimulator();
          setProgress(100);

          // Wait for user to see 100%
          await new Promise(resolve => setTimeout(resolve, 800));

          const updatedPlans = [...travelPlans];
          updatedPlans[activePlanIndex] = newPlan;
          setTravelPlans(updatedPlans);
          
          // Fetch images for new places
          fetchImagesForPlans([newPlan], generatedImages);

      } catch (e) {
          console.error(e);
          setError(t.chatError);
          stopProgressSimulator();
      } finally {
          if (!abortControllerRef.current.signal.aborted) {
             setIsLoading(false);
             stopProgressSimulator();
         }
      }
  };
  
  const handleHotelSelect = async (hotelName: string) => {
      if (!travelPlans) return;
      const currentPlan = travelPlans[activePlanIndex];
      
      setIsLoading(true);
      startProgressSimulator();

       try {
          // Collect liked places
          const likedPlaces: string[] = [];
          currentPlan.plan.forEach(day => {
              day.activities.forEach(act => {
                  if (act.isLiked) {
                      likedPlaces.push(act.placeName + " (" + act.time + ")");
                  }
              });
          });

          const newPlan = await regenerateTravelPlan(currentPlan, likedPlaces, wishlistPlaces, interests, language, hotelName);
          
          // Stop simulator and force to 100%
          stopProgressSimulator();
          setProgress(100);

          // Wait for user to see 100%
          await new Promise(resolve => setTimeout(resolve, 800));

          const updatedPlans = [...travelPlans];
          updatedPlans[activePlanIndex] = newPlan;
          setTravelPlans(updatedPlans);
          
          // Fetch images for new places
          fetchImagesForPlans([newPlan], generatedImages);

      } catch (e) {
          console.error(e);
          setError(t.chatError);
          stopProgressSimulator();
      } finally {
         setIsLoading(false);
         stopProgressSimulator();
      }
  };

  const handleHistoryRestore = (item: HistoryItem) => {
      setOrigin(item.inputs.origin);
      setDestination(item.inputs.destination);
      setNights(item.inputs.nights);
      setBudget(item.inputs.budget);
      setTransportation(item.inputs.transportation);
      setDepartureTime(item.inputs.departureTime);
      setWishlistPlaces(item.inputs.wishlistPlaces);
      setInterests(item.inputs.interests);
      setIsPackLight(!!item.inputs.isPackLight);
      
      // Restore dates logic
      const storedStart = item.inputs.startDate || getTomorrow();
      setStartDate(storedStart);
      setEndDate(getDateAfterDays(storedStart, item.inputs.nights || 1));
      
      setTravelPlans(item.plans);
      setIsHistoryOpen(false);
      setIsSearchCollapsed(true);
      
      // Check if we need images
      fetchImagesForPlans(item.plans, generatedImages);
  };

  if (!hasStarted) {
      return <LandingPage onStart={() => setHasStarted(true)} onLanguageSelect={(l) => setLanguage(l as Language)} t={t} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
           <Header t={t} onShowHistory={() => setIsHistoryOpen(true)} onBack={() => setHasStarted(false)} />
           
           <SearchBar 
             t={t}
             origin={origin} setOrigin={setOrigin}
             destination={destination} setDestination={setDestination}
             nights={nights} setNights={setNights}
             departureTime={departureTime} setDepartureTime={setDepartureTime}
             transportation={transportation} setTransportation={setTransportation}
             budget={budget} setBudget={setBudget}
             wishlistPlaces={wishlistPlaces} setWishlistPlaces={setWishlistPlaces}
             interests={interests} setInterests={setInterests}
             isPackLight={isPackLight} setIsPackLight={setIsPackLight}
             onGenerate={handleGenerate}
             onStop={handleStop}
             isLoading={isLoading}
             isCollapsed={isSearchCollapsed}
             onToggleCollapse={() => setIsSearchCollapsed(!isSearchCollapsed)}
             startDate={startDate} setStartDate={setStartDate}
             endDate={endDate} setEndDate={setEndDate}
           />

           {error && (
               <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
               </div>
           )}

           {isLoading && <LoadingSpinner t={t} progress={progress} />}

           {!isLoading && travelPlans && travelPlans.length > 0 && (
               <div className="mt-8">
                   {/* Plan Tabs if multiple */}
                   {travelPlans.length > 1 && (
                       <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
                           {travelPlans.map((plan, idx) => (
                               <button
                                  key={idx}
                                  onClick={() => setActivePlanIndex(idx)}
                                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                      activePlanIndex === idx 
                                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                  }`}
                               >
                                  {plan.transportationMode || `Plan ${idx + 1}`}
                               </button>
                           ))}
                       </div>
                   )}
                   
                   <TravelPlan 
                      plan={travelPlans[activePlanIndex]} 
                      images={generatedImages}
                      startDate={startDate}
                      onLikeToggle={handleLikeToggle}
                      onRegenerate={handleRegenerate}
                      onSelectHotel={handleHotelSelect}
                      t={t}
                      language={language}
                   />
               </div>
           )}
           
           <ChatWidget 
              currentPlan={travelPlans?.[activePlanIndex]} 
              t={t} 
              language={language} 
              startDate={startDate} 
            />
           
           <HistoryModal 
              isOpen={isHistoryOpen} 
              onClose={() => setIsHistoryOpen(false)} 
              history={history}
              onSelect={handleHistoryRestore}
              language={language}
           />
       </div>
    </div>
  );
};

export default App;
