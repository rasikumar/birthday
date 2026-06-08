/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FLOATING_ROOM_PHOTOS, FloatingPhotoType, CELEBRATION_CONFIG } from "../../data/const";
import { Compass, Sparkles, Move, Eye, X, Award, FileText } from "lucide-react";
import { SoundManager } from "../music/SoundManager";

// Custom decorative floating elements to create a magical memory dimension
interface HangingNote {
  id: string;
  text: string;
  top: string;
  left: string;
  depth: "fore" | "mid" | "back";
  rotation: number;
}

const HANGING_NOTES: HangingNote[] = [
  { id: "n1", text: "Do you remember the cold winter evening hot chocolate?", top: "45%", left: "80%", depth: "back", rotation: -12 },
  { id: "n2", text: "That afternoon we laughed until our stomachs hurt. Forever golden.", top: "15%", left: "12%", depth: "back", rotation: 8 },
  { id: "n3", text: "Always look ahead. The best is yet to arrive! 🌟", top: "75%", left: "15%", depth: "fore", rotation: -4 },
  { id: "n4", text: "Happy, wild, resilient, beautiful.", top: "68%", left: "85%", depth: "fore", rotation: 14 }
];

export default function FloatingMemoryRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [selectedPhoto, setSelectedPhoto] = useState<FloatingPhotoType | null>(null);

  // Measure container for accurate center coordinates
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left - dimensions.width / 2;
    const relativeY = e.clientY - rect.top - dimensions.height / 2;

    setMousePos({ x: relativeX, y: relativeY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleSectionEnter = () => {
    // Crossfade background theme music to Dreamlike / Magical
    SoundManager.setAtmosphere("magical");
  };

  const triggerMemClick = (photo: FloatingPhotoType) => {
    SoundManager.playSFX("chime");
    setSelectedPhoto(photo);
  };

  return (
    <div
      ref={containerRef}
      id="floating-room-root"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleSectionEnter}
      className="relative min-h-[120vh] bg-[#030305] py-28 px-4 overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic 3D depth background nebula and starry layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(13,10,25,0.85)_0%,rgba(3,3,5,1)_100%)] pointer-events-none" />
      
      {/* 3D Deep Space star coordinate grids */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, transparent 35%, #9a3412 100%)`,
          backgroundSize: "cover",
          transform: `translate3d(${mousePos.x * 0.005}px, ${mousePos.y * 0.005}px, 0)`
        }}
      />

      {/* Floating Flowers (Aesthetic cherry petals dancing) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-rose-400/20 text-lg sm:text-xl"
            style={{
              left: `${10 + i * 6}%`,
              top: `${Math.sin(i) * 30 + 50}%`,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.cos(i) * 30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Header Info */}
      <div className="max-w-xl mx-auto text-center relative z-20 select-none">
        <span className="font-mono text-xs text-amber-500 uppercase tracking-[0.35em] font-bold">Section 4 • Perspective Suite</span>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mt-3 font-semibold flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          The Floating Memory Chamber
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm font-display mt-3 max-w-sm mx-auto leading-relaxed">
          Not a static collage. A living memory dimension. Hover to pivot perspective, and click snapshots to release chimes.
        </p>

        {/* Floating instruction pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 font-mono text-[9px] uppercase tracking-widest animate-pulse">
          <Move className="w-3 h-3 text-amber-400 animate-bounce" />
          Interact: Orbit mouse to tilt depth layers
        </div>
      </div>

      {/* THE MEMORY CORE CANVAS */}
      <div className="relative w-full max-w-6xl mx-auto flex-1 min-h-[550px] mt-16 z-20">
        
        {/* Layer 1: BACK DECORATIVE RETRO FILM STRIPS */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out z-0 hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x * 0.015}px, ${mousePos.y * 0.015}px, 0)`
          }}
        >
          {/* Vertical vintage film strip silhouette */}
          <div className="absolute top-0 left-12 w-16 h-full border-r border-l border-dashed border-zinc-800/40 flex flex-col justify-around text-[10px] font-mono text-zinc-800/30">
            {Array.from({ length: 6 }).map((_, idx) => (
              <span key={idx} className="block rotate-90 select-none">🎞️ CELL {idx + 1}</span>
            ))}
          </div>
          
          <div className="absolute top-8 right-16 w-16 h-full border-r border-l border-dashed border-zinc-800/40 flex flex-col justify-around text-[10px] font-mono text-zinc-800/30">
            {Array.from({ length: 6 }).map((_, idx) => (
              <span key={idx} className="block -rotate-90 select-none">🎞️ SAFETY {idx + 10}</span>
            ))}
          </div>
        </div>

        {/* Layer 2: DECORATIVE HANGING NOSTALGIA NOTES */}
        {HANGING_NOTES.map((n) => {
          let depthFactor = 0.02;
          let colorTheme = "bg-amber-950/20 border-amber-500/10 text-amber-200/60";
          
          if (n.depth === "fore") {
            depthFactor = 0.065;
            colorTheme = "bg-amber-900/15 border-amber-500/25 text-amber-100 shadow-[0_15px_30px_rgba(0,0,0,0.6)]";
          }
          
          return (
            <motion.div
              key={n.id}
              className={`absolute p-4 border rounded-lg max-w-[160px] font-serif italic text-[11px] leading-relaxed text-center pointer-events-none hidden sm:block ${colorTheme}`}
              style={{
                top: n.top,
                left: n.left,
                transform: `rotate(${n.rotation}deg)`,
                x: mousePos.x * depthFactor,
                y: mousePos.y * depthFactor,
              }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* String attachment line mockup */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-[#1e1b4b]/10 to-amber-500/30 -translate-y-12" />
              "{n.text}"
            </motion.div>
          );
        })}

        {/* Layer 3: THE PARALLAX CORE SNAPSHOTS */}
        {FLOATING_ROOM_PHOTOS.map((photo) => {
          let multiplier = 0.03;
          let zIdx = "z-20";
          let scaleSize = 1.0;
          let cardShadow = "shadow-lg border-white/5";

          if (photo.depth === "fore") {
            multiplier = 0.075; // Heavy fast movement
            zIdx = "z-30";
            scaleSize = 1.06;
            cardShadow = "shadow-[0_28px_56px_rgba(0,0,0,0.85)] border-amber-500/15";
          } else if (photo.depth === "back") {
            multiplier = 0.015; // Slow micro movement
            zIdx = "z-10";
            scaleSize = 0.88;
            cardShadow = "shadow-md opacity-40 border-white/5";
          }

          const tx = mousePos.x * multiplier;
          const ty = mousePos.y * multiplier;

          return (
            <motion.div
              key={photo.id}
              id={`3d-photo-item-${photo.id}`}
              onClick={() => triggerMemClick(photo)}
              onMouseEnter={() => SoundManager.playSFX("hover")}
              className={`absolute p-3 bg-zinc-950/90 border rounded-2xl flex flex-col hover:border-amber-400/40 cursor-pointer select-none group transition-colors duration-300 ${zIdx} ${cardShadow}`}
              style={{
                top: photo.top,
                left: photo.left,
                x: tx,
                y: ty,
                scale: scaleSize,
                rotate: photo.rotation,
              }}
              whileHover={{
                scale: scaleSize + 0.035,
                rotate: photo.rotation + (photo.rotation >= 0 ? 2 : -2),
                borderColor: "rgba(245, 158, 11, 0.45)",
                backgroundColor: "rgba(10, 8, 14, 0.95)"
              }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
              {/* Image Frame */}
              <div className="overflow-hidden aspect-video w-44 md:w-56 rounded-xl relative bg-zinc-950">
                <img
                  src={photo.photoUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover brightness-[0.88] group-hover:brightness-100 group-hover:scale-103 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 mix-blend-overlay pointer-events-none" />
                
                {/* Vintage vignette */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
              </div>

              {/* Label & Captions */}
              <div className="mt-3 pl-1 text-left">
                <h4 className="text-[11px] font-bold text-white tracking-wider group-hover:text-amber-400 transition-colors uppercase leading-tight font-sans">
                  {photo.title}
                </h4>
                <p className="text-[9px] font-mono text-zinc-500 truncate mt-1">
                  {photo.subtitle}
                </p>
              </div>

              {/* Depth Pill badge */}
              <div className={`absolute bottom-3 right-3 text-[7px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${
                photo.depth === "fore" ? "bg-amber-400/10 text-amber-400" : "bg-white/5 text-zinc-500"
              }`}>
                {photo.depth}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* POPUP PHOTO POLAROID SPECIFICATION OVERLAY */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            key="photo-spec-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.85, rotate: 3 }}
              transition={{ type: "spring" }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-[#fbfaf5] p-5 pb-8 rounded-sm shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-[#eadaab]/50 flex flex-col text-zinc-950 aspect-[4/5] justify-between relative"
              style={{
                clipPath: "polygon(0% 1%, 100% 0%, 98% 99%, 2% 100%)",
              }}
            >
              {/* Close Button badge */}
              <button
                id="close-zoom-polaroid"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/10 hover:bg-zinc-950/20 text-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Polaroid Image block */}
              <div className="w-full aspect-[4/3] bg-zinc-950 overflow-hidden rounded shadow-inner relative group mt-6">
                <img
                  src={selectedPhoto.photoUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Handwriting Title tag */}
              <div className="mt-6 text-left font-serif border-t border-zinc-200/50 pt-5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#9a3412] font-semibold">Memoir Captured Snap</span>
                <h3 className="text-2xl font-bold tracking-tight italic text-zinc-900 mt-2">
                  "{selectedPhoto.title}"
                </h3>
                <p className="text-xs text-zinc-650 font-display mt-2.5 leading-relaxed capitalize">
                  {selectedPhoto.subtitle}. Beautiful memories gathered for Sarah's golden scrapbook collection.
                </p>
                
                <div className="mt-5 flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-dashed border-zinc-200 pt-3">
                  <span>EST. {CELEBRATION_CONFIG.birthYear}</span>
                  <span className="text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3" /> Artifact Sealed
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small foot watermark label */}
      <div className="w-full text-center relative z-20 pt-10">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.25em]">
          Scenic Memory Space • Orbiting {CELEBRATION_CONFIG.celebrantName}'s Golden Chapters
        </p>
      </div>
    </div>
  );
}
