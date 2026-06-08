/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CELEBRATION_CONFIG,
  INSTALLED_ASSETS,
  TIMELINE_MEMORIES,
} from "../../data/const";
import {
  Sparkles,
  Heart,
  ChevronRight,
  Volume2,
  Snowflake,
  Eye,
} from "lucide-react";
import { SoundManager } from "../music/SoundManager";

interface HeroSectionProps {
  onReadComplete: () => void;
  hasOpenedLetter: boolean;
}

export default function HeroSection({
  onReadComplete,
  hasOpenedLetter,
}: HeroSectionProps) {
  // Keepsake chest states
  // Steps:
  // 0: Wrapped vintage keepsake chest (closed, velvet ribbon, central wax seal)
  // 1: Wax seal cracked (sound played, ribbon dissolved)
  // 2: Keepsake box opening (lid lift, layered documents appear)
  // 3: Camera Zoom closer, core paper rises up
  // 4: Letter fully unfolded (gradual handwriting, polaroid snaps slide out)
  const [chestStep, setChestStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [typingText, setTypingText] = useState("");
  const [photosPopped, setPhotosPopped] = useState(false);

  const letterMessage = `Dearest ${CELEBRATION_CONFIG.celebrantName},\n\nToday marks another beautiful chapter of yours. The world became lighter, warmer, and infinitely more joyful the moment you entered it.\n\nWe have gathered a secret archive of your golden years, spontaneous laughs, and quiet moments of wonder. Inside this personal memory box, you'll travel through the thread of yesterday and discover vintage snapshots of your journey.\n\nTake a deep breath, listen closely to the melodies, and let the nostalgia guide you.\n\nWith all our love, always. ❤️`;

  // Change atmosphere automatically when chest opens
  useEffect(() => {
    if (chestStep >= 2) {
      SoundManager.setAtmosphere("piano");
    }
  }, [chestStep]);

  // Handwriting typewriter
  useEffect(() => {
    if (chestStep !== 4) return;
    let index = 0;
    setTypingText("");
    const interval = setInterval(() => {
      if (index < letterMessage.length) {
        setTypingText((prev) => prev + letterMessage.charAt(index));
        index++;
        if (index % 12 === 0) {
          SoundManager.playSFX("click"); // gentle dry ticking
        }
      } else {
        clearInterval(interval);
        setPhotosPopped(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [chestStep]);

  const handleBoxClick = () => {
    if (chestStep === 0) {
      // Crack Wax Seal
      setChestStep(1);
      SoundManager.playSFX("wax_crack");

      // Unwrap Ribbon
      setTimeout(() => {
        setChestStep(2);
        SoundManager.playSFX("paper");
      }, 1000);

      // Open Box & Zoom
      setTimeout(() => {
        setChestStep(3);
        SoundManager.playSFX("metal_lock");
      }, 2200);

      // Rise core document and trigger typing
      setTimeout(() => {
        setChestStep(4);
        SoundManager.playSFX("chime");
      }, 3400);
    }
  };

  return (
    <div
      id="hero-keepsake-chest-root"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0706] px-4 py-12"
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(38, 24, 18, 0.4) 0%, rgba(5, 5, 8, 1) 90%), url(${INSTALLED_ASSETS.luxuryMeshBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Table Setting & Flickering Candle light leak */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-radial-gradient bg-[#f59e0b]/5 opacity-30 pointer-events-none filter blur-[100px] animate-pulse-slow" />

      {/* Retro particles floating around */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400 opacity-15 filter blur-[1px]"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0.1, 0.35, 0.1],
            }}
            transition={{
              duration: 7 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {chestStep < 4 ? (
          // INTERACTIVE KEEPSAKE CHEST ON TABLE
          <motion.div
            key="keepsake-box-container"
            className="relative flex flex-col items-center z-20 max-w-xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 1.0 }}
          >
            {/* Guide labels */}
            <div className="text-center mb-10 select-none">
              <span className="font-mono text-[10px] text-amber-500 uppercase tracking-[0.35em] font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                Royal Kept Keepsake Case
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-zinc-200 mt-2 italic">
                {chestStep === 0 &&
                  "Crack the wax stamp to release the ribbons..."}
                {chestStep === 1 && "The ribbon is unravelling..."}
                {chestStep === 2 && "Unlatching the memory chest..."}
                {chestStep === 3 && "Lifting the parchment papers..."}
              </h2>
            </div>

            {/* HANDCRAFTED KEEPSAKE BOX CONTAINER */}
            <motion.div
              id="handcrafted-keepsake-case"
              onClick={handleBoxClick}
              className={`relative w-80 h-64 sm:w-[500px] sm:h-80 bg-gradient-to-br from-[#1e130c] via-[#120b08] to-[#0a0604] border-2 border-amber-500/20 rounded-2xl shadow-[0_45px_90px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden ${
                chestStep === 0
                  ? "hover:border-amber-400/35 transition-colors"
                  : ""
              }`}
              style={{ perspective: 1200 }}
              animate={
                chestStep === 3
                  ? { scale: 1.08, rotateX: 12, rotateY: -6 }
                  : { y: [-6, 6, -6] }
              }
              transition={{
                duration: 4,
                repeat: chestStep === 3 ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Velvet Lining shadow */}
              <div className="absolute inset-0 bg-radial-gradient bg-black/40 mix-blend-multiply" />

              {/* Gold Outline Foil Accents */}
              <div className="absolute inset-2 border border-amber-500/10 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-500/5 rounded-lg pointer-events-none" />

              {/* RIBBON WRAPPING LINES */}
              {chestStep === 0 && (
                <>
                  {/* Velvet red ribbon wraps with delicate shadows */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 bg-gradient-to-r from-red-800 via-red-600 to-red-800 shadow-2xl z-10" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 sm:h-12 bg-gradient-to-b from-red-800 via-red-600 to-red-800 shadow-2xl z-10" />
                </>
              )}

              {/* WAX SEAL STAMP IN THE INTERSECTION */}
              {chestStep <= 1 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                  <motion.div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative cursor-pointer ${
                      chestStep === 1
                        ? "bg-[#6b0f0f] border-2 border-red-900 shadow-inner"
                        : "bg-radial-gradient bg-[#9a3412] hover:bg-[#b45309] border-2 border-amber-300 shadow-[0_8px_30px_rgba(251,191,36,0.5)]"
                    }`}
                    animate={
                      chestStep === 1
                        ? { scale: [1, 0.85], opacity: 0.2, rotate: 45 }
                        : { scale: [1, 1.04, 1] }
                    }
                    transition={{
                      duration: chestStep === 1 ? 0.8 : 2.5,
                      repeat: chestStep === 1 ? 0 : Infinity,
                    }}
                  >
                    <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/25" />
                    <Heart
                      className={`w-7 h-7 sm:w-8 sm:h-8 fill-current ${chestStep === 1 ? "text-red-950" : "text-amber-100"}`}
                    />

                    {/* Crack effect inside wax stamp */}
                    {chestStep === 1 && (
                      <div
                        className="absolute inset-0 bg-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(55deg, transparent 48%, #1f0404 50%, transparent 52%)",
                        }}
                      />
                    )}
                  </motion.div>
                  {chestStep === 0 && (
                    <span className="text-[8px] font-mono tracking-widest uppercase text-amber-300 bg-black/85 px-2.5 py-0.5 rounded-full border border-amber-500/20 mt-4 animate-pulse whitespace-nowrap">
                      Crack Wax Seal
                    </span>
                  )}
                </div>
              )}

              {/* LAYERS OF OLD PAPERS & REVEALING ENVELOPE SEEDS inside box */}
              {chestStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.0 }}
                  className="absolute inset-4 bg-[#fbfbf8] rounded-lg border border-[#eadaa6] p-4 flex flex-col justify-between text-[#2e1f0e] shadow-inner"
                >
                  <div className="border-b border-amber-900/10 pb-2 mb-2">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#9a3412] font-semibold">
                      Memoir Archive Dossier #01
                    </span>
                    <h4 className="font-serif italic font-bold text-md tracking-tight">
                      The Sarah Chapters
                    </h4>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2 border border-amber-250">
                      <Heart className="w-5 h-5 text-[#b45309]" />
                    </div>
                    <p className="font-serif text-sm italic font-medium max-w-xs text-zinc-700">
                      "The chest holds stacked polaroids and letters locked
                      since Est. {CELEBRATION_CONFIG.birthYear}"
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[7px] text-zinc-400">
                      PULLING RECORD CORE...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Bottom text marking chest credentials */}
              {chestStep === 0 && (
                <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-10">
                  <p className="font-serif text-amber-250/30 text-[9px] uppercase tracking-[0.3em]">
                    SECURED MEMORY BOX • EST. {CELEBRATION_CONFIG.birthYear}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // STAGE 4: PREMIUM LETTER CORES FULLY REVEALED
          <motion.div
            key="royal-presentation-document"
            className="relative z-30 max-w-2xl w-full bg-[#fbfaf6] rounded-2xl p-6 sm:p-14 border border-[#eadaac] text-[#221c17] shadow-[0_35px_90px_rgba(0,0,0,0.92)] select-none overflow-visible"
            initial={{ opacity: 0, scale: 0.8, y: 200 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: -100, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            {/* Soft Lined parchment style rules */}
            <div
              className="absolute inset-0 opacity-[0.12] pointer-events-none rounded-2xl"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(#a37841 0px, #a37841 1px, transparent 1px, transparent 28px)",
                backgroundPosition: "0 40px",
              }}
            />

            {/* Floating Polaroid Photos emerging from behind the letter */}
            <AnimatePresence>
              {photosPopped && (
                <>
                  {/* Polaroid Photo 1 Offset Slide */}
                  <motion.div
                    initial={{ opacity: 0, x: -120, rotate: -15, scale: 0.8 }}
                    animate={{ opacity: 1, x: -160, rotate: -8, scale: 1 }}
                    transition={{ duration: 1.2, type: "spring" }}
                    className="absolute -left-16 bottom-16 w-36 bg-white p-2.5 rounded shadow-2xl border border-zinc-200 hidden md:flex flex-col"
                  >
                    <img
                      src={TIMELINE_MEMORIES[0].photoUrl}
                      alt="Nostalgia memories"
                      className="w-full h-24 object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-serif italic text-[10px] text-zinc-700 text-center mt-2 font-semibold">
                      "Pure laughing days"
                    </p>
                  </motion.div>

                  {/* Polaroid Photo 2 Offset Slide */}
                  <motion.div
                    initial={{ opacity: 0, x: 120, rotate: 15, scale: 0.8 }}
                    animate={{ opacity: 1, x: 160, rotate: 12, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
                    className="absolute -right-16 top-16 w-36 bg-white p-2.5 rounded shadow-2xl border border-zinc-200 hidden md:flex flex-col"
                  >
                    <img
                      src={TIMELINE_MEMORIES[1].photoUrl}
                      alt="Golden moments"
                      className="w-full h-24 object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-serif italic text-[10px] text-zinc-700 text-center mt-2 font-semibold">
                      "Comfort of yesterday"
                    </p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Document Header with Royal Stamp representation */}
            <div className="flex justify-between items-start border-b border-[#a37841]/25 pb-5 mb-8 relative z-10">
              <div className="text-left">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#b45309] bg-[#b45309]/5 px-3 py-1 rounded-full border border-[#b45309]/20 font-bold">
                  Secret Archive Memoir File
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-zinc-900 mt-3.5 leading-none tracking-tight">
                  Happy Birthday, {CELEBRATION_CONFIG.celebrantName}!
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#854d0e] mt-2 flex items-center gap-1">
                  <Snowflake className="w-3 h-3 text-[#b45309] animate-spin" />
                  Gilded Edition • Delivered{" "}
                  {CELEBRATION_CONFIG.birthDateFormatted}
                </p>
              </div>

              {/* Handcrafted Postage graphic Stamp */}
              <div className="w-12 h-14 border-2 border-dashed border-[#b45309]/25 bg-[#b45309]/5 hidden sm:flex flex-col items-center justify-center rounded relative shadow-xs">
                <span className="text-xl">🏵️</span>
                <div className="absolute bottom-1 font-mono text-[5px] tracking-widest text-[#a37841]">
                  VINTAGE
                </div>
              </div>
            </div>

            {/* Gradually typing handwriting area */}
            <div className="min-h-[220px] max-h-[350px] overflow-y-auto pr-2 no-scrollbar relative z-10 text-left">
              <p className="font-serif text-xl sm:text-2xl text-zinc-800 tracking-wide whitespace-pre-wrap leading-relaxed font-medium capitalize">
                {typingText}
                {typingText.length < letterMessage.length && (
                  <span className="inline-block w-1 h-5 bg-[#b45309] ml-0.5 animate-pulse" />
                )}
              </p>
            </div>

            {/* Dynamic Polaroids inside mobile portrait if too tight */}
            {photosPopped && (
              <div className="flex md:hidden gap-3.5 mt-6 border-t border-[#a37841]/10 pt-4">
                <div className="flex-1 bg-white p-1.5 rounded shadow border border-zinc-100 flex flex-col">
                  <img
                    src={TIMELINE_MEMORIES[0].photoUrl}
                    alt=""
                    className="w-full h-16 object-cover rounded-xs"
                  />
                  <span className="font-serif italic text-[8px] text-zinc-600 text-center mt-1">
                    Laughs
                  </span>
                </div>
                <div className="flex-1 bg-white p-1.5 rounded shadow border border-zinc-100 flex flex-col">
                  <img
                    src={TIMELINE_MEMORIES[1].photoUrl}
                    alt=""
                    className="w-full h-16 object-cover rounded-xs"
                  />
                  <span className="font-serif italic text-[8px] text-zinc-600 text-center mt-1">
                    Warmth
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Letter CTAs */}
            <div className="mt-10 border-t border-[#a37841]/15 pt-6 flex justify-between items-center relative z-10">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                Read with Warmth • Next: Unlock the timeline
              </span>

              <button
                id="enter-scrapbook-btn"
                onClick={onReadComplete}
                className="interactive-hover px-6 py-3.5 rounded-full bg-[#1e1b4b] hover:bg-amber-700 active:scale-95 text-white font-mono text-xs uppercase tracking-widest transition-all shadow-lg ml-auto flex items-center gap-2 cursor-pointer border border-amber-500/20"
              >
                Assemble Timeline Route
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
