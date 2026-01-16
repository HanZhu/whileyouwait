import React, { useState } from 'react';
import './Learn.css';

// Pool of interesting topics to explore
const TOPIC_POOL = [
    'Quantum Physics', 'Ancient Rome', 'Space Travel', 'Dolphins', 'Artificial Intelligence',
    'Renaissance Art', 'Deep Sea Creatures', 'String Theory', 'Egyptian Pyramids', 'Black Holes',
    'Human Brain', 'Climate Science', 'Game Theory', 'Biochemistry', 'Ancient Greece',
    'Cryptography', 'Norse Mythology', 'Photosynthesis', 'Particle Physics', 'Jazz Music',
    'Astronomy', 'Evolution', 'Philosophy', 'Photography', 'Virtual Reality',
    'Neuroscience', 'Genetics', 'Architecture', 'Linguistics', 'Volcanoes'
];

// Randomly select N unique topics from the pool
const getRandomTopics = (count = 5) => {
    const shuffled = [...TOPIC_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

function Learn() {
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [suggestedTopics] = useState(() => getRandomTopics(5));

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchKeyword = keyword.trim();
        if (!searchKeyword) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchKeyword)}&limit=1&namespace=0&format=json&origin=*`);
            const searchData = await searchRes.json();
            const bestTitle = searchData[1][0];

            if (!bestTitle) {
                setError('no-results');
                return;
            }

            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);

            if (!response.ok) throw new Error('Summary not found');
            const result = await response.json();

            setData(result);
        } catch (err) {
            console.error(err);
            setError('generic-error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="original-layout fade-in">
            <div className="main-content">
                <header className="page-header-cute" style={{ textAlign: 'left' }}>
                    <h2 className="h1-cute">Brain Food</h2>
                    <p className="p-cute" style={{ margin: '0', fontSize: '1rem' }}>
                        Don't just throw it to the AI and wait—use this time to sharpen your own mind! Dive into related concepts while the robot does the heavy lifting.
                    </p>
                </header>

                <form onSubmit={handleSearch} className="cute-search-form" style={{ marginTop: '30px' }}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="I want to learn about: (English keywords)"
                        className="cute-search-input"
                    />
                    <button type="submit" className="btn-primary-cute">Teach me!</button>
                </form>

                <div className="suggested-topics" style={{ display: 'flex', gap: '8px', marginBottom: '30px', flexWrap: 'wrap', opacity: 0.7 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Try:</span>
                    {suggestedTopics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => { setKeyword(topic); }}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-outer-bg)',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            {topic}
                        </button>
                    ))}
                </div>

                {loading && <div className="status-cute">Looking that up for you...</div>}

                {error === 'no-results' && <div className="error-cute">Hmm, couldn't find that. Try another topic (in English)?</div>}

                {error === 'generic-error' && <div className="error-cute">Something went wrong. Check your connection or try a shorter English keyword!</div>}

                {data && (
                    <div className="knowledge-card-container fade-in" style={{ marginTop: '20px' }}>
                        <div className="knowledge-card">
                            <div className="knowledge-hero">
                                <img
                                    src={data.thumbnail ? data.thumbnail.source : '/Assets/Learning_default.png'}
                                    alt={data.title}
                                    className="knowledge-img"
                                />
                                <div className="knowledge-badge">{data.description || 'General Knowledge'}</div>
                            </div>

                            <div className="knowledge-content">
                                <h3 className="knowledge-title">{data.title}</h3>
                                <div className="knowledge-divider"></div>
                                <div className="knowledge-extract">
                                    {data.extract}
                                </div>

                                <div className="knowledge-footer">
                                    <div className="concept-tags">
                                        <span className="concept-tag-mini">#LEARNING</span>
                                        <span className="concept-tag-mini">#CURIOSITY</span>
                                    </div>
                                    <a href={data.content_urls?.desktop?.page} target="_blank" rel="noopener noreferrer" className="knowledge-source-btn">
                                        Open Source ↗
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <aside className="original-sidebar">
                <div className="portrait-frame">
                    <img src="/Assets/Cat_Learn.png" alt="Learn Mascot" className="sidebar-mascot" />
                </div>
                <div className="sidebar-stats">
                    <span className="label-cinch">LIBRARY CAT</span>
                    <p>Boosting human intelligence.</p>
                </div>
            </aside>
        </div>
    );
}

export default Learn;
