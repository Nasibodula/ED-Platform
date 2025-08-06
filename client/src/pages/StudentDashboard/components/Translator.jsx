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

  const API_BASE = 'http://localhost:5001/api';

  // Fetch dictionary statistics
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/dictionary`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        // Fallback to mock data if API is not available
        setStats({
          english_words: 85,
          borana_words: 120,
          total_entries: 205
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        english_words: 85,
        borana_words: 120,
        total_entries: 205
      });
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
        const response = await fetch(`${API_BASE}/suggestions?q=${encodeURIComponent(text)}&lang=${lang}`);
        const data = await response.json();
        
        if (data.success) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
        }
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
      const response = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          source_lang: sourceLang,
          type: translationType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTranslationResult(data);
      } else {
        setTranslationResult({
          success: false,
          message: data.message || 'Translation not found',
          suggestions: data.suggestions || [],
          original: inputText
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation failed. Please check if the server is running.');
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