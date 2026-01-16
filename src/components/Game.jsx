import React, { useState, useEffect, useRef } from 'react';
import './Game.css';

function Game() {
    const [gameId, setGameId] = useState(null);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState('menu');
    const [countdown, setCountdown] = useState(null);
    const canvasRef = useRef(null);
    const reqRef = useRef(null);

    // Refs for robust game logic (avoiding stale closures)
    const gameState = useRef({
        dino: { y: 0, vy: 0 },
        obstacles: [],
        snake: [{ x: 10, y: 10 }],
        snakeDir: { x: 1, y: 0 },
        nextSnakeDir: { x: 1, y: 0 },
        food: { x: 15, y: 15 },
        ball: { x: 250, y: 250, dx: 4, dy: -4 },
        paddle: 210,
        score: 0,
        directionChanged: false // Prevent multiple direction changes per frame
    });

    const GAMES = [
        { id: 'dino', name: 'Dino Jump', icon: '🦖' },
        { id: 'snake', name: 'Snake', icon: '🐍' },
        { id: 'paddle', name: 'Paddle Ball', icon: '🎾' }
    ];

    const RULES = {
        dino: "Press [Space] to jump over obstacles. Don't touch the cacti!",
        snake: "Use [Arrow Keys] to move. Eat the apples, avoid the walls and yourself!",
        paddle: "Move your mouse to control the paddle. Keep the ball in play!"
    };

    const pickGame = (id) => {
        // Reset state
        gameState.current = {
            dino: { y: 0, vy: 0 },
            obstacles: [],
            // Classic Trail: Start with 3 segments
            snake: [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ],
            snakeDir: { x: 1, y: 0 },
            nextSnakeDir: { x: 1, y: 0 },
            food: { x: 15, y: 15 },
            ball: { x: 250, y: 250, dx: 4, dy: -4 },
            paddle: 210,
            score: 0,
            directionChanged: false
        };
        setScore(0);
        setGameId(id);
        setGameStatus('ready');
        setCountdown(null);
    };

    const startGame = () => {
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown === null) return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setGameStatus('playing');
            setCountdown(null);
        }
    }, [countdown]);

    const endGame = () => {
        setGameStatus('gameover');
        if (reqRef.current) {
            cancelAnimationFrame(reqRef.current);
            clearTimeout(reqRef.current);
        }
    };

    // --- CANVAS SCALING HELPER ---
    const setupCanvas = (canvas) => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return ctx;
    };

    // --- GAME LOOPS ---

    const updateDino = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const logicalW = canvas.width / dpr;
        const logicalH = canvas.height / dpr;
        const ground = logicalH - 40;

        // Physics
        const s = gameState.current;
        s.dino.y += s.dino.vy;
        s.dino.vy += 0.8;
        if (s.dino.y > 0) {
            s.dino.y = 0;
            s.dino.vy = 0;
        }

        // Obstacles
        if (Math.random() < 0.015) {
            s.obstacles.push({ x: logicalW, w: 20, h: 40 });
        }
        s.obstacles.forEach(o => o.x -= 5);
        s.obstacles = s.obstacles.filter(o => o.x > -50);

        // Collision
        const hit = s.obstacles.find(o =>
            o.x < 70 && o.x > 10 && (ground + s.dino.y) > (ground - o.h + 5)
        );
        if (hit) return endGame();

        s.score += 1;
        setScore(Math.floor(s.score / 10));

        // Draw
        ctx.clearRect(0, 0, logicalW, logicalH);

        // Ground line
        ctx.strokeStyle = '#4B4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, ground);
        ctx.lineTo(logicalW, ground);
        ctx.stroke();

        // Dino Icon
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🦖', 55, ground + s.dino.y - 10);

        // Obstacle Icons
        s.obstacles.forEach(o => {
            ctx.fillText('🌵', o.x + 10, ground - 5);
        });

        reqRef.current = requestAnimationFrame(updateDino);
    };

    const updateSnake = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const logicalW = canvas.width / dpr;
        const logicalH = canvas.height / dpr;
        const s = gameState.current;
        const grid = 20;
        const tileSize = logicalW / grid;

        // Execute direction change and reset flag
        s.snakeDir = s.nextSnakeDir;
        s.directionChanged = false; // Allow new input after this frame

        const headPos = { x: s.snake[0].x + s.snakeDir.x, y: s.snake[0].y + s.snakeDir.y };

        // Check wall collision first
        if (headPos.x < 0 || headPos.x >= grid || headPos.y < 0 || headPos.y >= grid) {
            return endGame();
        }

        // Check if eating food
        const eatingFood = (headPos.x === s.food.x && headPos.y === s.food.y);

        // Add new head
        s.snake.unshift(headPos);

        // If NOT eating, remove tail BEFORE collision check
        // This prevents false collision when head moves to tail's position
        if (!eatingFood) {
            s.snake.pop();
        }

        // Now check self-collision with updated snake body
        const selfCollision = s.snake.slice(1).find(seg => seg.x === headPos.x && seg.y === headPos.y);
        if (selfCollision) {
            return endGame();
        }

        // Handle food
        if (eatingFood) {
            s.score += 10;
            setScore(s.score);

            // Generate new food that doesn't overlap with snake (BUG FIX)
            let newFood;
            let attempts = 0;
            do {
                newFood = {
                    x: Math.floor(Math.random() * grid),
                    y: Math.floor(Math.random() * grid)
                };
                attempts++;
            } while (attempts < 100 && s.snake.find(seg => seg.x === newFood.x && seg.y === newFood.y));

            s.food = newFood;
        }

        // --- DRAWING ---
        ctx.clearRect(0, 0, logicalW, logicalH);

        // Draw Game Boundary (Clear Border)
        ctx.strokeStyle = '#FF8450';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, logicalW, logicalH);

        // Subtle Grid
        ctx.strokeStyle = 'rgba(75, 68, 68, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= grid; i++) {
            ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, logicalH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(logicalW, i * tileSize); ctx.stroke();
        }

        // Food (Apple)
        const fx = s.food.x * tileSize + tileSize / 2;
        const fy = s.food.y * tileSize + tileSize / 2;
        ctx.font = `${tileSize * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍎', fx, fy);

        // Snake Rendering (Classic Neat Block Style)
        s.snake.forEach((seg, i) => {
            const centerX = seg.x * tileSize + tileSize / 2;
            const centerY = seg.y * tileSize + tileSize / 2;
            const size = tileSize - 2;
            const x = seg.x * tileSize + 1;
            const y = seg.y * tileSize + 1;

            if (i === 0) {
                // HEAD: Sharp Rounded Block
                ctx.fillStyle = '#FF8450';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(x, y, size, size, 6);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, size, size);
                }

                // Eye highlights
                ctx.fillStyle = '#FFF';
                const eyeOff = 4 + (s.snakeDir.x !== 0 ? 0 : 0);
                const lookX = s.snakeDir.x * 3;
                const lookY = s.snakeDir.y * 3;

                // Position eyes based on axis of movement
                if (s.snakeDir.y !== 0) {
                    ctx.beginPath(); ctx.arc(centerX - 5, centerY + lookY, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(centerX + 5, centerY + lookY, 3, 0, Math.PI * 2); ctx.fill();
                } else {
                    ctx.beginPath(); ctx.arc(centerX + lookX, centerY - 5, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(centerX + lookX, centerY + 5, 3, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                // BODY: Consistent Grid-Aligned Blocks
                ctx.fillStyle = i % 2 === 0 ? '#FFB3A1' : '#FFCFCC';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(x, y, size, size, 4);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, size, size);
                }
            }
        });

        reqRef.current = setTimeout(() => {
            reqRef.current = requestAnimationFrame(updateSnake);
        }, 160);
    };

    const updatePaddle = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const logicalW = canvas.width / dpr;
        const logicalH = canvas.height / dpr;
        const s = gameState.current;

        s.ball.x += s.ball.dx;
        s.ball.y += s.ball.dy;

        if (s.ball.x < 15 || s.ball.x > logicalW - 15) s.ball.dx *= -1;
        if (s.ball.y < 15) s.ball.dy *= -1;

        if (s.ball.y > logicalH - 40 && s.ball.x > s.paddle && s.ball.x < s.paddle + 80) {
            s.ball.dy *= -1;
            // Add slight randomness to bounce
            s.ball.dx += (Math.random() - 0.5) * 2;
            s.score += 1;
            setScore(s.score);
        } else if (s.ball.y > logicalH) {
            return endGame();
        }

        // Draw
        ctx.clearRect(0, 0, logicalW, logicalH);

        // Ball (Tennis)
        ctx.font = '34px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎾', s.ball.x, s.ball.y);

        // Paddle (Custom Styled)
        const paddleW = 80;
        const paddleH = 14;
        ctx.fillStyle = '#FF8450';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 132, 80, 0.3)';
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(s.paddle, logicalH - 20, paddleW, paddleH, 7);
            ctx.fill();
        } else {
            ctx.fillRect(s.paddle, logicalH - 20, paddleW, paddleH);
        }
        ctx.shadowBlur = 0; // Reset shadow

        ctx.font = '20px Arial';
        ctx.fillText('🏓', s.paddle + paddleW / 2, logicalH - 12);

        reqRef.current = requestAnimationFrame(updatePaddle);
    };

    useEffect(() => {
        if (gameStatus !== 'playing') return;
        const canvas = canvasRef.current;
        if (canvas) setupCanvas(canvas);

        if (gameId === 'dino') reqRef.current = requestAnimationFrame(updateDino);
        if (gameId === 'snake') reqRef.current = requestAnimationFrame(updateSnake);
        if (gameId === 'paddle') reqRef.current = requestAnimationFrame(updatePaddle);
        return () => {
            cancelAnimationFrame(reqRef.current);
            clearTimeout(reqRef.current);
        };
    }, [gameId, gameStatus]);

    useEffect(() => {
        const handleKeys = (e) => {
            const s = gameState.current;

            if (gameStatus === 'playing') {
                // Dino controls
                if (gameId === 'dino' && e.code === 'Space' && s.dino.y === 0) {
                    e.preventDefault();
                    s.dino.vy = -15;
                }

                // Snake controls - prevent default for ALL arrow keys during Snake
                if (gameId === 'snake' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault(); // Always prevent scroll

                    // Only allow one direction change per game frame
                    if (s.directionChanged) return;

                    // Check against CURRENT direction to prevent 180° turns
                    if (e.key === 'ArrowUp' && s.snakeDir.y === 0) {
                        s.nextSnakeDir = { x: 0, y: -1 };
                        s.directionChanged = true;
                    }
                    if (e.key === 'ArrowDown' && s.snakeDir.y === 0) {
                        s.nextSnakeDir = { x: 0, y: 1 };
                        s.directionChanged = true;
                    }
                    if (e.key === 'ArrowLeft' && s.snakeDir.x === 0) {
                        s.nextSnakeDir = { x: -1, y: 0 };
                        s.directionChanged = true;
                    }
                    if (e.key === 'ArrowRight' && s.snakeDir.x === 0) {
                        s.nextSnakeDir = { x: 1, y: 0 };
                        s.directionChanged = true;
                    }
                }
            } else if (gameStatus === 'ready' && (e.code === 'Enter' || e.code === 'Space')) {
                e.preventDefault();
                startGame();
            }
        };

        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [gameId, gameStatus]);

    const handleMouseMove = (e) => {
        if (gameId === 'paddle' && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const posX = e.clientX - rect.left - 40;
            gameState.current.paddle = Math.max(0, Math.min(posX, rect.width - 80));
        }
    };

    return (
        <div className="original-layout fade-in">
            <div className="main-content">
                <header className="game-header-cute" style={{ textAlign: 'left' }}>
                    <h2 className="h1-cute">
                        {gameId ? GAMES.find(g => g.id === gameId).name : 'Game Time'}
                    </h2>
                    {gameStatus === 'playing' && <div className="score-badge">Points: {score}</div>}
                </header>

                <div className="game-stage">
                    {gameStatus === 'menu' && (
                        <div className="game-menu-cute">
                            <p className="p-cute" style={{ fontSize: '1rem' }}>Classic ways to kill a few minutes. Low stakes, high fun.</p>
                            <div className="game-options-cute">
                                {GAMES.map(g => (
                                    <button key={g.id} className="game-btn-card" onClick={() => pickGame(g.id)}>
                                        <span className="game-icon-big">{g.icon}</span>
                                        <span className="game-name-small">{g.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {gameStatus === 'ready' && (
                        <div className="game-overlay-cute">
                            {countdown === null ? (
                                <>
                                    <h3 className="h1-cute" style={{ fontSize: '2rem' }}>Ready?</h3>
                                    <p className="p-cute" style={{ margin: '20px 0', maxWidth: '300px' }}>{RULES[gameId]}</p>
                                    <button className="btn-primary-cute" onClick={startGame}>
                                        Start Game
                                    </button>
                                </>
                            ) : (
                                <div className="countdown-bubble">
                                    <h1 className="countdown-number bounce-in">
                                        {countdown > 0 ? countdown : 'GO!'}
                                    </h1>
                                </div>
                            )}
                        </div>
                    )}

                    {gameStatus === 'playing' && (
                        <canvas
                            ref={canvasRef}
                            style={{ width: '500px', height: '500px' }} // Logical size
                            onMouseMove={handleMouseMove}
                            className="cute-canvas"
                        />
                    )}

                    {gameStatus === 'gameover' && (
                        <div className="game-overlay-cute">
                            <h2 className="h1-cute">Brilliant!</h2>
                            <p className="p-cute">Final Score: {score}. Want another go?</p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button className="btn-primary-cute" onClick={() => pickGame(gameId)}>
                                    Try Again
                                </button>
                                <button className="btn-secondary-cute" onClick={() => setGameStatus('menu')}>
                                    Menu
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {gameStatus !== 'menu' && (
                    <button className="back-to-menu-btn" onClick={() => setGameStatus('menu')}>
                        ← Back to Games
                    </button>
                )}
            </div>

            <aside className="original-sidebar">
                <div className="portrait-frame">
                    <img src="/Assets/Cat_Play.jpg" alt="Companion" className="sidebar-mascot" />
                </div>
                <div className="sidebar-stats">
                    <span className="label-cinch">GAME BUDDY</span>
                    <p>Rooting for you!</p>
                </div>
            </aside>
        </div>
    );
}

export default Game;
