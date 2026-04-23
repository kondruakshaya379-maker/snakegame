import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants.ts';
import { PlayIcon, PauseIcon, SkipForwardIcon, SkipBackIcon, VolumeIcon } from './Icons.tsx';

export const MusicPlayer: React.FC = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = DUMMY_TRACKS[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
        setIsPlaying(true);
    };

    const handleEnded = () => {
        handleNext();
    };

    return (
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-neon-purple rounded-2xl p-6 shadow-neon-purple flex flex-col gap-4 transition-all duration-300">
            <audio 
                ref={audioRef} 
                src={currentTrack.url} 
                onEnded={handleEnded}
                preload="auto"
            />
            
            {/* Track Info */}
            <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-neon-cyan tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                    {currentTrack.title}
                </h3>
                <p className="text-sm text-gray-400 font-mono">{currentTrack.artist}</p>
            </div>

            {/* Visualizer Mock */}
            <div className="h-8 flex items-end justify-center gap-1 overflow-hidden opacity-80">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 bg-neon-pink rounded-t-sm transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                        style={{ 
                            height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '4px',
                            animationDelay: `${i * 0.1}s`
                        }}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-2">
                <button 
                    onClick={handlePrev}
                    className="text-gray-300 hover:text-neon-cyan transition-colors hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
                >
                    <SkipBackIcon className="w-8 h-8" />
                </button>
                
                <button 
                    onClick={togglePlay}
                    className="w-14 h-14 flex items-center justify-center bg-gray-800 border-2 border-neon-pink rounded-full text-neon-pink shadow-neon-pink hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
                </button>
                
                <button 
                    onClick={handleNext}
                    className="text-gray-300 hover:text-neon-cyan transition-colors hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
                >
                    <SkipForwardIcon className="w-8 h-8" />
                </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mt-2 px-4">
                <VolumeIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                />
            </div>
        </div>
    );
};
