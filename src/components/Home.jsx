import React, { useState, useEffect } from 'react';
import './Home.css';

function Home({ setMode }) {
    const [showReward, setShowReward] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowReward(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home-video-container">
            <div className="home-card-wrapper">
                {/* Video Background */}
                <video
                    className="home-bg-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >
                    <source src={`/Assets/Cat_BG.mp4?v=${Date.now()}`} type="video/mp4" />
                </video>

                {/* Dark Overlay for text readability */}
                <div className="home-video-overlay"></div>

                {/* Main Content */}
                <div className="home-content-layer fade-in">
                    <div className="home-centered-stack">
                        {/* Typography Layer */}
                        <div className="home-text-center-block">
                            <h1 className="h1-cute-signature">
                                While You Wait<span className="dot-pulse">.</span>
                            </h1>

                            <p className="p-cute-pauses centered">
                                <span className="p-intro-hook">AI busy writing / coding / building?</span>
                                <span className="p-breather">Train your human intelligence.</span>
                                <span className="p-list-item">
                                    Learn something, play a quick game, do some math, or enjoy some art —
                                </span>
                                <span className="p-footer-tag">while the robot does the heavy lifting.</span>
                            </p>

                            <div className={`waiting-reward centered ${showReward ? 'visible' : 'hidden'}`}>
                                "Catch up. Stay sharp."
                            </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className="home-actions-horizontal-row">
                            <button className="action-pill btn-learn" onClick={() => setMode('learn')}>
                                <div className="pill-icon-circle">📚</div>
                                <span className="pill-label">Learn</span>
                            </button>
                            <button className="action-pill btn-game" onClick={() => setMode('game')}>
                                <div className="pill-icon-circle">🎮</div>
                                <span className="pill-label">Game</span>
                            </button>
                            <button className="action-pill btn-math" onClick={() => setMode('math')}>
                                <div className="pill-icon-circle">🔢</div>
                                <span className="pill-label">Math</span>
                            </button>
                            <button className="action-pill btn-art" onClick={() => setMode('art')}>
                                <div className="pill-icon-circle">🎨</div>
                                <span className="pill-label">Art</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
