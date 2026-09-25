import React, { useState } from 'react';
import { Play, Compass, Shield, Zap, Sparkles } from 'lucide-react';

export default function HowItWorks({
  title = "Mission Command in Extreme Environments",
  description = "Watch how Aurora synchronizes overland traverses, monitors supply chains, and automates polar decision-making even when entirely cut off from the global internet.",
  videoSrc = "",
  posterSrc = ""
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="how-it-works" className="relative w-full py-16 sm:py-24 bg-transparent select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-sky-200/25 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[44px] leading-[1.2]">
            {title}
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Full Width Video Showcase Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-200/70 bg-slate-950 shadow-2xl shadow-sky-950/15 group">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={posterSrc}
              controls
              className="w-full h-full aspect-video object-cover"
            />
          ) : (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[340px] sm:min-h-[460px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Polar Technical Grid Background in Video Frame */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Ambient Radial Spotlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Decorative Corner HUD Markers */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2 text-[11px] font-mono text-sky-400/70 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AURORA // OPERATIONAL VIDEO DEMO</span>
              </div>
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[11px] font-mono text-slate-400/60 tracking-wider">
                HD 1080P • 60 FPS
              </div>

              {/* Central Interactive Play Button */}
              <div className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/20 group/btn"
                  aria-label="Play Overview Video"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white ml-1 transition-transform group-hover/btn:scale-110" />
                </button>
                <div className="mt-4 text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
                  {isPlaying ? "Video Playing" : "Click to watch platform walkthrough"}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Full width preview space ready for your MP4 / YouTube embed
                </div>
              </div>

              {/* Bottom HUD Bar in Video Container */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-slate-400/70 border-t border-slate-800/80 pt-3">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5 text-slate-300">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px] font-mono">TRAVERSE DISPATCH</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center space-x-1.5 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px] font-mono">OFFLINE DETERMINISTIC CORE</span>
                  </span>
                  <span className="hidden md:inline-flex items-center space-x-1.5 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px] font-mono">AI DECISION COPILOT</span>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-sky-400/80">
                  03:42
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
