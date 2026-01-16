import React, { useState, useEffect } from 'react';
import EqRender from './EqRender';
import './MathSection.css';

const DOMAIN_MAP = {
    'Algebra': { config: 'algebra', icon: '∑' },
    'Geometry': { config: 'geometry', icon: '△' },
    'Analysis': { config: 'precalculus', icon: '∫' },
    'Number Theory': { config: 'number_theory', icon: 'ℕ' },
    'Graph Theory': { config: 'counting_and_probability', icon: '⚶' }
};

const FALLBACK_PROBLEM = {
    question: "Solve for $x$: $x^2 - 5x + 6 = 0$",
    solution: "We factor the quadratic equation: $(x-2)(x-3)=0$. Solutions: $x=2, 3$."
};

function MathSection() {
    const [domain, setDomain] = useState(null);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const domains = Object.keys(DOMAIN_MAP);

    const fetchProblem = async (d, attempt = 0) => {
        if (attempt > 20) {
            // Safety: if we can't find a diagram-free problem after 20 tries, use fallback
            setProblem(FALLBACK_PROBLEM);
            setLoading(false);
            return;
        }

        setLoading(true);
        setShowSolution(false);
        const config = DOMAIN_MAP[d].config;

        // Random offset for fresh problems
        const randomOffset = window.Math.floor(window.Math.random() * 400);
        const url = `https://datasets-server.huggingface.co/rows?dataset=EleutherAI/hendrycks_math&config=${config}&split=test&offset=${randomOffset}&limit=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.rows && data.rows.length > 0) {
                const row = data.rows[0].row;
                const questionText = row.problem || '';
                const solutionText = row.solution || '';

                // Check if this problem contains diagrams
                const hasAsyInQuestion = /\[asy\][\s\S]*?\[\/asy\]/g.test(questionText);
                const hasAsyInSolution = /\[asy\][\s\S]*?\[\/asy\]/g.test(solutionText);

                if (hasAsyInQuestion || hasAsyInSolution) {
                    // Skip this problem and fetch another one
                    console.log(`Skipping problem with diagram (attempt ${attempt + 1})`);
                    fetchProblem(d, attempt + 1);
                    return;
                }

                setProblem({
                    question: questionText,
                    solution: solutionText
                });
                setLoading(false);
            } else {
                setProblem(FALLBACK_PROBLEM);
                setLoading(false);
            }
        } catch (error) {
            console.error("Math API Fetch Error:", error);
            setProblem(FALLBACK_PROBLEM);
            setLoading(false);
        }
    };

    const pickDomain = (d) => {
        setDomain(d);
        fetchProblem(d);
    };

    const nextProblem = () => {
        if (domain) fetchProblem(domain);
    };

    const renderTextWithMath = (text) => {
        if (!text) return null;

        // Pattern handles LaTeX ($$, \[, $) only - no Asymptote
        const parts = text.split(/(\$\$.*?\$\$|\\\[.*?\\\]|\$.*?\$)/g);

        return parts.map((part, i) => {
            if (!part) return null;

            // Check for display/block math
            if ((part.startsWith('$$') && part.endsWith('$$')) ||
                (part.startsWith('\\[') && part.endsWith('\\]'))) {
                let tex = part;
                if (part.startsWith('$$')) tex = part.slice(2, -2);
                if (part.startsWith('\\[')) tex = part.slice(2, -2);
                return <div key={i} className="math-block-wrapper"><EqRender tex={tex} displayMode={true} /></div>;
            }

            // Check for inline math
            if (part.startsWith('$') && part.endsWith('$')) {
                return <EqRender key={i} tex={part.slice(1, -1)} />;
            }

            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="math-module original-layout fade-in">
            <div className="main-content">
                <header className="math-header">
                    <h1 className="h1-cute">Do Some Math.</h1>
                    <p className="p-cute" style={{ textAlign: 'left', margin: '0' }}>
                        Keep your mind sharp. Choose a domain to start practicing.
                    </p>
                </header>

                {!domain ? (
                    <div className="math-selector fade-in">
                        <div className="math-options-cute">
                            {domains.map(d => (
                                <button key={d} className="game-btn-card" onClick={() => pickDomain(d)}>
                                    <span className="game-icon-big">{DOMAIN_MAP[d].icon}</span>
                                    <span className="game-name-small">{d}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="math-problem-view fade-in">
                        <div className="math-card">
                            <div className="math-card-header">
                                <span className="domain-badge">{domain}</span>
                                <button className="btn-text-only" onClick={() => setDomain(null)}>Change Domain</button>
                            </div>

                            {loading ? (
                                <div className="math-loading-state">
                                    <div className="placeholder-pulsar small"></div>
                                    <span>Puzzling over the numbers...</span>
                                </div>
                            ) : problem && (
                                <>
                                    <div className="math-question">
                                        <h3>{renderTextWithMath(problem.question)}</h3>
                                    </div>

                                    {showSolution && (
                                        <div className="math-solution slide-up">
                                            <div className="solution-divider"></div>
                                            <h4 className="solution-title">Solution</h4>
                                            <div className="solution-content">
                                                {renderTextWithMath(problem.solution)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="math-actions">
                                        {!showSolution ? (
                                            <button className="btn-primary-cute" onClick={() => setShowSolution(true)}>
                                                Show solution
                                            </button>
                                        ) : (
                                            <button className="btn-primary-cute" onClick={nextProblem}>
                                                Next Problem
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <aside className="original-sidebar">
                <div className="portrait-frame">
                    <img src="/Assets/Cat_Math.png" alt="Companion" className="sidebar-mascot" />
                </div>
                <div className="sidebar-stats">
                    <span className="label-cinch">MATH TUTOR</span>
                    <p>Mathematics is the language with which God has written the universe.</p>
                </div>
            </aside>
        </div>
    );
}

export default MathSection;
