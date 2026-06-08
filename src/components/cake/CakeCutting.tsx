/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CAKE_MOMENTS, INSTALLED_ASSETS, TIMELINE_MEMORIES } from "../../data/const";
import { Sparkles, RotateCcw, Heart, Flame, Gift, Award } from "lucide-react";
import { SoundManager } from "../music/SoundManager";

// Spark/cream crumb interface
interface CreamParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vrotate: number;
}

// Falling memory photos interface
interface FallingPhoto {
  id: number;
  url: string;
  title: string;
  x: number;
  rotate: number;
  delay: number;
  speed: number;
}

interface CakeCuttingProps {
  onToggleKnifeCursor: (active: boolean) => void;
}

export default function CakeCutting({ onToggleKnifeCursor }: CakeCuttingProps) {
  const [isCutCompleted, setIsCutCompleted] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 100
  const [activeStage, setActiveStage] = useState(0); // 1 to 7 stages
  const [creamCrumbs, setCreamCrumbs] = useState<CreamParticle[]>([]);
  const [balloons, setBalloons] = useState<{ id: number; color: string; left: number; delay: number; scale: number }[]>([]);
  const [fallingPhotos, setFallingPhotos] = useState<FallingPhoto[]>([]);

  // Natural Knife Inertia tracker
  const [showKnife, setShowKnife] = useState(false);
  const [knifePos, setKnifePos] = useState({ x: 0, y: 0 });
  const [knifeRotation, setKnifeRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Physics inertia coordinates
  const knifeRef = useRef({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });

  // Mouse move handler for Knife Inertia
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseTargetRef.current = { x, y };
  };

  // Inertia loop
  useEffect(() => {
    let rId: number;
    const updateInertia = () => {
      const dx = mouseTargetRef.current.x - knifeRef.current.x;
      const dy = mouseTargetRef.current.y - knifeRef.current.y;

      // Organic weight/inertia calculation (0.08 filter speed)
      knifeRef.current.x += dx * 0.085;
      knifeRef.current.y += dy * 0.085;

      // Rotate knife slightly relative to mouse lateral speed
      const rot = Math.max(-25, Math.min(25, dx * 0.1));
      setKnifeRotation(rot);
      setKnifePos({ x: knifeRef.current.x, y: knifeRef.current.y });

      rId = requestAnimationFrame(updateInertia);
    };

    rId = requestAnimationFrame(updateInertia);
    return () => cancelAnimationFrame(rId);
  }, []);

  const handleMouseEnter = () => {
    if (!isCutCompleted) {
      setShowKnife(true);
      onToggleKnifeCursor(true); // hide standard mouse cursor
    }
  };

  const handleMouseLeave = () => {
    setShowKnife(false);
    onToggleKnifeCursor(false);
  };

  const triggerCakeSliceClimax = () => {
    setIsCutCompleted(true);
    setShowKnife(false);
    onToggleKnifeCursor(false); // Return cursor to default state

    // 1. Play immediate confetti explosion sound effect
    SoundManager.playSFX("confetti");

    // 2. Crossfade global atmosphere track to the major-scale climax
    SoundManager.setAtmosphere("celebration");

    // Exploding physical cream particles
    const crumbs: CreamParticle[] = [];
    const colors = ["#ffffff", "#fef08a", "#fbcfe8", "#bfdbfe", "#fde047", "#fed7aa"];
    for (let i = 0; i < 48; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 11;
      crumbs.push({
        id: i,
        x: 0,
        y: -15, // center coordinate of the cut line
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // slightly upward gravity thrust
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 9,
        rotation: Math.random() * 360,
        vrotate: (Math.random() - 0.5) * 12,
      });
    }
    setCreamCrumbs(crumbs);

    // Progression of 7 stages of birthday celebration
    // Stage 1: Immediate Confetti
    setActiveStage(1);

    // Stage 2: Fireworks pops (at 1200ms)
    setTimeout(() => {
      setActiveStage(2);
      SoundManager.playSFX("sparkles");
    }, 1200);

    // Stage 3: Sparkles (at 2400ms)
    setTimeout(() => {
      setActiveStage(3);
      SoundManager.playSFX("chime");
    }, 2400);

    // Stage 4: Balloons rise (at 3600ms)
    setTimeout(() => {
      setActiveStage(4);
      const balloonColors = ["bg-rose-500", "bg-amber-400", "bg-sky-450", "bg-purple-500", "bg-teal-400"];
      const pool = Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        left: 5 + Math.random() * 90,
        delay: Math.random() * 1.5,
        scale: 0.8 + Math.random() * 0.4,
      }));
      setBalloons(pool);
    }, 3600);

    // Stage 5: Memory photos slide-show appears from entire experience (at 4800ms)
    setTimeout(() => {
      setActiveStage(5);
      SoundManager.playSFX("sparkles");

      const photoPool: FallingPhoto[] = [];
      TIMELINE_MEMORIES.forEach((memory, idx) => {
        for (let r = 0; r < 2; r++) {
          photoPool.push({
            id: idx * 2 + r,
            url: memory.photoUrl,
            title: memory.title,
            x: 8 + Math.random() * 84,
            rotate: (Math.random() - 0.5) * 35,
            delay: r * 0.7 + Math.random() * 0.5,
            speed: 6 + Math.random() * 4,
          });
        }
      });
      setFallingPhotos(photoPool);
    }, 4800);

    // Stage 6: Final emotional message fades in (at 6000ms)
    setTimeout(() => {
      setActiveStage(6);
      SoundManager.playSFX("chime");
    }, 6000);

    // Stage 7: Celebration music peak (at 7200ms)
    setTimeout(() => {
      setActiveStage(7);
    }, 7200);
  };

  // Run crumbs physics animation tick
  useEffect(() => {
    if (creamCrumbs.length === 0) return;
    const timer = setInterval(() => {
      setCreamCrumbs(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.45, // gravity pulls down
            vx: p.vx * 0.985, // air friction
            rotation: p.rotation + p.vrotate,
          }))
          .filter(p => p.y < 600)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [creamCrumbs]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setDragProgress(val);
    if (val % 10 === 0) {
      SoundManager.playSFX("click"); // sound tick feedback on step cuts
    }
    if (val >= 99 && !isCutCompleted) {
      triggerCakeSliceClimax();
    }
  };

  const resetCelebration = () => {
    setIsCutCompleted(false);
    setDragProgress(0);
    setActiveStage(0);
    setCreamCrumbs([]);
    setBalloons([]);
    setFallingPhotos([]);
    setShowKnife(true);
    onToggleKnifeCursor(true);
    SoundManager.setAtmosphere("warm");
  };

  return (
    <div
      ref={containerRef}
      id="cake-cutting-scenery"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen bg-[#040406] py-28 px-4 flex flex-col justify-center items-center overflow-hidden"
      style={{
        cursor: showKnife ? "none" : "auto", // Hide browser default cursor when custom knife handles area
        backgroundImage: `radial-gradient(ellipse at bottom, rgba(64,36,20,0.48) 0%, rgba(4,4,6,1) 90%), url(${INSTALLED_ASSETS.luxuryMeshBg})`,
        backgroundSize: "cover",
      }}
    >
      {/* 3D Candlelit Table Reflection Halos */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-orange-400/5 via-transparent to-transparent pointer-events-none filter blur-[80px]" />
      
      {/* Glow balls representing flickering candles in the environment */}
      <div className="absolute left-[15%] bottom-[30%] w-72 h-72 rounded-full bg-orange-500/5 filter blur-[100px] animate-pulse-slow" />
      <div className="absolute right-[15%] bottom-[30%] w-72 h-72 rounded-full bg-orange-500/5 filter blur-[100px] animate-pulse-slow" style={{ animationDelay: "2.5s" }} />

      {/* RISING EXTREME BACKROUND BALLOONS */}
      {activeStage >= 4 && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {balloons.map(b => (
            <motion.div
              key={b.id}
              className={`absolute bottom-[-130px] w-14 h-18 rounded-full ${b.color} shadow-lg flex flex-col items-center`}
              initial={{ y: 0, x: 0 }}
              animate={{ 
                y: -1100, 
                x: [0, 35, -35, 15, 0] 
              }}
              style={{ 
                left: `${b.left}%`,
                scale: b.scale,
              }}
              transition={{
                y: { duration: 11 + Math.random() * 4, delay: b.delay, ease: "linear" },
                x: { duration: 6, delay: b.delay, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Balloon tie details */}
              <div className="w-1.5 h-2 bg-black/15 mt-auto" />
              <div className="w-[1px] h-20 bg-white/20" />
            </motion.div>
          ))}
        </div>
      )}

      {/* RAIN OF MEMORIES FROM EXPERIENCE MAP OVERLAY */}
      {activeStage >= 5 && (
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {fallingPhotos.map(p => (
            <motion.div
              key={p.id}
              className="absolute -top-[140px] p-2 bg-white rounded shadow-2xl border border-zinc-200"
              style={{
                width: "95px",
                left: `${p.x}%`,
              }}
              initial={{ y: -100, rotate: p.rotate, opacity: 0 }}
              animate={{ 
                y: 1100, 
                rotate: p.rotate + (p.id % 2 === 0 ? 360 : -360),
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: p.speed,
                delay: p.delay,
                ease: "linear",
              }}
            >
              <img src={p.url} alt="Nostalgic trace" className="w-full h-14 object-cover rounded-xs" referrerPolicy="no-referrer" />
              <p className="text-[6px] font-mono text-zinc-950 font-semibold mt-1 text-center truncate leading-none">
                {p.title}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* RAMPING FIREWORKS SPARKS BACKGROUND */}
      {activeStage >= 2 && (
        <div className="absolute inset-0 z-5 pointer-events-none opacity-40 mix-blend-screen scale-110">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-ping bg-amber-400"
              style={{
                top: `${20 + Math.random() * 35}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 1.3}s`,
                animationDuration: "2.8s"
              }}
            />
          ))}
        </div>
      )}

      {/* CENTRAL DYNAMIC PLATFORM BUILDER */}
      <div className="max-w-4xl w-full text-center relative z-20 flex flex-col items-center">
        {!isCutCompleted ? (
          // PRE-CUT STAGING SCENE
          <nav className="flex flex-col items-center select-none w-full">
            <span className="font-mono text-xs text-amber-500 uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              Final Climax Ceremony
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight italic font-semibold">
              {CAKE_MOMENTS.mainCall}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-lg font-sans leading-relaxed">
              Grab the physical golden blade inside this section, trace it smoothly across the double-layer frosting to trigger the celebration!
            </p>

            {/* HIGH-RES DETAILED TABLE AND PLATE SCENE */}
            <div className="relative mt-16 mb-20 flex justify-center items-center">
              {/* Spinning background magic constellation orbits */}
              <div className="absolute w-[380px] h-[380px] md:w-[440px] md:h-[440px] rounded-full border border-dashed border-amber-500/10 animate-spin" style={{ animationDuration: "35s" }} />

              {/* HANDCRAFTED PLATFORM PLATE */}
              <motion.div
                id="luxury-flickering-plate"
                className="relative z-10 w-76 h-76 md:w-[360px] md:h-[360px] flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-3xs rounded-full border border-amber-500/10"
                animate={{
                  y: [-3, 3, -3],
                  rotate: [0, 1.2, -1.2, 0]
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Embedded Beautiful Cake Photo with physical drop shadows */}
                <img
                  src={INSTALLED_ASSETS.interactiveCakeBespoke}
                  alt="Realistic Luxurious Birthday Cake"
                  className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_25px_50px_rgba(245,158,11,0.4)]"
                  referrerPolicy="no-referrer"
                />

                {/* Candles with real 3D flame indicators flicking */}
                <div className="absolute top-[18%] left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="flex flex-col items-center"
                      animate={{ scale: [1, 1.15, 0.95, 1.1, 1], y: [0, -1, 0] }}
                      transition={{ duration: 0.4 + idx * 0.15, repeat: Infinity }}
                    >
                      <Flame className="w-5 h-6 text-amber-400 fill-current filter drop-shadow-[0_0_8px_rgb(245,158,11)]" />
                      <div className="w-1.5 h-5 bg-rose-400 rounded-sm" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* REAL-TIME DEFORMING CUTTING GUIDE WIRE */}
              <div className="absolute inset-x-[-30px] top-1/2 -translate-y-1/2 h-[3px] border-t border-dashed border-amber-400/40 z-20 pointer-events-none">
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[4px] bg-amber-400 shadow-[0_0_15px_#F59E0B]"
                  style={{ width: `${dragProgress}%` }}
                />
              </div>

              {/* SLICER PROGRESS DOCK */}
              <div className="absolute bottom-[-32px] z-30 w-80 bg-zinc-950/95 border border-amber-500/35 px-4 py-3 rounded-full shadow-[0_25px_55px_rgba(0,0,0,0.9)] flex items-center pr-3">
                <div className="flex-1 ml-3 relative flex flex-col justify-center select-none">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dragProgress}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-ew-resize accent-amber-400 focus:outline-hidden"
                  />
                  <div className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mt-2">
                    Drag blade path to slice cake ({dragProgress}%)
                  </div>
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-8 bg-black/40 border border-zinc-900 py-1.5 px-5 rounded-full select-none">
              {CAKE_MOMENTS.cheerPhrase}
            </span>
          </nav>
        ) : (
          // POST-CUT SUCCESS CLIMAX SCENARIO
          <motion.div
            id="grand-finale-board"
            className="flex flex-col items-center select-none py-6 relative z-20 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* SPLITTED SEPARATIVE PHYSICAL DEFORMATION CAKE */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mb-10 overflow-visible">
              
              {/* LEFT PHYSICAL SPLIT PART */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                }}
                animate={{ x: -35, rotate: -4 }}
                transition={{ type: "spring", stiffness: 50, damping: 9, delay: 0.1 }}
              >
                <img
                  src={INSTALLED_ASSETS.interactiveCakeBespoke}
                  alt="Left side"
                  className="w-[85%] h-[85%] object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* RIGHT PHYSICAL SPLIT PART */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                }}
                animate={{ x: 35, rotate: 4 }}
                transition={{ type: "spring", stiffness: 50, damping: 9, delay: 0.1 }}
              >
                <img
                  src={INSTALLED_ASSETS.interactiveCakeBespoke}
                  alt="Right side"
                  className="w-[85%] h-[85%] object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* PHYSICAL FLOATING CRUMBS DUST COORDINATES */}
              {creamCrumbs.map(p => (
                <div
                  key={p.id}
                  className="absolute rounded-lg pointer-events-none shadow"
                  style={{
                    backgroundColor: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    left: `calc(50% + ${p.x}px)`,
                    top: `calc(50% + ${p.y}px)`,
                    transform: `rotate(${p.rotation}deg)`,
                  }}
                />
              ))}

              {/* Golden glowing blade slice separator trace */}
              <motion.div
                className="absolute w-1.5 h-44 bg-amber-400/80 shadow-[0_0_20px_#f59e0b] rounded-full"
                animate={{ scaleY: [0.1, 1.2, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.8 }}
              />
            </div>

            {/* CELEBRATION CLIMAX TITLES */}
            <AnimatePresence mode="popLayout">
              {activeStage >= 1 && (
                <motion.div
                  key="grand-birthday-celebration-title"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="p-5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 mb-6 shadow-[0_0_40px_rgba(244,63,94,0.35)]"
                  >
                    <Heart className="w-12 h-12 fill-current" />
                  </motion.div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-rose-450 tracking-tight leading-none px-4">
                    Happy Birthday, Sarah! 🏵️
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 6: THE DETAILED BLESSING BLOCK */}
            <AnimatePresence>
              {activeStage >= 6 && (
                <motion.div
                  id="final-message-card"
                  className="mt-10 bg-zinc-950/80 border border-amber-500/25 px-8 py-8 rounded-2xl max-w-xl shadow-[0_30px_70px_rgba(251,191,36,0.06)] backdrop-blur-md text-center"
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 14 }}
                >
                  <div className="flex items-center gap-2 text-amber-400 justify-center mb-4">
                    <Gift className="w-5 h-5 animate-bounce" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Special Blessing Unlocked</span>
                  </div>
                  
                  <p className="text-zinc-200 font-serif text-md sm:text-lg italic leading-relaxed font-semibold">
                    "{CAKE_MOMENTS.finalBlessing}"
                  </p>

                  <span className="block mt-6 text-[9px] font-mono tracking-widest uppercase text-zinc-500">
                    Sovereign Memoirs are completely compiled.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reload button controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-12 relative z-30">
              <button
                id="replay-experience"
                onClick={resetCelebration}
                className="interactive-hover flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 hover:bg-[#d97706]/15 border border-amber-600/35 text-white font-mono text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Cut Cake Again
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* KINETIC GOLDEN INERTIA KNIFE CURSOR */}
      {showKnife && (
        <div
          id="custom-inertia-knife"
          className="absolute z-50 pointer-events-none origin-bottom-left"
          style={{
            left: `${knifePos.x}px`,
            top: `${knifePos.y}px`,
            transform: `translate3d(-20px, -85px, 0) rotate(${knifeRotation - 45}deg)`,
            filter: "drop-shadow(0 8px 15px rgba(0,0,0,0.5))",
          }}
        >
          {/* Custom SVG Golden Royal Cut Knife representation */}
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Knife Blade Steel Gilded with Gold gradients */}
            <path d="M 30 10 C 32 30 35 70 30 90 L 22 90 L 22 30 C 22 15 25 10 30 10 Z" fill="url(#goldBladeGrad)" stroke="#fbbf24" strokeWidth="1" />
            
            {/* Knife golden Guard Hilt */}
            <rect x="18" y="90" width="16" height="5" rx="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            
            {/* Mahogany brown wooden handle grip */}
            <rect x="23" y="95" width="6" height="20" rx="1.5" fill="#78350f" />
            
            {/* Handle golden pommel cap */}
            <circle cx="26" cy="116" r="2.5" fill="#f59e0b" />

            <defs>
              <linearGradient id="goldBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}
