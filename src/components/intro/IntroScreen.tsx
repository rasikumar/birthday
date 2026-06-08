/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CELEBRATION_CONFIG, INSTALLED_ASSETS } from "../../data/const";
import { Sparkles, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { SoundManager } from "../music/SoundManager";

interface IntroScreenProps {
  onUnlockComplete: () => void;
  onPlayTrigger: () => void;
}

export default function IntroScreen({
  onUnlockComplete,
  onPlayTrigger,
}: IntroScreenProps) {
  const [pin, setPin] = useState<string>("");
  const [isWrong, setIsWrong] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  // Transition chronology stage tracker
  const [transitionStage, setTransitionStage] = useState<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | null
  >(null);

  // Target passcode from config
  const TARGET_PASS = CELEBRATION_CONFIG.targetPassword;

  const handleCharInput = (val: string) => {
    if (isTransitioning) return;
    SoundManager.playSFX("click");
    if (pin.length < 8 && /^\d+$/.test(val)) {
      const newPin = pin + val;
      setPin(newPin);
    }
  };

  const handleBackspace = () => {
    if (isTransitioning) return;
    SoundManager.playSFX("click");
    setPin((prev) => prev.slice(0, -1));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key >= "0" && e.key <= "9") {
        handleCharInput(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isTransitioning]);

  // Monitor passcode target state
  useEffect(() => {
    if (pin.length === 8) {
      if (pin === TARGET_PASS) {
        triggerCinematicTransition();
      } else {
        // Red shake feedback
        setIsWrong(true);
        setShakeCount((prev) => prev + 1);
        const timer = setTimeout(() => {
          setIsWrong(false);
          setPin("");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [pin]);

  const triggerCinematicTransition = () => {
    setIsTransitioning(true);
    setTransitionStage(1);
    SoundManager.playSFX("heartbeat");
    onPlayTrigger(); // Notify outer tree

    // Sound repeating loops for high-friction cinematic heartbeat
    const beatInterval = setInterval(() => {
      SoundManager.playSFX("heartbeat");
    }, 600);

    // Stage 2: Vault lock activates, lock sounds, light leaks
    setTimeout(() => {
      setTransitionStage(2);
      SoundManager.playSFX("metal_lock");
    }, 1400);

    // Stage 3: Memory particles wave emerges
    setTimeout(() => {
      setTransitionStage(3);
      SoundManager.playSFX("sparkles");
    }, 2800);

    // Stage 4: Cinematic camera push forward zoom
    setTimeout(() => {
      setTransitionStage(4);
    }, 4200);

    // Stage 5: Memories begin floating around freely
    setTimeout(() => {
      setTransitionStage(5);
      SoundManager.playSFX("chime");
    }, 5600);

    // Stage 6: Background music crossfades in
    setTimeout(() => {
      setTransitionStage(6);
      SoundManager.setAtmosphere("mystery");
    }, 7000);

    // Stage 7: Blinding light clean transition fade out
    setTimeout(() => {
      clearInterval(beatInterval);
      setTransitionStage(7);
      SoundManager.playSFX("sparkles");
    }, 8400);

    // Final entry handover
    setTimeout(() => {
      onUnlockComplete();
    }, 9800);
  };

  return (
    <div
      id="intro-screen-container"
      className="fixed inset-0 z-50 overflow-hidden bg-[#040406] flex select-none"
    >
      <AnimatePresence>
        {!isTransitioning ? (
          // MAIN PASSCODE ENTRY SYSTEM
          <motion.div
            id="intro-grid-layout"
            className="w-full h-full flex flex-col md:flex-row"
            exit={{ scale: 1.15, opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{
              display: "flex",
            }}
          >
            {/* LEFT SIDE: Floating Polaroid artistic border */}
            <div className="w-full md:w-[45%] h-[40vh] md:h-full relative bg-[#06060c] flex items-center justify-center border-b md:border-b-0 md:border-r border-amber-500/10 p-4 sm:p-6 md:p-12 overflow-hidden">
              {/* Particle dust */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,163,115,0.06),transparent_60%)] animate-pulse-slow" />
              <div
                className="absolute inset-0 opacity-10 bg-repeat bg-center"
                style={{
                  backgroundImage: `url(${INSTALLED_ASSETS.luxuryMeshBg})`,
                  backgroundSize: "cover",
                }}
              />

              {/* Unique Organic Clip Frame */}
              <motion.div
                id="floating-parent-polaroid"
                className="relative z-10 polaroid-frame w-48 sm:w-56 md:w-64 lg:w-80 p-3 sm:p-4 md:p-5 flex flex-col rounded-sm ring-1 ring-amber-500/30"
                style={{
                  clipPath: "polygon(0% 2%, 100% 0%, 98% 98%, 2% 100%)",
                  maxWidth: "90%",
                }}
                animate={{
                  y: [-12, 12, -12],
                  rotate: [1, -2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Embedded Polaroid Image */}
                <div className="overflow-hidden bg-zinc-950 aspect-[4/5] relative rounded-xs">
                  <img
                    src={INSTALLED_ASSETS.vaultPolaroid}
                    alt="Birthday Memory Cover"
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Subtle water-ripple overlay */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 sm:gap-1.5 text-white/80 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest bg-black/40 px-1.5 sm:px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-300 animate-spin" />
                    Memory Box #01
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 md:mt-5 text-zinc-900 font-serif flex flex-col gap-0.5 select-none pt-2 border-t border-zinc-200">
                  <p className="text-xs sm:text-sm md:text-md italic tracking-tight font-medium">
                    "Time stands still here..."
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 mt-1">
                    EST. {CELEBRATION_CONFIG.birthYear}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: Password Wall Setup */}
            <div
              className="w-full md:w-[55%] h-[60vh] md:h-full relative flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-16"
              style={{
                backgroundImage: `linear-gradient(210deg, rgba(8,8,12,0.85) 0%, rgba(5,5,8,0.95) 100%), url(${INSTALLED_ASSETS.luxuryMeshBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Luxury gold glow spot */}
              <div className="absolute top-1/4 right-1/4 w-[25vw] h-[25vw] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />

              {/* Header */}
              <div className="w-full flex justify-between items-center z-10 gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-amber-500/80">
                    Secured Digital Artifact
                  </span>
                </div>
                <button
                  id="toggle-pass-hint"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="interactive-hover text-zinc-500 hover:text-amber-400 font-mono text-[8px] sm:text-[10px] tracking-wider uppercase transition-colors flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-white/5 rounded-full border border-white/5 active:scale-95"
                >
                  {showPassword ? (
                    <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  ) : (
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  )}
                  {showPassword ? "Hide Code" : "Peek Code"}
                </button>
              </div>

              {/* Password Core Panel */}
              <div className="max-w-md mx-auto w-full z-10 my-auto flex flex-col items-center px-2 sm:px-0">
                <motion.div
                  id="lock-icon-motion"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="p-2.5 sm:p-3.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 sm:mb-6 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                >
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center font-semibold text-white tracking-tight mb-2 px-2">
                  Enter The Memory Vault
                </h1>

                <p className="text-zinc-400 text-[10px] sm:text-xs text-center font-display tracking-wide max-w-xs mb-6 sm:mb-8 leading-relaxed px-2">
                  Provide the 8-digit date to crack open the vault of cherished
                  moments.
                </p>

                {/* Secret passcode dynamic grid cells */}
                <motion.div
                  id="passcode-digit-box"
                  key={shakeCount}
                  animate={
                    isWrong
                      ? {
                          x: [-10, 10, -8, 8, -5, 5, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                  className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 mb-6 flex-wrap justify-center px-2"
                >
                  {Array.from({ length: 8 }).map((_, index) => {
                    const char = pin[index];
                    const active = pin.length === index;
                    return (
                      <div
                        key={index}
                        className={`w-8 h-11 sm:w-9 sm:h-13 md:w-10 md:h-14 lg:w-12 lg:h-16 rounded-lg relative flex items-center justify-center font-mono text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-all duration-300 border-2 ${
                          isWrong
                            ? "border-red-500 bg-red-950/20 text-red-400"
                            : char
                              ? "border-amber-500 bg-amber-950/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                              : active
                                ? "border-amber-400 bg-amber-400/5 animate-pulse text-white"
                                : "border-zinc-800 bg-zinc-950/50 text-zinc-600"
                        }`}
                      >
                        {char ? (showPassword ? char : "•") : ""}
                        {/* Ripple particle effect inside dot */}
                        {char && (
                          <motion.div
                            className="absolute inset-0 border border-amber-400/40 rounded-lg"
                            initial={{ scale: 0.7, opacity: 1 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </motion.div>

                {/* Display Hint Container */}
                <AnimatePresence>
                  {showPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] sm:text-[11px] font-mono text-amber-400/80 tracking-wider text-center px-2"
                    >
                      💡 Hint: {CELEBRATION_CONFIG.passwordDisplayHint}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Embedded Dial buttons */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-48 sm:w-56 md:w-64 mt-4 sm:mt-6">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCharInput(num)}
                      className="interactive-hover h-10 sm:h-11 md:h-12 rounded-lg bg-zinc-900/40 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/30 font-mono text-base sm:text-lg text-zinc-300 hover:text-amber-400 font-medium transition-all duration-200 active:scale-95 flex items-center justify-center shadow-xs"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCharInput("0")}
                    className="interactive-hover col-start-2 h-10 sm:h-11 md:h-12 rounded-lg bg-zinc-900/40 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/30 font-mono text-base sm:text-lg text-zinc-300 hover:text-amber-400 font-medium transition-all duration-200 active:scale-95 flex items-center justify-center"
                  >
                    0
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="interactive-hover h-10 sm:h-11 md:h-12 rounded-lg bg-zinc-950/80 text-zinc-500 hover:text-red-400 border border-zinc-900 hover:border-red-500/20 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center text-center"
                  >
                    Del
                  </button>
                </div>
              </div>

              {/* Small Footnote */}
              <div className="w-full text-center z-10">
                <p className="text-[8px] sm:text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] leading-relaxed px-2">
                  © MMXVI • Designed Exclusively for{" "}
                  {CELEBRATION_CONFIG.celebrantName} • All Moments Sealed
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // COMPLETE 7-STAGE CINEMATIC LOCK OPENING SEQUENCE
          <motion.div
            id="cinematic-7stage-vault"
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {/* STAGE 1: Heartbeat pulse shadows */}
            {transitionStage === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center px-4"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-red-600/10 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)] mb-8"
                  animate={{ scale: [1, 1.25, 1, 1.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <Lock className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-serif text-zinc-300 italic">
                  "Gently, the chamber wakes..."
                </h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                  Stage 1: Interface Freeze & Breath Check
                </p>
              </motion.div>
            )}

            {/* STAGE 2: Metallic mechanism unlock + light leaks */}
            {transitionStage === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Simulated light leaks from boundary corners */}
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-amber-500/20 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/20 blur-[120px]" />

                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-amber-500/40 flex items-center justify-center text-amber-400 mb-8"
                >
                  <Unlock className="w-10 h-10" />
                </motion.div>
                <h3 className="text-xl font-serif text-zinc-200">
                  Releasing the Vintage Tumbler
                </h3>
                <p className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.25em] mt-2">
                  Stage 2: Metal lock mechanism active
                </p>
              </motion.div>
            )}

            {/* STAGE 3: Memory particles and stardust fill */}
            {transitionStage === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Floating particle dust elements */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 80 + 10}%`,
                      }}
                      animate={{
                        y: [0, -300],
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: 1.8 + Math.random() * 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                <div className="text-center z-20">
                  <h3 className="text-2xl font-serif italic text-white mb-2">
                    "Sifting through coordinates of gold..."
                  </h3>
                  <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                    Stage 3: Gathering nostalgic dust
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: Camera Push Zoom Portal */}
            {transitionStage === 4 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-center"
              >
                <div className="w-40 h-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)] animate-pulse flex items-center justify-center border border-amber-500/10 mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-500 animate-ping" />
                </div>
                <h3 className="text-xl font-serif text-amber-200">
                  Stepping into the dream...
                </h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                  Stage 4: Camera Zoom Push
                </p>
              </motion.div>
            )}

            {/* STAGE 5: Memories floating around the screen */}
            {transitionStage === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Swirling cards layout */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const xOffset = (i - 2.5) * 120;
                  const yOffset = Math.sin(i) * 50;
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-24 h-32 bg-white/10 rounded border border-white/20 p-2 shadow-2xl backdrop-blur-xs flex flex-col justify-between"
                      initial={{ scale: 0, x: 0, y: 100, rotate: 0 }}
                      animate={{
                        scale: 1,
                        x: xOffset + Math.sin(i) * 30,
                        y: yOffset,
                        rotate: (i - 2.5) * 15,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.1,
                        type: "spring",
                      }}
                    >
                      <div className="w-full h-20 bg-zinc-950/60 rounded-xs flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      </div>
                      <p className="text-[7px] font-mono tracking-wider text-center text-zinc-300 mt-1 uppercase">
                        MEMORIES
                      </p>
                    </motion.div>
                  );
                })}

                <div className="mt-80 text-center z-10">
                  <h3 className="text-2xl font-serif uppercase tracking-widest text-[#fff]">
                    "Everything is starting to float..."
                  </h3>
                  <p className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest mt-1">
                    Stage 5: Atmosphere levitation
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 6: Background music crossfaded - warm swell */}
            {transitionStage === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center max-w-md px-6"
              >
                <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 mb-6 border border-amber-400/30 animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-3xl font-serif font-semibold text-white tracking-tight">
                  The Space is Open
                </h3>
                <p className="font-display text-zinc-400 text-xs mt-2 uppercase tracking-widest max-w-xs leading-relaxed">
                  We built a nostalgic digital dimension from your golden
                  moments. Take a deep breath.
                </p>
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mt-4">
                  Stage 6: Musical atmosphere active
                </p>
              </motion.div>
            )}

            {/* STAGE 7: Total blind transition / white wash */}
            {transitionStage === 7 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 1.3 }}
                className="absolute inset-0 bg-white z-50 flex items-center justify-center"
              >
                <h2 className="text-xl font-mono uppercase tracking-[0.4em] text-zinc-900 font-bold animate-pulse">
                  Welcome to your timeline
                </h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
