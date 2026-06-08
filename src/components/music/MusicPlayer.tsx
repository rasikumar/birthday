/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PLAYLIST_SONGS, TrackType } from "../../data/const";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Music4,
} from "lucide-react";

interface MusicPlayerProps {
  isPlayingGlobal: boolean;
  onPlayingGlobalChange: (isPlaying: boolean) => void;
  overrideVolume: number; // For letters section (lowers reading volume)
}

export default function MusicPlayer({
  isPlayingGlobal,
  onPlayingGlobalChange,
  overrideVolume,
}: MusicPlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeTrack: TrackType = PLAYLIST_SONGS[trackIndex];

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(activeTrack.audioUrl);
    audioRef.current.loop = false;

    // Load progress and duration logs
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 180);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleEnded);

    if (isPlayingGlobal) {
      audioRef.current.play().catch((err) => {
        console.log("Audio autoplay prevented by secure browser policy:", err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [trackIndex]);

  // Sync Global Play State
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlayingGlobal) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingGlobal]);

  // Apply Volume Level / Override Modifiers
  useEffect(() => {
    if (!audioRef.current) return;
    const computedVolume = isMuted ? 0 : volume * overrideVolume;
    audioRef.current.volume = computedVolume;
  }, [volume, isMuted, overrideVolume]);

  const togglePlay = () => {
    onPlayingGlobalChange(!isPlayingGlobal);
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST_SONGS.length);
  };

  const handlePrev = () => {
    setTrackIndex(
      (prev) => (prev - 1 + PLAYLIST_SONGS.length) % PLAYLIST_SONGS.length,
    );
  };

  const selectSong = (index: number) => {
    setTrackIndex(index);
    onPlayingGlobalChange(true);
    setIsPlaylistOpen(false);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const waveBarCount = 8;

  return (
    <div id="music-player-dock-root" className="fixed bottom-6 right-6 z-40">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // MINI MODE FLOAT PILL
          <motion.div
            key="mini-dock"
            layoutId="player-dock"
            id="mini-player-dock"
            className="glass-panel rounded-full py-2.5 pl-3.5 pr-4 flex items-center gap-3.5 shadow-2xl border border-amber-500/10 hover:border-amber-500/25 cursor-pointer backdrop-blur-xl"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Spinning artwork indicator */}
            <div className="relative">
              <motion.img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                className="w-8 h-8 rounded-full border border-amber-500/20 object-cover"
                animate={isPlayingGlobal ? { rotate: 360 } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full border border-black/10 inset-shadow-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#050505] rounded-full border border-white/10" />
            </div>

            {/* Title and stats */}
            <div>
              <p className="text-[11px] font-medium font-display text-white max-w-[100px] truncate leading-tight">
                {activeTrack.title}
              </p>
              <p className="text-[9px] font-mono text-zinc-500 truncate mt-0.5 leading-none">
                {activeTrack.artist}
              </p>
            </div>

            {/* Custom Interactive Equalizer bars */}
            <div className="flex gap-0.5 items-end h-3.5 px-1">
              {Array.from({ length: waveBarCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[1.5px] bg-amber-400 rounded-full"
                  animate={{
                    height: isPlayingGlobal
                      ? [4, 14, 4, 10, 4][(i + trackIndex) % 5]
                      : 4,
                  }}
                  transition={{
                    duration: 0.8 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Tiny play state playpause overlay inside pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="interactive-hover p-1.5 rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              {isPlayingGlobal ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
            </button>
          </motion.div>
        ) : (
          // EXPANDED MODE SPECTACULAR SPOTIFY DOCK
          <motion.div
            key="expanded-dock"
            layoutId="player-dock"
            id="expanded-player-dock"
            className="w-80 glass-panel rounded-2xl p-4.5 shadow-2xl border border-amber-500/15"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            {/* Header control collapse */}
            <div className="flex justify-between items-center mb-3 text-zinc-400">
              <span className="text-[9px] font-mono tracking-widest uppercase text-amber-500 flex items-center gap-1.5 font-bold">
                <Music4 className="w-3 h-3 text-amber-400 animate-pulse" />
                Sarah's Memory Sounds
              </span>
              <button
                id="minimize-player-hud"
                onClick={() => {
                  setIsExpanded(false);
                  setIsPlaylistOpen(false);
                }}
                className="interactive-hover p-1 rounded-full hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Track Info Display */}
            <div className="flex gap-3.5 items-center mb-3.5">
              {/* Floating Orbiting Ring Cover */}
              <div className="relative flex-shrink-0 group">
                <motion.img
                  src={activeTrack.coverUrl}
                  alt={activeTrack.title}
                  className="w-14 h-14 rounded-lg object-cover border border-white/5 shadow-md"
                  animate={isPlayingGlobal ? { rotate: 360 } : {}}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-lg bg-black/10 transition-opacity" />
              </div>

              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate hover:text-amber-400 transition-colors font-display">
                  {activeTrack.title}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                  {activeTrack.artist}
                </p>
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="mb-3.5">
              <div
                className="relative w-full h-1 bg-zinc-800 rounded-full cursor-pointer group mb-1.5"
                onClick={handleProgressBarClick}
              >
                {/* Processed track coloring */}
                <div
                  className="absolute left-0 top-0 h-full bg-amber-400 rounded-full group-hover:bg-amber-300 transition-colors"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                {/* Micro drag handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-sm"
                  style={{
                    left: `calc(${(currentTime / duration) * 100}% - 4px)`,
                  }}
                />
              </div>

              {/* Ticker values */}
              <div className="flex justify-between text-[9px] font-mono text-zinc-500 leading-none">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Dock Bar */}
            <div className="flex items-center justify-between mb-2">
              <button
                id="playlist-popup-toggler"
                onClick={() => setIsPlaylistOpen((prev) => !prev)}
                className={`interactive-hover p-2 rounded-full transition-all cursor-pointer ${
                  isPlaylistOpen
                    ? "text-[#fcd34d] bg-amber-500/10"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  id="music-prev"
                  onClick={handlePrev}
                  className="interactive-hover p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4.5 h-4.5 fill-current" />
                </button>

                <button
                  id="music-play-pause-btn"
                  onClick={togglePlay}
                  className="interactive-hover p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  {isPlayingGlobal ? (
                    <Pause className="w-4 h-4 fill-current text-zinc-950" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5 text-zinc-950" />
                  )}
                </button>

                <button
                  id="music-next"
                  onClick={handleNext}
                  className="interactive-hover p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4.5 h-4.5 fill-current" />
                </button>
              </div>

              {/* Sound volume controller element */}
              <div className="flex items-center gap-1.5 text-zinc-400 group">
                <button
                  id="toggle-audio-mute"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="interactive-hover p-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-12 h-1 accent-amber-400 hover:accent-amber-300 bg-zinc-800 rounded-lg appearance-none cursor-pointer scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300"
                />
              </div>
            </div>

            {/* PLAYLIST POPUP PANEL */}
            <AnimatePresence>
              {isPlaylistOpen && (
                <motion.div
                  id="playlist-directory"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3.5 bg-black/40 rounded-xl max-h-[140px] overflow-y-auto border border-white/5 no-scrollbar divide-y divide-white/5"
                >
                  {PLAYLIST_SONGS.map((song, i) => {
                    const isSelected = i === trackIndex;
                    return (
                      <div
                        key={song.id}
                        onClick={() => selectSong(i)}
                        className={`interactive-hover p-2 flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isSelected
                            ? "bg-amber-950/20 text-amber-300"
                            : "hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-6 h-6 rounded-sm object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <p
                            className={`text-[10px] font-semibold truncate leading-tight ${isSelected ? "text-amber-400" : ""}`}
                          >
                            {song.title}
                          </p>
                          <p className="text-[8px] font-mono text-zinc-500 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
