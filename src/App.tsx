/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import IntroScreen from "./components/intro/IntroScreen";
import HeroSection from "./components/hero/HeroSection";
import TimelineMemories from "./components/memories/TimelineMemories";
import HiddenLetters from "./components/memories/HiddenLetters";
import FloatingMemoryRoom from "./components/gallery/FloatingMemoryRoom";
import CakeCutting from "./components/cake/CakeCutting";
import MusicPlayer from "./components/music/MusicPlayer";
import CustomCursor from "./components/common/CustomCursor";
import Lenis from "lenis";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [readingProgressDimOverride, setReadingProgressDimOverride] =
    useState(1.0);
  const [cursorMode, setCursorMode] = useState<"default" | "knife">("default");
  const [hasOpenedLetter, setHasOpenedLetter] = useState(false);

  // Activate cinematic Lenis smooth scroll
  useEffect(() => {
    if (!isUnlocked) return;
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // organic gravity-glide curve
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isUnlocked]);

  return (
    <div
      id="application-sandbox-frame"
      className="relative text-white min-h-screen selection:bg-amber-400 selection:text-zinc-950"
    >
      {/* 1. Interactive 60fps custom visual cursor */}
      <CustomCursor mode={cursorMode} />

      {!isUnlocked ? (
        // VAULT DOOR LOCK PAGE
        <IntroScreen
          onUnlockComplete={() => setIsUnlocked(true)}
          onPlayTrigger={() => setIsPlayingMusic(true)}
        />
      ) : (
        // UNLOCKED BEAUTIFUL BIRTHDAY EXPERIENCE CORES
        <div
          id="unlocked-experience-road"
          className={`relative overflow-x-hidden ${!hasOpenedLetter ? "h-screen overflow-hidden" : "overflow-visible"}`}
        >
          {/* Hero space greetings */}
          <HeroSection
            onReadComplete={() => {
              setHasOpenedLetter(true);
            }}
            hasOpenedLetter={hasOpenedLetter}
          />

          {hasOpenedLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Archive timeline street with audio tracks */}
              <TimelineSectionHolder />

              {/* Vintage sealed envelope mailbox desk */}
              <HiddenLetters
                onReadingStatusChange={(isReading) => {
                  // Dim active soundtracks volume level during active focused reading mode
                  setReadingProgressDimOverride(isReading ? 0.15 : 1.0);
                }}
              />

              {/* Mouse perspective interactive 3D gallery */}
              <FloatingMemoryRoom />

              {/* Interactive tactile cake slicing ritual */}
              <CakeCutting
                onToggleKnifeCursor={(active) => {
                  setCursorMode(active ? "knife" : "default");
                }}
              />
            </motion.div>
          )}

          {/* Spotify layout background streaming system */}
          <MusicPlayer
            isPlayingGlobal={isPlayingMusic}
            onPlayingGlobalChange={setIsPlayingMusic}
            overrideVolume={readingProgressDimOverride}
          />
        </div>
      )}
    </div>
  );
}

// Layout wrapper for Section 2 to add neat typography styling dividers
function TimelineSectionHolder() {
  return (
    <div className="relative">
      {/* Top jagged transition border */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#050508] to-[#06060a] z-20 pointer-events-none" />
      <TimelineMemories />
      {/* Bottom jagged transition border */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#040406] to-[#06060a] z-20 pointer-events-none" />
    </div>
  );
}
