// // import React, { useState, useEffect } from 'react';
// // import { 
// //   ArrowLeftRight, 
// //   Volume2, 
// //   Copy, 
// //   Share, 
// //   BookmarkPlus, 
// //   History, 
// //   X, 
// //   Save,
// //   Download
// // } from 'lucide-react';

// // const TranslationTool = ({ isLoggedIn = false }) => {
// //   const [sourceText, setSourceText] = useState('');
// //   const [translatedText, setTranslatedText] = useState('');
// //   const [sourceLang, setSourceLang] = useState('English');
// //   const [targetLang, setTargetLang] = useState('Oromo');
// //   const [recentTranslations, setRecentTranslations] = useState([
// //     { source: 'Hello, how are you?', translated: 'Akkam, nagaa?', sourceLang: 'English', targetLang: 'Oromo' },
// //     { source: 'I am learning a new language', translated: 'Afaan haaraa baradhaa jira', sourceLang: 'English', targetLang: 'Oromo' }
// //   ]);
// //   const [showHistory, setShowHistory] = useState(false);

// //   const handleSwapLanguages = () => {
// //     const tempLang = sourceLang;
// //     setSourceLang(targetLang);
// //     setTargetLang(tempLang);
// //     setSourceText(translatedText);
// //     setTranslatedText(sourceText);
// //   };

// //   const handleTranslate = () => {
// //     // This would connect to your translation API
// //     // For demonstration, using a simple simulation
// //     if (sourceText.trim() === '') return;
    
// //     // Simulate translation with delay
// //     setTimeout(() => {
// //       const mockTranslation = sourceText.length > 0 
// //         ? `[${targetLang} translation of: "${sourceText}"]` 
// //         : '';
// //       setTranslatedText(mockTranslation);
      
// //       // Add to history if there's actual content
// //       if (sourceText && mockTranslation) {
// //         const newTranslation = {
// //           source: sourceText,
// //           translated: mockTranslation,
// //           sourceLang,
// //           targetLang,
// //           timestamp: new Date()
// //         };
// //         setRecentTranslations(prev => [newTranslation, ...prev].slice(0, 10));
// //       }
// //     }, 500);
// //   };

// //   // Auto translate when text changes (with debounce)
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       if (sourceText) handleTranslate();
// //     }, 1000);
    
// //     return () => clearTimeout(timer);
// //   }, [sourceText, sourceLang, targetLang]);

// //   // Copy translated text
// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(translatedText);
// //     // In a real app, you would show a toast notification
// //   };

// //   // Toggle history panel
// //   const toggleHistory = () => {
// //     setShowHistory(!showHistory);
// //   };

// //   // Language options for the platform
// //   const languageOptions = ['English', 'Oromo', 'Borana'];

// //   return (
// //     <div className="min-h-screen bg-white p-4 md:p-8">
// //       {/* Header with breadcrumb */}
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-indigo-950 mb-2">Translation Tool</h1>
// //         <div className="text-indigo-300 text-sm">
// //           {isLoggedIn ? 'Dashboard' : 'Home'} &gt; Translation Tool
// //         </div>
// //       </div>

// //       <div className="flex flex-col lg:flex-row gap-6">
// //         {/* Main translation area */}
// //         <div className="flex-1 bg-indigo-50 rounded-xl shadow-md overflow-hidden">
// //           <div className="bg-indigo-200 p-4 flex justify-between items-center">
// //             <div className="flex-1">
// //               <select 
// //                 value={sourceLang}
// //                 onChange={(e) => setSourceLang(e.target.value)}
// //                 className="bg-white text-indigo-950 px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-indigo-300"
// //               >
// //                 {languageOptions.map(lang => (
// //                   <option key={`source-${lang}`} value={lang}>{lang}</option>
// //                 ))}
// //               </select>
// //             </div>
            
// //             <button 
// //               onClick={handleSwapLanguages}
// //               className="mx-4 p-2 rounded-full bg-indigo-300 hover:bg-indigo-400 text-white transition-colors"
// //             >
// //               <ArrowLeftRight size={20} />
// //             </button>
            
// //             <div className="flex-1 flex justify-end">
// //               <select 
// //                 value={targetLang}
// //                 onChange={(e) => setTargetLang(e.target.value)}
// //                 className="bg-white text-indigo-950 px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-indigo-300"
// //               >
// //                 {languageOptions.map(lang => (
// //                   <option key={`target-${lang}`} value={lang}>{lang}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
          
