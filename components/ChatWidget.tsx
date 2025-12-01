
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { TravelPlan, Language } from '../types';
import { translations } from '../translations';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatWidgetProps {
  currentPlan?: TravelPlan;
  t: typeof translations.ja;
  language: Language;
  startDate?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentPlan, t, language, startDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize messages from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
      try {
          const saved = localStorage.getItem('ai_tour_chat_messages');
          return saved ? JSON.parse(saved) : [];
      } catch (e) {
          console.error("Failed to load chat history", e);
          return [];
      }
  });
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
      try {
          localStorage.setItem('ai_tour_chat_messages', JSON.stringify(messages));
      } catch (e) {
          console.error("Failed to save chat history", e);
      }
  }, [messages]);

  // チャットが開かれたときに初期メッセージがない場合、挨拶を追加
  useEffect(() => {
    // Only add welcome message if completely empty and open
    if (isOpen && messages.length === 0) {
      // Use timeout to allow rendering to settle if cleared
      const timer = setTimeout(() => {
         setMessages([
           { role: 'model', text: t.chatWelcome }
         ]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, t.chatWelcome]);

  // メッセージ追加時やオープン時に自動スクロール
  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      // 履歴をAPI形式に変換
      const historyForApi = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Pass startDate so AI knows the plan context date
      const responseText = await sendChatMessage(historyForApi, userMessage, language, currentPlan, startDate);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t.chatError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-slate-200 mb-4 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="bg-white text-blue-600 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex items-center mr-2 flex-shrink-0">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="font-bold text-lg text-blue-600 hidden sm:block truncate">{t.chatTitle}</h3>
                <h3 className="font-bold text-lg text-blue-600 sm:hidden">AI</h3>
              </div>
              
              {/* Railway Info Link */}
              <a 
                href="https://transit.yahoo.co.jp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 ml-auto mr-3 inline-flex items-center px-2 py-1 border border-slate-200 rounded text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                title={t.transit}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t.transit}
              </a>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-slate-100 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chatPlaceholder}
                className="flex-1 p-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none ${
          isOpen ? 'bg-slate-600 rotate-90' : 'bg-gradient-to-r from-blue-600 to-cyan-500'
        }`}
      >
        {isOpen ? (
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
           </svg>
        )}
        
        {!isOpen && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
