import React from 'react';
import { Link } from 'react-router-dom';
import HeroGlobe from './HeroGlobe';

export default function Hero({
  titleLine1 = "Plan. Move. Monitor. Respond.",
  titleLine2 = " Across the Polar Frontier.",
  subtitle = "One operational platform for transportation, research, field teams, route intelligence, and emergency response.",
  primaryCtaText = "Start an operation",
  primaryCtaLink = "/dashboard",
  secondaryCtaText = "See how it works",
  secondaryCtaLink = "/missions"
}) {
  return (
    <div id="overview" className="relative w-full bg-gradient-to-b from-sky-100/80 via-blue-50/60 to-transparent pt-10 sm:pt-14 pb-8 overflow-hidden select-none">
      {/* Richer Polar Blue Ambient Background Glows */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-b from-sky-300/35 via-blue-200/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-sky-400/20 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-16 right-1/4 w-[450px] h-[280px] bg-cyan-300/15 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Central Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        {/* Main Heading in Editorial Serif Style */}
        <h1 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-4xl sm:text-5xl lg:text-[58px] leading-[1.15]">
          <span className="block">{titleLine1}</span>
          <span className="block mt-1 sm:mt-1.5 text-slate-800">{titleLine2}</span>
        </h1>

        {/* Subtitle - slightly smaller and refined */}
        <p className="mt-4 text-xs sm:text-[14px] md:text-[15px] text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-normal">
          {subtitle}
        </p>

        {/* Action Buttons - lowered down */}
        <div className="mt-9 sm:mt-10 flex flex-row items-center justify-center gap-3.5">
          <Link
            to={primaryCtaLink}
            className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-950 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-sky-900/10 active:scale-[0.98]"
          >
            {primaryCtaText}
          </Link>
          {secondaryCtaLink.startsWith('/') ? (
            <Link
              to={secondaryCtaLink}
              className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-slate-800 bg-white/90 hover:bg-white border border-sky-200/80 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {secondaryCtaText}
            </Link>
          ) : (
            <a
              href={secondaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-slate-800 bg-white/90 hover:bg-white border border-sky-200/80 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>

      {/* Real 3D Rotating Interactive Earth Globe within the Hero Section */}
      <div className="relative w-full h-[270px] sm:h-[320px] md:h-[370px] mt-1 sm:mt-2 overflow-hidden">
        <HeroGlobe />
        {/* Seamless blend mask at bottom matching polar background */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-blue-50/90 via-sky-50/50 to-transparent pointer-events-none" />
      </div>

      {/* Social Proof / Partner Logos Strip (Full Width, seamless without divider line) */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pt-2 w-full">
          {/* Label on Far Left End */}
          <div className="text-left w-full md:w-auto shrink-0">
            <p className="text-xs text-slate-500 font-medium leading-snug max-w-[200px]">
              Trusted by research stations and polar expeditions worldwide
            </p>
          </div>

          {/* Partner Brand Logos Spanning Across to Far Right End */}
          <div className="w-full md:flex-1 flex flex-wrap items-center justify-between md:justify-end gap-6 sm:gap-10 md:gap-12 lg:gap-16 opacity-85 hover:opacity-100 transition-opacity">
            {/* Gumroad Logo */}
            <div className="flex items-center space-x-1.5 cursor-default">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-neutral-700 hover:text-neutral-950 font-sans uppercase">
                GUMROAD
              </span>
            </div>

            {/* Mailchimp Logo */}
            <div className="flex items-center space-x-1.5 cursor-default">
              <svg className="w-6 h-6 text-neutral-700 hover:text-neutral-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 6.6c.3 0 .6.2.7.5.3.7.1 1.5-.5 2l-.4.3c-.2.2-.4.4-.4.7v.2c0 .4-.3.7-.7.7s-.7-.3-.7-.7v-.4c0-.6.3-1.1.8-1.5l.4-.3c.3-.2.4-.6.2-.9-.1-.2-.4-.3-.7-.3H14c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h1.8zm-7.6 0c1 0 1.8.8 1.8 1.8 0 .4-.3.7-.7.7s-.7-.3-.7-.7c0-.2-.2-.4-.4-.4s-.4.2-.4.4c0 .4-.3.7-.7.7s-.7-.3-.7-.7c0-1 .8-1.8 1.8-1.8zm3.8 9.4c-2.4 0-4.4-1.6-4.9-3.8-.1-.4.2-.8.6-.9.4-.1.8.2.9.6.3 1.5 1.7 2.6 3.4 2.6s3.1-1.1 3.4-2.6c.1-.4.5-.7.9-.6.4.1.7.5.6.9-.5 2.2-2.5 3.8-4.9 3.8z" />
              </svg>
              <span className="font-bold text-base sm:text-lg tracking-tight text-neutral-700 hover:text-neutral-950 lowercase">
                mailchimp
              </span>
            </div>

            {/* Airtable Logo */}
            <div className="flex items-center space-x-1.5 cursor-default">
              <svg className="w-5 h-5 text-neutral-700 hover:text-neutral-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.2 2.4L2.8 6.6c-.5.2-.8.7-.8 1.3v8.3c0 .6.3 1.1.8 1.3l8.4 4.2c.5.2 1.1.2 1.6 0l8.4-4.2c.5-.2.8-.7.8-1.3V7.9c0-.6-.3-1.1-.8-1.3l-8.4-4.2c-.5-.3-1.1-.3-1.6 0zM12 4.4l6.8 3.4L12 11.2 5.2 7.8 12 4.4zm-1 8.5v7l-6-3v-7l6 3zm2 7v-7l6-3v7l-6 3z" />
              </svg>
              <span className="font-bold text-base sm:text-lg tracking-tight text-neutral-700 hover:text-neutral-950">
                Airtable
              </span>
            </div>

            {/* Gumroad Logo (second instance as in screenshot) */}
            <div className="flex items-center space-x-1.5 cursor-default">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-neutral-700 hover:text-neutral-950 font-sans uppercase">
                GUMROAD
              </span>
            </div>

            {/* Notion Logo */}
            <div className="flex items-center space-x-1.5 cursor-default">
              <div className="w-5 h-5 rounded border-[1.8px] border-neutral-700 hover:border-neutral-950 flex items-center justify-center font-serif font-black text-xs text-neutral-700 hover:text-neutral-950">
                N
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-tight text-neutral-700 hover:text-neutral-950">
                Notion
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