// //           <div className="flex flex-col md:flex-row">
// //             {/* Source text input */}
// //             <div className="flex-1 p-4">
// //               <textarea 
// //                 placeholder={`Enter text in ${sourceLang}`}
// //                 value={sourceText}
// //                 onChange={(e) => setSourceText(e.target.value)}
// //                 className="w-full h-40 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
// //               />
// //               <div className="mt-2 flex justify-end">
// //                 <button className="text-indigo-500 p-2" title="Clear text" onClick={() => setSourceText('')}>
// //                   <X size={16} />
// //                 </button>
// //               </div>
// //             </div>
            
// //             {/* Translation output */}
// //             <div className="flex-1 p-4 bg-white">
// //               <div className="w-full h-40 p-3 border border-indigo-200 rounded-lg overflow-auto">
// //                 {translatedText}
// //               </div>
// //               <div className="mt-2 flex justify-between">
// //                 <button className="text-indigo-500 p-2 flex items-center gap-1" title="Listen">
// //                   <Volume2 size={16} />
// //                 </button>
// //                 <div className="flex">
// //                   <button className="text-indigo-500 p-2" title="Copy" onClick={handleCopy}>
// //                     <Copy size={16} />
// //                   </button>
// //                   <button className="text-indigo-500 p-2" title="Share">
// //                     <Share size={16} />
// //                   </button>
// //                   {isLoggedIn && (
// //                     <button className="text-indigo-500 p-2" title="Save to vocabulary">
// //                       <BookmarkPlus size={16} />
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Right sidebar - shown or hidden based on state */}
// //         <div className={`w-full lg:w-72 bg-indigo-50 rounded-xl shadow-md overflow-hidden transition-all ${showHistory ? 'block' : 'hidden lg:block'}`}>
// //           <div className="bg-indigo-200 p-4 flex justify-between items-center">
// //             <h3 className="font-medium text-indigo-950">Recent Translations</h3>
// //             {isLoggedIn && (
// //               <button className="text-indigo-950 p-1 rounded hover:bg-indigo-300" title="Save all">
// //                 <Save size={16} />
// //               </button>
// //             )}
// //           </div>
          
// //           <div className="p-4 max-h-96 overflow-y-auto">
// //             {recentTranslations.length > 0 ? (
// //               recentTranslations.map((item, index) => (
// //                 <div key={index} className="mb-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
// //                   <div className="text-xs text-indigo-400 mb-1">{item.sourceLang} → {item.targetLang}</div>
// //                   <div className="text-sm font-medium text-indigo-950 mb-1">{item.source}</div>
// //                   <div className="text-sm text-indigo-700">{item.translated}</div>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="text-center text-indigo-400 py-8">No recent translations</div>
// //             )}
// //           </div>
          
// //           <div className="p-4 bg-indigo-100">
// //             <button className="w-full py-2 bg-indigo-300 hover:bg-indigo-400 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
// //               <Download size={16} />
// //               <span>Save Offline</span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>
      
// //       {/* Mobile history toggle */}
// //       <div className="lg:hidden mt-4">
// //         <button 
// //           onClick={toggleHistory}
// //           className="w-full py-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-950 rounded-lg flex items-center justify-center gap-2 transition-colors"
// //         >
// //           <History size={16} />
// //           <span>{showHistory ? 'Hide History' : 'Show History'}</span>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TranslationTool;



// import React, { useState } from 'react';
// import axios from 'axios';

// function TranslationTool() {
//   const [inputText, setInputText] = useState('');
//   const [translation, setTranslation] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleTranslate = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Update the URL to point to your Flask backend
//       const response = await axios.post('http://localhost:5000/api/translate', { 
//         text: inputText 
//       });
      
//       setTranslation(response.data.translation);
//     } catch (error) {
//       console.error('Translation error:', error);
      
//       // More detailed error handling
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         setError(error.response.data.error || 'Translation failed');
//       } else if (error.request) {
//         // The request was made but no response was received
//         setError('No response from server. Check your backend is running.');
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         setError('Error setting up the translation request');
//       }
      
//       setTranslation('');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
//         <h1 className="text-2xl font-bold text-center mb-4">
//           Oromo-English Translator
//         </h1>
//         <textarea
//           className="w-full h-32 p-2 border rounded-lg mb-4 
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter text to translate..."
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//         <button
//           className={`w-full py-2 rounded-lg text-white font-semibold
//                       ${isLoading 
//                         ? 'bg-gray-400 cursor-not-allowed' 
//                         : 'bg-blue-600 hover:bg-blue-700'}`}
//           onClick={handleTranslate}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Translating...' : 'Translate'}
//         </button>
        
//         {error && (
//           <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg">
//             <p>{error}</p>
//           </div>
//         )}
        
//         {translation && (
//           <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//             <h2 className="font-semibold mb-2">Translation:</h2>
//             <p>{translation}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TranslationTool;



