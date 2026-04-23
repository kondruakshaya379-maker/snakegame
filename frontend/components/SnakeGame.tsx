import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_SETTINGS } from '../constants.ts';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } = GAME_SETTINGS;

const generateFood = (snake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
        // eslint-disable-next-line no-loop-func
        isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
};

export const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    
    const directionRef = useRef<Direction>(direction);
    const boardRef = useRef<HTMLDivElement>(null);

    // Keep ref in sync with state for the game loop to access latest without triggering re-renders
    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        directionRef.current = 'RIGHT';
        setScore(0);
        setGameOver(false);
        setFood(generateFood([{ x: 10, y: 10 }]));
        setHasStarted(true);
        setIsPaused(false);
        boardRef.current?.focus();
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault(); // Prevent scrolling
        }

        if (e.key === ' ' && hasStarted && !gameOver) {
            setIsPaused(p => !p);
            return;
        }

        if (!hasStarted || isPaused || gameOver) return;

        const currentDir = directionRef.current;
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (currentDir !== 'DOWN') setDirection('UP');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (currentDir !== 'UP') setDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (currentDir !== 'RIGHT') setDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (currentDir !== 'LEFT') setDirection('RIGHT');
                break;
        }
    }, [hasStarted, isPaused, gameOver]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (!hasStarted || isPaused || gameOver) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const newHead = { ...head };
                const currentDir = directionRef.current;

                switch (currentDir) {
                    case 'UP': newHead.y -= 1; break;
                    case 'DOWN': newHead.y += 1; break;
                    case 'LEFT': newHead.x -= 1; break;
                    case 'RIGHT': newHead.x += 1; break;
                }

                // Check wall collision
                if (
                    newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => s + 10);
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return newSnake;
            });
        };

        const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score * SPEED_INCREMENT));
        const gameLoop = setInterval(moveSnake, currentSpeed);

        return () => clearInterval(gameLoop);
    }, [hasStarted, isPaused, gameOver, food, score]);

    // Focus board on mount
    useEffect(() => {
        boardRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Score Board */}
            <div className="flex justify-between w-full max-w-[400px] px-4 py-2 bg-gray-900/50 border border-neon-cyan rounded-lg shadow-neon-cyan">
                <div className="text-neon-cyan font-mono text-xl font-bold tracking-widest">
                    SCORE: {score.toString().padStart(4, '0')}
                </div>
                <div className="text-neon-pink font-mono text-sm flex items-center">
                    {isPaused ? 'PAUSED' : (gameOver ? 'GAME OVER' : 'PLAYING')}
                </div>
            </div>

            {/* Game Board Container */}
            <div 
                ref={boardRef}
                tabIndex={0}
                className="relative outline-none bg-black border-2 border-neon-cyan shadow-neon-cyan rounded-sm overflow-hidden"
                style={{ 
                    width: `${GRID_SIZE * 20}px`, 
                    height: `${GRID_SIZE * 20}px` 
                }}
            >
                {/* Grid Background (Optional, subtle) */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Food */}
                <div 
                    className="absolute bg-neon-lime rounded-full shadow-neon-lime animate-pulse"
                    style={{
                        width: '20px',
                        height: '20px',
                        left: `${food.x * 20}px`,
                        top: `${food.y * 20}px`,
                        transform: 'scale(0.8)'
                    }}
                />

                {/* Snake */}
                {snake.map((segment, index) => {
                    const isHead = index === 0;
                    return (
                        <div 
                            key={`${segment.x}-${segment.y}-${index}`}
                            className={`absolute rounded-sm ${isHead ? 'bg-neon-pink shadow-neon-pink z-10' : 'bg-pink-400/80 border border-pink-500/30'}`}
                            style={{
                                width: '20px',
                                height: '20px',
                                left: `${segment.x * 20}px`,
                                top: `${segment.y * 20}px`,
                                transform: isHead ? 'scale(1.05)' : 'scale(0.95)'
                            }}
                        />
                    );
                })}

                {/* Overlays */}
                {(!hasStarted || gameOver) && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        {gameOver && (
                            <h2 className="text-4xl font-bold text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-bounce">
                                GAME OVER
                            </h2>
                        )}
                        <button 
                            onClick={resetGame}
                            className="px-6 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold tracking-widest rounded hover:bg-neon-cyan hover:text-black transition-all shadow-neon-cyan"
                        >
                            {hasStarted ? 'RESTART' : 'START GAME'}
                        </button>
                        <p className="text-gray-400 mt-4 text-sm font-mono">Use Arrow Keys or WASD to move</p>
                        <p className="text-gray-500 text-xs font-mono mt-1">Spacebar to Pause</p>
                    </div>
                )}
                
                {isPaused && hasStarted && !gameOver && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                        <h2 className="text-3xl font-bold text-neon-cyan tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                            PAUSED
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};
