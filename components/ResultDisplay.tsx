
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  previewUrl: string;
  mediaType: 'image' | 'video' | 'audio';
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, previewUrl, mediaType }) => {
  const getVerdictColor = () => {
    switch (result.verdict) {
      case 'AI_GENERATED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'REAL': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Media Preview Column */}
      <div className="relative group overflow-hidden rounded-2xl border border-gray-800 bg-black flex items-center justify-center min-h-[300px]">
        {mediaType === 'image' && (
          <img src={previewUrl} alt="Analyzed content" className="w-full h-full object-contain max-h-[500px]" />
        )}
        {mediaType === 'video' && (
          <video src={previewUrl} controls className="w-full h-full max-h-[500px]" />
        )}
        {mediaType === 'audio' && (
          <div className="flex flex-col items-center justify-center w-full p-12 space-y-8">
            <div className="relative">
                <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                <i className="fa-solid fa-compact-disc text-8xl text-purple-400/60 animate-spin-slow"></i>
            </div>
            <audio src={previewUrl} controls className="w-full h-12 rounded-lg" />
            <div className="flex gap-1 items-end h-8">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1 bg-purple-500/40 rounded-full animate-bounce" 
                        style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
          </div>
        )}
        
        <div className="scan-line"></div>
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest border backdrop-blur-md ${getVerdictColor()}`}>
            {result.verdict.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Analysis Details Column */}
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-8 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className={`fa-solid ${mediaType === 'audio' ? 'fa-music' : mediaType === 'image' ? 'fa-palette' : 'fa-film'} text-6xl`}></i>
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Forensic Verdict</h3>
                <h4 className="text-3xl font-black">Analysis Result</h4>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Authenticity Score</span>
              <span className="text-4xl font-mono font-bold text-blue-400">{result.confidenceScore}%</span>
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-8 italic border-l-2 border-blue-500/30 pl-4 py-1">
            "{result.summary}"
          </p>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-200/10">
                  Probability Bar
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-800">
              <div 
                style={{ width: `${result.confidenceScore}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${result.isAiGenerated ? 'bg-red-500' : 'bg-green-500'}`}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 border-white/5">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-fingerprint text-blue-400"></i>
            Forensic Metadata
          </h4>
          <div className="space-y-4">
            {result.artifacts.map((artifact, idx) => (
              <div key={idx} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${artifact.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`}></div>
                    <h5 className="font-bold text-gray-100 text-sm tracking-tight">{artifact.title}</h5>
                  </div>
                  <span className={`text-[9px] uppercase tracking-tighter px-2 py-0.5 rounded-md font-black ${getSeverityBadge(artifact.severity)}`}>
                    {artifact.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-normal group-hover:text-gray-300 transition-colors">{artifact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
