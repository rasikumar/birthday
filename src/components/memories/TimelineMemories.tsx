/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE_MEMORIES } from "../../data/const";
import {
  Calendar,
  Sparkles,
  BookOpen,
  Volume2,
  Mail,
  Camera,
  Layers,
  Award,
  Sun,
  Moon,
  Trash2,
  VolumeX,
  Volume
} from "lucide-react";

// Register ScrollTrigger immediately
gsap.registerPlugin(ScrollTrigger);

interface ScrapbookStates {
  hasBeachStickerPeeled: boolean;
  isNapkinPulled: boolean;
  isCreamWiped: boolean;
  isStarsToggled: boolean;
  playingVoiceId: number | null;
}

export default function TimelineMemories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Core interactive states per page
  const [states, setStates] = useState<ScrapbookStates>({
    hasBeachStickerPeeled: false,
    isNapkinPulled: false,
    isCreamWiped: false,
    isStarsToggled: false,
    playingVoiceId: null
  });

  // Handle GSAP ScrollTrigger horizontal pinning and transform
  useEffect(() => {
    const pinEl = containerRef.current;
    const beltEl = beltRef.current;
    if (!pinEl || !beltEl) return;

    const setupGSAP = () => {
      const scrollWidth = beltEl.scrollWidth;
      const windowWidth = window.innerWidth;
      const xVal = -(scrollWidth - windowWidth);

      // We animate the x position of our belt based on scroll height
      const anim = gsap.to(beltEl, {
        x: xVal,
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollWidth - windowWidth}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          }
        }
      });

      return anim;
    };

    let activeAnim = setupGSAP();

    // Re-verify on window resizing
    const handleResize = () => {
      if (activeAnim) {
        if (activeAnim.scrollTrigger) activeAnim.scrollTrigger.kill();
        activeAnim.kill();
      }
      activeAnim = setupGSAP();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (activeAnim) {
        if (activeAnim.scrollTrigger) activeAnim.scrollTrigger.kill();
        activeAnim.kill();
      }
    };
  }, []);

  const toggleVoiceNote = (id: number) => {
    setStates(prev => {
      const isCurrentlyPlaying = prev.playingVoiceId === id;
      return {
        ...prev,
        playingVoiceId: isCurrentlyPlaying ? null : id
      };
    });
  };

  // Convert scroll progress into an Awwwards-style premium ending zoom out
  // We zoom out the scrapbook container toward the final stage (progress > 0.85)
  const zoomFactor = scrollProgress > 0.85 ? 1 - (scrollProgress - 0.85) * 1.5 : 1;
  const rotationFactor = scrollProgress > 0.85 ? (scrollProgress - 0.85) * -10 : 0;
  const bookCoverY = scrollProgress > 0.85 ? (scrollProgress - 0.85) * 50 : 0;

  return (
    <div
      ref={containerRef}
      id="scrapbook-journey-pin-container"
      className="relative w-full overflow-hidden bg-[#0d0907]"
    >
      {/* WOODEN RETRO TABLE DESK WRAPPER PORT */}
      <div
        className="relative h-screen w-full overflow-hidden flex items-center justify-start"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(32, 20, 12, 0.45) 0%, rgba(8, 6, 5, 0.98) 100%),
            url('https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1920')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Subtle desk dust & particles */}
        <div className="absolute inset-0 bg-[#000]/45 opacity-60 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP GLOWING STATUS BAR CONTAINER */}
        <div className="absolute top-5 inset-x-0 w-full flex justify-center z-40 pointer-events-none select-none">
          <div className="px-5 py-2.5 rounded-full bg-zinc-950/85 border border-amber-500/25 backdrop-blur-md flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-amber-400 uppercase font-semibold">
              Scrapbook Journey: {Math.round(scrollProgress * 100)}% Explorer
            </span>
          </div>
        </div>

        {/* TRANSLATING METRIC BLOCK */}
        <motion.div
          ref={beltRef}
          id="scrapbook-panels-belt"
          className="relative flex flex-row flex-nowrap items-center h-[88vh] px-[12vw] will-change-transform"
          style={{
            transformOrigin: "center center",
            perspective: 2500,
          }}
        >
          {/* ================= PANEL 0: INTRO ALBUM LEATHER BOOK COVER ================= */}
          <div className="w-[85vw] md:w-[75vw] shrink-0 h-full flex items-center justify-center pr-[6vw] z-50">
            <motion.div
              id="vintage-album-book-hinge"
              className="relative w-full max-w-xl h-[70vh] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] border-3 border-amber-950/70 p-10 flex flex-col justify-between text-amber-100/90 select-none"
              style={{
                backgroundImage: "linear-gradient(145deg, #2a1b12 0%, #110905 100%)",
                transformOrigin: "left center",
                // Physically tilt & swing open as the scroll starts
                transform: `rotateY(${scrollProgress < 0.12 ? (scrollProgress / 0.12) * -95 : -95}deg)`,
                opacity: scrollProgress > 0.16 ? 0 : 1,
                backfaceVisibility: "hidden"
              }}
              transition={{ type: "spring", stiffness: 35, damping: 10 }}
            >
              <div className="absolute inset-2 border border-dotted border-amber-600/20 rounded-xl pointer-events-none" />

              {/* Gold Filigree Ornaments */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-500/30 rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-500/30 rounded-tr-sm" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-500/30 rounded-bl-sm" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500/30 rounded-br-sm" />

              <div className="flex flex-col items-center text-center mt-8">
                <BookOpen className="w-14 h-14 text-amber-500/70 mb-4 animate-bounce" />
                <span className="font-mono text-[9px] text-amber-400/60 tracking-[0.35em] uppercase font-bold">
                  Memory Safe lock • Private Edition
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-amber-200 mt-4 leading-tight italic tracking-wide">
                  Sarah's Journal
                </h1>
                <p className="text-stone-400 font-sans text-xs max-w-xs mt-3 leading-relaxed">
                  A tangible path of starry drives, burnt cupcakes, and golden summer hours.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mb-2.5" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500/40 font-bold">
                  Scroll To Open Book Cover 📖
                </p>
              </div>
            </motion.div>
          </div>

          {/* ================= PANEL 1: SUMMER BEACH (STICKER REVEAL) ================= */}
          <div className="w-[85vw] md:w-[88vw] shrink-0 h-full flex items-center pr-[5vw] relative">
            <div className="relative w-full h-[70vh] bg-[#fcfaf4] text-[#1c1917] rounded-xl p-8 md:p-12 border border-[#e1dac2] shadow-[0_25px_50px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden">
              <SpiralBinderHoles />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center pl-8">
                {/* Left Story Text */}
                <div className="md:col-span-6 text-left flex flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                        DIARY PAGE 01
                      </span>
                      <span className="font-mono text-[9px] text-amber-800 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {TIMELINE_MEMORIES[0].date}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#451a03] italic">
                      {TIMELINE_MEMORIES[0].title}
                    </h3>

                    <p className="mt-4 font-cursive text-2xl leading-relaxed text-stone-800 tracking-wide pr-3">
                      {TIMELINE_MEMORIES[0].message}
                    </p>
                  </div>

                  {/* Footprint player */}
                  <div className="mt-4">
                    <AudioPlayerMini
                      id={1}
                      duration={TIMELINE_MEMORIES[0].voiceNoteDuration || "0:45"}
                      isPlaying={states.playingVoiceId === 1}
                      onToggle={() => toggleVoiceNote(1)}
                    />
                  </div>
                </div>

                {/* Right Interactive Photo */}
                <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
                  {/* Underlay revealed secret diary snippet */}
                  <div className="absolute inset-4 rounded-xl border-2 border-dashed border-rose-500/25 bg-rose-50/50 p-6 flex flex-col items-center justify-center text-center select-none">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mb-2 animate-pulse text-[#b45309]">🌴</div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#78350f] font-extrabold">Secret Diary Unveiled</span>
                    <p className="font-cursive text-lg text-stone-700 mt-2 max-w-xs leading-snug font-bold">
                      "We actually forgot our suncream and had to use strawberry yogurt from the cooler! That's why we smell like fruit punch here!"
                    </p>
                  </div>

                  {/* Drag-Covering Polaroid */}
                  {!states.hasBeachStickerPeeled ? (
                    <motion.div
                      className="relative w-64 p-3 bg-white rounded-xs shadow-xl cursor-default border border-zinc-100 z-10"
                      whileHover={{ scale: 1.04, rotate: -2 }}
                      style={{ rotate: 3 }}
                    >
                      {/* Adhesive overlay */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-yellow-100/40 backdrop-blur-3xs border-x border-dashed border-zinc-200 pointer-events-none" />
                      
                      <div className="relative aspect-square overflow-hidden rounded-xs bg-[#050508]">
                        <img src={TIMELINE_MEMORIES[0].photoUrl} alt="Beach snapshot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      <div className="mt-3 text-center">
                        <button
                          onClick={() => setStates(prev => ({ ...prev, hasBeachStickerPeeled: true }))}
                          className="interactive-hover px-3 py-1 bg-[#1e1b4b] hover:bg-amber-600 text-[8.5px] font-mono text-white tracking-widest uppercase rounded-full focus:outline-hidden"
                        >
                          Peel Sticker open
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="absolute top-2 right-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-950 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md select-none z-30"
                      onClick={() => setStates(prev => ({ ...prev, hasBeachStickerPeeled: false }))}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <span className="font-mono text-[8px] uppercase tracking-widest font-extrabold text-amber-950">Seal Photo Back</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= PANEL 2: THE COFFEE CAFE (PULL OUT NAPKIN) ================= */}
          <div className="w-[85vw] md:w-[88vw] shrink-0 h-full flex items-center pr-[5vw] relative">
            <div className="relative w-full h-[70vh] bg-[#fcfaf4] text-[#1c1917] rounded-xl p-8 md:p-12 border border-[#e1dac2] shadow-[0_25px_50px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden">
              <SpiralBinderHoles />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center pl-8">
                <div className="md:col-span-6 text-left flex flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#1e3a8a] bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md font-bold">
                        DIARY PAGE 02
                      </span>
                      <span className="font-mono text-[9px] text-amber-800 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {TIMELINE_MEMORIES[1].date}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#451a03] italic">
                      {TIMELINE_MEMORIES[1].title}
                    </h3>

                    <p className="mt-4 font-cursive text-2xl leading-relaxed text-stone-800 tracking-wide pr-3">
                      {TIMELINE_MEMORIES[1].message}
                    </p>
                  </div>

                  <div className="mt-4">
                    <AudioPlayerMini
                      id={2}
                      duration={TIMELINE_MEMORIES[1].voiceNoteDuration || "1:12"}
                      isPlaying={states.playingVoiceId === 2}
                      onToggle={() => toggleVoiceNote(2)}
                    />
                  </div>
                </div>

                {/* NAPKIN POCKET CONTAINER */}
                <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
                  <div className="relative w-64 h-52 bg-[#3f200c] border-2 border-[#d97706]/40 rounded-xl flex flex-col items-center justify-center shadow-2xl overflow-visible select-none">
                    {/* Decorative envelope seal flap */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-[#321706] border-b border-[#d97706]/20 rounded-t-xl" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />

                    <span className="text-3xl">☕🎨</span>
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#fcd34d] font-bold mt-2 text-center">Cafe Napkin Pocket</p>

                    <button
                      onClick={() => setStates(prev => ({ ...prev, isNapkinPulled: !prev.isNapkinPulled }))}
                      className="interactive-hover mt-3.5 px-4 py-1.5 rounded-full bg-amber-400 hover:bg-yellow-400 text-zinc-950 font-mono text-[8px] uppercase tracking-widest font-extrabold focus:outline-hidden"
                    >
                      {states.isNapkinPulled ? "Push napkin sketch back" : "Pull Napkin out"}
                    </button>

                    {/* FLOATING NAPKIN PIECE SKETCH POPPORT */}
                    <AnimatePresence>
                      {states.isNapkinPulled && (
                        <motion.div
                          className="absolute z-50 w-52 p-4 bg-stone-50 text-stone-900 shadow-2xl border border-zinc-200 rounded-sm text-center transform"
                          initial={{ y: 150, opacity: 0, scale: 0.8, rotate: -15 }}
                          animate={{ y: -72, opacity: 1, scale: 1.12, rotate: 3 }}
                          exit={{ y: 150, opacity: 0, scale: 0.8, rotate: -15 }}
                          transition={{ type: "spring", stiffness: 95, damping: 11 }}
                        >
                          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-b from-stone-200 to-transparent border-t border-dashed border-stone-400" />
                          <span className="font-mono text-[7px] text-stone-400 tracking-widest block uppercase font-bold">Orig sketch #04</span>
                          <div className="text-3xl my-2">🐈🐈‍⬛☕</div>
                          <p className="font-cursive text-md text-stone-800 leading-tight">
                            "A tiny portrait of Olivia's clumsy fat cat. Sarah drew it using brown espresso froth drops!"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PANEL 3: MIDNIGHT BAKING (CREAM WIPING) ================= */}
          <div className="w-[85vw] md:w-[88vw] shrink-0 h-full flex items-center pr-[5vw] relative">
            <div className="relative w-full h-[70vh] bg-[#fcfaf4] text-[#1c1917] rounded-xl p-8 md:p-12 border border-[#e1dac2] shadow-[0_25px_50px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden">
              <SpiralBinderHoles />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center pl-8">
                <div className="md:col-span-6 text-left flex flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#9d174d] bg-pink-100 border border-pink-300 px-2 py-0.5 rounded-md font-bold">
                        DIARY PAGE 03
                      </span>
                      <span className="font-mono text-[9px] text-amber-800 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {TIMELINE_MEMORIES[2].date}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#451a03] italic">
                      {TIMELINE_MEMORIES[2].title}
                    </h3>

                    <p className="mt-4 font-cursive text-2xl leading-relaxed text-stone-800 tracking-wide pr-3">
                      {TIMELINE_MEMORIES[2].message}
                    </p>
                  </div>

                  <div className="mt-4">
                    <AudioPlayerMini
                      id={3}
                      duration={TIMELINE_MEMORIES[2].voiceNoteDuration || "0:28"}
                      isPlaying={states.playingVoiceId === 3}
                      onToggle={() => toggleVoiceNote(3)}
                    />
                  </div>
                </div>

                <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
                  <div className="relative w-64 p-3 bg-white border border-zinc-200 rounded-sm shadow-lg overflow-hidden select-none">
                    <img src={TIMELINE_MEMORIES[2].photoUrl} alt="Volcano cake" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />

                    {/* SPLATTER FROSTING OVERLAY */}
                    <AnimatePresence>
                      {!states.isCreamWiped && (
                        <motion.div
                          className="absolute inset-3 bg-white/95 border-2 border-dashed border-amber-300/40 flex flex-col items-center justify-center p-4 cursor-pointer text-center z-10"
                          exit={{ opacity: 0, scale: 0.9, y: 40 }}
                          onClick={() => setStates(prev => ({ ...prev, isCreamWiped: true }))}
                        >
                          <span className="text-3xl animate-bounce">🍦🧁</span>
                          <span className="font-mono text-[8px] uppercase tracking-widest text-amber-900 font-bold mt-2">Whipped Frosting Bloob</span>
                          <p className="font-cursive text-sm text-stone-600 mt-1">
                            A huge blob of double frosting shot right at the camera lens! Click to wipe it clear.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-2 text-center">
                      <span className="font-cursive text-md text-stone-700 font-bold">2:00 AM Volcano Rise</span>
                      {states.isCreamWiped && (
                        <button
                          onClick={() => setStates(prev => ({ ...prev, isCreamWiped: false }))}
                          className="block text-[7.5px] font-mono tracking-widest uppercase text-red-700 mt-1 mx-auto font-bold"
                        >
                          Put Cream Back On Lens
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PANEL 4: SUNSET PATH DRIVE (MIDNIGHT NIGHTLITE TOGGLE) ================= */}
          <div className="w-[85vw] md:w-[88vw] shrink-0 h-full flex items-center pr-[5vw] relative">
            <div
              className="relative w-full h-[70vh] rounded-xl p-8 md:p-12 border border-[#e1dac2] shadow-[0_25px_50px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden transition-all duration-700"
              style={{
                backgroundColor: states.isStarsToggled ? "#020102" : "#fcfaf4",
                color: states.isStarsToggled ? "#f3f4f6" : "#1c1917"
              }}
            >
              <SpiralBinderHoles />

              {/* Constellation twinkling sparks */}
              {states.isStarsToggled && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {Array.from({ length: 15 }).map((_, rIdx) => (
                    <motion.div
                      key={rIdx}
                      className="absolute rounded-full bg-yellow-300 w-1 h-1 shadow-md"
                      style={{
                        top: `${Math.random() * 95}%`,
                        left: `${Math.random() * 95}%`,
                      }}
                      animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5 + Math.random() * 2.5, repeat: Infinity }}
                    />
                  ))}
                  <div className="absolute top-[15%] right-[15%] opacity-20 w-44 h-44 bg-cyan-500/25 rounded-full blur-3xl" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center pl-8 relative z-10">
                <div className="md:col-span-6 text-left flex flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#065f46] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md font-bold">
                        DIARY PAGE 04
                      </span>
                      <span className={`font-mono text-[9px] font-semibold flex items-center gap-1 ${states.isStarsToggled ? "text-emerald-400" : "text-amber-800"}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {TIMELINE_MEMORIES[3].date}
                      </span>
                    </div>

                    <h3 className={`text-2xl sm:text-3xl font-serif font-black tracking-tight italic ${states.isStarsToggled ? "text-amber-200" : "text-[#451a03]"}`}>
                      {TIMELINE_MEMORIES[3].title}
                    </h3>

                    <p className={`mt-4 font-cursive text-2xl leading-relaxed tracking-wide pr-3 ${states.isStarsToggled ? "text-zinc-200" : "text-stone-800"}`}>
                      {TIMELINE_MEMORIES[3].message}
                    </p>
                  </div>

                  <div className="mt-4">
                    <AudioPlayerMini
                      id={4}
                      duration={TIMELINE_MEMORIES[3].voiceNoteDuration || "1:35"}
                      isPlaying={states.playingVoiceId === 4}
                      onToggle={() => toggleVoiceNote(4)}
                    />
                  </div>
                </div>

                {/* Stars flash slider trigger */}
                <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
                  <div className={`relative w-64 p-3 rounded-sm shadow-xl border transition-colors duration-500 overflow-hidden ${states.isStarsToggled ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"}`}>
                    <img src={TIMELINE_MEMORIES[3].photoUrl} alt="Starry path sunset" className="w-full h-40 object-cover" />
                    
                    <div className="p-2 text-center">
                      <p className={`font-cursive text-md leading-none font-bold ${states.isStarsToggled ? "text-zinc-250 animate-pulse" : "text-zinc-800"}`}>"Meet me at the sunrise peak!"</p>

                      <button
                        onClick={() => setStates(prev => ({ ...prev, isStarsToggled: !prev.isStarsToggled }))}
                        className={`mt-3 py-1.5 px-3 rounded-full font-mono text-[8px] uppercase tracking-widest font-extrabold focus:outline-hidden transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                          states.isStarsToggled
                            ? "bg-amber-400 text-zinc-950 font-bold"
                            : "bg-[#111827] text-white hover:bg-amber-600"
                        }`}
                      >
                        {states.isStarsToggled ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        {states.isStarsToggled ? "Turn On Daytime" : "Toggle Midnight constellations"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PANEL 5: SUMMARY CLOSING COLLAGE ================= */}
          <div className="w-[90vw] md:w-[94vw] shrink-0 h-full flex items-center pr-[12vw] relative">
            <div className="relative w-full max-w-4xl h-[72vh] flex flex-col justify-between p-8 select-none text-center">
              
              <div className="relative z-10 text-center">
                <span className="font-mono text-[9px] text-amber-400 uppercase tracking-[0.3em] font-black flex items-center justify-center gap-1.5 mb-1 select-none">
                  📔 Scrapbook Safe Closed
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-black italic text-amber-100 leading-tight">
                  Yesterday, Today & Forever
                </h2>
                <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2 opacity-50" />
              </div>

              {/* Spread layouts */}
              <div className="grid grid-cols-4 gap-4 my-6 relative z-10 max-w-2xl mx-auto">
                {/* 1 */}
                <div className="p-1 bg-white shadow-xl rounded-2xs transform rotate-[-6deg] hover:scale-110 hover:-translate-y-4 transition-all border border-zinc-200">
                  <img src={TIMELINE_MEMORIES[0].photoUrl} alt="" className="w-28 h-18 object-cover" />
                  <p className="font-cursive text-[10px] text-zinc-950 font-bold mt-1 text-center">Summer '12</p>
                </div>
                {/* 2 */}
                <div className="p-1 bg-white shadow-xl rounded-2xs transform rotate-[10deg] hover:scale-110 hover:-translate-y-4 transition-all border border-zinc-200">
                  <img src={TIMELINE_MEMORIES[1].photoUrl} alt="" className="w-28 h-18 object-cover" />
                  <p className="font-cursive text-[10px] text-zinc-950 font-bold mt-1 text-center">Winter '16</p>
                </div>
                {/* 3 */}
                <div className="p-1 bg-white shadow-xl rounded-2xs transform rotate-[-4deg] hover:scale-110 hover:-translate-y-4 transition-all border border-zinc-200">
                  <img src={TIMELINE_MEMORIES[2].photoUrl} alt="" className="w-28 h-18 object-cover" />
                  <p className="font-cursive text-[10px] text-zinc-950 font-bold mt-1 text-center">Oct '20</p>
                </div>
                {/* 4 */}
                <div className="p-1 bg-white shadow-xl rounded-2xs transform rotate-[5deg] hover:scale-110 hover:-translate-y-4 transition-all border border-zinc-200">
                  <img src={TIMELINE_MEMORIES[3].photoUrl} alt="" className="w-28 h-18 object-cover" />
                  <p className="font-cursive text-[10px] text-zinc-950 font-bold mt-1 text-center">May '23</p>
                </div>
              </div>

              <div className="relative z-10 max-w-lg mx-auto bg-amber-950/20 border border-amber-500/25 p-5 rounded-xl">
                <p className="font-cursive text-2xl text-amber-200 leading-snug tracking-wide italic">
                  "The visitor spent 10 minutes traveling inside someone's deepest memories, not 10 minutes browsing a generic website."
                </p>
              </div>

              <div className="relative z-10 pb-4">
                <div className="w-12 h-0.5 bg-yellow-500/30 mx-auto mb-2" />
                <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                  Scroll down to step into the next chapter
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Side binder rings
function SpiralBinderHoles() {
  return (
    <div className="absolute left-[3px] sm:left-[8px] top-0 bottom-0 flex flex-col justify-evenly pointer-events-none z-30 select-none">
      {Array.from({ length: 11 }).map((_, hIdx) => (
        <div key={hIdx} className="relative w-5 h-5 flex items-center justify-center my-1">
          <div className="w-2.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-950 shadow-inner" />
          <div className="absolute -left-1 w-6 h-4 border-2 border-amber-700/60 rounded-full bg-gradient-to-r from-amber-600/60 via-yellow-450 to-neutral-900 shadow-md transform rotate-12" />
        </div>
      ))}
    </div>
  );
}

// Mini audio soundtrack playback
interface MiniAudioProps {
  id: number;
  duration: string;
  isPlaying: boolean;
  onToggle: () => void;
}

function AudioPlayerMini({ id, duration, isPlaying, onToggle }: MiniAudioProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 select-none">
        <Volume2 className="w-3.5 h-3.5 text-[#854d0e] animate-pulse" />
        <span className="font-sans text-[8.5px] uppercase tracking-widest font-bold text-[#854d0e]">
          Auditory Footprint Note
        </span>
      </div>

      <div className="bg-[#f5ecda] p-2.5 rounded-xl flex items-center gap-3 border border-[#ebdcb8] shadow-xs">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-full bg-[#78350f] hover:bg-amber-900 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer focus:outline-hidden"
        >
          {isPlaying ? (
            <span className="text-[10px] text-amber-300 font-bold uppercase font-mono">■</span>
          ) : (
            <span className="text-[10px] text-white font-bold ml-0.5 uppercase font-mono">▶</span>
          )}
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex gap-[1.5px] items-end h-4 py-0.5 overflow-hidden">
            {Array.from({ length: 22 }).map((_, wIdx) => (
              <motion.div
                key={wIdx}
                className={`w-[1.8px] rounded-full shrink-0 ${isPlaying ? "bg-[#78350f]" : "bg-[#c4b397]"}`}
                animate={{
                  height: isPlaying ? [3, 13, 5, 10, 3][(wIdx + id) % 5] : 3,
                }}
                transition={{ duration: 0.5 + wIdx * 0.012, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[7px] font-mono uppercase tracking-widest text-[#9a3412] mt-1 select-none">
            <span>{isPlaying ? "Streaming tape..." : "Tape footprint Audio"}</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