import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, BookOpen, Languages, ArrowLeftRight, Volume2, Copy, Check } from 'lucide-react';

const TranslationTool = () => {
  const [inputText, setInputText] = useState('');
  const [translationResult, setTranslationResult] = useState(null);
  const [sourceLang, setSourceLang] = useState('english');
  const [translationType, setTranslationType] = useState('word');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Mock API base URL - replace with your actual backend URL
  const API_BASE = 'http://localhost:5000/api';

  // Fetch dictionary statistics
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock stats for demo - replace with actual API call
      setStats({
        english_words: 85,
        borana_words: 120,
        total_entries: 205
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Debounced suggestions
  const fetchSuggestions = useCallback(
    debounce(async (text, lang) => {
      if (text.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        // Mock suggestions for demo - replace with actual API call
        const mockSuggestions = [
          'appear', 'appearance', 'appetite', 'appointment', 'applaud',
          'appreciate', 'approach', 'approve', 'area', 'argue'
        ].filter(word => word.toLowerCase().includes(text.toLowerCase()));
        
        setSuggestions(mockSuggestions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setError('');
    
    if (translationType === 'word' && value.trim()) {
      fetchSuggestions(value, sourceLang);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock translation for demo - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (translationType === 'word') {
        // Mock word translation
        const mockTranslations = [
          { borana: 'futisa-tifta', type: 'verb' },
          { borana: 'fakkaadha-kaatta', type: 'verb' }
        ];
        
        setTranslationResult({
          success: true,
          translations: mockTranslations,
          original: inputText
        });
      } else {
        // Mock sentence translation
        setTranslationResult({
          success: true,
          translation: `${inputText} → [Borana translation here]`,
          original: inputText
        });
      }
    } catch (error) {
      setError('Translation failed. Please try again.');
      setTranslationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle language swap
  const handleLanguageSwap = () => {
    setSourceLang(sourceLang === 'english' ? 'borana' : 'english');
    setInputText('');
    setTranslationResult(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Borana Translator</h1>
                <p className="text-sm text-gray-600">English ↔ Borana Dictionary & Translator</p>
              </div>
            </div>
            
            {stats && (
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{stats.english_words} EN words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{stats.borana_words} Borana words</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Language Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  sourceLang === 'english' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {sourceLang === 'english' ? 'English' : 'Borana'}
                </span>
                
                <button
                  onClick={handleLanguageSwap}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Swap languages"
                >
                  <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                </button>
                
                <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  sourceLang === 'borana' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {sourceLang === 'borana' ? 'English' : 'Borana'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTranslationType('word')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  translationType === 'word'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Word
              </button>
              <button
                onClick={() => setTranslationType('sentence')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  translationType === 'sentence'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sentence
              </button>
            </div>
          </div>
        </div>

        {/* Translation Input */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="relative">
            <div className="flex items-center space-x-2 mb-3">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Enter {sourceLang === 'english' ? 'English' : 'Borana'} text
              </span>
            </div>
            
            <div className="relative">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={translationType === 'word' 
                  ? `Type a ${sourceLang} word...` 
                  : `Type a ${sourceLang} sentence...`
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={translationType === 'word' ? 2 : 4}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className="text-gray-900">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-500">
                {translationType === 'sentence' && 'Press Enter to translate'}
              </div>
              
              <button
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Translation Results */}
        {translationResult && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Translation Result</h3>
              {translationResult.success && (
                <button
                  onClick={() => handleCopy(
                    translationType === 'word' 
                      ? translationResult.translations?.[0]?.borana || translationResult.translations?.[0]?.english
                      : translationResult.translation
                  )}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            {translationResult.success ? (
              <div className="space-y-4">
                {translationType === 'word' ? (
                  <div className="space-y-3">
                    {translationResult.translations?.map((translation, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-green-900">
                              {translation.borana || translation.english}
                            </p>
                            {translation.type && (
                              <span className="inline-block px-2 py-1 text-xs bg-green-200 text-green-800 rounded mt-1">
                                {translation.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-lg text-blue-900">{translationResult.translation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{translationResult.message || 'Translation not found'}</p>
                {translationResult.suggestions && translationResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Did you mean:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {translationResult.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Word Translation</h4>
              <ul className="space-y-1">
                <li>• Type individual words for precise translations</li>
                <li>• Use autocomplete suggestions while typing</li>
                <li>• View word types (noun, verb, etc.)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sentence Translation</h4>
              <ul className="space-y-1">
                <li>• Enter complete sentences or phrases</li>
                <li>• Press Enter or click Translate</li>
                <li>• Words not found will be marked with [ ]</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default TranslationTool;