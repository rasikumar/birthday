/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SECRETS_ENVELOPES, SealedLetter, CELEBRATION_CONFIG } from "../../data/const";
import { Mail, BookOpen, Clock, X, Heart, Sparkles, Music } from "lucide-react";

interface HiddenLettersProps {
  onReadingStatusChange: (isReading: boolean) => void;
}

export default function HiddenLetters({ onReadingStatusChange }: HiddenLettersProps) {
  const [selectedLetter, setSelectedLetter] = useState<SealedLetter | null>(null);

  // Trigger Reading Status modifier on parent component to adjust background music
  useEffect(() => {
    onReadingStatusChange(selectedLetter !== null);
  }, [selectedLetter, onReadingStatusChange]);

  return (
    <div
      id="hidden-letters-wrapper"
      className="relative min-h-screen bg-[#040406] py-28 px-4 md:px-8 flex flex-col justify-center transition-colors duration-1000"
    >
      {/* Dimmed backdrop background when reading letter */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            className="absolute inset-0 bg-black/85 z-30 pointer-events-none backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section title */}
        <div className="text-center max-w-xl mx-auto mb-20 select-none">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-[0.3em] font-semibold">Section 3 • Sealed Mailbox</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-3 font-bold">
            Hidden Parchments of Love
          </h2>
          <p className="text-zinc-500 text-xs font-display mt-2.5 max-w-sm mx-auto leading-relaxed">
            Unfold vintage envelopes holding speaking letters. Reading a letter automatically quietens active soundtracks.
          </p>
        </div>

        {/* READING MODE NOTIFIER */}
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[-40px] left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 border border-amber-500/30 px-4 py-1.5 rounded-full flex items-center gap-2"
            >
              <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300">Focused Reading Mode Active (Music Dimmed)</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LETTERS DESK LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          {SECRETS_ENVELOPES.map((letter) => {
            const isCurrentSealed = selectedLetter?.id === letter.id;

            return (
              <motion.div
                key={letter.id}
                id={`envelope-frame-${letter.id}`}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedLetter(letter)}
                className={`interactive-hover group relative cursor-pointer p-6 rounded-xl border border-white/5 transition-all outline-hidden flex flex-col justify-between ${
                  letter.envelopeColor
                } shadow-[0_15px_30px_rgba(0,0,0,0.6)] ${
                  selectedLetter && !isCurrentSealed ? "opacity-30 filter blur-[2px]" : "opacity-100"
                }`}
                style={{ minHeight: "260px" }}
              >
                {/* Vintage stamp */}
                <div className="absolute top-6 right-6 w-12 h-14 border-2 border-dashed border-white/20 flex flex-col items-center justify-center rounded-sm bg-white/5 relative">
                  <span className="text-xl select-none">{letter.stampEmoji}</span>
                  <div className="absolute bottom-1 font-mono text-[6px] tracking-widest text-white/50">SEAL</div>
                </div>

                {/* Sender Title */}
                <div>
                  <div className="flex items-center gap-2 text-white/40 font-mono text-[9px] uppercase tracking-[0.2em] mb-2">
                    <Mail className="w-3 h-3 text-amber-400" />
                    Sealed Envelope #{letter.id}
                  </div>
                  <h3 className="text-xl font-serif font-black tracking-tight text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {letter.senderName}
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400/85">
                    {letter.relationshipName}
                  </span>
                </div>

                {/* Excerpt preview */}
                <div className="mt-8 border-t border-white/10 pt-4 text-left">
                  <p className="text-xs text-white/70 font-display italic font-light line-clamp-2 leading-relaxed">
                    "{letter.shortExcerpt}"
                  </p>
                  
                  <span className="inline-block mt-4 text-[9px] font-mono uppercase tracking-[0.2em] text-amber-400 group-hover:underline">
                    Break Seal & Read →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FULL SCREEN EXPANDED LETTER OVERLAY */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedLetter(null)} />

            <motion.div
              id="unfolded-desk-letter"
              className="relative w-full max-w-2xl bg-[#faf5ec] rounded-xl p-8 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-[#e2d8c3] z-50 text-[#1f2937]"
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 50 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              {/* Retro visual page lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
                style={{
                  backgroundImage: "repeating-linear-gradient(#f7e1b5 0px, #f7e1b5 1px, transparent 1px, transparent 28px)",
                  backgroundPosition: "0 28px",
                  lineHeight: "28px",
                }}
              />

              {/* Close helper button */}
              <button
                id="close-parchment-sheet"
                onClick={() => setSelectedLetter(null)}
                className="interactive-hover absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-zinc-400 hover:text-zinc-700 transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Envelope details Header */}
              <div className="border-b border-zinc-300 pb-4 mb-6 relative">
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Shared with Sarah
                </div>
                <h4 className="text-2xl font-serif font-black text-amber-900 leading-tight">
                  Letter from {selectedLetter.senderName}
                </h4>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1 block">
                  {selectedLetter.relationshipName}
                </span>
              </div>

              {/* Simulated Ink Written Text */}
              <div className="min-h-[220px] max-h-[380px] overflow-y-auto pr-2 no-scrollbar relative">
                <InkWriter text={selectedLetter.fullHandwrittenMessage} />
              </div>

              {/* Bottom decorative signatures */}
              <div className="mt-8 border-t border-zinc-200 pt-5 flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest relative">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  EST. {CELEBRATION_CONFIG.birthYear}
                </div>
                <div className="flex items-center gap-1 text-red-500 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Sealed with Love
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// INK WRITER STRING CYCLE COMPONENT
function InkWriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (index < text.length) {
        // Grab current char and double pace if whitespace
        setDisplayText(current => current + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Fast, beautiful signature typewriter pace

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="font-cursive text-xl md:text-2xl text-zinc-800 tracking-wide whitespace-pre-wrap leading-relaxed select-text mt-2 font-medium">
      {displayText}
      {displayText.length < text.length && (
        <span className="inline-block w-1.5 h-4.5 bg-amber-600 ml-0.5 animate-pulse" />
      )}
    </p>
  );
}
