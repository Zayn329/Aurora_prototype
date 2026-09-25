import React, { useRef, useEffect } from 'react';

export default function HowItWorks({
  title = "Mission Command in Extreme Environments",
  description = "Watch how Aurora synchronizes overland traverses, monitors supply chains, and automates polar decision-making even when entirely cut off from the global internet.",
  videoSrc = "/over.mp4",
  posterSrc = ""
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React has a known quirk where muted isn't always bound as a DOM property on mount
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      if (video && video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch((err) => {
            console.log('Autoplay attempt waiting for user interaction:', err);
          });
        }
      }
    };

    // Attempt immediate play
    tryPlay();

    // Event listeners to start playing as soon as media chunks arrive
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);

    // If user touches or clicks anywhere on the page, ensure it is playing
    const handleGlobalInteraction = () => {
      tryPlay();
    };
    window.addEventListener('scroll', handleGlobalInteraction, { passive: true });
    window.addEventListener('click', handleGlobalInteraction, { passive: true });
    window.addEventListener('touchstart', handleGlobalInteraction, { passive: true });

    // IntersectionObserver to auto-play whenever section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
      window.removeEventListener('scroll', handleGlobalInteraction);
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, []);

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
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-200/80 bg-slate-950 shadow-2xl shadow-sky-950/20">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onPause={(e) => {
              // Ensure it keeps playing continuously
              e.target.play().catch(() => {});
            }}
            onEnded={(e) => {
              e.target.currentTime = 0;
              e.target.play().catch(() => {});
            }}
            className="w-full h-full aspect-video object-cover bg-black pointer-events-none"
          >
            <source src="/over.mp4" type="video/mp4" />
            <source src="/overview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
