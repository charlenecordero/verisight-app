
import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { MediaFile, AnalysisResult } from './types';
import { analyzeMedia } from './services/geminiService';

const App: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediaSelect = useCallback(async (media: MediaFile) => {
    setSelectedMedia(media);
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const analysis = await analyzeMedia(
        media.preview,
        media.file.type,
        media.type
      );
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during forensic analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = () => {
    setSelectedMedia(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group" onClick={reset} style={{ cursor: 'pointer' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <i className="fa-solid fa-fingerprint text-white text-lg"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">VERISIGHT<span className="text-blue-500">.</span></span>
          </div>
          <div className="hidden lg:flex gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Visual Forensics</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Audio Integrity</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Art Verification</a>
          </div>
          {selectedMedia && (
            <button 
              onClick={reset}
              className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/10"
            >
              Analyze Another
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {!selectedMedia && (
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Next-Gen Content Verification
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              Verify Reality<span className="text-blue-600">.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              A comprehensive forensic suite using Gemini 3 Pro to expose AI artifacts in photography, digital art, cinematography, and music.
            </p>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-4 animate-bounce">
              <i className="fa-solid fa-triangle-exclamation text-xl"></i>
              <span className="font-bold text-sm tracking-tight">{error}</span>
            </div>
          )}

          {!selectedMedia ? (
            <FileUpload onFileSelect={handleMediaSelect} isLoading={isAnalyzing} />
          ) : (
            <div className="space-y-12">
              {isAnalyzing ? (
                <div className="glass-card rounded-[2.5rem] p-20 text-center flex flex-col items-center border-white/5">
                  <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-[6px] border-blue-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-[6px] border-purple-500/20 border-b-transparent rounded-full animate-spin-reverse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className={`fa-solid ${selectedMedia.type === 'audio' ? 'fa-music' : 'fa-eye'} text-2xl text-blue-400 animate-pulse`}></i>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight mb-4 uppercase">Running Forensics</h2>
                  <p className="text-gray-400 max-w-md font-medium">
                    Our neural network is decomposing the spectral and structural data of your {selectedMedia.type} to identify non-human generation patterns.
                  </p>
                  <div className="mt-8 flex gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              ) : result ? (
                <ResultDisplay 
                  result={result} 
                  previewUrl={selectedMedia.preview} 
                  mediaType={selectedMedia.type} 
                />
              ) : null}
            </div>
          )}
        </div>

        {!selectedMedia && (
          <div className="mt-32 space-y-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: 'fa-camera', label: 'Photography', color: 'blue', desc: 'Detects skin texture & light physics.' },
                    { icon: 'fa-palette', label: 'Digital Art', color: 'emerald', desc: 'Exposes procedural brush-stroke patterns.' },
                    { icon: 'fa-music', label: 'Audio Tracks', color: 'purple', desc: 'Analyzes spectral gaps & vocal synthesis.' },
                    { icon: 'fa-film', label: 'Cinema', color: 'red', desc: 'Verifies temporal coherence & motion blur.' }
                ].map((item, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-[2rem] hover:scale-105 transition-all duration-500 cursor-default border-white/5 group">
                        <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center text-${item.color}-400 mb-6 group-hover:bg-${item.color}-500 group-hover:text-white transition-all`}>
                            <i className={`fa-solid ${item.icon} text-2xl`}></i>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-2">{item.label}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <i className="fa-solid fa-microscope text-9xl"></i>
                </div>
                <div className="max-w-2xl relative z-10">
                    <h2 className="text-4xl font-black tracking-tight mb-6">How It Works</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        VeriSight doesn't just guess. We use multi-modal reasoning to compare uploaded content against millions of known AI generation signatures. From the way light refracts in an eye to the specific metallic ringing of an AI voice, we see what the human ear and eye miss.
                    </p>
                    <button className="px-8 py-3 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                        View Research Paper
                    </button>
                </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <i className="fa-solid fa-eye text-white text-[10px]"></i>
                </div>
                <span className="text-sm font-black tracking-tighter uppercase">VERISIGHT</span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Ethics Statement</a>
            </div>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
              &copy; 2025 Neural Integrity Labs. Powered by Gemini 3.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
