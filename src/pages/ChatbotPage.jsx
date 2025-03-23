import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Volume2, 
  Copy, 
  Share, 
  BookmarkPlus, 
  History, 
  X, 
  Save,
  Download
} from 'lucide-react';

const TranslationTool = ({ isLoggedIn = false }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Oromo');
  const [recentTranslations, setRecentTranslations] = useState([
    { source: 'Hello, how are you?', translated: 'Akkam, nagaa?', sourceLang: 'English', targetLang: 'Oromo' },
    { source: 'I am learning a new language', translated: 'Afaan haaraa baradhaa jira', sourceLang: 'English', targetLang: 'Oromo' }
  ]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = () => {
    // This would connect to your translation API
    // For demonstration, using a simple simulation
    if (sourceText.trim() === '') return;
    
    // Simulate translation with delay
    setTimeout(() => {
      const mockTranslation = sourceText.length > 0 
        ? `[${targetLang} translation of: "${sourceText}"]` 
        : '';
      setTranslatedText(mockTranslation);
      
      // Add to history if there's actual content
      if (sourceText && mockTranslation) {
        const newTranslation = {
          source: sourceText,
          translated: mockTranslation,
          sourceLang,
          targetLang,
          timestamp: new Date()
        };
        setRecentTranslations(prev => [newTranslation, ...prev].slice(0, 10));
      }
    }, 500);
  };

  // Auto translate when text changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText) handleTranslate();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [sourceText, sourceLang, targetLang]);

  // Copy translated text
  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    // In a real app, you would show a toast notification
  };

  // Toggle history panel
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Language options for the platform
  const languageOptions = ['English', 'Oromo', 'Borana'];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-950 mb-2">Translation Tool</h1>
        <div className="text-indigo-300 text-sm">
          {isLoggedIn ? 'Dashboard' : 'Home'} &gt; Translation Tool
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main translation area */}
        <div className="flex-1 bg-indigo-50 rounded-xl shadow-md overflow-hidden">
          <div className="bg-indigo-200 p-4 flex justify-between items-center">
            <div className="flex-1">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-white text-indigo-950 px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-indigo-300"
              >
                {languageOptions.map(lang => (
                  <option key={`source-${lang}`} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleSwapLanguages}
              className="mx-4 p-2 rounded-full bg-indigo-300 hover:bg-indigo-400 text-white transition-colors"
            >
              <ArrowLeftRight size={20} />
            </button>
            
            <div className="flex-1 flex justify-end">
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-white text-indigo-950 px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-indigo-300"
              >
                {languageOptions.map(lang => (
                  <option key={`target-${lang}`} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Source text input */}
            <div className="flex-1 p-4">
              <textarea 
                placeholder={`Enter text in ${sourceLang}`}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full h-40 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button className="text-indigo-500 p-2" title="Clear text" onClick={() => setSourceText('')}>
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Translation output */}
            <div className="flex-1 p-4 bg-white">
              <div className="w-full h-40 p-3 border border-indigo-200 rounded-lg overflow-auto">
                {translatedText}
              </div>
              <div className="mt-2 flex justify-between">
                <button className="text-indigo-500 p-2 flex items-center gap-1" title="Listen">
                  <Volume2 size={16} />
                </button>
                <div className="flex">
                  <button className="text-indigo-500 p-2" title="Copy" onClick={handleCopy}>
                    <Copy size={16} />
                  </button>
                  <button className="text-indigo-500 p-2" title="Share">
                    <Share size={16} />
                  </button>
                  {isLoggedIn && (
                    <button className="text-indigo-500 p-2" title="Save to vocabulary">
                      <BookmarkPlus size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar - shown or hidden based on state */}
        <div className={`w-full lg:w-72 bg-indigo-50 rounded-xl shadow-md overflow-hidden transition-all ${showHistory ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-indigo-200 p-4 flex justify-between items-center">
            <h3 className="font-medium text-indigo-950">Recent Translations</h3>
            {isLoggedIn && (
              <button className="text-indigo-950 p-1 rounded hover:bg-indigo-300" title="Save all">
                <Save size={16} />
              </button>
            )}
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            {recentTranslations.length > 0 ? (
              recentTranslations.map((item, index) => (
                <div key={index} className="mb-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-xs text-indigo-400 mb-1">{item.sourceLang} → {item.targetLang}</div>
                  <div className="text-sm font-medium text-indigo-950 mb-1">{item.source}</div>
                  <div className="text-sm text-indigo-700">{item.translated}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-indigo-400 py-8">No recent translations</div>
            )}
          </div>
          
          <div className="p-4 bg-indigo-100">
            <button className="w-full py-2 bg-indigo-300 hover:bg-indigo-400 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Download size={16} />
              <span>Save Offline</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile history toggle */}
      <div className="lg:hidden mt-4">
        <button 
          onClick={toggleHistory}
          className="w-full py-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-950 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <History size={16} />
          <span>{showHistory ? 'Hide History' : 'Show History'}</span>
        </button>
      </div>
    </div>
  );
};

export default TranslationTool;