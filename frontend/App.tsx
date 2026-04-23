import React from 'react';
import { SnakeGame } from './components/SnakeGame.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans selection:bg-neon-pink selection:text-white">
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <header className="w-full py-6 text-center z-10 relative">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(176,38,255,0.5)]">
                    Neon<span className="text-white drop-shadow-none">Snake</span> & Synth
                </h1>
                <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest">CYBERNETIC ENTERTAINMENT SYSTEM</p>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-4 z-10 w-full max-w-7xl mx-auto">
                
                {/* Left/Top: Music Player */}
                <div className="w-full lg:w-1/3 flex justify-center lg:justify-end order-2 lg:order-1">
                    <MusicPlayer />
                </div>

                {/* Center/Right: Game */}
                <div className="w-full lg:w-2/3 flex justify-center order-1 lg:order-2">
                    <SnakeGame />
                </div>

            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-gray-600 font-mono text-xs z-10">
                <p>SYSTEM v1.0.0 // AI GENERATED AUDIO DEMO</p>
            </footer>
        </div>
    );
};

export default App;
